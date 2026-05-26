"""
Predictions API Routes
ML predictions: role prediction, skill gaps, ROI estimation
"""

from fastapi import APIRouter, HTTPException
from typing import List

from app.models.schemas import (
    PredictionResponse, RolePredictionResponse, SkillGapResponse,
    LearningROIResponse
)
from app.services import prediction_service

router = APIRouter()


@router.get("/{user_id}/role", response_model=RolePredictionResponse)
async def predict_next_role(user_id: str):
    """
    Predict user's next career role based on current skills and trends.
    """
    try:
        prediction = await prediction_service.predict_next_role(user_id)
        if not prediction:
            raise HTTPException(status_code=404, detail="User not found")
        return prediction
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{user_id}/all", response_model=List[PredictionResponse])
async def get_user_predictions(user_id: str, skip: int = 0, limit: int = 50):
    """
    Get all predictions for a user.
    """
    try:
        predictions = await prediction_service.get_user_predictions(user_id, skip, limit)
        return predictions
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{user_id}/roi", response_model=List[LearningROIResponse])
async def estimate_learning_roi(user_id: str):
    """
    Calculate ROI for learning each priority skill.
    Shows salary increase projection and break-even time.
    """
    try:
        roi_estimates = await prediction_service.estimate_learning_roi(user_id)
        return roi_estimates
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/{user_id}/refresh", status_code=202)
async def refresh_predictions(user_id: str):
    """
    Trigger refresh of all predictions for a user.
    Runs ML models asynchronously.
    """
    try:
        await prediction_service.refresh_predictions(user_id)
        return {"message": "Predictions refresh scheduled"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/{prediction_id}/feedback", status_code=204)
async def submit_prediction_feedback(prediction_id: str, is_accurate: bool):
    """
    Submit feedback on prediction accuracy.
    Used to improve future predictions.
    """
    try:
        await prediction_service.record_prediction_feedback(prediction_id, is_accurate)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
