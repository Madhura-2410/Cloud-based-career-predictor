import sys
import os
import logging

# Add the app directory to sys.path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.services.data_processing_pipeline_service import pipeline_service
from utils import sql_connector

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

def main():
    """
    Execute the data processing pipeline.
    """
    logger.info("Starting Data Processing Pipeline...")
    
    # Test database connection
    if not sql_connector.test_connection():
        logger.error("Database connection failed. Please ensure SQL Server is running and connection string is correct.")
        return
    
    try:
        # Run the full pipeline
        summary = pipeline_service.run_full_pipeline()
        
        logger.info("Pipeline Execution Summary:")
        for dataset, stats in summary.get("datasets", {}).items():
            logger.info(f"  - {dataset}: {stats.get('rows')} rows processed, {stats.get('skills_extracted')} skills extracted")
        
        if summary.get("errors"):
            logger.error(f"Pipeline encountered {len(summary['errors'])} errors:")
            for error in summary["errors"]:
                logger.error(f"  - {error}")
        else:
            logger.info("Pipeline completed successfully!")
            
    except Exception as e:
        logger.error(f"An unexpected error occurred during pipeline execution: {str(e)}")

if __name__ == "__main__":
    main()
