from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.analytics_service import analytics_service

router = APIRouter()

class ResumeRequest(BaseModel):
    resume_text: str

@router.post("/analyze")
async def analyze_resume(request: ResumeRequest):
    """Analyze resume text to extract skills and info."""
    try:
        analysis = analytics_service.analyze_resume(request.resume_text)
        return analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
