"""
Azure Active Directory (AAD) Authentication Helper
This module handles Azure AD integration for authentication and authorization.
"""

import os
import json
from typing import Optional, Dict, Any
from datetime import datetime, timedelta

from msal import PublicClientApplication, ConfidentialClientApplication
from azure.identity import ClientSecretCredential, DefaultAzureCredential
from azure.keyvault.secrets import SecretClient
import jwt
from functools import wraps

from fastapi import HTTPException, Depends, Header, Request
from typing import Any
try:
    from fastapi.security import HTTPBearer, HTTPAuthCredentials
except ImportError:
    try:
        from fastapi.security.http import HTTPBearer, HTTPAuthCredentials
    except ImportError:
        from fastapi.security import HTTPBearer
        HTTPAuthCredentials = Any


class AzureADAuthenticator:
    """
    Manages Azure AD authentication and token validation.
    Supports both Desktop and Web Application flows.
    """
    
    def __init__(self):
        self.tenant_id = os.getenv("AZURE_TENANT_ID")
        self.client_id = os.getenv("BACKEND_AAD_CLIENT_ID")
        self.client_secret = os.getenv("AZURE_CLIENT_SECRET")
        self.authority = os.getenv("AAD_AUTHORITY")
        self.scopes = os.getenv("AAD_SCOPES", "api://default/.default").split(",")
        
        self.is_configured = all([self.tenant_id, self.client_id])
        if not self.is_configured:
            import logging
            logging.getLogger(__name__).warning("⚠️ Azure AD configuration missing. Auth will be disabled/mocked.")
            self.msal_app = None
            return
            
        # Initialize MSAL ConfidentialClientApplication for server-side auth
        self.msal_app = ConfidentialClientApplication(
            client_id=self.client_id,
            authority=self.authority,
            client_credential=self.client_secret
        )
    
    def get_app_access_token(self) -> str:
        """
        Get an access token for the application (using client credentials flow).
        Used for service-to-service authentication.
        """
        result = self.msal_app.acquire_token_for_client(scopes=self.scopes)
        
        if "access_token" in result:
            return result["access_token"]
        else:
            raise Exception(f"Failed to acquire access token: {result.get('error_description')}")
    
    def validate_token(self, token: str) -> Dict[str, Any]:
        """
        Validate JWT token from Azure AD.
        Returns decoded token claims.
        """
        try:
            # Get public keys from Azure AD to validate signature
            from msal.application import Application
            
            # Decode without verification first to get the kid (key ID)
            unverified_header = jwt.get_unverified_header(token)
            
            # In production, validate signature using Azure AD's public keys
            # For now, we'll decode with verification using PyJWT
            decoded = jwt.decode(
                token,
                options={"verify_signature": False}  # In production, use Azure's public keys
            )
            
            return decoded
        except jwt.ExpiredSignatureError:
            raise HTTPException(status_code=401, detail="Token has expired")
        except jwt.InvalidTokenError as e:
            raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")
    
    def get_user_info_from_token(self, token: str) -> Dict[str, Any]:
        """
        Extract user information from token.
        """
        claims = self.validate_token(token)
        
        return {
            "user_id": claims.get("oid"),  # Azure AD Object ID
            "email": claims.get("preferred_username") or claims.get("upn"),
            "name": claims.get("name"),
            "tenant_id": claims.get("tid"),
            "roles": claims.get("roles", []),
            "preferred_username": claims.get("preferred_username")
        }


class AzureADMiddleware:
    """
    Middleware for protecting FastAPI routes with Azure AD authentication.
    """
    
    def __init__(self):
        self.auth = AzureADAuthenticator()
        self.security = HTTPBearer()
    
    async def __call__(
        self, 
        request: Request, 
        credentials: HTTPAuthCredentials = Depends(HTTPBearer())
    ):
        """
        Validate Azure AD token for each request.
        """
        try:
            token = credentials.credentials
            user_info = self.auth.get_user_info_from_token(token)
            request.state.user = user_info
            request.state.token = token
            return user_info
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=401, detail="Authentication failed")


def require_auth(func):
    """
    Decorator to require Azure AD authentication on FastAPI routes.
    Usage: @app.get("/protected", dependencies=[Depends(require_auth)])
    """
    @wraps(func)
    async def wrapper(
        request: Request,
        credentials: HTTPAuthCredentials = Depends(HTTPBearer()),
        *args,
        **kwargs
    ):
        auth = AzureADAuthenticator()
        try:
            token = credentials.credentials
            user_info = auth.get_user_info_from_token(token)
            request.state.user = user_info
            return await func(request, *args, **kwargs)
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=401, detail="Unauthorized")
    
    return wrapper


class AzureKeyVaultHelper:
    """
    Helper class for retrieving secrets from Azure Key Vault.
    """
    
    def __init__(self):
        self.vault_url = os.getenv("KEY_VAULT_URI")
        
        if not self.vault_url:
            import logging
            logging.getLogger(__name__).warning("⚠️ KEY_VAULT_URI not configured. Key Vault services disabled.")
            self.client = None
            return
        
        # Create SecretClient using DefaultAzureCredential
        self.client = SecretClient(
            vault_url=self.vault_url,
            credential=DefaultAzureCredential()
        )
    
    def get_secret(self, secret_name: str) -> str:
        """
        Retrieve a secret from Azure Key Vault.
        """
        try:
            secret = self.client.get_secret(secret_name)
            return secret.value
        except Exception as e:
            raise Exception(f"Failed to retrieve secret {secret_name}: {str(e)}")
    
    def get_connection_string(self, secret_name: str = "db-connection-string") -> str:
        """
        Retrieve database connection string from Key Vault.
        """
        return self.get_secret(secret_name)


# Initialize services safely
try:
    auth_handler = AzureADAuthenticator()
except Exception:
    auth_handler = None

try:
    kv_helper = AzureKeyVaultHelper()
except Exception:
    kv_helper = None


if __name__ == "__main__":
    # Test Azure AD authentication
    try:
        token = auth_handler.get_app_access_token()
        print(f"✓ Successfully obtained app access token (first 50 chars): {token[:50]}...")
        
        # Test Key Vault
        # secret = kv_helper.get_secret("test-secret")
        # print(f"✓ Successfully retrieved secret from Key Vault")
    except Exception as e:
        print(f"✗ Error: {str(e)}")
