from datetime import datetime, timedelta, timezone
from typing import Any, Dict

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from passlib.exc import UnknownHashError
from pymongo.errors import PyMongoError

try:
    import bcrypt as pybcrypt
except Exception:  # pragma: no cover - optional dependency fallback
    pybcrypt = None

from ..core.config import settings
from ..db.mongodb import db_manager
from ..models.auth import AuthResponse, UserCreate, UserLogin, UserPublic


# Use PBKDF2-SHA256 to avoid passlib+bcrypt backend compatibility issues.
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


class AuthService:
    @staticmethod
    def _users_collection():
        if db_manager.sync_client is None:
            raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Database not connected")
        return db_manager.sync_client["academic_guidance"]["users"]

    @staticmethod
    def hash_password(password: str) -> str:
        return pwd_context.hash(password)

    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        try:
            return pwd_context.verify(plain_password, hashed_password)
        except UnknownHashError:
            # Fallback for legacy bcrypt hashes created before PBKDF2 migration.
            if not hashed_password.startswith(("$2a$", "$2b$", "$2y$")):
                return False
            if pybcrypt is None:
                return False
            try:
                return pybcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))
            except ValueError:
                return False
        except ValueError:
            # Avoid leaking backend errors to clients for malformed/legacy cases.
            return False

    @staticmethod
    def create_access_token(payload: Dict[str, Any]) -> str:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        token_payload = {**payload, "exp": expire}
        return jwt.encode(token_payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)

    @staticmethod
    def _serialize_user(user_doc: dict) -> UserPublic:
        return UserPublic(
            id=str(user_doc["_id"]),
            email=user_doc["email"],
            full_name=user_doc.get("full_name"),
            created_at=user_doc.get("created_at"),
        )

    @classmethod
    def register(cls, data: UserCreate) -> AuthResponse:
        users = cls._users_collection()
        try:
            existing = users.find_one({"email": data.email.lower().strip()})
            if existing:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

            now = datetime.now(timezone.utc)
            doc = {
                "email": data.email.lower().strip(),
                "password_hash": cls.hash_password(data.password),
                "full_name": data.full_name.strip() if data.full_name else None,
                "created_at": now,
                "updated_at": now,
            }
            result = users.insert_one(doc)
            created_user = users.find_one({"_id": result.inserted_id})
        except HTTPException:
            raise
        except PyMongoError as exc:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Database temporarily unavailable",
            ) from exc

        token = cls.create_access_token({"sub": created_user["email"], "uid": str(created_user["_id"])})
        return AuthResponse(access_token=token, user=cls._serialize_user(created_user))

    @classmethod
    def login(cls, data: UserLogin) -> AuthResponse:
        users = cls._users_collection()
        try:
            user_doc = users.find_one({"email": data.email.lower().strip()})
        except PyMongoError as exc:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Database temporarily unavailable",
            ) from exc

        if not user_doc or not cls.verify_password(data.password, user_doc["password_hash"]):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

        token = cls.create_access_token({"sub": user_doc["email"], "uid": str(user_doc["_id"])})
        return AuthResponse(access_token=token, user=cls._serialize_user(user_doc))

    @classmethod
    def get_current_user(cls, token: str = Depends(oauth2_scheme)) -> dict:
        credentials_error = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

        try:
            payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
            email = payload.get("sub")
            if not email:
                raise credentials_error
        except JWTError as exc:
            raise credentials_error from exc

        users = cls._users_collection()
        try:
            user_doc = users.find_one({"email": email})
        except PyMongoError as exc:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Database temporarily unavailable",
            ) from exc

        if not user_doc:
            raise credentials_error
        return user_doc


def require_user(current_user: dict = Depends(AuthService.get_current_user)) -> dict:
    return current_user
