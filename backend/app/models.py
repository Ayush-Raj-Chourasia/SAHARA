from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Union
from datetime import datetime

class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: str = "senior" # "senior" or "family"
    phone: str
    age: Optional[int] = None
    gender: Optional[str] = None
    weight_kg: Optional[float] = None
    conditions: List[str] = []

class UserCreate(UserBase):
    password: str

class UserInDB(UserBase):
    id: str = Field(alias="_id")
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None


class GoogleAuthRequest(BaseModel):
    id_token: Optional[str] = None
    google_uid: Optional[str] = None
    name: str
    email: EmailStr
    role: str = "senior"
    photo_url: Optional[str] = None


class ProfileCompleteRequest(BaseModel):
    phone: str
    name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    weight_kg: Optional[float] = None
    conditions: List[str] = []
    location: Optional[str] = None
    language_preference: Optional[str] = None
    living_status: Optional[str] = None
    family_proximity: Optional[str] = None
    relationship: Optional[str] = None
    proximity: Optional[str] = None
    invite_code: Optional[str] = None
    senior_email: Optional[EmailStr] = None


class FamilyLinkRequest(BaseModel):
    invite_code: Optional[str] = None
    senior_email: Optional[EmailStr] = None
    relationship: str
    proximity: str

class HealthLogCreate(BaseModel):
    user_id: str
    bp_sys: int
    bp_dia: int
    sugar: int
    heart_rate: int
    weight: Optional[float] = None
    fatigue: Optional[int] = Field(None, ge=1, le=10) # 1-10
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class NutritionLogCreate(BaseModel):
    user_id: str
    meal_type: str # breakfast, lunch, dinner, snack
    food_name: str
    kcal: int
    protein: float
    iron_mg: Optional[float] = 0
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class SOSCreate(BaseModel):
    user_id: str
    latitude: float
    longitude: float
    timestamp: datetime = Field(default_factory=datetime.utcnow)
