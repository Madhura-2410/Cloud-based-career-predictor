"""
Azure Blob Storage Helper
This module provides utilities for interacting with Azure Blob Storage.
Used for storing datasets, ML models, user uploads, etc.
"""

import os
from typing import Optional, List, BinaryIO, Tuple
from datetime import datetime, timedelta
import io

from azure.storage.blob import (
    BlobServiceClient, 
    BlobClient,
    ContainerClient,
    BlobSasPermissions,
    generate_blob_sas
)
from azure.identity import DefaultAzureCredential
import logging

logger = logging.getLogger(__name__)


class AzureBlobStorageClient:
    """
    Client for Azure Blob Storage operations.
    Supports uploading, downloading, listing, and managing blobs.
    """
    
    def __init__(self):
        """Initialize Blob Storage client."""
        connection_string = os.getenv("BLOB_STORAGE_CONNECTION_STRING")
        account_name = os.getenv("BLOB_STORAGE_ACCOUNT")
        
        self.is_configured = False
        try:
            if connection_string:
                # Use connection string if available
                self.blob_service_client = BlobServiceClient.from_connection_string(
                    connection_string
                )
                self.is_configured = True
            elif account_name:
                # Use managed identity (recommended for Azure deployments)
                account_url = f"https://{account_name}.blob.core.windows.net"
                self.blob_service_client = BlobServiceClient(
                    account_url=account_url,
                    credential=DefaultAzureCredential()
                )
                self.is_configured = True
            else:
                logger.warning("⚠️ Blob Storage configuration missing. Cloud storage features disabled.")
                self.blob_service_client = None
        except Exception as e:
            logger.warning(f"⚠️ Blob Storage initialization failed: {str(e)}")
            self.blob_service_client = None
        
        self.container_datasets = os.getenv("BLOB_CONTAINER_DATASETS", "datasets")
        self.container_models = os.getenv("BLOB_CONTAINER_MODELS", "ml-models")
        self.container_uploads = os.getenv("BLOB_CONTAINER_UPLOADS", "user-uploads")
    
    def ensure_container_exists(self, container_name: str) -> ContainerClient:
        """
        Create container if it doesn't exist.
        Returns ContainerClient instance.
        """
        try:
            container_client = self.blob_service_client.get_container_client(
                container_name
            )
            # This will fail if container doesn't exist
            container_client.get_container_properties()
            logger.info(f"Container '{container_name}' already exists")
        except Exception:
            # Container doesn't exist, create it
            logger.info(f"Creating container '{container_name}'...")
            container_client = self.blob_service_client.create_container(
                name=container_name
            )
        
        return container_client
    
    def upload_blob(
        self,
        container_name: str,
        blob_name: str,
        data: BinaryIO,
        overwrite: bool = True,
        metadata: Optional[dict] = None
    ) -> str:
        """
        Upload a blob to Blob Storage.
        
        Args:
            container_name: Name of the container
            blob_name: Name/path of the blob
            data: File-like object or bytes to upload
            overwrite: Allow overwriting existing blob
            metadata: Optional metadata dictionary
        
        Returns:
            Blob URI
        """
        try:
            container_client = self.ensure_container_exists(container_name)
            blob_client = container_client.get_blob_client(blob_name)
            
            blob_client.upload_blob(data, overwrite=overwrite)
            
            if metadata:
                blob_client.set_blob_metadata(metadata)
            
            logger.info(f"Successfully uploaded blob: {blob_name} to {container_name}")
            return blob_client.url
        
        except Exception as e:
            logger.error(f"Failed to upload blob: {str(e)}")
            raise
    
    def download_blob(
        self,
        container_name: str,
        blob_name: str
    ) -> BinaryIO:
        """
        Download a blob from Blob Storage.
        
        Args:
            container_name: Name of the container
            blob_name: Name/path of the blob
        
        Returns:
            BytesIO object with blob content
        """
        try:
            blob_client = self.blob_service_client.get_blob_client(
                container=container_name,
                blob=blob_name
            )
            
            download_stream = blob_client.download_blob()
            blob_data = io.BytesIO(download_stream.readall())
            blob_data.seek(0)
            
            logger.info(f"Successfully downloaded blob: {blob_name}")
            return blob_data
        
        except Exception as e:
            logger.error(f"Failed to download blob: {str(e)}")
            raise
    
    def delete_blob(
        self,
        container_name: str,
        blob_name: str
    ) -> bool:
        """Delete a blob from Blob Storage."""
        try:
            blob_client = self.blob_service_client.get_blob_client(
                container=container_name,
                blob=blob_name
            )
            blob_client.delete_blob()
            logger.info(f"Successfully deleted blob: {blob_name}")
            return True
        except Exception as e:
            logger.error(f"Failed to delete blob: {str(e)}")
            raise
    
    def list_blobs(
        self,
        container_name: str,
        name_starts_with: Optional[str] = None
    ) -> List[dict]:
        """
        List blobs in a container.
        
        Args:
            container_name: Name of the container
            name_starts_with: Optional filter prefix
        
        Returns:
            List of blob dictionaries with metadata
        """
        try:
            container_client = self.blob_service_client.get_container_client(
                container_name
            )
            
            blobs = []
            for blob_props in container_client.list_blobs(
                name_starts_with=name_starts_with
            ):
                blobs.append({
                    "name": blob_props.name,
                    "size": blob_props.size,
                    "created": blob_props.creation_time,
                    "modified": blob_props.last_modified
                })
            
            return blobs
        
        except Exception as e:
            logger.error(f"Failed to list blobs: {str(e)}")
            raise
    
    def generate_sas_url(
        self,
        container_name: str,
        blob_name: str,
        expires_in_hours: int = 24,
        permissions: str = "r"
    ) -> str:
        """
        Generate a SAS (Shared Access Signature) URL for a blob.
        Useful for sharing temporary access links.
        
        Args:
            container_name: Name of the container
            blob_name: Name of the blob
            expires_in_hours: Hours until SAS expires
            permissions: SAS permissions (r=read, w=write, d=delete, etc.)
        
        Returns:
            Full SAS URL
        """
        try:
            account_name = os.getenv("BLOB_STORAGE_ACCOUNT")
            account_key = os.getenv("BLOB_STORAGE_KEY")
            
            if not account_key:
                logger.warning("BLOB_STORAGE_KEY not set, cannot generate SAS URL")
                return None
            
            expiry = datetime.utcnow() + timedelta(hours=expires_in_hours)
            
            sas_token = generate_blob_sas(
                account_name=account_name,
                container_name=container_name,
                blob_name=blob_name,
                account_key=account_key,
                permission=BlobSasPermissions(read=("r" in permissions)),
                expiry=expiry
            )
            
            sas_url = (
                f"https://{account_name}.blob.core.windows.net/"
                f"{container_name}/{blob_name}?{sas_token}"
            )
            
            return sas_url
        
        except Exception as e:
            logger.error(f"Failed to generate SAS URL: {str(e)}")
            raise
    
    def upload_dataset(self, file_path: str, dataset_name: str) -> str:
        """
        Upload a dataset CSV to Blob Storage.
        
        Args:
            file_path: Local file path
            dataset_name: Name to store blob as
        
        Returns:
            Blob URI
        """
        try:
            with open(file_path, "rb") as file:
                return self.upload_blob(
                    container_name=self.container_datasets,
                    blob_name=dataset_name,
                    data=file,
                    metadata={
                        "dataset": dataset_name,
                        "uploaded_at": datetime.utcnow().isoformat(),
                        "file_type": "csv"
                    }
                )
        except Exception as e:
            logger.error(f"Failed to upload dataset: {str(e)}")
            raise
    
    def download_dataset(self, dataset_name: str) -> BinaryIO:
        """Download a dataset from Blob Storage."""
        return self.download_blob(
            container_name=self.container_datasets,
            blob_name=dataset_name
        )


# Initialize global client
blob_client = AzureBlobStorageClient()


if __name__ == "__main__":
    # Test Blob Storage operations
    try:
        print("Testing Azure Blob Storage client...")
        
        # List datasets
        datasets = blob_client.list_blobs("datasets")
        print(f"✓ Found {len(datasets)} datasets in Blob Storage")
        
        # Generate SAS URL for a blob
        # sas_url = blob_client.generate_sas_url("datasets", "sample.csv", expires_in_hours=1)
        # print(f"✓ Generated SAS URL: {sas_url[:80]}...")
    
    except Exception as e:
        print(f"✗ Error: {str(e)}")
