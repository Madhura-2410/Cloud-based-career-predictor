# Deployment Guide - Phase 1: Project Setup & Azure Configuration

## Overview
This guide covers setting up the AI Skill Intelligence Platform in Microsoft Azure during Phase 1.

## Prerequisites

- Azure subscription (with owner/contributor access)
- Azure CLI installed and configured
- PowerShell 7+
- Azure Storage Explorer (optional but recommended)
- Git
- Python 3.9+
- Node.js 16+

## Phase 1 Deployment Steps

### STEP 1: Create Azure Resource Group

```bash
# Set variables
$resourceGroup = "ai-skill-platform-rg"
$location = "eastus"

# Create resource group
az group create \
  --name $resourceGroup \
  --location $location
```

### STEP 2: Create Azure SQL Database

```bash
# Variables
$sqlServer = "ai-skill-sql-server"
$sqlDatabase = "ai_skill_platform_db"
$sqlAdmin = "sqladmin"
$sqlPassword = "YourStrongPassword123!"

# Create SQL Server
az sql server create \
  --name $sqlServer \
  --resource-group $resourceGroup \
  --location $location \
  --admin-user $sqlAdmin \
  --admin-password $sqlPassword

# Create SQL Database
az sql db create \
  --resource-group $resourceGroup \
  --server $sqlServer \
  --name $sqlDatabase \
  --edition Standard \
  --service-objective S2

# Configure firewall rule (allow Azure services)
az sql server firewall-rule create \
  --resource-group $resourceGroup \
  --server $sqlServer \
  --name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0
```

### STEP 3: Create Azure Storage Account

```bash
# Variables
$storageAccount = "aiskillstorage$random"

# Create storage account
az storage account create \
  --name $storageAccount \
  --resource-group $resourceGroup \
  --location $location \
  --sku Standard_LRS \
  --kind StorageV2 \
  --access-tier Hot

# Create containers
az storage container create \
  --account-name $storageAccount \
  --name datasets

az storage container create \
  --account-name $storageAccount \
  --name ml-models

az storage container create \
  --account-name $storageAccount \
  --name user-uploads
```

### STEP 4: Create Azure Key Vault

```bash
# Variables
$keyVault = "ai-skill-vault"

# Create Key Vault
az keyvault create \
  --resource-group $resourceGroup \
  --name $keyVault \
  --location $location

# Store database connection string
$connectionString = "mssql+pyodbc://$sqlAdmin:$sqlPassword@$sqlServer.database.windows.net:1433/$sqlDatabase?driver=ODBC+Driver+17+for+SQL+Server"

az keyvault secret set \
  --vault-name $keyVault \
  --name "db-connection-string" \
  --value $connectionString

# Store storage account key
$storageKey = az storage account keys list --account-name $storageAccount --query "[0].value" -o tsv

az keyvault secret set \
  --vault-name $keyVault \
  --name "blob-storage-key" \
  --value $storageKey
```

### STEP 5: Setup Azure AD Application Registration

```bash
# Create AAD app for backend API
az ad app create \
  --display-name "AI Skill Platform Backend API" \
  --identifier-uris "api://ai-skill-platform-api"

# Get app ID
$backendAppId = az ad app list --display-name "AI Skill Platform Backend API" --query "[0].appId" -o tsv

# Create service principal
az ad sp create --id $backendAppId

# Create AAD app for frontend
az ad app create \
  --display-name "AI Skill Platform Frontend" \
  --public-client-redirect-uris "http://localhost:3000" "http://localhost:3000/auth/callback"

# Get frontend app ID
$frontendAppId = az ad app list --display-name "AI Skill Platform Frontend" --query "[0].appId" -o tsv
```

### STEP 6: Upload Datasets to Blob Storage

```bash
# Upload from local CSV files to Blob Storage
$datasets = @(
    "ai_jobs_market_2025_2026.csv",
    "postings.csv", 
    "resume_data.csv",
    "companies/companies.csv"
)

foreach ($dataset in $datasets) {
    az storage blob upload \
      --account-name $storageAccount \
      --container-name "datasets" \
      --name $dataset \
      --file ".\data\$dataset"
}

Write-Host "Datasets uploaded to Blob Storage"
```

### STEP 7: Initialize Database Schema

