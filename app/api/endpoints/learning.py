from fastapi import APIRouter, HTTPException, Depends
from ...recommendation import get_lesson_content, get_mock_quiz
from typing import Optional
from ...services.auth_service import require_user

router = APIRouter()

@router.get("/lesson")
async def get_lesson(career: Optional[str] = None, skill: Optional[str] = None, week: int = 1, current_user: dict = Depends(require_user)):
    topic = career or skill
    content = get_lesson_content(topic, week)
    if "No lesson found" in content:
        raise HTTPException(status_code=404, detail=content)
    return {"content": content}

@router.get("/quiz")
async def get_quiz(career: Optional[str] = None, skill: Optional[str] = None, week: int = 1, current_user: dict = Depends(require_user)):
    topic = career or skill
    quiz = get_mock_quiz(topic, week)
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found for this topic")
    return quiz
