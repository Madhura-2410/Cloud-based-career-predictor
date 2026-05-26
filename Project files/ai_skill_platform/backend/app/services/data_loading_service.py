"""
Data Loading Service
Loads datasets from Azure Blob Storage and local files
"""

import pandas as pd
import logging
from typing import List, Dict, Optional
from io import BytesIO
import os

from utils import blob_client

logger = logging.getLogger(__name__)


class DataLoadingService:
    """
    Service for loading datasets from Blob Storage and files.
    """
    
    @staticmethod
    def load_dataset_from_blob(dataset_name: str) -> Optional[pd.DataFrame]:
        """
        Load a CSV dataset from Blob Storage.
        
        Args:
            dataset_name: Name of the dataset file
        
        Returns:
            DataFrame or None if not found
        """
        try:
            logger.info(f"Loading dataset from Blob: {dataset_name}")
            
            # Download from blob
            blob_data = blob_client.download_dataset(dataset_name)
            
            # Read into DataFrame
            df = pd.read_csv(blob_data)
            
            logger.info(f"✓ Loaded {len(df)} rows from {dataset_name}")
            return df
        
        except Exception as e:
            logger.error(f"Failed to load dataset {dataset_name}: {str(e)}")
            return None
    
    @staticmethod
    def load_local_csv(file_path: str) -> Optional[pd.DataFrame]:
        """Load CSV from local file system."""
        try:
            df = pd.read_csv(file_path)
            logger.info(f"Loaded {len(df)} rows from {file_path}")
            return df
        except Exception as e:
            logger.error(f"Failed to load local file {file_path}: {str(e)}")
            return None
    
    @staticmethod
    def load_all_datasets() -> Dict[str, pd.DataFrame]:
        """
        Load all available datasets, checking local paths first.
        """
        # Define potential local paths (relative to project root)
        local_paths = {
            "job_postings": "../postings.csv",
            "ai_jobs": "../ai_jobs_market_2025_2026.csv",
            "resume": "../resume_data.csv",
            "companies": "../companies/companies.csv"
        }
        
        datasets = {}
        for key, path in local_paths.items():
            # Try local first
            df = DataLoadingService.load_local_csv(path)
            if df is not None:
                datasets[key] = df
            else:
                # Fallback to blob
                blob_name = os.path.basename(path) if key != "companies" else "companies/companies.csv"
                df = DataLoadingService.load_dataset_from_blob(blob_name)
                if df is not None:
                    datasets[key] = df
        
        return datasets
    
    @staticmethod
    def get_dataset_info(df: pd.DataFrame) -> Dict:
        """Get basic info about a dataset."""
        return {
            "rows": len(df),
            "columns": len(df.columns),
            "column_names": list(df.columns),
            "missing_values": df.isnull().sum().to_dict(),
            "dtypes": df.dtypes.astype(str).to_dict()
        }


# Global instance
data_loader = DataLoadingService()
