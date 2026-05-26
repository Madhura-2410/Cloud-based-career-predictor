# AI Skill Intelligence Platform

A cloud-native, full-stack web application built on Microsoft Azure that tracks skill decay, predicts future roles, detects skill gaps, and provides AI-powered learning recommendations.

## 📋 Project Overview

The AI Skill Intelligence Platform is designed to:
- **Track Skill Decay**: Monitor how skills diminish over time
- **Predict Future Roles**: Forecast emerging job opportunities based on industry trends
- **Detect Skill Gaps**: Identify missing skills for target positions
- **Rank Priority Skills**: Determine which skills to learn first
- **Estimate Learning ROI**: Calculate career impact of skill development
- **AI Mentor Simulation**: Provide personalized learning guidance
- **Industry Trend Alerts**: Send real-time notifications about sector changes

## 🏗️ Architecture

### Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React.js + TypeScript |
| **Backend API** | FastAPI (Python) |
| **Database** | Azure SQL Database |
| **Storage** | Azure Blob Storage |
| **Authentication** | Azure Active Directory (AAD) |
| **ML Platform** | Azure Machine Learning |
| **Serverless** | Azure Functions |
| **Automation** | Azure Logic Apps + Event Grid |
| **Monitoring** | Azure Monitor + Application Insights |
| **Secrets** | Azure Key Vault |

### Project Structure

```
ai_skill_platform/
├── frontend/                 # React.js application
│   ├── src/
│   │   ├── pages/           # Page components
│   │   ├── components/      # Reusable components
│   │   ├── services/        # API services
│   │   └── App.tsx
│   ├── package.json
│   └── tsconfig.json
├── backend/                  # FastAPI application
│   ├── app/
│   │   ├── routes/          # API endpoints
│   │   ├── models/          # Pydantic models
│   │   ├── services/        # Business logic
│   │   ├── auth/            # Azure AD integration
│   │   └── main.py
│   ├── requirements.txt
│   └── .env
├── ml_models/               # Azure ML artifacts
│   ├── skill_decay_model/
│   ├── role_prediction_model/
│   ├── skill_gap_model/
│   └── roi_estimator/
├── azure_functions/         # Serverless functions
│   ├── skill_trend_alert/
│   ├── data_ingestion/
│   ├── daily_skill_decay/
│   └── function_app.py
├── database_schema/         # SQL DDL scripts
│   ├── init_schema.sql
│   └── seed_data.sql
├── utils/                   # Shared utilities
│   ├── azure_client.py
│   ├── blob_storage.py
│   ├── sql_connector.py
│   └── auth_helper.py
├── infra/                   # Infrastructure as Code
│   ├── azure_resources.bicep
│   └── deploy.ps1
├── .env.example
├── docker-compose.yml
└── deployment_guide.md
```

## 🚀 Quick Start

### Prerequisites
- Azure subscription
- Python 3.9+
- Node.js 16+
- Azure CLI installed
- Docker (optional)

### Phase 1: Setup

1. **Clone and setup environment**
   ```bash
   cd ai_skill_platform
   cp .env.example .env
   ```

2. **Create Azure resources** (see `deployment_guide.md`)

3. **Initialize database**
   ```bash
   # Run SQL schema initialization (Phase 1)
   sqlcmd -S <server> -U <username> -P <password> -d <database> -i database_schema/init_schema.sql
   ```

4. **Deploy backend**
   ```bash
   cd backend
   pip install -r requirements.txt
   python -m uvicorn app.main:app --reload
   ```

5. **Deploy frontend**
   ```bash
   cd frontend
   npm install
   npm start
   ```

## 📊 Datasets Integrated

| Dataset | Source | Use Cases |
|---------|--------|-----------|
| Indeed Job Postings | `/data/postings.csv` | Trend alerts, skill extraction, decay analysis |
| AI Jobs Market 2025-26 | `/data/ai_jobs_market_2025_2026.csv` | Future skill prediction |
| Company Data | `/data/companies/` | Industry analysis, company insights |
| Resume Data | `/data/resume_data.csv` | Role prediction, personalization |

## 🔑 Key Features (Planned)

- ✅ **Phase 1**: Project structure, Azure setup, database schema, basic API
- 🔄 **Phase 2**: React frontend, Azure AD authentication
- 🔄 **Phase 3**: ML models (skill decay, predictions)
- 🔄 **Phase 4**: Azure Functions for automation
- 🔄 **Phase 5**: Advanced analytics and reporting

## 📝 Configuration

See `.env.example` for required environment variables:
- Azure subscription ID
- Azure AD tenant ID and client ID
- SQL Database connection strings
- Blob Storage account details
- Key Vault URI

## 🧪 Testing

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

## 📦 Deployment

Deployment guides for each phase are in `deployment_guide.md`.

## 🤝 Contributing

- Follow PEP 8 (Python) and ESLint config (JavaScript)
- Create feature branches: `feature/feature-name`
- Submit PRs with comprehensive commit messages

## 📄 License

This project is licensed under MIT License.

## 👥 Team

**Project**: AI Skill Intelligence Platform  
**Phase**: 1 - Project Structure & Azure Setup  
**Status**: In Progress

---

**Last Updated**: April 2026
