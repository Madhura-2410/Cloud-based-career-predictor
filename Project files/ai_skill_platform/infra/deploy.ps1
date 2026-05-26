param(
    [Parameter(Mandatory=$true)]
    [string]$EnvironmentName = "development",
    
    [Parameter(Mandatory=$true)]
    [string]$ResourceGroup = "ai-skill-platform-rg",
    
    [Parameter(Mandatory=$true)]
    [string]$Location = "eastus"
)

# Set error action preference
$ErrorActionPreference = "Stop"

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Deploying AI Skill Platform" -ForegroundColor Cyan
Write-Host "Environment: $EnvironmentName" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

# Check if resourceGroup exists
$rgExists = az group exists --name $ResourceGroup | ConvertFrom-Json
if (-not $rgExists) {
    Write-Host "Creating resource group: $ResourceGroup" -ForegroundColor Yellow
    az group create --name $ResourceGroup --location $Location
}

# Variables
$timestamp = Get-Date -Format "yyyyMMddHHmmss"
$storageAccountName = "aiskill$timestamp".ToLower().Substring(0, 24)
$sqlServerName = "ai-skill-sql-$timestamp".ToLower()
$keyVaultName = "ai-skill-vault-$timestamp".ToLower().Substring(0, 24)

Write-Host "`n[1/3] Creating Storage Account..." -ForegroundColor Green
az storage account create `
    --name $storageAccountName `
    --resource-group $ResourceGroup `
    --location $Location `
    --sku Standard_LRS `
    --kind StorageV2 `
    --access-tier Hot

# Create storage containers
az storage container create `
    --account-name $storageAccountName `
    --name datasets

az storage container create `
    --account-name $storageAccountName `
    --name ml-models

az storage container create `
    --account-name $storageAccountName `
    --name user-uploads

Write-Host "`n[2/3] Creating Key Vault..." -ForegroundColor Green
az keyvault create `
    --resource-group $ResourceGroup `
    --name $keyVaultName `
    --location $Location

Write-Host "`n[3/3] Deployment Summary..." -ForegroundColor Green
Write-Host "`nDeployed Resources:" -ForegroundColor Cyan
Write-Host "  Resource Group: $ResourceGroup" 
Write-Host "  Storage Account: $storageAccountName"
Write-Host "  Key Vault: $keyVaultName"
Write-Host "  Location: $Location"

Write-Host "`nNext Steps:" -ForegroundColor Yellow
Write-Host "  1. Update .env file with your credentials"
Write-Host "  2. Run database schema initialization script"
Write-Host "  3. Deploy backend API to App Service"
Write-Host "  4. Deploy frontend to Static Web Apps"

Write-Host "`nDeployment Complete!" -ForegroundColor Green
