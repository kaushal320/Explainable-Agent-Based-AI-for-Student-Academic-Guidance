from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field
import os

class Settings(BaseSettings):
    GROQ_API_KEY: str = Field(default=..., env="GROQ_API_KEY")
    MONGODB_URI: str = Field(default=..., env="MONGODB_URI")
    JWT_SECRET_KEY: str = Field(default="change-me-in-production", env="JWT_SECRET_KEY")
    JWT_ALGORITHM: str = Field(default="HS256", env="JWT_ALGORITHM")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(default=1440, env="ACCESS_TOKEN_EXPIRE_MINUTES")
    AUTO_SEED_KNOWLEDGE_BASE: bool = Field(default=True, env="AUTO_SEED_KNOWLEDGE_BASE")
    RAG_TOP_K: int = Field(default=3, env="RAG_TOP_K")
    MODEL_PATH: str = Field(default="model/career_model.pkl")
    DOMAIN_ENCODER_PATH: str = Field(default="model/domain_encoder.pkl")
    CAREER_ENCODER_PATH: str = Field(default="model/career_encoder.pkl")
    DATA_PATH: str = Field(default="data/career_content.csv")
    ENV: str = Field(default="dev", env="ENV")
    SMTP_HOST: str = Field(default="", env="SMTP_HOST")
    SMTP_PORT: int = Field(default=587, env="SMTP_PORT")
    SMTP_USER: str = Field(default="", env="SMTP_USER")
    SMTP_PASSWORD: str = Field(default="", env="SMTP_PASSWORD")
    SMTP_TLS: bool = Field(default=True, env="SMTP_TLS")
    ALLOWED_HOSTS: list = Field(default=["localhost", "127.0.0.1", "0.0.0.0"], env="ALLOWED_HOSTS")
    ALLOWED_ORIGINS: list = Field(default=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"], env="ALLOWED_ORIGINS")
    MAX_REQUEST_BODY_BYTES: int = Field(default=10485760, env="MAX_REQUEST_BODY_BYTES")
    RATE_LIMIT_PER_MINUTE: int = Field(default=60, env="RATE_LIMIT_PER_MINUTE")
    
    # Google OAuth2
    GOOGLE_CLIENT_ID: str = Field(default="", env="GOOGLE_CLIENT_ID")
    GOOGLE_CLIENT_SECRET: str = Field(default="", env="GOOGLE_CLIENT_SECRET")
    GOOGLE_REDIRECT_URI: str = Field(default="http://localhost:3000/login", env="GOOGLE_REDIRECT_URI")
    
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding='utf-8', extra="ignore")

settings = Settings()
