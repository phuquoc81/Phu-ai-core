# PhuAI Nexus Pro

Enterprise AI platform with Stripe billing, team management, usage analytics, and Web3 payments.

## Features

- 🧠 **AI Models** — protected endpoints with per-call credit tracking
- 💳 **Stripe Billing** — multi-plan subscriptions with metered credits
- 🔔 **Stripe Webhooks** — real-time subscription lifecycle events
- 👥 **Team Accounts** — multi-seat billing and member management
- 🔗 **Web3 Payments** — PHU81 token on Polygon network
- 📊 **Usage Analytics** — daily credit charts and forecasts
- 🧾 **Invoices** — PDF generation with tax calculation
- 🔐 **Security** — JWT auth, rate limiting, Helmet, CORS

## Project Structure

```
phuai-nexus-pro/
├── backend/          # Node.js / Express API
├── frontend/         # React SPA
├── smart-contract/   # PHU81 ERC-20 token (Polygon)
├── .github/workflows # CI/CD pipelines
├── docker-compose.yml
├── README.md
├── DEPLOYMENT.md
├── API.md
└── WEB3.md
```

## Quick Start

### Prerequisites

- Node.js ≥ 18
- MongoDB Atlas account (or local MongoDB)
- Stripe account
- (Optional) Polygon RPC for Web3 payments

### Backend

```bash
cd backend
cp .env.example .env
# Fill in all values in .env
npm install
npm run dev
```

### Frontend

```bash
cd frontend
cp .env.example .env
# Fill in REACT_APP_API_URL and REACT_APP_STRIPE_PUBLISHABLE_KEY
npm install
npm start
```

### Docker (full stack)

```bash
cp backend/.env.example .env   # set real values
docker compose up --build
```

Backend runs on `http://localhost:5000`, frontend on `http://localhost:3000`.

## Environment Variables

See `backend/.env.example` and `frontend/.env.example` for required variables.

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment to Vercel + Render.

## API Reference

See [API.md](API.md) for full endpoint documentation.

## Web3 / PHU81 Token

See [WEB3.md](WEB3.md) for smart contract deployment and token integration.

## Security

- All secrets are loaded from environment variables — no hardcoded credentials
- Stripe webhook signature verification
- JWT authentication with short expiry
- Rate limiting on all endpoints
- Helmet security headers
- CORS domain restriction
- MongoDB injection prevention via Mongoose
