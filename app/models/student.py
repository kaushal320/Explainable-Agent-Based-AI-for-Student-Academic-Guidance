from pydantic import BaseModel, Field
from typing import List, Dict, Optional

class StudentOnboarding(BaseModel):
    gpa: float = Field(..., ge=0.0, le=4.0)
    python_exp: str
    sql_exp: str
    java_exp: str
    domain: str

class SkillScores(BaseModel):
    Python: int
    SQL: int
    Java: int
    GPA: float

class LearningPlan(BaseModel):
    advice: List[str]
    weakness_rank: List[List]
    beginner: str
    intermediate: str
    advanced: str
    projects: str
    tools: str

class PredictionResponse(BaseModel):
    career: str
    plan: LearningPlan
    skills: SkillScores
