"""
Data Processing Pipeline Service
Coordinates data loading, cleaning, skill extraction, and storage
"""

import logging
import pandas as pd
from typing import Dict, List, Optional
from datetime import datetime

from app.services.data_loading_service import data_loader
from app.services.text_preprocessing_service import preprocessor
from app.services.skill_extraction_service import skill_extractor
from utils import sql_connector

logger = logging.getLogger(__name__)


class DataProcessingPipelineService:
    """
    Coordinates the entire data processing pipeline.
    """
    
    @staticmethod
    def process_job_postings(df: pd.DataFrame) -> pd.DataFrame:
        """
        Process job postings data.
        
        Steps:
        1. Clean job description
        2. Extract skills
        3. Extract required/preferred skills
        
        Args:
            df: Raw job postings DataFrame
        
        Returns:
            Processed DataFrame
        """
        logger.info("🔄 Processing job postings...")
        
        # Identify description column (common column names)
        desc_col = None
        for col in df.columns:
            if 'description' in col.lower() or 'job_desc' in col.lower():
                desc_col = col
                break
        
        if desc_col:
            # Clean text
            df = preprocessor.preprocess_dataframe(df, desc_col)
            
            # Extract skills
            df = skill_extractor.extract_skills_from_dataframe(df, desc_col)
            logger.info(f"✓ Extracted skills from {len(df)} job postings")
        
        return df
    
    @staticmethod
    def process_resumes(df: pd.DataFrame) -> pd.DataFrame:
        """
        Process resume data.
        
        Args:
            df: Raw resume DataFrame
        
        Returns:
            Processed DataFrame
        """
        logger.info("🔄 Processing resumes...")
        
        # Find resume content column
        content_col = None
        for col in df.columns:
            if 'resume' in col.lower() or 'content' in col.lower() or 'text' in col.lower():
                content_col = col
                break
        
        if content_col:
            df = preprocessor.preprocess_dataframe(df, content_col)
            df = skill_extractor.extract_skills_from_dataframe(df, content_col)
            logger.info(f"✓ Extracted skills from {len(df)} resumes")
        
        return df
    
    @staticmethod
    def store_skills_to_database(skills_dict: Dict[str, int]) -> None:
        """
        Store extracted skills to database.
        
        Args:
            skills_dict: Dictionary of {skill_name: frequency}
        """
        try:
            session = sql_connector.get_session()
            
            for skill_name, frequency in skills_dict.items():
                # Check if skill exists
                query = f"""
                    SELECT 1 FROM dbo.Skills WHERE SkillName = :skill_name
                """
                result = session.execute(query, {"skill_name": skill_name})
                
                if not result.fetchone():
                    # Insert new skill
                    insert_query = f"""
                        INSERT INTO dbo.Skills 
                        (SkillName, SkillCategory, ProfilingFrequency, CreatedAt, ModifiedAt)
                        VALUES (:skill_name, 'General', :frequency, GETUTCDATE(), GETUTCDATE())
                    """
                    session.execute(insert_query, {"skill_name": skill_name, "frequency": frequency})
            
            session.commit()
            logger.info(f"✓ Stored {len(skills_dict)} skills to database")
        
        except Exception as e:
            logger.error(f"Failed to store skills: {str(e)}")
            session.rollback()
    
    @staticmethod
    def store_job_postings_to_database(df: pd.DataFrame) -> None:
        """
        Store processed job postings to database.
        
        Args:
            df: Processed job postings DataFrame
        """
        try:
            session = sql_connector.get_session()
            
            for idx, row in df.iterrows():
                # Check if job posting already exists
                query = f"""
                    SELECT 1 FROM dbo.JobPostings 
                    WHERE ExternalJobId = :external_id OR 
                    (JobTitle = :title AND CompanyName = :company)
                    LIMIT 1
                """
                
                params = {
                    "external_id": row.get("id", ""),
                    "title": row.get("JobTitle", row.get("job_title", "")),
                    "company": row.get("CompanyName", row.get("company_name", ""))
                }
                
                result = session.execute(query, params)
                
                if not result.fetchone():
                    # Insert job posting
                    insert_query = f"""
                        INSERT INTO dbo.JobPostings 
                        (JobTitle, CompanyName, Industry, Location, JobDescription, 
                         RequiredSkills, EmploymentType, PostedDate, Source, IsActive, CreatedAt)
                        VALUES (:title, :company, :industry, :location, :description,
                                :skills, :emp_type, GETUTCDATE(), 'process', 1, GETUTCDATE())
                    """
                    
                    skills = row.get("JobDescription_skills", [])
                    params = {
                        "title": row.get("JobTitle", row.get("job_title", "")),
                        "company": row.get("CompanyName", row.get("company_name", "")),
                        "industry": row.get("Industry", row.get("industry", "")),
                        "location": row.get("Location", row.get("location", "")),
                        "description": row.get("JobDescription_cleaned", "")[:3000],
                        "skills": str(skills),
                        "emp_type": row.get("EmploymentType", row.get("employment_type", "full-time"))
                    }
                    
                    session.execute(insert_query, params)
            
            session.commit()
            logger.info(f"✓ Stored {len(df)} job postings to database")
        
        except Exception as e:
            logger.error(f"Failed to store job postings: {str(e)}")
            session.rollback()
    
    @staticmethod
    def run_full_pipeline() -> Dict:
        """
        Run the complete data processing pipeline.
        
        Returns:
            Pipeline execution summary
        """
        logger.info("=" * 50)
        logger.info("🚀 STARTING DATA PROCESSING PIPELINE")
        logger.info("=" * 50)
        
        summary = {
            "timestamp": datetime.utcnow().isoformat(),
            "datasets": {},
            "total_skills": 0,
            "total_records": 0,
            "errors": []
        }
        
        try:
            # Load datasets
            datasets = data_loader.load_all_datasets()
            logger.info(f"✓ Loaded {len(datasets)} datasets")
            
            # Process job postings
            if "job_postings" in datasets:
                df_jobs = DataProcessingPipelineService.process_job_postings(datasets["job_postings"])
                DataProcessingPipelineService.store_job_postings_to_database(df_jobs)
                
                # Extract skill frequencies
                all_skills = {}
                for skills_list in df_jobs.get("JobDescription_skills", []):
                    for skill in skills_list:
                        all_skills[skill] = all_skills.get(skill, 0) + 1
                
                DataProcessingPipelineService.store_skills_to_database(all_skills)
                
                summary["datasets"]["job_postings"] = {
                    "rows": len(df_jobs),
                    "skills_extracted": len(all_skills),
                    "top_skills": dict(sorted(all_skills.items(), key=lambda x: x[1], reverse=True)[:10])
                }
                summary["total_skills"] += len(all_skills)
                summary["total_records"] += len(df_jobs)
            
            # Process resumes
            if "resume" in datasets:
                df_resumes = DataProcessingPipelineService.process_resumes(datasets["resume"])
                
                # Extract skill frequencies from resumes
                resume_skills = {}
                for skills_list in df_resumes.get("text_skills", df_resumes.get("content_skills", [])):
                    for skill in skills_list:
                        resume_skills[skill] = resume_skills.get(skill, 0) + 1
                
                summary["datasets"]["resumes"] = {
                    "rows": len(df_resumes),
                    "skills_extracted": len(resume_skills),
                    "top_skills": dict(sorted(resume_skills.items(), key=lambda x: x[1], reverse=True)[:10])
                }
                summary["total_records"] += len(df_resumes)
            
        except Exception as e:
            logger.error(f"Pipeline error: {str(e)}")
            summary["errors"].append(str(e))
        
        logger.info("=" * 50)
        logger.info("✅ PIPELINE COMPLETE")
        logger.info("=" * 50)
        
        return summary


pipeline_service = DataProcessingPipelineService()
