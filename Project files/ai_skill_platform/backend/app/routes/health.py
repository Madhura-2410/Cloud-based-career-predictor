"""
Health Check Route
Basic health and status checks for the API
"""

from fastapi import APIRouter, Depends
from datetime import datetime
from app.models.schemas import HealthResponse
from utils import sql_connector, blob_client

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
async def health_check():
    """
    Health check endpoint - no authentication required.
    Returns status of API and dependent services.
    """
    
    # Check database
    db_status = "healthy"
    try:
        if sql_connector and hasattr(sql_connector, 'test_connection'):
            db_status = "healthy" if sql_connector.test_connection() else "unhealthy"
        else:
            db_status = "disabled"
    except Exception:
        db_status = "unhealthy"
    
    # Check Blob Storage
    blob_status = "disabled"
    try:
        if blob_client and hasattr(blob_client, 'is_configured') and blob_client.is_configured:
            blob_client.list_blobs("datasets")
            blob_status = "healthy"
        else:
            blob_status = "disabled"
    except Exception:
        blob_status = "unhealthy"
    
    return HealthResponse(
        status="healthy" if db_status == "healthy" else ("degraded" if blob_status == "unhealthy" else "running"),
        version="1.0.0",
        timestamp=datetime.utcnow(),
        database=db_status,
        blob_storage=blob_status
    )


@router.get("/status")
async def status():
    """Detailed status information."""
    return {
        "api": "running",
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat(),
        "environment": "production"
    }
