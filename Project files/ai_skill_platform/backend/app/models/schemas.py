"""
Pydantic Models for API Requests and Responses
"""

from typing import Optional, List, Dict, Any
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from enum import Enum


# ============================================================
# ENUMS
# ============================================================

class EmploymentStatusEnum(str, Enum):
    EMPLOYED = "employed"
    UNEMPLOYED = "unemployed"
    FREELANCE = "freelance"
    STUDENT = "student"
    TRANSITIONING = "transitioning"


class ProficiencyLevelEnum(str, Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"
    EXPERT = "expert"


class SkillCategoryEnum(str, Enum):
    PROGRAMMING = "Programming Languages"
    DATA_SCIENCE = "Data Science & AI"
    CLOUD = "Cloud Platforms"
    DEVOPS = "DevOps & Containerization"
    WEB = "Web Development"
    MOBILE = "Mobile Development"
    DATABASE = "Databases"
    BIG_DATA = "Big Data"


class PredictionTypeEnum(str, Enum):
    ROLE_PREDICTION = "role_prediction"
    SKILL_GAP = "skill_gap"
    SKILL_DECAY = "skill_decay_forecast"
    ROI_ESTIMATION = "roi_estimation"
    PRIORITY_RANKING = "priority_ranking"
    TREND_ALERT = "trend_alert"


# ============================================================
# USER MODELS
# ============================================================

class UserBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    current_role: Optional[str] = None
    target_role: Optional[str] = None


class UserCreate(UserBase):
    pass


class UserUpdate(BaseModel):
    current_role: Optional[str] = None
    target_role: Optional[str] = None
    department: Optional[str] = None
    years_of_experience: Optional[int] = None
    bio: Optional[str] = None


class UserResponse(UserBase):
    user_id: str
    created_at: datetime
    is_active: bool
    
    class Config:
        from_attributes = True


# ============================================================
# SKILL MODELS
# ============================================================

class SkillBase(BaseModel):
    skill_name: str
    skill_category: SkillCategoryEnum
    description: Optional[str] = None
    skill_level: Optional[ProficiencyLevelEnum] = None


class SkillCreate(SkillBase):
    profiling_frequency: Optional[int] = 50
    predicted_growth_rate: Optional[float] = 0.0


class SkillResponse(SkillBase):
    skill_id: str
    profiling_frequency: int
    predicted_growth_rate: float
    is_active: bool
    
    class Config:
        from_attributes = True


class UserSkillBase(BaseModel):
    skill_id: str
    proficiency_level: ProficiencyLevelEnum
    years_of_experience: Optional[float] = None
    proficiency: Optional[int] = Field(None, ge=0, le=100)


class UserSkillCreate(UserSkillBase):
    pass


class UserSkillResponse(UserSkillBase):
    user_skill_id: str
    current_decay_percentage: float
    last_practiced_date: Optional[datetime] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


# ============================================================
# PREDICTION MODELS
# ============================================================

class PredictionBase(BaseModel):
    prediction_type: PredictionTypeEnum
    confidence: float = Field(..., ge=0, le=100)


class PredictionCreate(PredictionBase):
    target_skill_id: Optional[str] = None
    target_role_id: Optional[str] = None
    reasoning: Optional[str] = None


class PredictionResponse(PredictionBase):
    prediction_id: str
    user_id: str
    predicted_value: Dict[str, Any]
    model_version: str
    prediction_date: datetime
    valid_until_date: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class RolePredictionResponse(BaseModel):
    predicted_role: str
    confidence: float
    reasoning: str
    required_skills: List[str]
    learning_estimate_hours: int


class SkillGapResponse(BaseModel):
    skill_name: str
    current_level: ProficiencyLevelEnum
    target_level: ProficiencyLevelEnum
    gap_level: str
    estimated_learning_hours: int


class SkillDecayForecastResponse(BaseModel):
    skill_name: str
    current_proficiency: int
    forecasted_proficiency_in_3_months: int
    forecasted_proficiency_in_6_months: int
    decay_rate_per_month: float
    recommendation: str


class LearningROIResponse(BaseModel):
    skill_name: str
    estimated_learning_hours: int
    estimated_cost: float
    projected_salary_increase: float
    roi_percentage: float
    break_even_months: int
    long_term_value: float


# ============================================================
# JOB POSTING MODELS
# ============================================================

class JobPostingBase(BaseModel):
    job_title: str
    company_name: str
    industry: Optional[str] = None
    salary_min: Optional[float] = None
    salary_max: Optional[float] = None
    location: Optional[str] = None


class JobPostingResponse(JobPostingBase):
    job_posting_id: str
    required_skills: Optional[List[str]] = None
    preferred_skills: Optional[List[str]] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


# ============================================================
# ALERT MODELS
# ============================================================

class TrendAlertResponse(BaseModel):
    alert_id: str
    trend_type: str
    alert_title: str
    affected_skills: List[str]
    severity: str
    created_at: datetime
    expires_at: Optional[datetime] = None


# ============================================================
# GENERIC RESPONSE MODELS
# ============================================================

class HealthResponse(BaseModel):
    status: str
    version: str
    timestamp: datetime
    database: str = "unknown"
    blob_storage: str = "unknown"


class ErrorResponse(BaseModel):
    error: str
    detail: Optional[str] = None
    status_code: int


class PaginatedResponse(BaseModel):
    data: List[Any]
    total: int
    page: int
    page_size: int
    total_pages: int


class SuccessResponse(BaseModel):
    success: bool
    message: str
    data: Optional[Any] = None


# ============================================================
# AI MENTOR MODELS
# ============================================================

class MentorMessageRequest(BaseModel):
    topic: str
    question: str
    context: Optional[str] = None


class MentorMessageResponse(BaseModel):
    session_id: str
    mentor_response: str
    suggestions: List[str]
    resources: List[Dict[str, str]]
    next_steps: List[str]


# ============================================================
# DASHBOARD MODELS
# ============================================================

class UserDashboardResponse(BaseModel):
    user: UserResponse
    total_skills: int
    avg_proficiency: float
    priority_skills: List[UserSkillResponse]
    upcoming_alerts: List[TrendAlertResponse]
    predictions: List[PredictionResponse]
    ROI_estimates: List[LearningROIResponse]
