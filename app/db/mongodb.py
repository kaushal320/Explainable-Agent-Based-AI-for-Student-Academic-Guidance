from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import MongoClient
import logging
from ..core.config import settings

MONGO_TIMEOUT_MS = 5000

logger = logging.getLogger(__name__)

class MongoDB:
    client: AsyncIOMotorClient = None
    sync_client: MongoClient = None
    db = None
    
    @classmethod
    def connect(cls):
        try:
            logger.info("Connecting to MongoDB Atlas...")
            # Async client for FastAPI operations
            cls.client = AsyncIOMotorClient(
                settings.MONGODB_URI,
                serverSelectionTimeoutMS=MONGO_TIMEOUT_MS,
                connectTimeoutMS=MONGO_TIMEOUT_MS,
                socketTimeoutMS=MONGO_TIMEOUT_MS,
            )

            # Sync client (useful for some LangChain operations that require sync block)
            cls.sync_client = MongoClient(
                settings.MONGODB_URI,
                serverSelectionTimeoutMS=MONGO_TIMEOUT_MS,
                connectTimeoutMS=MONGO_TIMEOUT_MS,
                socketTimeoutMS=MONGO_TIMEOUT_MS,
            )

            # Force a quick connectivity check so request handlers don't hang later.
            cls.sync_client.admin.command("ping")

            cls.db = cls.client.get_database("academic_guidance")
            try:
                cls.sync_client["academic_guidance"]["users"].create_index("email", unique=True)
                cls.sync_client["academic_guidance"]["knowledge_base"].create_index("metadata.source")
            except Exception as index_error:
                logger.warning(f"MongoDB index setup skipped: {index_error}")
            logger.info("Successfully connected to MongoDB Atlas!")
        except Exception as e:
            cls.client = None
            cls.sync_client = None
            cls.db = None
            logger.error(f"Could not connect to MongoDB: {e}")
            
    @classmethod
    def close(cls):
        if cls.client:
            cls.client.close()
            logger.info("MongoDB connection closed.")
        if cls.sync_client:
            cls.sync_client.close()

db_manager = MongoDB()
