# Web3 / PHU81 Token Guide

## Overview

PHU81 is an ERC-20 utility token deployed on Polygon. Users can send PHU81 tokens to purchase AI credits as an alternative to Stripe.

**Rate:** 1 PHU81 = 10 AI Credits

## Smart Contract

- **Token name:** PhuAI Token
- **Symbol:** PHU81
- **Max supply:** 81,000,000 PHU81
- **Network:** Polygon Mainnet (or Mumbai Testnet)
- **Standard:** ERC-20 (OpenZeppelin)

## Deployment

### Prerequisites

```bash
npm install --save-dev hardhat @openzeppelin/contracts
npx hardhat init
```

### Configure Hardhat

Add to `hardhat.config.js`:

```js
module.exports = {
  solidity: "0.8.20",
  networks: {
    polygon: {
      url: process.env.POLYGON_RPC_URL,
      accounts: [process.env.DEPLOYER_PRIVATE_KEY],
    },
    mumbai: {
      url: process.env.MUMBAI_RPC_URL,
      accounts: [process.env.DEPLOYER_PRIVATE_KEY],
    },
  },
};
```

### Deploy

```bash
# Testnet (Mumbai)
npx hardhat run smart-contract/deployment.js --network mumbai

# Mainnet
npx hardhat run smart-contract/deployment.js --network polygon
```

Copy the deployed contract address to `PHU81_CONTRACT_ADDRESS` in `backend/.env`.

## How Payments Work

1. User connects wallet in the frontend.
2. User calls `approve(backendWallet, amount)` on the PHU81 contract.
3. User sends a transaction — the backend's wallet address receives the tokens.
4. Frontend calls `POST /api/web3/pay` with `{ txHash, amount, walletAddress }`.
5. Backend verifies (TODO: on-chain RPC call) and awards credits.

## Security Notes

- Always verify `txHash` on-chain before awarding credits (Polygon RPC node or oracle).
- Use a dedicated backend wallet; never use the deployer key in production.
- Require token allowance/approval pattern to avoid double-spend.
