"""
Analytics & Trends Service
Calculates trending skills, job market trends, industry insights
"""

import logging
from typing import List, Dict, Optional
from datetime import datetime, timedelta
import pandas as pd
from sqlalchemy import text

from utils import sql_connector

logger = logging.getLogger(__name__)


class AnalyticsService:
    """
    Service for analytics, trends, and market insights.
    """
    
    @staticmethod
    def get_trending_skills(days: int = 90, limit: int = 20) -> List[Dict]:
        """
        Get trending skills based on recent job postings.
        
        Args:
            days: Look back period
            limit: Number of skills to return
        
        Returns:
            List of trending skills with counts and growth
        """
        try:
            session = sql_connector.get_session()
            
            query = text("""
                SELECT TOP :limit SkillName, COUNT(*) as skill_count, 
                       CAST(COUNT(*) as FLOAT) / (
                           SELECT COUNT(*) FROM dbo.JobPostings 
                           WHERE PostedDate >= DATEADD(day, -:days, GETUTCDATE())
                       ) * 100 as percentage
                FROM dbo.JobPostings jp
                CROSS APPLY STRING_SPLIT(REPLACE(REPLACE(jp.RequiredSkills, '[', ''), ']', ''), ',') as skills
                WHERE jp.PostedDate >= DATEADD(day, -:days, GETUTCDATE())
                GROUP BY SkillName
                ORDER BY skill_count DESC
            """)
            
            results = session.execute(query, {"days": days, "limit": limit}).fetchall()
            
            return [
                {
                    "skill": row[0],
                    "count": row[1],
                    "percentage": float(row[2])
                }
                for row in results
            ]
        
        except Exception as e:
            logger.error(f"Failed to get trending skills: {str(e)}")
            return []
    
    @staticmethod
    def get_skills_by_user(user_id: str) -> List[Dict]:
        """
        Get skills for a specific user.
        
        Args:
            user_id: User ID
        
        Returns:
            List of user skills with proficiency
        """
        try:
            session = sql_connector.get_session()
            
            query = text("""
                SELECT us.SkillId, s.SkillName, s.SkillCategory, 
                       us.Proficiency, us.CurrentDecayPercentage,
                       DATEDIFF(day, us.LastPracticedDate, GETUTCDATE()) as days_since_practice
                FROM dbo.UserSkills us
                JOIN dbo.Skills s ON us.SkillId = s.SkillId
                WHERE us.UserId = :user_id
                ORDER BY us.Proficiency DESC
            """)
            
            results = session.execute(query, {"user_id": user_id}).fetchall()
            
            return [
                {
                    "skill_id": str(row[0]),
                    "skill_name": row[1],
                    "category": row[2],
                    "proficiency": row[3],
                    "decay_percentage": row[4],
                    "days_since_practice": row[5]
                }
                for row in results
            ]
        
        except Exception as e:
            logger.error(f"Failed to get user skills: {str(e)}")
            return []
    
    @staticmethod
    def get_job_market_trends(industry: Optional[str] = None, limit: int = 10) -> Dict:
        """
        Get job market trends by industry.
        
        Args:
            industry: Filter by industry (optional)
            limit: Number of industries to return
        
        Returns:
            Job market trends data
        """
        try:
            session = sql_connector.get_session()
            
            # Jobs by industry
            industry_query = text("""
                SELECT TOP :limit Industry, COUNT(*) as job_count,
                       AVG(SalaryMax) as avg_salary,
                       CAST(COUNT(*) as FLOAT) / (SELECT COUNT(*) FROM dbo.JobPostings) * 100 as percentage
                FROM dbo.JobPostings
                WHERE Industry IS NOT NULL
                GROUP BY Industry
                ORDER BY job_count DESC
            """)
            
            industry_results = session.execute(industry_query, {"limit": limit}).fetchall()
            
            return {
                "by_industry": [
                    {
                        "industry": row[0],
                        "job_count": row[1],
                        "avg_salary": float(row[2]) if row[2] else 0,
                        "percentage": float(row[3])
                    }
                    for row in industry_results
                ],
                "total_jobs": session.execute(text("SELECT COUNT(*) FROM dbo.JobPostings")).scalar(),
                "timestamp": datetime.utcnow().isoformat()
            }
        
        except Exception as e:
            logger.error(f"Failed to get job market trends: {str(e)}")
            return {"error": str(e)}
    
    @staticmethod
    def get_skill_demand_forecast() -> List[Dict]:
        """
        Forecast future skill demand based on trends.
        
        Returns:
            List of skills with demand forecast
        """
        try:
            session = sql_connector.get_session()
            
            query = text("""
                SELECT SkillName, DemandTrend, PredictedGrowthRate, ProfilingFrequency
                FROM dbo.Skills
                WHERE IsActive = 1
                ORDER BY 
                    CASE WHEN DemandTrend = 'rising' THEN 1
                         WHEN DemandTrend = 'stable' THEN 2
                         ELSE 3 END,
                    PredictedGrowthRate DESC
            """)
            
            results = session.execute(query).fetchall()
            
            return [
                {
                    "skill": row[0],
                    "trend": row[1],
                    "growth_rate": float(row[2]) if row[2] else 0,
                    "demand_score": row[3]
                }
                for row in results
            ]
        
        except Exception as e:
            logger.error(f"Failed to get skill demand forecast: {str(e)}")
            return []
    
    @staticmethod
    def get_skill_frequency_distribution() -> Dict[str, int]:
        """
        Get distribution of skill frequency across all job postings.
        
        Returns:
            Dictionary of skill frequency
        """
        try:
            session = sql_connector.get_session()
            
            query = text("""
                SELECT SkillName, ProfilingFrequency
                FROM dbo.Skills
                WHERE IsActive = 1
                ORDER BY ProfilingFrequency DESC
                LIMIT 50
            """)
            
            results = session.execute(query).fetchall()
            
            return {row[0]: row[1] for row in results}
        
        except Exception as e:
            logger.error(f"Failed to get skill frequency: {str(e)}")
            return {}
    
    @staticmethod
    def analyze_resume(resume_text: str) -> Dict:
        """
        Analyze a resume for skills, experience level, and recommendations.
        
        Args:
            resume_text: Raw resume text
        
        Returns:
            Analysis results
        """
        from app.services.text_preprocessing_service import preprocessor
        from app.services.skill_extraction_service import skill_extractor
        
        try:
            # Clean text
            cleaned = preprocessor.clean_text(resume_text)
            
            # Extract skills with confidence
            skills = skill_extractor.extract_skills_with_confidence(resume_text)
            
            # Get top skills
            top_skills = sorted(skills, key=lambda x: x["confidence"], reverse=True)[:10]
            
            # Calculate experience level based on keywords
            exp_level = "entry"
            if any(word in cleaned for word in ["senior", "lead", "principal", "architect", "manager"]):
                exp_level = "senior"
            elif any(word in cleaned for word in ["mid-level", "experienced", "5 years", "10 years"]):
                exp_level = "mid"
            
            return {
                "experience_level": exp_level,
                "skills": top_skills,
                "total_skills": len(skills),
                "summary_word_count": len(cleaned.split()),
                "analysis_timestamp": datetime.utcnow().isoformat()
            }
        
        except Exception as e:
            logger.error(f"Failed to analyze resume: {str(e)}")
            return {"error": str(e)}
    
    @staticmethod
    def get_recommended_skills_for_role(current_role: str, target_role: str) -> List[Dict]:
        """
        Get recommended skills to transition from current to target role.
        
        Args:
            current_role: Current job title
            target_role: Target job title
        
        Returns:
            List of recommended skills with priority
        """
        try:
            session = sql_connector.get_session()
            
            # This is a placeholder - in production, would use ML model
            # For now, return trending skills that match target role
            query = text("""
                SELECT TOP 20 SkillName, PredictedGrowthRate, ProfilingFrequency
                FROM dbo.Skills
                WHERE IsActive = 1 AND DemandTrend = 'rising'
                ORDER BY PredictedGrowthRate DESC, ProfilingFrequency DESC
            """)
            
            results = session.execute(query).fetchall()
            
            return [
                {
                    "skill": row[0],
                    "priority": idx + 1,
                    "growth_rate": float(row[1]) if row[1] else 0,
                    "market_demand": row[2]
                }
                for idx, row in enumerate(results)
            ]
        
        except Exception as e:
            logger.error(f"Failed to get recommended skills: {str(e)}")
            return []


analytics_service = AnalyticsService()
