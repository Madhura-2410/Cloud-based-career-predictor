# Railway Deployment Guide

This repo is set up to deploy as a single Railway service using the root `Dockerfile`.
That container builds the React frontend, bundles it into the FastAPI app, and serves everything from one Railway domain.

## What Railway Uses

- `Dockerfile`: builds the frontend and backend into one image
- `railway.json`: tells Railway to use the Dockerfile builder
- `.dockerignore`: keeps the build context small and avoids shipping local caches or secret files

## Deploy Steps

1. Push this repository to GitHub.
2. In Railway, create a new project and choose **Deploy from GitHub repo**.
3. Select this repository.
4. Railway should detect the root `Dockerfile` automatically. The `railway.json` file keeps the builder pinned to Dockerfile mode.
5. Add environment variables in Railway for your backend dependencies.

## Recommended Variables

- `SQLALCHEMY_DATABASE_URL` or the individual SQL values:
  - `SQL_SERVER`
  - `SQL_DATABASE`
  - `SQL_USERNAME`
  - `SQL_PASSWORD`
- `AZURE_TENANT_ID`
- `BACKEND_AAD_CLIENT_ID`
- `AZURE_CLIENT_SECRET`
- `AAD_AUTHORITY`
- `AAD_SCOPES`
- `BLOB_STORAGE_CONNECTION_STRING` or:
  - `BLOB_STORAGE_ACCOUNT`
  - `BLOB_STORAGE_KEY`
- `BLOB_CONTAINER_DATASETS`
- `BLOB_CONTAINER_MODELS`
- `BLOB_CONTAINER_UPLOADS`
- `KEY_VAULT_URI`
- `LOG_LEVEL`
- `ENVIRONMENT`
- `CORS_ORIGINS` only if you later split frontend and backend across different domains

## Important Notes

- Railway injects a `PORT` variable for the service. The Dockerfile listens on that port.
- The frontend is built with `REACT_APP_API_URL=/`, so API requests stay on the same Railway domain.
- Railway does not provide SQL Server as a managed database, so point the app at Azure SQL or another SQL Server instance you control.

## After Deploy

1. Open the Railway service URL.
2. Visit `/health` to confirm the app is live.
3. If you want a dashboard-style health check in Railway, set the service health check path to `/health` in the Railway UI.

## If You Need Only the Frontend

The root `server.js` and `package.json` still support serving the built frontend separately, but the Dockerfile path is the one that deploys the full stack cleanly on Railway.
