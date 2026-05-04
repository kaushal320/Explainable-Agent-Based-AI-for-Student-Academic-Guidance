from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any

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

class FeatureContribution(BaseModel):
    feature: str
    shap_value: float
    value: Any

class CareerExplanation(BaseModel):
    confidence: float
    runner_up_career: Optional[str] = None
    runner_up_confidence: Optional[float] = None
    top_positive_drivers: List[FeatureContribution] = Field(default_factory=list)
    top_negative_drivers: List[FeatureContribution] = Field(default_factory=list)
    model_global_importance: List[Dict[str, float]] = Field(default_factory=list)

class PredictionResponse(BaseModel):
    career: str
    plan: LearningPlan
    skills: SkillScores
    explanation: Optional[CareerExplanation] = None
