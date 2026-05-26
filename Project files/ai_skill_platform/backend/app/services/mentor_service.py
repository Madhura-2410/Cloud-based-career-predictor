import logging
from typing import List, Dict
import random

logger = logging.getLogger(__name__)

class AIMentorService:
    """
    Simulates an AI Mentor providing career guidance based on skill patterns and market trends.
    """
    
    @staticmethod
    def generate_guidance(user_id: str, skills: List[str], predicted_role: str) -> Dict:
        """
        Generate personalized career guidance.
        """
        # Guidance templates
        intro_templates = [
            f"Based on your profile, I see a clear path towards becoming a {predicted_role}.",
            f"Your current skill set in {', '.join(skills[:3])} is a strong foundation for a {predicted_role} role.",
            f"Looking at the industry trends, transitioning to {predicted_role} would be a highly strategic move."
        ]
        
        advice_templates = [
            "I recommend double-downing on technical certifications to boost your market visibility.",
            "Focus on building a portfolio that demonstrates your proficiency in practical applications.",
            "Networking with industry professionals in your target dream role will provide invaluable insights."
        ]
        
        # Roadmap steps
        steps = [
            {"step": 1, "title": "Foundation", "action": f"Solidify {skills[0] if skills else 'core'} skills"},
            {"step": 2, "title": "Specialize", "action": f"Learn advanced concepts in {predicted_role} domain"},
            {"step": 3, "title": "Validation", "action": "Obtain relevant industry certifications"},
            {"step": 4, "title": "Portfolio", "action": "Build 2-3 high-impact projects"},
            {"step": 5, "title": "Launch", "action": "Start applying and networking for target roles"}
        ]
        
        return {
            "mentor_name": "Antigravity AI Mentor",
            "summary": random.choice(intro_templates),
            "primary_advice": random.choice(advice_templates),
            "roadmap_steps": steps,
            "motivation_quote": "The best way to predict the future is to create it.",
            "next_milestone": "Complete advanced certification in Generative AI"
        }

mentor_service = AIMentorService()
