# Estate360 — Deployment Guide

## Architecture

```
Vercel (Frontend)               VPS / Railway / Render (Backend)
┌─────────────────┐             ┌────────────────────────────────┐
│  Next.js 16     │             │  Nginx (:443)                  │
│  (SSR + Static) │────────────►│    → Daphne (:8000)            │
│                 │  API calls  │      → Django ASGI             │
│  estate360.com  │  (HTTPS)    │        → PostgreSQL + Redis    │
└─────────────────┘             └────────────────────────────────┘
```

## Prerequisites

- [Vercel](https://vercel.com) account (GitHub login)
- Backend hosting: Railway, Render, Fly.io, or any VPS with Docker
- A domain name (optional but recommended)

---

## 1. Deploy Backend

### Option A: Railway / Render / Fly.io (Recommended)

1. Push the repo to GitHub
2. In Railway/Render/Fly:
   - **Build**: `docker build -t estate360-web .`
   - **Start**: `docker run -p 8000:8000 estate360-web`
3. Set environment variables (use the `.env.example` template):

| Variable | Description |
|----------|-------------|
| `SECRET_KEY` | Django secret key (generate with `python -c "import secrets; print(secrets.token_urlsafe(50))"`) |
| `DEBUG` | `False` |
| `DB_NAME` | `estate360` |
| `DB_USER` | `postgres` |
| `DB_PASSWORD` | Strong password |
| `DB_HOST` | PostgreSQL host from your DB provider |
| `DB_PORT` | `5432` |
| `ALLOWED_HOSTS` | Your backend domain, e.g. `api.estate360.com` |
| `CORS_ALLOWED_ORIGINS` | Your frontend domain, e.g. `https://estate360.vercel.app` |
| `CSRF_TRUSTED_ORIGINS` | Same as CORS_ALLOWED_ORIGINS |
| `REDIS_URL` | Redis connection string from Redis provider |
| `FRONTEND_URL` | `https://estate360.vercel.app` |

4. After deploy, create superuser:
   ```bash
   docker exec -it <container-id> python manage.py createsuperuser --noinput --username admin --email admin@estate360.com
   ```

### Option B: VPS with Docker (Full Control)

```bash
# SSH into VPS
git clone https://github.com/kai-lucky72/estate360.git
cd estate360
cp .env.example .env   # Edit with real secrets
docker compose up -d   # Starts Nginx + Daphne + PostgreSQL + Redis
docker compose exec web python manage.py createsuperuser --noinput --username admin --email admin@estate360.com
```

To set up SSL with Let's Encrypt:
```bash
docker compose exec nginx apk add certbot certbot-nginx
certbot --nginx -d api.estate360.com
```

---

## 2. Deploy Frontend to Vercel

### One-click (via Vercel Dashboard)

1. Push to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import the `estate360/frontend` directory
4. Set environment variable:
   - `NEXT_PUBLIC_API_URL` → `https://your-backend-domain.com`
5. Click **Deploy**

### Via CLI

```bash
cd frontend
npx vercel --prod
# Set environment variable when prompted:
# NEXT_PUBLIC_API_URL=https://your-backend-domain.com
```

### GitHub Actions (Auto-deploy)

Create `.github/workflows/deploy-frontend.yml`:

```yaml
name: Deploy Frontend to Vercel
on:
  push:
    branches: [main]
    paths: ['frontend/**']
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
          working-directory: ./frontend
```

---

## 3. Environment Variables Summary

### Frontend (Vercel)

| Variable | Example | Required |
|----------|---------|----------|
| `NEXT_PUBLIC_API_URL` | `https://api.estate360.com` | Yes |

### Backend (Django)

| Variable | Example | Required |
|----------|---------|----------|
| `SECRET_KEY` | (generated) | Yes |
| `DEBUG` | `False` | Yes |
| `DB_NAME` | `estate360` | Yes |
| `DB_USER` | `postgres` | Yes |
| `DB_PASSWORD` | (strong) | Yes |
| `DB_HOST` | `your-db-host.com` | Yes |
| `DB_PORT` | `5432` | Yes |
| `ALLOWED_HOSTS` | `api.estate360.com,localhost` | Yes |
| `CORS_ALLOWED_ORIGINS` | `https://estate360.vercel.app` | Yes |
| `CSRF_TRUSTED_ORIGINS` | `https://estate360.vercel.app` | Yes |
| `REDIS_URL` | `redis://your-redis-host:6379` | Yes |
| `FRONTEND_URL` | `https://estate360.vercel.app` | Yes |

---

## 4. Post-Deploy Checks

```bash
# Health check
curl https://api.estate360.com/api/health/
# → {"status":"healthy","database":"healthy"}

# API docs
open https://api.estate360.com/api/docs/  # Swagger UI
open https://api.estate360.com/api/redoc/  # ReDoc

# Frontend
open https://estate360.vercel.app
```
