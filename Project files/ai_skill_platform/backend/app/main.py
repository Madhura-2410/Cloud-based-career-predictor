"""
FastAPI Main Application
AI Skill Intelligence Platform Backend API
"""

import os
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, HTMLResponse, FileResponse
from fastapi.openapi.utils import get_openapi
from fastapi.staticfiles import StaticFiles
from pathlib import Path

from app.routes import health, users, skills, predictions, analytics, jobs, resume, mentor
from app.services import database_service
from utils import sql_connector, blob_client, auth_handler

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


# Lifespan event handlers
@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application startup and shutdown events.
    """
    # Startup
    logger.info("🚀 Starting AI Skill Intelligence Platform API...")
    
    try:
        # Initialize database
        logger.info("📊 Initializing database connection...")
        if sql_connector.test_connection():
            logger.info("✓ Database connection successful")
        else:
            logger.warning("⚠ Database connection test failed, continuing...")
        
        # Initialize Blob Storage
        logger.info("☁️  Testing Blob Storage connection...")
        try:
            if blob_client and blob_client.is_configured:
                datasets = blob_client.list_blobs("datasets")
                logger.info(f"✓ Blob Storage accessible ({len(datasets)} datasets found)")
            else:
                logger.warning("⚠ Blob Storage not configured for local development")
        except Exception as e:
            logger.warning(f"⚠ Blob Storage initialization warning: {str(e)}")
        
        # Test Azure AD
        logger.info("🔐 Testing Azure AD configuration...")
        try:
            app.state.auth_handler = auth_handler
            logger.info("✓ Azure AD configured")
        except Exception as e:
            logger.warning(f"⚠ Azure AD configuration warning: {str(e)}")
    
    except Exception as e:
        logger.error(f"✗ Startup error: {str(e)}")
    
    yield
    
    # Shutdown
    logger.info("🛑 Shutting down AI Skill Intelligence Platform API...")
    try:
        if sql_connector and hasattr(sql_connector, 'engine') and sql_connector.engine:
            sql_connector.close()
            logger.info("✓ Database connections closed")
    except Exception as e:
        logger.error(f"Error during shutdown: {str(e)}")


# Create FastAPI application
app = FastAPI(
    title="AI Skill Intelligence Platform",
    description="Cloud-native platform for skill tracking, prediction, and career development",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:8000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Custom OpenAPI schema
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    
    openapi_schema = get_openapi(
        title="AI Skill Intelligence Platform API",
        version="1.0.0",
        description="""
        Enterprise API for AI Skill Intelligence Platform
        
        ## Features
        - 👤 User management and profiles
        - 🎯 Skill tracking and decay forecasting
        - 🔮 Role and skill predictions
        - 📊 Learning ROI estimation
        - 🤖 AI mentor simulation
        - 📡 Industry trend alerts
        - 🔐 Azure AD authentication
        - ☁️  Blob Storage integration
        
        ## Authentication
        All endpoints (except `/health`) require Azure AD token.
        Include token in Authorization header: `Bearer <token>`
        """,
        routes=app.routes,
    )
    
    openapi_schema["info"]["x-logo"] = {
        "url": "https://via.placeholder.com/150"
    }
    
    app.openapi_schema = openapi_schema
    return app.openapi_schema


app.openapi = custom_openapi


# Include routers
app.include_router(health.router, tags=["Health"])
app.include_router(users.router, tags=["Users"], prefix="/api/users")
app.include_router(skills.router, tags=["Skills"], prefix="/skills")
app.include_router(predictions.router, tags=["Predictions"], prefix="/api/predictions")
app.include_router(analytics.router, tags=["Analytics"])
app.include_router(jobs.router, tags=["Jobs"], prefix="/jobs")
app.include_router(resume.router, tags=["Resume"], prefix="/resume")
app.include_router(mentor.router, tags=["Mentor"], prefix="/mentor")

# Serve frontend static files
try:
    app.mount("/static", StaticFiles(directory="static/static"), name="static")
except Exception as e:
    logger.warning(f"Could not mount static files: {str(e)}")
    logger.info("API will run without frontend - this is normal in development mode")


# Root endpoint serves the frontend if it exists, otherwise returns API metadata.
@app.get("/", response_class=HTMLResponse)
async def root():
    """Root endpoint."""
    index_file = Path(__file__).resolve().parents[1] / "static" / "index.html"
    if index_file.exists():
        return FileResponse(index_file, media_type="text/html")

    return JSONResponse(
        content={
            "name": "AI Skill Intelligence Platform",
            "version": "1.0.0",
            "status": "running",
            "docs": "/docs",
            "health": "/health"
        }
    )


# Error handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """Custom HTTP exception handler."""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": exc.detail,
            "status_code": exc.status_code
        }
    )


@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """Global exception handler."""
    logger.error(f"Unhandled exception: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "detail": str(exc) if os.getenv("DEBUG", "false").lower() == "true" else None
        }
    )


if __name__ == "__main__":
    import uvicorn
    
    port = int(os.getenv("API_PORT", 8000))
    host = os.getenv("API_HOST", "0.0.0.0")
    
    logger.info(f"Starting server on {host}:{port}")
    
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=os.getenv("DEBUG", "false").lower() == "true",
        log_level=os.getenv("LOG_LEVEL", "info").lower()
    )
