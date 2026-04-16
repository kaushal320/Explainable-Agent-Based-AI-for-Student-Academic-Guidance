from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class UserCreate(BaseModel):
    email: str = Field(..., min_length=3)
    password: str = Field(..., min_length=8)
    full_name: Optional[str] = None


class UserLogin(BaseModel):
    email: str = Field(..., min_length=3)
    password: str = Field(..., min_length=1)


class UserPublic(BaseModel):
    id: str
    email: str
    full_name: Optional[str] = None
    created_at: Optional[datetime] = None


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserPublic
