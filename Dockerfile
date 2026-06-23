FROM node:18-alpine AS frontend-builder

WORKDIR /frontend-build

COPY ["Project files/ai_skill_platform/frontend/package.json", "./package.json"]
COPY ["Project files/ai_skill_platform/frontend/package-lock.json", "./package-lock.json"]

RUN npm ci

COPY ["Project files/ai_skill_platform/frontend/", "./"]

ARG REACT_APP_API_URL=/
ENV REACT_APP_API_URL=${REACT_APP_API_URL}

RUN npm run build

FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    gnupg \
    unixodbc-dev \
    ca-certificates \
    && mkdir -p /usr/share/keyrings \
    && curl -fsSL https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor -o /usr/share/keyrings/microsoft-archive-keyring.gpg \
    && echo "deb [arch=amd64 signed-by=/usr/share/keyrings/microsoft-archive-keyring.gpg] https://packages.microsoft.com/debian/11/prod bullseye main" > /etc/apt/sources.list.d/mssql-release.list \
    && apt-get update \
    && ACCEPT_EULA=Y apt-get install -y msodbcsql17 \
    && rm -rf /var/lib/apt/lists/*

COPY ["Project files/ai_skill_platform/backend/requirements.txt", "./requirements.txt"]

RUN pip install --no-cache-dir -r requirements.txt

COPY ["Project files/ai_skill_platform/backend/", "./"]
COPY --from=frontend-builder /frontend-build/build ./static

ENV PYTHONUNBUFFERED=1 \
    API_HOST=0.0.0.0 \
    API_PORT=8000 \
    PORT=8000

EXPOSE 8000

CMD ["sh", "-c", "python -m uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
