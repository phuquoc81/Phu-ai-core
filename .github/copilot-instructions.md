# Copilot Instructions for Phu AI Core

## Project Overview

Phu AI Core is a mixed repository containing:

- a public marketing site built with static HTML, CSS, and vanilla JavaScript at the repository root,
- a React frontend application in `/frontend`,
- an Express/MongoDB backend API in `/backend`,
- and a Solidity smart contract in `/smart-contract`.

Keep changes scoped to the part of the product you are working on.

## Repository Structure

```text
/
├── index.html                # Marketing landing page
├── css/                      # Shared marketing-site styles
├── js/                       # Shared marketing-site JavaScript
├── pages/                    # Additional static marketing pages
├── frontend/                 # React application (react-scripts)
│   ├── package.json
│   └── src/
├── backend/                  # Express API
│   ├── package.json
│   └── src/
├── smart-contract/           # Solidity contract(s)
├── docker-compose.yml
└── .github/workflows/        # CI/CD workflows
```

## Tech Stack

- **Marketing site**: Vanilla HTML5, CSS3, and JavaScript
- **Frontend app**: React with `react-scripts`
- **Backend API**: Node.js, Express, Mongoose, Stripe
- **Smart contract**: Solidity

## Coding Conventions

### Root marketing site

- Keep marketing-site JavaScript in `/js/app.js`.
- Use the existing IIFE-based structure for new vanilla JavaScript behaviors.
- Reuse existing CSS variables and utility classes from `/css/styles.css`.
- Prefer modern DOM APIs and accessible markup.

### Frontend (`/frontend`)

- Follow the existing React structure in `frontend/src`.
- Use the existing service/context patterns before introducing new abstractions.
- Do not add new frontend frameworks or replace `react-scripts` tooling without a strong reason.

### Backend (`/backend`)

- Keep API logic in the existing controller/route/middleware structure.
- Reuse the current security middleware patterns (`helmet`, CORS, rate limiting, JWT auth).
- Do not hardcode secrets or fallback production credentials.

## Build and Test Commands

Run commands from the repository root unless the task is isolated to a subproject:

- `npm run build` — installs frontend dependencies and builds the React app
- `npm test` — installs frontend dependencies and runs the React test runner with `--passWithNoTests`
- `npm run start:frontend`
- `npm run start:backend`

Subproject commands:

- `cd frontend && npm start|build|test`
- `cd backend && npm start`

## CI/CD

- `.github/workflows/azure-webapps-node.yml` uses the root `npm install`, `npm run build --if-present`, and `npm run test --if-present` flow.
- `.github/workflows/deploy.yml` installs dependencies separately in `/frontend` and `/backend`, then builds the frontend artifact.
- This repository does **not** currently keep lockfiles in `frontend/` or `backend/`, so workflows that install subproject dependencies should use `npm install` rather than `npm ci` unless lockfiles are added.

## Dos and Don'ts

- ✅ Make the smallest possible change that fixes the issue.
- ✅ Update directly related docs or workflow config when the repo structure changes.
- ✅ Validate the specific subproject you changed.
- ❌ Do not introduce secrets, API keys, or committed `.env` files.
- ❌ Do not replace the root static site with a framework app.
- ❌ Do not make unrelated stylistic refactors.
