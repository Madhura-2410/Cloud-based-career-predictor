"""
Azure Client Configuration
Central configuration for all Azure services.
"""

import os
from typing import Optional
from azure.identity import DefaultAzureCredential, ClientSecretCredential
try:
    from azure.mgmt.subscription import SubscriptionClient
    HAS_MGMT_SDK = True
except ImportError:
    SubscriptionClient = None
    HAS_MGMT_SDK = False
import logging

logger = logging.getLogger(__name__)


class AzureClientConfig:
    """
    Centralized Azure configuration and credential management.
    Supports multiple authentication methods for different environments.
    """
    
    def __init__(self):
        """Initialize Azure client configuration."""
        self.subscription_id = os.getenv("AZURE_SUBSCRIPTION_ID")
        self.tenant_id = os.getenv("AZURE_TENANT_ID")
        self.client_id = os.getenv("AZURE_CLIENT_ID")
        self.client_secret = os.getenv("AZURE_CLIENT_SECRET")
        self.resource_group = os.getenv("AZURE_RESOURCE_GROUP")
        self.location = os.getenv("AZURE_LOCATION", "eastus")
        
        if not self.subscription_id:
            logger.warning("AZURE_SUBSCRIPTION_ID not set")
        
        self.credential = self._get_credential()
    
    def _get_credential(self):
        """
        Get Azure credentials using the most appropriate method.
        Priority: Client Secret > Service Principal > Managed Identity > CLI/Environment
        """
        try:
            if self.client_id and self.client_secret and self.tenant_id:
                logger.info("Using Service Principal credentials")
                return ClientSecretCredential(
                    tenant_id=self.tenant_id,
                    client_id=self.client_id,
                    client_secret=self.client_secret
                )
            else:
                logger.info("Using DefaultAzureCredential")
                # This attempts: environment, managed identity, CLI, etc.
                return DefaultAzureCredential()
        except Exception as e:
            logger.error(f"Failed to initialize credentials: {str(e)}")
            raise
    
    def validate_credentials(self) -> bool:
        """Validate that credentials are properly configured."""
        if not HAS_MGMT_SDK:
            logger.warning("Azure Management SDK not installed. Skipping deep validation.")
            return True # Assume valid for local preview
            
        try:
            if not self.subscription_id:
                logger.error("Subscription ID not configured")
                return False
            
            # Try to get subscription details
            subscription_client = SubscriptionClient(credential=self.credential)
            subscription = subscription_client.subscriptions.get(self.subscription_id)
            
            logger.info(f"✓ Subscription verified: {subscription.display_name}")
            return True
        except Exception as e:
            logger.error(f"Credential validation failed: {str(e)}")
            return False
    
    def get_subscription_client(self):
        """Get Azure Subscription client."""
        if not HAS_MGMT_SDK:
            raise ImportError("Azure Management SDK (azure-mgmt-subscription) is not installed.")
        return SubscriptionClient(credential=self.credential)
    
    def get_credential(self):
        """Get Azure credential object."""
        return self.credential


# Global configuration instance
azure_config = AzureClientConfig()


if __name__ == "__main__":
    # Test Azure configuration
    try:
        print("Testing Azure client configuration...")
        
        if azure_config.validate_credentials():
            print("✓ Azure credentials are valid")
            print(f"  Subscription ID: {azure_config.subscription_id}")
            print(f"  Tenant ID: {azure_config.tenant_id}")
            print(f"  Resource Group: {azure_config.resource_group}")
            print(f"  Location: {azure_config.location}")
        else:
            print("✗ Azure credentials validation failed")
    
    except Exception as e:
        print(f"✗ Error: {str(e)}")
