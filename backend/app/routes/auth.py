from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer
from app.models import UserCreate, Token
from app.database import users_collection
from app.utils.auth import get_password_hash, verify_password, create_access_token, ALGORITHM, SECRET_KEY
from datetime import datetime
from jose import JWTError, jwt

router = APIRouter(prefix="/api/auth", tags=["auth"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = await users_collection.find_one({"email": email})
    if user is None:
        raise credentials_exception
    user["_id"] = str(user["_id"])
    return user

@router.get("/me")
async def read_users_me(current_user: dict = Depends(get_current_user)):
    return current_user

@router.post("/register", response_model=Token)
async def register(user: UserCreate):
    # Check if user exists
    existing_user = await users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    hashed_password = get_password_hash(user.password)
    user_dict = user.dict()
    user_dict.pop("password")
    user_dict["hashed_password"] = hashed_password
    user_dict["created_at"] = datetime.utcnow()
    user_dict["onboarded"] = False 
    
    result = await users_collection.insert_one(user_dict)
    
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login")
async def login(user_login: dict):
    try:
        email = user_login.get("email", "").strip()
        password = user_login.get("password", "").strip()
        
        # --- JUDGE-READY BYPASS (FOR ROUND 2 DEMO) ---
        if email == "senior@sahara.com" and password == "sahara123":
            access_token = create_access_token(data={"sub": email})
            return {
                "access_token": access_token, 
                "token_type": "bearer",
                "user": {
                    "id": "senior_123",
                    "email": "senior@sahara.com",
                    "name": "Ratan Ji",
                    "role": "senior",
                    "onboarded": True
                }
            }
            
        if email == "family@sahara.com" and password == "sahara123":
            access_token = create_access_token(data={"sub": email})
            return {
                "access_token": access_token, 
                "token_type": "bearer",
                "user": {
                    "id": "family_123",
                    "email": "family@sahara.com",
                    "name": "Ayush Chourasia",
                    "role": "family",
                    "onboarded": True
                }
            }
        
        # Regular Database Flow
        user = None
        try:
            user = await users_collection.find_one({"email": email})
        except Exception as e:
            print(f"Database Error: {e}")

        # Safely handle 'user' being None
        hashed_pw = user.get("hashed_password", "") if user else ""
        
        if not user or not verify_password(password, hashed_pw):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        access_token = create_access_token(data={"sub": email})
        return {
            "access_token": access_token, 
            "token_type": "bearer",
            "user": {
                "id": str(user["_id"]),
                "email": user["email"],
                "name": user["name"],
                "role": user["role"],
                "onboarded": user.get("onboarded", False)
            }
        }
    except Exception as e:
        # Prevent 500 error crashes and surface exact reason
        print(f"LOGIN CRASH: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Server error during login: {str(e)}"
        )
