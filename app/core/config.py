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
    
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding='utf-8', extra="ignore")

settings = Settings()
