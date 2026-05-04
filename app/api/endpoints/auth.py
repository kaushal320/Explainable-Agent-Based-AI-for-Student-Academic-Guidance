from fastapi import APIRouter, Depends

from ...models.auth import AuthResponse, UserCreate, UserLogin, UserPublic, RegisterResponse, VerifyEmailRequest, ResendVerificationRequest, GoogleLoginRequest, GoogleLoginResponse
from ...services.auth_service import AuthService, require_user

router = APIRouter()


@router.post("/register", response_model=RegisterResponse)
async def register(data: UserCreate):
    return AuthService.register(data)


@router.post("/login", response_model=AuthResponse)
async def login(data: UserLogin):
    return AuthService.login(data)


@router.post("/google-login", response_model=GoogleLoginResponse)
async def google_login(data: GoogleLoginRequest):
    return AuthService.google_login(data)


@router.post("/verify-email", response_model=AuthResponse)
async def verify_email(data: VerifyEmailRequest):
    return AuthService.verify_email(data)


@router.post("/resend-verification", response_model=RegisterResponse)
async def resend_verification(data: ResendVerificationRequest):
    return AuthService.resend_verification(data)


@router.get("/me", response_model=UserPublic)
async def me(current_user: dict = Depends(require_user)):
    return UserPublic(
        id=str(current_user["_id"]),
        email=current_user["email"],
        full_name=current_user.get("full_name"),
        created_at=current_user.get("created_at"),
        oauth_provider=current_user.get("oauth_provider")
    )
