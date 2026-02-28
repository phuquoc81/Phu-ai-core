# API Reference

Base URL: `https://<backend-url>/api`

All protected endpoints require:
```
Authorization: Bearer <jwt_token>
```

---

## Auth

### POST /ai/register
Register a new user.

**Body:** `{ name, email, password }`  
**Response:** `{ token, user }`

### POST /ai/login
Login.

**Body:** `{ email, password }`  
**Response:** `{ token, user }`

### GET /ai/me *(protected)*
Get current user.

---

## Stripe

### POST /stripe/checkout *(protected)*
Create a Stripe checkout session.

**Body:** `{ plan: "starter" | "pro" | "enterprise" }`  
**Response:** `{ url }` — redirect user to this URL.

### POST /stripe/portal *(protected)*
Open the Stripe customer portal.

**Response:** `{ url }`

### POST /webhook
Stripe webhook handler (raw body, signature verified).

---

## Usage

### POST /usage/track *(protected)*
Track an AI API call.

**Body:** `{ endpoint, model, tokens, metadata }`  
**Response:** `{ creditsUsed, creditsRemaining, usageId }`

### GET /usage/balance *(protected)*
Get credit balance.

**Response:** `{ credits, plan }`

### GET /usage/history *(protected)*
Paginated usage history.

**Query:** `page`, `limit`  
**Response:** `{ records, total, page, pages }`

### GET /usage/analytics *(protected)*
Aggregate daily usage.

**Query:** `days` (default 30)  
**Response:** `{ analytics: [{ _id, totalCredits, totalTokens, calls }], days }`

---

## Team

### POST /team *(protected)*
Create a team.

**Body:** `{ name }`

### GET /team *(protected)*
Get current user's team.

### POST /team/members *(protected)*
Add a member by email.

**Body:** `{ email, role? }`

### DELETE /team/members/:memberId *(protected)*
Remove a member.

---

## Invoices

### GET /invoices *(protected)*
List invoices.

### GET /invoices/:id *(protected)*
Get invoice details.

### GET /invoices/:id/pdf *(protected)*
Download invoice as PDF.

---

## Web3

### GET /web3/token-info
PHU81 token metadata.

### POST /web3/pay *(protected)*
Record a PHU81 payment and award credits.

**Body:** `{ txHash, amount, walletAddress }`  
**Response:** `{ message, credits, txHash }`

---

## Admin *(admin role required)*

### GET /admin/revenue
Revenue totals.

### GET /admin/users
User and subscriber counts.

### GET /admin/usage
Platform-wide usage analytics.

---

## Health

### GET /health
Returns `{ status: "ok", ts }`.
