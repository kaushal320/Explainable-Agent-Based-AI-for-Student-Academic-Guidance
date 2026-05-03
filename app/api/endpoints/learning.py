from fastapi import APIRouter, HTTPException, Depends
from ...recommendation import get_lesson_content, get_mock_quiz
from typing import Optional
from ...services.auth_service import require_user

router = APIRouter()

@router.get("/lesson")
async def get_lesson(skill: str, week: int, current_user: dict = Depends(require_user)):
    content = get_lesson_content(skill, week)
    if "No lesson found" in content:
        raise HTTPException(status_code=404, detail=content)
    return {"content": content}

@router.get("/quiz")
async def get_quiz(skill: str, current_user: dict = Depends(require_user)):
    quiz = get_mock_quiz(skill)
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found for this skill")
    return quiz
