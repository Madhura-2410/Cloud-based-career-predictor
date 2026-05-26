// Azure Bicep Template for AI Skill Intelligence Platform - Phase 1
// This template deploys core infrastructure components

param location string = resourceGroup().location
param environment string = 'development'
param projectName string = 'ai-skill-platform'

// Naming convention
var uniqueSuffix = uniqueString(resourceGroup().id)
var storageName = '${projectName}${uniqueSuffix}'.substring(0, 24)
var sqlServerName = '${projectName}-sql-${uniqueSuffix}'.substring(0, 63)
var keyVaultName = '${projectName}-${uniqueSuffix}'.substring(0, 24)
var appInsightsName = '${projectName}-ai-${uniqueSuffix}'

// ============================================================
// Storage Account for Datasets and Models
// ============================================================
resource storageAccount 'Microsoft.Storage/storageAccounts@2022-09-01' = {
  name: storageName
  location: location
  kind: 'StorageV2'
  sku: {
    name: 'Standard_LRS'
  }
  properties: {
    accessTier: 'Hot'
    minimumTlsVersion: 'TLS1_2'
    supportsHttpsTrafficOnly: true
  }
}

// Create blob containers
resource containerDatasets 'Microsoft.Storage/storageAccounts/blobServices/containers@2022-09-01' = {
  name: '${storageName}/default/datasets'
  properties: {
    publicAccess: 'None'
  }
  dependsOn: [
    storageAccount
  ]
}

resource containerModels 'Microsoft.Storage/storageAccounts/blobServices/containers@2022-09-01' = {
  name: '${storageName}/default/ml-models'
  properties: {
    publicAccess: 'None'
  }
  dependsOn: [
    storageAccount
  ]
}

resource containerUploads 'Microsoft.Storage/storageAccounts/blobServices/containers@2022-09-01' = {
  name: '${storageName}/default/user-uploads'
  properties: {
    publicAccess: 'None'
  }
  dependsOn: [
    storageAccount
  ]
}

// ============================================================
// SQL Database
// ============================================================
resource sqlServer 'Microsoft.Sql/servers@2022-02-01-preview' = {
  name: sqlServerName
  location: location
  properties: {
    administratorLogin: 'sqladmin'
    version: '12.0'
    minimalTlsVersion: '1.2'
  }
}

resource sqlDatabase 'Microsoft.Sql/servers/databases@2022-02-01-preview' = {
  parent: sqlServer
  name: 'ai_skill_platform_db'
  location: location
  sku: {
    name: 'Standard'
    tier: 'Standard'
  }
  properties: {
    collation: 'SQL_Latin1_General_CP1_CI_AS'
    maxSizeBytes: 268435456000 // 250 GB
  }
}

// Firewall rule to allow Azure services
resource firewall 'Microsoft.Sql/servers/firewallRules@2022-02-01-preview' = {
  parent: sqlServer
  name: 'AllowAzureServices'
  properties: {
    startIpAddress: '0.0.0.0'
    endIpAddress: '0.0.0.0'
  }
}

// ============================================================
// Key Vault
// ============================================================
resource keyVault 'Microsoft.KeyVault/vaults@2022-07-01' = {
  name: keyVaultName
  location: location
  properties: {
    tenantId: subscription().tenantId
    sku: {
      family: 'A'
      name: 'standard'
    }
    accessPolicies: []
    enableSoftDelete: true
    softDeleteRetentionInDays: 90
    enablePurgeProtection: false
  }
}

// ============================================================
// Application Insights
// ============================================================
resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: appInsightsName
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
    RetentionInDays: 30
    publicNetworkAccessForIngestion: 'Enabled'
    publicNetworkAccessForQuery: 'Enabled'
  }
}

// ============================================================
// Outputs
// ============================================================
output storageAccountName string = storageAccount.name
output storageAccountId string = storageAccount.id
output sqlServerName string = sqlServer.name
output sqlServerFqdn string = sqlServer.properties.fullyQualifiedDomainName
output keyVaultName string = keyVault.name
output keyVaultId string = keyVault.id
output appInsightsKey string = appInsights.properties.InstrumentationKey
output connectionString string = 'Server=tcp:${sqlServer.properties.fullyQualifiedDomainName},1433;Initial Catalog=ai_skill_platform_db;Persist Security Info=False;User ID=sqladmin;Password=YourPasswordHere;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;'
