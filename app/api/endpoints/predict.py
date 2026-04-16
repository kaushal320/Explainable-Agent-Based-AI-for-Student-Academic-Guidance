from fastapi import APIRouter, HTTPException, Depends
from ...models.student import StudentOnboarding, PredictionResponse
from ...services.prediction_service import PredictionService
from ...services.auth_service import require_user

router = APIRouter()

@router.post("/", response_model=PredictionResponse)
async def predict_career(data: StudentOnboarding, current_user: dict = Depends(require_user)):
    try:
        response = PredictionService.predict_career(data)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
