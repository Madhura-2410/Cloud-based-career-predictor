"""
Users API Routes
User management, profile, and authentication endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from uuid import UUID

from app.models.schemas import (
    UserResponse, UserCreate, UserUpdate, UserDashboardResponse
)
from app.services import user_service
from utils import auth_handler, AzureADMiddleware

router = APIRouter()


@router.post("/register", response_model=UserResponse, status_code=201)
async def register_user(user: UserCreate):
    """
    Register a new user.
    Creates user profile in database.
    """
    try:
        created_user = await user_service.create_user(user)
        return created_user
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to create user")


@router.get("/profile", response_model=UserResponse)
async def get_profile(
    request,
    credentials: dict = Depends(AzureADMiddleware())
):
    """
    Get current user's profile.
    Requires authentication.
    """
    try:
        user_id = request.state.user.get("user_id")
        user = await user_service.get_user(user_id)
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        return user
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{user_id}", response_model=UserResponse)
async def get_user(user_id: str):
    """Get user by ID."""
    try:
        user = await user_service.get_user(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return user
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/profile", response_model=UserResponse)
async def update_profile(
    update_data: UserUpdate,
    request,
    credentials: dict = Depends(AzureADMiddleware())
):
    """
    Update current user's profile.
    Requires authentication.
    """
    try:
        user_id = request.state.user.get("user_id")
        updated_user = await user_service.update_user(user_id, update_data)
        
        if not updated_user:
            raise HTTPException(status_code=404, detail="User not found")
        
        return updated_user
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{user_id}/dashboard", response_model=UserDashboardResponse)
async def get_user_dashboard(user_id: str):
    """
    Get comprehensive user dashboard with skills, predictions, and alerts.
    """
    try:
        dashboard = await user_service.get_user_dashboard(user_id)
        if not dashboard:
            raise HTTPException(status_code=404, detail="User not found")
        return dashboard
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{user_id}", status_code=204)
async def delete_user(user_id: str):
    """
    Delete a user (admin only).
    """
    try:
        success = await user_service.delete_user(user_id)
        if not success:
            raise HTTPException(status_code=404, detail="User not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/", response_model=List[UserResponse])
async def list_users(skip: int = 0, limit: int = 100):
    """
    List all users (paginated).
    Admin endpoint.
    """
    try:
        users = await user_service.list_users(skip, limit)
        return users
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
