import logging
import os
import sys

def setup_azure_logging():
    """
    Configures logging for Azure Monitor / Application Insights.
    """
    connection_string = os.getenv("APPLICATIONINSIGHTS_CONNECTION_STRING")
    
    logger = logging.getLogger('app')
    logger.setLevel(logging.INFO)
    
    # Standard Stream Handler
    stream_handler = logging.StreamHandler(sys.stdout)
    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    stream_handler.setFormatter(formatter)
    logger.addHandler(stream_handler)
    
    if connection_string:
        try:
            # Requires opencensus-ext-azure
            from opencensus.ext.azure.log_exporter import AzureLogHandler
            logger.addHandler(AzureLogHandler(connection_string=connection_string))
            logger.info("Azure Monitor logging enabled.")
        except ImportError:
            logger.warning("opencensus-ext-azure not installed. Azure Monitor logging disabled.")
    
    return logger

app_logger = setup_azure_logging()
