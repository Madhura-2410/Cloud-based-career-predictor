from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app.services.analytics_service import analytics_service

router = APIRouter()

@router.get("/trends")
async def get_job_trends(industry: Optional[str] = None, limit: int = 10):
    """Get job market trends."""
    try:
        trends = analytics_service.get_job_market_trends(industry=industry, limit=limit)
        return trends
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
