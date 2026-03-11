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
5. Backend independently fetches and verifies the transaction on-chain (via Polygon RPC or a trusted provider), checks that:
   - the `to` address matches the backend's receiving wallet,
   - the token contract is `PHU81_CONTRACT_ADDRESS`,
   - the on-chain transferred amount is sufficient for the requested credits,
   - the transaction has the required number of confirmations, and
   - the `txHash` has not been used before;
   only then does it record the `txHash` as consumed and award credits based **solely** on the verified on-chain amount (not the client-supplied `amount`).

## Security Notes

- Always verify `txHash` on-chain before awarding credits (Polygon RPC node or oracle); never trust the client-supplied `amount`.
- Persist every processed `txHash` and reject any attempt to reuse a transaction hash (one-time use per `txHash`).
- Use a dedicated backend wallet; never use the deployer key in production.
- Require token allowance/approval pattern to avoid double-spend.
