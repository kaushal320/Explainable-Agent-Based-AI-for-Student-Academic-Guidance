from fastapi import APIRouter, Depends

from ...models.auth import AuthResponse, UserCreate, UserLogin, UserPublic
from ...services.auth_service import AuthService, require_user

router = APIRouter()


@router.post("/register", response_model=AuthResponse)
async def register(data: UserCreate):
    return AuthService.register(data)


@router.post("/login", response_model=AuthResponse)
async def login(data: UserLogin):
    return AuthService.login(data)


@router.get("/me", response_model=UserPublic)
async def me(current_user: dict = Depends(require_user)):
    return UserPublic(
        id=str(current_user["_id"]),
        email=current_user["email"],
        full_name=current_user.get("full_name"),
        created_at=current_user.get("created_at"),
    )
