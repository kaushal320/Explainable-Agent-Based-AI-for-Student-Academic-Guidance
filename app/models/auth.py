from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field, EmailStr


class UserCreate(BaseModel):
    email: EmailStr = Field(...)
    password: str = Field(..., min_length=8)
    full_name: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr = Field(...)
    password: str = Field(..., min_length=1)


class GoogleLoginRequest(BaseModel):
    token: str = Field(..., description="Google OAuth2 ID token")


class GoogleLoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserPublic"
    oauth_provider: str = "google"


class UserPublic(BaseModel):
    id: str
    email: EmailStr
    full_name: Optional[str] = None
    created_at: Optional[datetime] = None
    oauth_provider: Optional[str] = None


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserPublic


class VerifyEmailRequest(BaseModel):
    email: EmailStr = Field(...)
    code: str = Field(..., min_length=6, max_length=6)


class ResendVerificationRequest(BaseModel):
    email: EmailStr = Field(...)


class RegisterResponse(BaseModel):
    message: str
    requires_verification: bool = True
    email: EmailStr
