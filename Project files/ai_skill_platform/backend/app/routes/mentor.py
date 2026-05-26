from fastapi import APIRouter, HTTPException
from app.services.mentor_service import mentor_service
from app.services.prediction_service import predict_next_role

router = APIRouter()

@router.get("/{user_id}/guidance")
async def get_mentor_guidance(user_id: str):
    """
    Get personalized AI Mentor guidance.
    """
    try:
        # Get prediction context first
        prediction = await predict_next_role(user_id)
        predicted_role = prediction.predicted_role if prediction else "Senior Specialist"
        
        # Mock some skills for the user
        skills = ["Python", "Cloud Architecture", "Leadership"]
        
        guidance = mentor_service.generate_guidance(user_id, skills, predicted_role)
        return guidance
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
