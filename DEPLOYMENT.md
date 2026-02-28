# Deployment Guide

## Backend — Render.com

1. Create a new **Web Service** on [render.com](https://render.com).
2. Connect your GitHub repository.
3. Set **Root Directory** to `backend`.
4. Set **Build Command**: `npm install`
5. Set **Start Command**: `npm start`
6. Add all environment variables from `backend/.env.example`.
7. Add a **Stripe webhook** endpoint:
   - URL: `https://<your-render-url>/api/webhook`
   - Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
   - Copy the signing secret to `STRIPE_WEBHOOK_SECRET`.

## Frontend — Vercel

1. Import the repository on [vercel.com](https://vercel.com).
2. Set **Root Directory** to `frontend`.
3. Add environment variables:
   - `REACT_APP_API_URL` = `https://<your-render-url>/api`
   - `REACT_APP_STRIPE_PUBLISHABLE_KEY`
4. Deploy.

## Database — MongoDB Atlas

1. Create a free cluster on [cloud.mongodb.com](https://cloud.mongodb.com).
2. Create a database user and whitelist Render's outbound IPs (or allow all: `0.0.0.0/0`).
3. Copy the connection string to `MONGODB_URI`.

## CI/CD — GitHub Actions

Add the following secrets to your GitHub repository:

| Secret | Description |
|--------|-------------|
| `VERCEL_TOKEN` | Vercel personal access token |
| `VERCEL_ORG_ID` | Vercel team/org ID |
| `VERCEL_PROJECT_ID` | Vercel project ID |
| `RENDER_SERVICE_ID` | Render service ID |
| `RENDER_DEPLOY_KEY` | Render deploy hook key |
| `REACT_APP_API_URL` | Backend URL for frontend build |
| `REACT_APP_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |

## Docker

```bash
docker compose build
docker compose up -d
```

Scale the backend:

```bash
docker compose up -d --scale backend=3
```
