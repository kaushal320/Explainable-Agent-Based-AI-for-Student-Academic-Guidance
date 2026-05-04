from datetime import datetime, timedelta, timezone
from typing import Any, Dict

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from passlib.exc import UnknownHashError
from pymongo.errors import PyMongoError
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token
import requests as http_requests

try:
    import bcrypt as pybcrypt
except Exception:  # pragma: no cover - optional dependency fallback
    pybcrypt = None

from ..core.config import settings
from ..db.mongodb import db_manager
from ..models.auth import AuthResponse, UserCreate, UserLogin, UserPublic, RegisterResponse, VerifyEmailRequest, ResendVerificationRequest, GoogleLoginRequest, GoogleLoginResponse
from .email_service import EmailService


# Use PBKDF2-SHA256 to avoid passlib+bcrypt backend compatibility issues.
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/token")


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
            oauth_provider=user_doc.get("oauth_provider")
        )

    @classmethod
    def register(cls, data: UserCreate) -> RegisterResponse:
        users = cls._users_collection()
        try:
            existing = users.find_one({"email": data.email.lower().strip()})
            if existing:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

            now = datetime.now(timezone.utc)
            otp = EmailService.generate_otp()
            otp_expires = now + timedelta(minutes=10)

            doc = {
                "email": data.email.lower().strip(),
                "password_hash": cls.hash_password(data.password),
                "full_name": data.full_name.strip() if data.full_name else None,
                "created_at": now,
                "updated_at": now,
                "is_verified": False,
                "verification_code": otp,
                "verification_expires": otp_expires
            }
            users.insert_one(doc)
            
            # Send verification email
            EmailService.send_verification_email(doc["email"], otp)
            
        except HTTPException:
            raise
        except PyMongoError as exc:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Database temporarily unavailable",
            ) from exc

        return RegisterResponse(
            message="Verification code sent to your email.",
            requires_verification=True,
            email=doc["email"]
        )

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

        if not user_doc.get("is_verified", True):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Email not verified")

        token = cls.create_access_token({"sub": user_doc["email"], "uid": str(user_doc["_id"])})
        return AuthResponse(access_token=token, user=cls._serialize_user(user_doc))

    @classmethod
    def verify_email(cls, data: VerifyEmailRequest) -> AuthResponse:
        users = cls._users_collection()
        email = data.email.lower().strip()
        user_doc = users.find_one({"email": email})

        if not user_doc:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

        if user_doc.get("is_verified"):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already verified")

        if user_doc.get("verification_code") != data.code:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid verification code")

        expires = user_doc.get("verification_expires")
        if not expires or expires.replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Verification code expired")

        users.update_one(
            {"_id": user_doc["_id"]},
            {"$set": {"is_verified": True}, "$unset": {"verification_code": "", "verification_expires": ""}}
        )

        user_doc["is_verified"] = True
        token = cls.create_access_token({"sub": user_doc["email"], "uid": str(user_doc["_id"])})
        return AuthResponse(access_token=token, user=cls._serialize_user(user_doc))

    @classmethod
    def resend_verification(cls, data: ResendVerificationRequest) -> RegisterResponse:
        users = cls._users_collection()
        email = data.email.lower().strip()
        user_doc = users.find_one({"email": email})

        if not user_doc:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

        if user_doc.get("is_verified"):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already verified")

        now = datetime.now(timezone.utc)
        otp = EmailService.generate_otp()
        otp_expires = now + timedelta(minutes=10)

        users.update_one(
            {"_id": user_doc["_id"]},
            {"$set": {"verification_code": otp, "verification_expires": otp_expires}}
        )

        EmailService.send_verification_email(email, otp)

        return RegisterResponse(
            message="A new verification code has been sent.",
            requires_verification=True,
            email=email
        )

    @classmethod
    def verify_google_token(cls, token: str) -> dict:
        """Verify Google OAuth2 access token by calling Google's userinfo endpoint."""
        client_id = settings.GOOGLE_CLIENT_ID.strip()
        if not client_id:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Google OAuth not configured on the server"
            )
        try:
            # Call Google's userinfo endpoint with the access token
            response = http_requests.get(
                "https://www.googleapis.com/oauth2/v3/userinfo",
                headers={"Authorization": f"Bearer {token}"},
                timeout=10
            )
            if response.status_code != 200:
                raise ValueError(f"Google userinfo returned {response.status_code}")
            return response.json()
        except Exception as exc:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid Google token"
            ) from exc

    @classmethod
    def google_login(cls, data: GoogleLoginRequest) -> GoogleLoginResponse:
        """Handle Google OAuth2 login."""
        users = cls._users_collection()
        try:
            # Verify the token
            idinfo = cls.verify_google_token(data.token)
            email = idinfo.get("email", "").lower().strip()
            
            if not email:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Google email not found in token"
                )

            # Check if user exists
            user_doc = users.find_one({"email": email})
            
            if user_doc:
                # Update last login and ensure oauth_provider is set
                users.update_one(
                    {"_id": user_doc["_id"]},
                    {"$set": {
                        "updated_at": datetime.now(timezone.utc),
                        "oauth_provider": "google"
                    }}
                )
                user_doc = users.find_one({"_id": user_doc["_id"]})
            else:
                # Create new user from Google profile
                now = datetime.now(timezone.utc)
                doc = {
                    "email": email,
                    "full_name": idinfo.get("name"),
                    "password_hash": None,  # No password for OAuth users
                    "is_verified": True,  # Google verified the email
                    "oauth_provider": "google",
                    "google_id": idinfo.get("sub"),
                    "picture": idinfo.get("picture"),
                    "created_at": now,
                    "updated_at": now,
                }
                result = users.insert_one(doc)
                user_doc = users.find_one({"_id": result.inserted_id})

            # Generate JWT token
            token = cls.create_access_token({
                "sub": user_doc["email"],
                "uid": str(user_doc["_id"])
            })
            
            return GoogleLoginResponse(
                access_token=token,
                user=cls._serialize_user(user_doc),
                oauth_provider="google"
            )
            
        except HTTPException:
            raise
        except PyMongoError as exc:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Database temporarily unavailable",
            ) from exc

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
