# GitHub Actions Setup Guide

This guide explains how to set up the GitHub Actions workflows for CI/CD with Google Cloud Registry.

## Required GitHub Secrets

Go to your repository settings → Secrets and variables → Actions, and add the following secrets:

### 1. Google Cloud Service Account Key
- **Name**: `GCP_SA_KEY`
- **Value**: JSON key file content from your Google Cloud Service Account
- **How to get it**:
  1. Go to Google Cloud Console → IAM & Admin → Service Accounts
  2. Create a new service account or use existing one
  3. Grant these roles:
     - Artifact Registry Administrator
     - Cloud Run Admin
     - Storage Admin
  4. Create and download JSON key
  5. Copy the entire JSON content as the secret value

### 2. Google Cloud Project ID
- **Name**: `GCP_PROJECT_ID`
- **Value**: Your Google Cloud project ID (e.g., `my-project-123`)

### 3. Database Configuration (for Cloud Run deployment)
- **Name**: `DB_HOST`
- **Value**: Your Cloud SQL instance connection name or IP
- **Name**: `DB_USER`
- **Value**: Database username (e.g., `postgres`)
- **Name**: `DB_PASSWORD`
- **Value**: Database password
- **Name**: `DB_NAME`
- **Value**: Database name (e.g., `techmeet`)
- **Name**: `DB_PORT`
- **Value**: Database port (e.g., `5432`)

## Google Cloud Setup

### 1. Enable Required APIs
```bash
gcloud services enable artifactregistry.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

### 2. Create Artifact Registry Repository
```bash
gcloud artifacts repositories create meetmate-go \
  --repository-format=docker \
  --location=us-central1 \
  --description="MeetMate Go Docker repository"
```

### 3. Configure Docker Authentication
```bash
gcloud auth configure-docker us-central1-docker.pkg.dev
```

## Workflow Overview

### 1. **CI/CD Pipeline** (`.github/workflows/ci-cd.yml`)
- **Triggers**: Push to main/develop, PRs to main
- **Jobs**:
  - **Test**: Runs frontend and backend tests
  - **Build and Push**: Builds multi-arch Docker image and pushes to GCR
  - **Deploy**: Deploys to Google Cloud Run
  - **Security Scan**: Runs Trivy vulnerability scanner

### 2. **Docker Integration Tests** (`.github/workflows/docker-test.yml`)
- **Triggers**: Push to main/develop, PRs to main
- **Job**: Tests the complete Docker setup locally

## Manual Deployment

If you want to deploy manually:

```bash
# Build and push image
docker build -t us-central1-docker.pkg.dev/YOUR_PROJECT_ID/meetmate-go/app:latest .
docker push us-central1-docker.pkg.dev/YOUR_PROJECT_ID/meetmate-go/app:latest

# Deploy to Cloud Run
gcloud run deploy app \
  --image us-central1-docker.pkg.dev/YOUR_PROJECT_ID/meetmate-go/app:latest \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --port 8080
```

## Monitoring

- **GitHub Actions**: Check the Actions tab in your repository
- **Google Cloud Run**: Monitor in Google Cloud Console → Cloud Run
- **Logs**: View logs in Google Cloud Console → Logging

## Troubleshooting

### Common Issues:
1. **Authentication errors**: Verify GCP_SA_KEY is correctly formatted
2. **Permission denied**: Ensure service account has required roles
3. **Build failures**: Check Dockerfile and dependencies
4. **Deployment failures**: Verify database connection settings

### Debug Commands:
```bash
# Check service account permissions
gcloud projects get-iam-policy YOUR_PROJECT_ID

# Test Docker build locally
docker build -t meetmate-go:test .

# Test with docker-compose
docker-compose up --build
```
