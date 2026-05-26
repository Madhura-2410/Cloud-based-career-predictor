"""
Azure Functions App
Event-driven serverless functions for data processing and automation
"""

import azure.functions as func
import logging
import json
from datetime import datetime

app = func.FunctionApp()

logger = logging.getLogger(__name__)


# ============================================================
# FUNCTION 1: Weekly Skill Decay Update
# ============================================================

@app.timer_trigger(arg_name="myTimer", schedule="0 0 * * 0")  # Every Sunday at Midnight
def weekly_skill_decay_update(myTimer: func.TimerRequest) -> None:
    """
    Weekly function to update skill decay percentages for all users.
    """
    from ml_models.skill_decay_model import SkillDecayModel
    from utils import sql_connector
    
    logging.info('Starting weekly skill decay recalculation...')
    
    try:
        session = sql_connector.get_session()
        
        # 1. Query users and their skills with last practiced date
        query = "SELECT us.UserId, s.SkillName, us.LastPracticedDate FROM dbo.UserSkills us JOIN dbo.Skills s ON us.SkillId = s.SkillId"
        rows = session.execute(query).fetchall()
        
        for row in rows:
            user_id, skill_name, last_date = row
            days_since = (datetime.utcnow() - last_date).days
            
            # 2. Calculate Decay
            decay = SkillDecayModel.calculate_decay_percentage(skill_name, days_since)
            
            # 3. Update DB
            update_query = "UPDATE dbo.UserSkills SET CurrentDecayPercentage = :decay WHERE UserId = :uid AND SkillId = (SELECT SkillId FROM dbo.Skills WHERE SkillName = :sname)"
            session.execute(update_query, {"decay": decay, "uid": user_id, "sname": skill_name})
            
            # 4. Trigger Alert if decay > 30%
            if decay > 30:
                logging.warning(f"CRITICAL DECAY: User {user_id} skill {skill_name} at {decay}%")
                # Push to notification queue for Logic App
        
        session.commit()
        logging.info('Weekly decay update completed successfully.')
        
    except Exception as e:
        logging.error(f"Failed weekly decay update: {str(e)}")

# ============================================================
# FUNCTION 2: Dataset Upload Processing (Blob Trigger)
# ============================================================

@app.blob_trigger(arg_name="myblob", path="datasets/{name}", connection="AzureWebJobsStorage")
def process_new_dataset(myblob: func.InputStream):
    """
    Triggered when a new dataset is uploaded to the 'datasets' container.
    """
    logging.info(f"Python blob trigger function processed blob \n"
                 f"Name: {myblob.name}\n"
                 f"Blob Size: {myblob.length} bytes")
    
    # Trigger the processing pipeline (could call a webhook on the FastAPI backend)
    # import requests
    # requests.post("https://api.yourdomain.com/admin/trigger-pipeline")

# ============================================================
# FUNCTION 3: Logic App Alert Router
# ============================================================

@app.queue_trigger(arg_name="msg", queue_name="alerts-queue", connection="AzureWebJobsStorage")
def logic_app_alert_router(msg: func.InputStream) -> None:
    """
    Routes alerts to Logic Apps for multi-channel notification (Email, Teams, Mobile).
    """
    try:
        message = json.loads(msg.getvalue().decode())
        alert_type = message.get("type") # 'DECAY' | 'TREND' | 'RISK'
        
        logging.info(f"Routing {alert_type} alert to Logic App...")
        
        # Logic App HTTP Trigger URL from Environment Variables
        # LOGIC_APP_URL = os.environ["LOGIC_APP_WEBHOOK_URL"]
        # requests.post(LOGIC_APP_URL, json=message)
        
    except Exception as e:
        logging.error(f"Error routing alert: {str(e)}")


# ============================================================
# FUNCTION 5: Health Check
# ============================================================

@app.route(route="health")
def health_check(req: func.HttpRequest) -> func.HttpResponse:
    """Health check endpoint for monitoring."""
    return func.HttpResponse(
        json.dumps({
            "status": "healthy",
            "service": "ai-skill-functions",
            "timestamp": datetime.utcnow().isoformat()
        }),
        status_code=200,
        mimetype="application/json"
    )


if __name__ == "__main__":
    app.run()
