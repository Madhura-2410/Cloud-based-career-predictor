import os
import logging
from azure.identity import DefaultAzureCredential
from azure.keyvault.secrets import SecretClient

logger = logging.getLogger(__name__)

class KeyVaultService:
    """
    Secure retrieval of secrets from Azure Key Vault.
    If KVAULT_URL is not set, falls back to environment variables.
    """
    
    def __init__(self):
        self.vault_url = os.getenv("AZURE_KEYVAULT_URL")
        self.client = None
        
        if self.vault_url:
            try:
                credential = DefaultAzureCredential()
                self.client = SecretClient(vault_url=self.vault_url, credential=credential)
                logger.info(f"Connected to Azure Key Vault: {self.vault_url}")
            except Exception as e:
                logger.error(f"Failed to connect to Key Vault: {str(e)}")

    def get_secret(self, secret_name: str, default: str = None) -> str:
        """
        Retrieves a secret from Key Vault or falls back to ENV.
        """
        if self.client:
            try:
                return self.client.get_secret(secret_name).value
            except Exception as e:
                logger.warning(f"Secret {secret_name} not found in Key Vault, trying ENV. Error: {str(e)}")
        
        return os.getenv(secret_name, default)

kv_client = KeyVaultService()
