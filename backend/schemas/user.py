from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    name: Optional[str] = Field(None, max_length=100)

class UserCreate(UserBase):
    password: str = Field(..., min_length=8)

class UserOut(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class UserProfile(BaseModel):
    id: int = Field(..., description="The unique identifier for the user.")
    name: str = Field(..., min_length=2, max_length=100, description="The full name of the student.")
    department: str = Field(..., description="The academic department of the student.")
    year: str = Field(..., description="The current academic year of the student.")
    interests: List[str] = Field(default_factory=list, description="List of topics the student is interested in.")
