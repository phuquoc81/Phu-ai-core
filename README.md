# PhuAI Nexus Pro

**AI Automation • Web3 Payments • Global Compliance**

Enterprise AI SaaS Platform — fully monetized, subscription-controlled, and production-deployable.

## Features

- 🤖 AI-powered tools with metered credit billing
- 💳 Stripe Checkout + Subscription Plans (7 tiers)
- 🔔 Stripe Webhooks with signature verification
- 🏦 Stripe Customer Portal (self-serve billing)
- 👥 Team accounts with multi-seat management
- 🌍 Multi-currency support with automated tax (GST/HST/VAT)
- 🔐 JWT authentication & protected AI routes
- 🪙 Web3 token (PHU81) payment fallback
- 📊 Admin revenue & tax dashboard
- 🛡 Production security (Helmet, CORS, rate limiting)

## Project Structure

```
phuai-nexus/
├── backend/          # Node.js + Express + MongoDB API
├── frontend/         # React SPA
├── smart-contract/   # PHU81 ERC-20 token (Solidity)
├── docker-compose.yml
└── index.html        # Public marketing site
```

## Setup

### Backend

```bash
cd backend
cp .env.example .env   # fill in your secrets
npm install
npm start
```

### Frontend

```bash
cd frontend
cp .env.example .env   # set REACT_APP_API_URL
npm install
npm start
```

### Docker (full stack)

```bash
docker-compose up --build
```

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for signing JWTs |
| `STRIPE_SECRET_KEY` | Stripe secret key (`sk_live_...`) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret (`whsec_...`) |
| `FRONTEND_URL` | Your frontend URL |

### Frontend (`frontend/.env`)

| Variable | Description |
|---|---|
| `REACT_APP_API_URL` | Backend API base URL |

## Deployment

- **Backend** → Render / Railway / AWS EC2
- **Frontend** → Vercel / Netlify
- **Database** → MongoDB Atlas
- **Web3** → Polygon network

## Security

- ✔ Never commit `.env` files
- ✔ Stripe handles all card data (PCI compliant)
- ✔ Webhook signature verification prevents spoofing
- ✔ JWT expiry & bcrypt password hashing
- ✔ Rate limiting on all API routes
- ✔ CORS restricted to configured frontend URL 
