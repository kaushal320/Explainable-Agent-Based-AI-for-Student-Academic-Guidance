import joblib
import pandas as pd
from contextlib import asynccontextmanager
from fastapi import FastAPI
from .config import settings
from ..db.mongodb import db_manager
import logging

logger = logging.getLogger(__name__)

class MLModels:
    model = None
    le_domain = None
    le_career = None
    content_df = None

ml_models = MLModels()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Connect to MongoDB
    db_manager.connect()
    
    # Load models
    try:
        logger.info("Loading ML models...")
        ml_models.model = joblib.load(settings.MODEL_PATH)
        ml_models.le_domain = joblib.load(settings.DOMAIN_ENCODER_PATH)
        ml_models.le_career = joblib.load(settings.CAREER_ENCODER_PATH)
        ml_models.content_df = pd.read_csv(settings.DATA_PATH)
        logger.info("ML models and data loaded successfully.")
    except Exception as e:
        logger.error(f"Error loading models: {e}")

    if settings.AUTO_SEED_KNOWLEDGE_BASE:
        try:
            from ..services.rag_service import rag_service
            rag_service.seed_from_csv()
        except Exception as e:
            logger.warning(f"Knowledge base seeding skipped: {e}")
    
    yield
    
    # Clean up (if any)
    ml_models.model = None
    ml_models.le_domain = None
    ml_models.le_career = None
    ml_models.content_df = None
    db_manager.close()
