"""
Resume Analysis Service
Comprehensive resume analysis including skill extraction and career recommendations
"""

import logging
from typing import Dict, List
from datetime import datetime
import re

from app.services.text_preprocessing_service import preprocessor
from app.services.skill_extraction_service import skill_extractor

logger = logging.getLogger(__name__)


class ResumeAnalysisService:
    """
    Service for comprehensive resume analysis.
    """
    
    @staticmethod
    def extract_experience_years(resume_text: str) -> int:
        """
        Extract years of experience from resume.
        
        Args:
            resume_text: Raw resume text
        
        Returns:
            Estimated years of experience
        """
        try:
            # Look for patterns like "5 years", "10+ years", etc.
            patterns = [
                r'(\d+)\+?\s*(?:years?|yrs?)\s*(?:of\s+)?(?:experience|exp)',
                r'(?:experience|exp):\s*(\d+)\+?\s*(?:years?|yrs?)',
            ]
            
            matches = []
            for pattern in patterns:
                found = re.findall(pattern, resume_text.lower())
                matches.extend([int(m) for m in found])
            
            # Return average or default to 0
            return int(sum(matches) / len(matches)) if matches else 0
        
        except Exception as e:
            logger.error(f"Failed to extract experience years: {str(e)}")
            return 0
    
    @staticmethod
    def extract_education(resume_text: str) -> List[str]:
        """
        Extract education details from resume.
        
        Args:
            resume_text: Raw resume text
        
        Returns:
            List of education entries
        """
        try:
            education_keywords = [
                "bachelor", "master", "phd", "degree", "diploma", "certification",
                "bs.", "ba.", "ms.", "ma.", "mba", "bs computer science"
            ]
            
            lines = resume_text.split('\n')
            education = []
            
            for line in lines:
                if any(keyword in line.lower() for keyword in education_keywords):
                    cleaned = line.strip()
                    if cleaned:
                        education.append(cleaned)
            
            return education[:5]  # Limit to 5 entries
        
        except Exception as e:
            logger.error(f"Failed to extract education: {str(e)}")
            return []
    
    @staticmethod
    def extract_certifications(resume_text: str) -> List[str]:
        """
        Extract certifications from resume.
        
        Args:
            resume_text: Raw resume text
        
        Returns:
            List of certifications
        """
        try:
            cert_keywords = [
                "aws certified", "aws", "gcp", "azure", "kubernetes",
                "cissp", "ccna", "rhce", "pmp", "scrum master", "certified"
            ]
            
            lines = resume_text.split('\n')
            certs = []
            
            for line in lines:
                if any(keyword in line.lower() for keyword in cert_keywords):
                    cleaned = line.strip()
                    if cleaned and len(cleaned) > 5:
                        certs.append(cleaned)
            
            return certs[:5]  # Limit to 5 entries
        
        except Exception as e:
            logger.error(f"Failed to extract certifications: {str(e)}")
            return []
    
    @staticmethod
    def determine_experience_level(years: int, top_skills: List[Dict]) -> str:
        """
        Determine experience level based on years and skills.
        
        Args:
            years: Years of experience
            top_skills: List of extracted skills
        
        Returns:
            Experience level (entry, mid, senior, expert)
        """
        if years < 2 or len(top_skills) < 3:
            return "entry"
        elif years < 5 or len(top_skills) < 8:
            return "mid"
        elif years < 10 or len(top_skills) < 15:
            return "senior"
        else:
            return "expert"
    
    @staticmethod
    def get_skill_proficiency_estimate(skill_data: Dict) -> str:
        """
        Estimate proficiency level based on confidence score.
        
        Args:
            skill_data: Skill extraction data
        
        Returns:
            Proficiency level (beginner, intermediate, advanced, expert)
        """
        confidence = skill_data.get("confidence", 0)
        
        if confidence < 0.5:
            return "beginner"
        elif confidence < 0.7:
            return "intermediate"
        elif confidence < 0.85:
            return "advanced"
        else:
            return "expert"
    
    @staticmethod
    def analyze_resume_comprehensive(resume_text: str) -> Dict:
        """
        Comprehensive resume analysis.
        
        Args:
            resume_text: Raw resume text
        
        Returns:
            Complete analysis results
        """
        try:
            # Clean text
            cleaned_text = preprocessor.clean_text(resume_text)
            
            # Extract components
            years_exp = ResumeAnalysisService.extract_experience_years(resume_text)
            education = ResumeAnalysisService.extract_education(resume_text)
            certifications = ResumeAnalysisService.extract_certifications(resume_text)
            
            # Extract skills with confidence
            skills_data = skill_extractor.extract_skills_with_confidence(resume_text)
            top_skills = sorted(skills_data, key=lambda x: x["confidence"], reverse=True)[:15]
            
            # Enhance top skills with proficiency
            enhanced_skills = [
                {
                    **skill,
                    "proficiency": ResumeAnalysisService.get_skill_proficiency_estimate(skill)
                }
                for skill in top_skills
            ]
            
            # Determine experience level
            exp_level = ResumeAnalysisService.determine_experience_level(years_exp, enhanced_skills)
            
            # Calculate scores
            skill_diversity = len(set(s["skill"] for s in enhanced_skills))
            average_confidence = sum(s["confidence"] for s in enhanced_skills) / len(enhanced_skills) if enhanced_skills else 0
            
            return {
                "summary": {
                    "years_experience": years_exp,
                    "experience_level": exp_level,
                    "total_skills_identified": len(skills_data),
                    "unique_skill_categories": skill_diversity,
                    "resume_quality_score": round(average_confidence * 100, 2)
                },
                "skills": {
                    "top_skills": enhanced_skills,
                    "total_count": len(skills_data),
                    "average_confidence": round(average_confidence, 2)
                },
                "education": {
                    "entries": education,
                    "count": len(education)
                },
                "certifications": {
                    "entries": certifications,
                    "count": len(certifications)
                },
                "opportunities": {
                    "missing_technical_skills": ResumeAnalysisService.identify_gaps(enhanced_skills),
                    "recommended_certifications": ResumeAnalysisService.recommend_certs(exp_level),
                    "career_path_suggestions": ResumeAnalysisService.suggest_roles(exp_level, enhanced_skills)
                },
                "metadata": {
                    "analysis_timestamp": datetime.utcnow().isoformat(),
                    "text_length": len(cleaned_text),
                    "word_count": len(cleaned_text.split())
                }
            }
        
        except Exception as e:
            logger.error(f"Failed to analyze resume: {str(e)}")
            return {"error": str(e_), "timestamp": datetime.utcnow().isoformat()}
    
    @staticmethod
    def identify_gaps(current_skills: List[Dict]) -> List[str]:
        """
        Identify common skills missing from resume.
        
        Args:
            current_skills: List of current skills
        
        Returns:
            List of recommended skills to develop
        """
        common_role_skills = ["git", "ci/cd", "docker", "testing", "documentation"]
        found_skills = [s["skill"].lower() for s in current_skills]
        
        gaps = [skill for skill in common_role_skills if skill not in found_skills]
        return gaps[:5]
    
    @staticmethod
    def recommend_certs(experience_level: str) -> List[str]:
        """
        Recommend certifications based on experience level.
        
        Args:
            experience_level: Current experience level
        
        Returns:
            List of recommended certifications
        """
        recommendations = {
            "entry": ["AWS Solutions Architect Associate", "Azure Fundamentals", "CompTIA A+"],
            "mid": ["AWS Solutions Architect Professional", "Azure Administrator", "Kubernetes CKA"],
            "senior": ["AWS Security Specialty", "Google Cloud Professional", "CISSP"],
            "expert": ["AWS Solutions Architect Expert", "Google Cloud Architect", "Enterprise DevOps"]
        }
        
        return recommendations.get(experience_level, [])
    
    @staticmethod
    def suggest_roles(experience_level: str, skills: List[Dict]) -> List[Dict]:
        """
        Suggest career paths based on skills and experience.
        
        Args:
            experience_level: Current experience level
            skills: Current skills
        
        Returns:
            List of suggested roles
        """
        skill_names = [s["skill"].lower() for s in skills]
        
        suggestions = []
        
        # Check for specific role indicators
        if any(skill in skill_names for skill in ["react", "vue", "angular"]):
            suggestions.append({
                "role": "Frontend Developer",
                "match_percentage": 85,
                "description": "Build user interfaces using modern JavaScript frameworks"
            })
        
        if any(skill in skill_names for skill in ["python", "machine learning", "tensorflow"]):
            suggestions.append({
                "role": "ML Engineer / Data Scientist",
                "match_percentage": 90,
                "description": "Develop machine learning models and data solutions"
            })
        
        if any(skill in skill_names for skill in ["aws", "azure", "docker", "kubernetes"]):
            suggestions.append({
                "role": "DevOps / Cloud Engineer",
                "match_percentage": 88,
                "description": "Manage infrastructure and deployment pipelines"
            })
        
        if any(skill in skill_names for skill in ["fastapi", "nodejs", "spring"]):
            suggestions.append({
                "role": "Backend Developer",
                "match_percentage": 87,
                "description": "Build server-side applications and APIs"
            })
        
        # Sort by match percentage
        return sorted(suggestions, key=lambda x: x["match_percentage"], reverse=True)[:3]


resume_analyzer = ResumeAnalysisService()