```bash
# Install sqlcmd (if not already installed)
# On Windows: chocolatey install -y sqlcmd
# On Linux: curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add -

# Connect to SQL Database and run schema
sqlcmd -S ai-skill-sql-server.database.windows.net -U sqladmin -P YourPassword123! -d ai_skill_platform_db -i database_schema/init_schema.sql

# Seed initial data
sqlcmd -S ai-skill-sql-server.database.windows.net -U sqladmin -P YourPassword123! -d ai_skill_platform_db -i database_schema/seed_data.sql

echo "Database schema and seed data initialized successfully"
```

### STEP 8: Create Application Insights

```bash
# Create Application Insights for monitoring
az monitor app-insights component create \
  --app ai-skill-appinsights \
  --location $location \
  --resource-group $resourceGroup \
  --application-type web

# Get instrumentation key
$appInsightsKey = az monitor app-insights component show \
  --app ai-skill-appinsights \
  --resource-group $resourceGroup \
  --query "instrumentationKey" -o tsv
```

### STEP 9: Configure Environment Variables

```bash
# Copy .env.example to .env
cp .env.example .env

# Update .env with your values (use the PowerShell or bash script below)
# Update SQL connection information
# Update Blob Storage account name and key
# Update Key Vault URI
# Update Azure AD credentials
# Update other configuration

# On Windows PowerShell:
(Get-Content .env) -replace 'your-subscription-id', $subscriptionId | Set-Content .env
(Get-Content .env) -replace 'your-sql-server', $sqlServer | Set-Content .env
# ... continue for other values
```

### STEP 10: Test Azure Connectivity

```bash
# Test from terminal
cd backend

# Install dependencies
pip install -r requirements.txt

# Test Azure connections
python -c "from utils import azure_config; azure_config.validate_credentials()"

# Output should show:
# ✓ Azure credentials are valid
#   Subscription ID: xxx
#   Tenant ID: xxx
```

## Verification Checklist

- [ ] Resource group created in Azure
- [ ] SQL Database created and schema initialized
- [ ] Blob Storage account created with datasets uploaded
- [ ] Key Vault created with secrets stored
- [ ] AAD applications registered
- [ ] Application Insights configured
- [ ] Environment variables (.env) configured
- [ ] Azure connectivity verified

## Azure Services Summary

| Service | Resource | Purpose |
|---------|----------|---------|
| **SQL Database** | ai_skill_platform_db | Relational data storage |
| **Blob Storage** | datasets, ml-models | Dataset and model storage |
| **Key Vault** | ai-skill-vault | Secrets and credentials |
| **App Insights** | ai-skill-appinsights | Monitoring and diagnostics |
| **AAD** | AI Skill Platform apps | Authentication |
| **Service Bus** | (future) | Message queuing |
| **Logic Apps** | (future) | Workflow automation |
| **Machine Learning** | (future) | Model training |

## Next Steps: Phase 2

In Phase 2, we will:
- Develop React frontend with Azure AD login
- Implement FastAPI backend endpoints
- Deploy backend API to Azure Container Instances or App Service
- Deploy frontend to Azure Static Web Apps
- Integrate with Azure SQL and Blob Storage

## Troubleshooting

### SQL Connection Failed
```bash
# Check firewall rules
az sql server firewall-rule list --resource-group $resourceGroup --server $sqlServer

# Add your IP address
az sql server firewall-rule create \
  --resource-group $resourceGroup \
  --server $sqlServer \
  --name AllowMyIP \
  --start-ip-address YOUR_IP \
  --end-ip-address YOUR_IP
```

### Blob Storage Access Denied
```bash
# Regenerate storage key in Key Vault
$newKey = az storage account keys renew --account-name $storageAccount --key primary --query "keys[0].value" -o tsv

az keyvault secret set \
  --vault-name $keyVault \
  --name "blob-storage-key" \
  --value $newKey
```

## Cost Estimation

| Service | Tier | Est. Cost/Month |
|---------|------|-----------------|
| SQL Database | Standard S2 | ~$30 |
| Blob Storage | Standard (100GB) | ~$2 |
| Key Vault | Standard | ~$0.60 |
| App Insights | Standard (1GB) | ~$0.57 |
| **Total** | | **~$33/month** |

*Costs may vary based on usage and region*

---

**Phase 1 Complete!** Ready for Phase 2: Frontend & Backend Development
