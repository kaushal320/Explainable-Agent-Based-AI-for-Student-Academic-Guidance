from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any
from ...models.feedback import FeedbackCreate
from ...db.mongodb import db_manager
import logging
from datetime import datetime

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/")
async def submit_feedback(
    feedback: FeedbackCreate,
) -> Dict[str, Any]:
    try:
        db = db_manager.db
        if db is None:
            # Fallback for testing without DB
            logger.info(f"Feedback received (No DB): {feedback.model_dump()}")
            return {"status": "success", "message": "Feedback submitted successfully (Mock)"}
            
        payload = feedback.model_dump()
        comment = (payload.get("comment") or "").strip()
        if len(comment) > 2000:
            raise HTTPException(status_code=400, detail="Comment too long")

        feedback_doc = {
            "rating": payload.get("rating"),
            "comment": comment,
            "user_email": payload.get("user_email"),
        }
        feedback_doc["created_at"] = datetime.utcnow()
        
        result = await db.feedbacks.insert_one(feedback_doc)
        
        return {
            "status": "success",
            "message": "Feedback submitted successfully",
            "id": str(result.inserted_id)
        }
    except Exception as e:
        logger.error(f"Error submitting feedback: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to submit feedback")
