from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class FeedbackCreate(BaseModel):
    rating: int = Field(..., ge=1, le=5)
    comment: str
    user_email: Optional[str] = None

class FeedbackInDB(FeedbackCreate):
    created_at: datetime
