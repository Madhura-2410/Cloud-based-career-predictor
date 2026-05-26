import pandas as pd
from typing import List, Dict

class PriorityRanker:
    """
    Ranks skills to learn based on demand, growth, and user gap.
    """
    
    @staticmethod
    def rank_skills(missing_skills: List[str], market_trends: List[Dict]) -> List[Dict]:
        """
        Calculates a Priority Score for each missing skill.
        Score = (Market Demand * 0.5) + (Growth Rate * 0.3) + (Salary Multiplier * 0.2)
        """
        ranked = []
        
        # Convert trends to lookup
        trend_map = {t['skill']: t for t in market_trends}
        
        for skill in missing_skills:
            trend = trend_map.get(skill, {"demand": 50, "growth": 0.05, "salary_boost": 1.0})
            
            demand_score = trend.get("demand", 50)
            growth_score = trend.get("growth", 0.05) * 1000 # scale growth
            salary_score = trend.get("salary_boost", 1.0) * 10
            
            priority_score = (demand_score * 0.5) + (growth_score * 0.3) + (salary_score * 0.2)
            
            ranked.append({
                "skill": skill,
                "priority_score": round(priority_score, 2),
                "market_demand": demand_score,
                "growth_rate": trend.get("growth", 0.05)
            })
            
        return sorted(ranked, key=lambda x: x["priority_score"], reverse=True)
