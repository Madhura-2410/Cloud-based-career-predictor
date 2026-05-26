import pandas as pd
import numpy as np
from datetime import datetime, timedelta

class SkillDecayModel:
    """
    Predicts the decay of a skill's relevance or proficiency over time.
    """
    
    # Half-life of skills in months (estimated)
    # AI/ML skills decay faster than soft skills or core programming
    SKILL_HALF_LIFE = {
        "generative ai": 6,
        "machine learning": 18,
        "python": 36,
        "sql": 60,
        "leadership": 120,
        "communication": 240,
        "default": 24
    }
    
    @staticmethod
    def calculate_decay_percentage(skill_name: str, days_since_practice: int) -> float:
        """
        Calculates decay using exponential decay formula: N(t) = N0 * (0.5)^(t/half_life)
        """
        skill_name = skill_name.lower()
        half_life_months = SkillDecayModel.SKILL_HALF_LIFE.get(skill_name, SkillDecayModel.SKILL_HALF_LIFE["default"])
        half_life_days = half_life_months * 30
        
        decay_factor = (0.5) ** (days_since_practice / half_life_days)
        decay_percentage = (1 - decay_factor) * 100
        
        return round(decay_percentage, 2)

    @staticmethod
    def predict_future_relevance(skill_name: str, years_ahead: int) -> float:
        """
        Predicts how relevant a skill will be in X years based on market trends.
        """
        # This would normally be trained on historical job posting trends
        # For now, return a heuristic based on "future_skill_prediction" data
        return 0.95 # Placeholder
