from fastapi import APIRouter, HTTPException, status, Depends
from app.models import UserCreate, Token
from app.database import users_collection
from app.utils.auth import get_password_hash, verify_password, create_access_token
from datetime import datetime

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/register")
async def register(user: UserCreate):
    existing_user = await users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    user_dict = user.dict()
    user_dict.pop("password")
    user_dict["hashed_password"] = hashed_password
    user_dict["created_at"] = datetime.utcnow()
    
    result = await users_collection.insert_one(user_dict)
    user_id = str(result.inserted_id)
    
    access_token = create_access_token(data={"sub": user.email})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": user_id,
        "email": user.email,
        "name": user.name,
        "role": user.role
    }

@router.post("/login")
async def login(user_login: dict):
    email = user_login.get("email")
    password = user_login.get("password")
    
    user = await users_collection.find_one({"email": email})
    if not user or not verify_password(password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": email})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": str(user["_id"]),
        "email": user.get("email"),
        "name": user.get("name", email.split("@")[0]),
        "role": user.get("role", "senior")
    }
