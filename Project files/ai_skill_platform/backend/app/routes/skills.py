from fastapi import APIRouter, HTTPException, Query
from typing import List
from app.services.analytics_service import analytics_service

router = APIRouter()

@router.get("/trending")
async def get_trending_skills(days: int = 90, limit: int = 20):
    """Get trending skills from job postings."""
    try:
        skills = analytics_service.get_trending_skills(days=days, limit=limit)
        return skills
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/user/{user_id}")
async def get_user_skills(user_id: str):
    """Get skills for a specific user."""
    try:
        skills = analytics_service.get_skills_by_user(user_id)
        return skills
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
