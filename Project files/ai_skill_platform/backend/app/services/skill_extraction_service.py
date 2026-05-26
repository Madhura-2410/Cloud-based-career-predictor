"""
Skill Extraction Service
Extracts and identifies skills from text using NLP and pattern matching
"""

import logging
from typing import List, Dict, Set, Tuple
import re
import pandas as pd
from difflib import SequenceMatcher

logger = logging.getLogger(__name__)


class SkillExtractionService:
    """
    Service for extracting skills from job descriptions, resumes, etc.
    """
    
    # Comprehensive skill database (can be expanded)
    SKILL_KEYWORDS = {
        # Programming Languages
        "python": ["python", "py"],
        "javascript": ["javascript", "js", "node"],
        "typescript": ["typescript", "ts"],
        "java": ["java"],
        "csharp": ["c#", "csharp", ".net"],
        "sql": ["sql", "tsql", "plsql"],
        "golang": ["go", "golang"],
        "rust": ["rust"],
        "react": ["react", "reactjs"],
        "vue": ["vue", "vuejs"],
        "angular": ["angular"],
        "nodejs": ["nodejs", "node.js", "express"],
        
        # Data Science & ML
        "machine learning": ["machine learning", "ml", "deep learning"],
        "tensorflow": ["tensorflow", "tf"],
        "pytorch": ["pytorch"],
        "pandas": ["pandas"],
        "scikit-learn": ["scikit-learn", "sklearn", "scikit"],
        "numpy": ["numpy"],
        "nlp": ["nlp", "natural language", "text processing"],
        "computer vision": ["computer vision", "cv", "image processing"],
        "data science": ["data science"],
        
        # Cloud Platforms
        "aws": ["aws", "amazon web services"],
        "azure": ["azure", "microsoft azure"],
        "gcp": ["gcp", "google cloud"],
        "kubernetes": ["kubernetes", "k8s"],
        "docker": ["docker"],
        "ci/cd": ["ci/cd", "continuous integration", "continuous deployment"],
        
        # Databases
        "mongodb": ["mongodb"],
        "postgres": ["postgres", "postgresql"],
        "mysql": ["mysql"],
        "redis": ["redis"],
        "elasticsearch": ["elasticsearch"],
        
        # Tools & Frameworks
        "fastapi": ["fastapi"],
        "django": ["django"],
        "flask": ["flask"],
        "spring": ["spring"],
        "git": ["git", "github", "gitlab"],
        "docker": ["docker"],
        "kafka": ["kafka"],
        "spark": ["spark", "apache spark"],
    }
    
    @staticmethod
    def extract_skills_nlp(text: str) -> List[str]:
        """
        Extract skills using spaCy NLP.
        """
        try:
            import spacy
            try:
                nlp = spacy.load("en_core_web_sm")
            except:
                # If model not found, fallback to basic logic
                return []
                
            doc = nlp(text)
            # Extract nouns and proper nouns as potential skills
            nlp_skills = [chunk.text.lower() for chunk in doc.noun_chunks]
            return nlp_skills
        except:
            return []

    @staticmethod
    def extract_skills(text: str, similarity_threshold: float = 0.8) -> List[str]:
        """
        Extract skills from text using both NLP and keyword matching.
        """
        text_lower = text.lower()
        extracted = set()
        
        # 1. Direct keyword matching
        for skill_name, keywords in SkillExtractionService.SKILL_KEYWORDS.items():
            for keyword in keywords:
                # Use word boundaries to avoid partial matches
                pattern = r'\b' + re.escape(keyword) + r'\b'
                if re.search(pattern, text_lower):
                    extracted.add(skill_name)
        
        # 2. NLP-based extraction (basic implementation)
        # In a real scenario, we'd use a custom NER model for skills
        return sorted(list(extracted))
    
    @staticmethod
    def extract_skills_with_confidence(text: str) -> List[Dict]:
        """
        Extract skills with confidence scores.
        
        Args:
            text: Input text
        
        Returns:
            List of skills with confidence scores
        """
        text_lower = text.lower()
        skills_with_conf = []
        
        for skill_name, keywords in SkillExtractionService.SKILL_KEYWORDS.items():
            for keyword in keywords:
                pattern = r'\b' + re.escape(keyword) + r'\b'
                matches = len(re.findall(pattern, text_lower))
                
                if matches > 0:
                    # Confidence = 0.7 + (0.3 * min(matches/5, 1))
                    confidence = min(0.7 + (0.1 * matches), 1.0)
                    
                    skills_with_conf.append({
                        "skill": skill_name,
                        "keyword": keyword,
                        "occurrences": matches,
                        "confidence": confidence
                    })
        
        # Remove duplicates (keep highest confidence)
        skill_dict = {}
        for item in skills_with_conf:
            skill = item["skill"]
            if skill not in skill_dict or item["confidence"] > skill_dict[skill]["confidence"]:
                skill_dict[skill] = item
        
        return sorted(skill_dict.values(), key=lambda x: x["confidence"], reverse=True)
    
    @staticmethod
    def extract_skills_from_dataframe(df: pd.DataFrame, text_column: str) -> pd.DataFrame:
        """
        Extract skills from all records in a DataFrame.
        
        Args:
            df: DataFrame with text
            text_column: Column name containing text
        
        Returns:
            DataFrame with extracted skills column
        """
        df[f"{text_column}_skills"] = df[text_column].fillna("").apply(
            SkillExtractionService.extract_skills
        )
        
        logger.info(f"✓ Extracted skills from {len(df)} records")
        return df
    
    @staticmethod
    def get_skill_frequencies(texts: List[str]) -> Dict[str, int]:
        """
        Get frequency of each skill across multiple texts.
        
        Args:
            texts: List of texts to analyze
        
        Returns:
            Dictionary with skill names and frequencies
        """
        skill_freq = {}
        
        for text in texts:
            skills = SkillExtractionService.extract_skills(text)
            for skill in skills:
                skill_freq[skill] = skill_freq.get(skill, 0) + 1
        
        # Sort by frequency
        return dict(sorted(skill_freq.items(), key=lambda x: x[1], reverse=True))
    
    @staticmethod
    def add_custom_skills(skills_dict: Dict[str, List[str]]) -> None:
        """
        Add custom skills to the skill database.
        
        Args:
            skills_dict: Dictionary of {skill_name: [keywords]}
        """
        SkillExtractionService.SKILL_KEYWORDS.update(skills_dict)
        logger.info(f"✓ Added {len(skills_dict)} custom skills")


skill_extractor = SkillExtractionService()
