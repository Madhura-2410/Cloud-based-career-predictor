class ResilienceScorer:
    """
    Calculates how resilient a user's skill portfolio is against automation and market changes.
    """
    
    # Automation risk scores (0-1, where 1 is highly automatable)
    AUTOMATION_RISK = {
        "manual data entry": 0.95,
        "basic coding": 0.40,
        "complex system design": 0.10,
        "strategic planning": 0.05,
        "empathy": 0.02,
        "python": 0.20,
        "machine learning": 0.15,
        "prompt engineering": 0.30
    }
    
    @staticmethod
    def calculate_resilience(skills: list) -> dict:
        """
        Calculates Resilience Score based on diversity and low-automation-risk skills.
        """
        if not skills:
            return {"score": 0, "status": "critical"}
        
        total_risk = 0
        known_skills = 0
        
        for skill in skills:
            risk = ResilienceScorer.AUTOMATION_RISK.get(skill.lower(), 0.5)
            total_risk += risk
            known_skills += 1
            
        avg_risk = total_risk / known_skills
        resilience_score = (1 - avg_risk) * 100
        
        # Add diversity bonus
        diversity_bonus = min(len(skills) * 2, 20)
        final_score = min(resilience_score + diversity_bonus, 100)
        
        status = "high"
        if final_score < 40: status = "critical"
        elif final_score < 70: status = "moderate"
        
        return {
            "score": round(final_score, 2),
            "status": status,
            "automation_vulnerability": round(avg_risk * 100, 2)
        }
