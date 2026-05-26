from typing import List, Optional, Dict
import logging
from datetime import datetime
import json

from app.models.schemas import (
    PredictionResponse, RolePredictionResponse, LearningROIResponse, SkillGapResponse
)
from utils import sql_connector
from ml_models.skill_decay_model import SkillDecayModel
from ml_models.roi_calculator import ROICalculator
from ml_models.resilience_scorer import ResilienceScorer

logger = logging.getLogger(__name__)

async def predict_next_role(user_id: str) -> Optional[RolePredictionResponse]:
    """
    Predict user's next career role based on their skills and market trends.
    """
    try:
        session = sql_connector.get_session()
        
        # 1. Get user skills
        query = "SELECT s.SkillName FROM dbo.UserSkills us JOIN dbo.Skills s ON us.SkillId = s.SkillId WHERE us.UserId = :user_id"
        result = session.execute(query, {"user_id": user_id}).fetchall()
        user_skills = [row[0] for row in result]
        
        if not user_skills:
            return None
            
        # 2. Call ML Model (Placeholder for Azure ML Endpoint)
        # In production: response = requests.post(AZURE_ML_ENDPOINT, json={"skills": user_skills})
        # For now, heuristic prediction:
        predicted_role = "Senior AI Engineer" if "Machine Learning" in user_skills else "Full Stack Developer"
        
        return RolePredictionResponse(
            user_id=user_id,
            current_role="Junior Developer",
            predicted_role=predicted_role,
            confidence_score=0.85,
            required_skills=["Kubernetes", "Generative AI"],
            estimated_time_months=6
        )
    except Exception as e:
        logger.error(f"Role prediction failed: {str(e)}")
        return None

async def get_user_predictions(user_id: str, skip: int = 0, limit: int = 50) -> List[PredictionResponse]:
    """
    Get all stored predictions for a user.
    """
    try:
        session = sql_connector.get_session()
        query = "SELECT * FROM dbo.Predictions WHERE UserId = :user_id"
        # result = session.execute(query, {"user_id": user_id}).fetchall()
        # Transform to Pydantic models...
        return [] # Placeholder
    except Exception as e:
        logger.error(f"Failed to fetch predictions: {str(e)}")
        return []

async def estimate_learning_roi(user_id: str) -> List[LearningROIResponse]:
    """
    Calculate ROI for learning each priority skill.
    """
    try:
        # Mocking user context
        current_salary = 80000
        target_skills = ["Generative AI", "Azure DevOps", "Databricks"]
        
        results = []
        for skill in target_skills:
            roi_data = ROICalculator.estimate_roi(skill, current_salary, skill_difficulty=7, market_demand=0.9)
            results.append(LearningROIResponse(
                skill_name=skill,
                estimated_salary_increase=roi_data["annual_gain"],
                cost_to_learn=roi_data["investment_cost"],
                time_to_learn_hours=280,
                roi_percentage=roi_data["roi_score"] * 100,
                break_even_months=roi_data["break_even_months"]
            ))
        return results
    except Exception as e:
        logger.error(f"ROI estimation failed: {str(e)}")
        return []

async def get_portfolio_resilience(user_id: str) -> Dict:
    """
    Calculate resilience score for user's skill portfolio.
    """
    try:
        session = sql_connector.get_session()
        query = "SELECT s.SkillName FROM dbo.UserSkills us JOIN dbo.Skills s ON us.SkillId = s.SkillId WHERE us.UserId = :user_id"
        result = session.execute(query, {"user_id": user_id}).fetchall()
        skills = [row[0] for row in result]
        
        return ResilienceScorer.calculate_resilience(skills)
    except Exception as e:
        logger.error(f"Resilience scoring failed: {str(e)}")
        return {"score": 0, "error": str(e)}

async def refresh_predictions(user_id: str) -> None:
    """
    Trigger background job to refresh user's ML predictions.
    """
    logger.info(f"Refreshing predictions for user {user_id}...")
    # Trigger Azure Function or background task
    pass

async def record_prediction_feedback(prediction_id: str, is_accurate: bool) -> None:
    """
    Record feedback to improve ML model accuracy over time.
    """
    try:
        session = sql_connector.get_session()
        query = "UPDATE dbo.AuditLog SET Action = 'Prediction Feedback', Details = :details WHERE AuditId = :id"
        # session.execute(query, {"details": f"Accurate: {is_accurate}", "id": prediction_id})
        # session.commit()
    except Exception as e:
        logger.error(f"Feedback recording failed: {str(e)}")
