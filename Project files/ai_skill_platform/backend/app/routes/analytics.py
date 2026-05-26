"""
Analytics and Trends API Routes
Endpoints for trending skills, job trends, resume analysis
"""

from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from pydantic import BaseModel

from app.services.analytics_service import analytics_service
from app.services.resume_analysis_service import resume_analyzer

router = APIRouter(prefix="/api/analytics", tags=["analytics"])


# ============ Pydantic Models ============

class TrendingSkillResponse(BaseModel):
    skill: str
    count: int
    percentage: float


class UserSkillResponse(BaseModel):
    skill_id: str
    skill_name: str
    category: str
    proficiency: float
    decay_percentage: Optional[float] = None
    days_since_practice: Optional[int] = None


class JobMarketTrendResponse(BaseModel):
    industry: str
    job_count: int
    avg_salary: float
    percentage: float


class SkillDemandResponse(BaseModel):
    skill: str
    trend: str
    growth_rate: float
    demand_score: int


class ResumeAnalysisResponse(BaseModel):
    experience_level: str
    total_skills: int
    summary_word_count: int
    analysis_timestamp: str


class ResumeAnalysisComprehensiveResponse(BaseModel):
    summary: dict
    skills: dict
    education: dict
    certifications: dict
    opportunities: dict
    metadata: dict


# ============ Trending Skills Endpoint ============

@router.get(
    "/skills/trending",
    response_model=List[TrendingSkillResponse],
    summary="Get Trending Skills",
    description="Retrieve trending skills based on recent job postings"
)
async def get_trending_skills(
    days: int = Query(90, ge=1, le=365, description="Look back period in days"),
    limit: int = Query(20, ge=1, le=100, description="Number of skills to return")
):
    """
    Get trending skills from job postings.
    
    - **days**: Number of days to look back (default: 90)
    - **limit**: Number of results to return (default: 20)
    
    Returns trending skills with their frequency and market percentage.
    """
    try:
        skills = analytics_service.get_trending_skills(days=days, limit=limit)
        
        if not skills:
            raise HTTPException(status_code=404, detail="No trending skills data available")
        
        return skills
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve trending skills: {str(e)}")


# ============ User Skills Endpoint ============

@router.get(
    "/skills/user/{user_id}",
    response_model=List[UserSkillResponse],
    summary="Get User Skills",
    description="Retrieve all skills for a specific user"
)
async def get_user_skills(user_id: str):
    """
    Get all skills for a specific user with their proficiency levels.
    
    - **user_id**: The user's unique identifier
    
    Returns user's skills with proficiency, decay percentage, and practice history.
    """
    try:
        skills = analytics_service.get_skills_by_user(user_id)
        
        if not skills:
            raise HTTPException(status_code=404, detail=f"No skills found for user {user_id}")
        
        return skills
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve user skills: {str(e)}")


# ============ Job Market Trends Endpoint ============

@router.get(
    "/jobs/trends",
    summary="Get Job Market Trends",
    description="Retrieve job market trends by industry"
)
async def get_job_market_trends(
    industry: Optional[str] = Query(None, description="Filter by industry (optional)"),
    limit: int = Query(10, ge=1, le=50, description="Number of industries to return")
):
    """
    Get job market trends and statistics.
    
    - **industry**: Optional filter by industry name
    - **limit**: Number of results to return (default: 10)
    
    Returns job market data including job counts, average salaries, and market percentages.
    """
    try:
        trends = analytics_service.get_job_market_trends(industry=industry, limit=limit)
        
        if "error" in trends:
            raise HTTPException(status_code=500, detail=trends["error"])
        
        return trends
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve job trends: {str(e)}")


# ============ Skill Demand Forecast Endpoint ============

@router.get(
    "/skills/demand-forecast",
    response_model=List[SkillDemandResponse],
    summary="Get Skill Demand Forecast",
    description="Get forecasted demand for skills"
)
async def get_skill_demand_forecast():
    """
    Get forecasted skill demand based on market trends.
    
    Returns skills with demand trend (rising, stable, declining) and growth rate projections.
    """
    try:
        forecast = analytics_service.get_skill_demand_forecast()
        
        if not forecast:
            raise HTTPException(status_code=404, detail="No forecast data available")
        
        return forecast
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve demand forecast: {str(e)}")


# ============ Skill Frequency Distribution Endpoint ============

@router.get(
    "/skills/frequency-distribution",
    summary="Get Skill Frequency Distribution",
    description="Get distribution of skill frequency across all jobs"
)
async def get_skill_frequency():
    """
    Get frequency distribution of skills in the job market.
    
    Returns a dictionary mapping skill names to their frequency counts.
    """
    try:
        distribution = analytics_service.get_skill_frequency_distribution()
        
        if not distribution:
            raise HTTPException(status_code=404, detail="No frequency data available")
        
        return distribution
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve frequency distribution: {str(e)}")


# ============ Resume Analysis Endpoint ============

class ResumeAnalysisRequest(BaseModel):
    resume_text: str


@router.post(
    "/resume/analyze",
    response_model=ResumeAnalysisComprehensiveResponse,
    summary="Analyze Resume",
    description="Comprehensive analysis of a resume"
)
async def analyze_resume(request: ResumeAnalysisRequest):
    """
    Analyze a resume for skills, experience, and recommendations.
    
    Accepts:
    - **resume_text**: Raw text content of the resume
    
    Returns:
    - Extracted skills with proficiency levels
    - Experience level estimation
    - Education and certifications
    - Career path suggestions
    - Skill gap analysis
    - Recommended certifications
    """
    try:
        if not request.resume_text or len(request.resume_text.strip()) < 50:
            raise HTTPException(
                status_code=400,
                detail="Resume text must be at least 50 characters long"
            )
        
        analysis = resume_analyzer.analyze_resume_comprehensive(request.resume_text)
        
        if "error" in analysis:
            raise HTTPException(status_code=500, detail=analysis["error"])
        
        return analysis
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to analyze resume: {str(e)}")


# ============ Recommended Skills Endpoint ============

@router.get(
    "/skills/recommendations/{target_role}",
    summary="Get Recommended Skills",
    description="Get recommended skills for transitioning to a target role"
)
async def get_recommended_skills(
    target_role: str,
    current_role: str = Query("junior developer", description="Current job title")
):
    """
    Get recommended skills to transition to a target role.
    
    - **target_role**: Desired job title/role
    - **current_role**: Current job title (optional)
    
    Returns skills recommended for the transition with priority rankings.
    """
    try:
        recommendations = analytics_service.get_recommended_skills_for_role(
            current_role=current_role,
            target_role=target_role
        )
        
        if not recommendations:
            raise HTTPException(status_code=404, detail="No recommendations available")
        
        return recommendations
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve recommendations: {str(e)}")
