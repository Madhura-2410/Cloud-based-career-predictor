"""
Skills API Routes
Skill management, tracking, and decay monitoring
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List

from app.models.schemas import (
    SkillResponse, SkillCreate, UserSkillResponse, UserSkillCreate,
    SkillDecayForecastResponse, SkillGapResponse
)
from app.services import skill_service
from utils import auth_handler

router = APIRouter()


@router.get("/", response_model=List[SkillResponse])
async def list_skills(
    category: str = Query(None),
    skip: int = 0,
    limit: int = 100
):
    """
    List all registered skills.
    Optionally filter by category.
    """
    try:
        skills = await skill_service.list_skills(category, skip, limit)
        return skills
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{skill_id}", response_model=SkillResponse)
async def get_skill(skill_id: str):
    """Get skill details by ID."""
    try:
        skill = await skill_service.get_skill(skill_id)
        if not skill:
            raise HTTPException(status_code=404, detail="Skill not found")
        return skill
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/", response_model=SkillResponse, status_code=201)
async def create_skill(skill: SkillCreate):
    """
    Create new skill (admin only).
    """
    try:
        created_skill = await skill_service.create_skill(skill)
        return created_skill
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/{user_id}/add", response_model=UserSkillResponse, status_code=201)
async def add_skill_to_user(user_id: str, user_skill: UserSkillCreate):
    """
    Add a skill to user's skill set.
    """
    try:
        added_skill = await skill_service.add_skill_to_user(user_id, user_skill)
        return added_skill
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{user_id}/skills", response_model=List[UserSkillResponse])
async def get_user_skills(user_id: str, skip: int = 0, limit: int = 100):
    """
    Get all skills for a user.
    """
    try:
        skills = await skill_service.get_user_skills(user_id, skip, limit)
        return skills
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{user_id}/priority-skills", response_model=List[UserSkillResponse])
async def get_priority_skills(user_id: str):
    """
    Get user's priority skills (ranked by importance).
    """
    try:
        skills = await skill_service.get_priority_skills(user_id)
        return skills
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{user_id}/decay-forecast", response_model=List[SkillDecayForecastResponse])
async def get_decay_forecast(user_id: str):
    """
    Get skill decay forecast for user's skills.
    Shows projected proficiency loss over time.
    """
    try:
        forecasts = await skill_service.get_skill_decay_forecast(user_id)
        return forecasts
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{user_id}/gaps", response_model=List[SkillGapResponse])
async def get_skill_gaps(user_id: str):
    """
    Get skill gaps between current and target role.
    """
    try:
        gaps = await skill_service.get_skill_gaps(user_id)
        return gaps
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/{user_id}/practice/{skill_id}", status_code=204)
async def record_skill_practice(user_id: str, skill_id: str):
    """
    Record that user practiced a skill.
    Updates last_practiced_date and resets decay.
    """
    try:
        await skill_service.record_skill_practice(user_id, skill_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{user_id}/skills/{skill_id}", status_code=204)
async def remove_user_skill(user_id: str, skill_id: str):
    """
    Remove a skill from user's skill set.
    """
    try:
        success = await skill_service.remove_user_skill(user_id, skill_id)
        if not success:
            raise HTTPException(status_code=404, detail="User skill not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
