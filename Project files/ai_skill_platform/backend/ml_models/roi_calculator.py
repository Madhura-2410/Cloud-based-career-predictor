class ROICalculator:
    """
    Estimates Return on Investment for learning new skills.
    """
    
    @staticmethod
    def estimate_roi(skill_name: str, current_salary: float, skill_difficulty: int, market_demand: float) -> dict:
        """
        ROI = (Salary Increase * Probability) / (Hours to Learn * Hourly Cost)
        """
        # Heuristic salary increases per skill (in percentage)
        base_salary_jump = {
            "python": 0.15,
            "machine learning": 0.25,
            "azure": 0.20,
            "react": 0.12,
            "generative ai": 0.30,
            "default": 0.10
        }
        
        # Difficulty translates to learning hours (1-10 scale)
        learning_hours = skill_difficulty * 40 # 1 difficulty = 40 hours
        hourly_cost = (current_salary / 2080) # 2080 work hours per year
        
        investment_cost = learning_hours * hourly_cost
        
        jump_pct = base_salary_jump.get(skill_name.lower(), base_salary_jump["default"])
        annual_gain = current_salary * jump_pct * market_demand # Adjust gain by demand prob
        
        roi_score = (annual_gain / investment_cost) if investment_cost > 0 else 0
        
        return {
            "annual_gain": round(annual_gain, 2),
            "investment_cost": round(investment_cost, 2),
            "roi_score": round(roi_score, 2),
            "break_even_months": round((investment_cost / (annual_gain/12)), 1) if annual_gain > 0 else 0
        }
