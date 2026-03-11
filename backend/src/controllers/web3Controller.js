'use strict';

const User = require('../models/User');

// ── Process PHU81 token payment ───────────────────────────────
// NOTE: Actual on-chain verification must be done on the smart contract.
// This endpoint accepts a transaction hash, looks up the user, and
// awards credits equivalent to the on-chain PHU81 amount sent.
// In production, verify via a trusted RPC node or oracle.

exports.processPayment = async (req, res, next) => {
  try {
    const { txHash, amount, walletAddress } = req.body;

    if (!txHash || !amount || !walletAddress) {
      return res.status(400).json({ error: 'txHash, amount and walletAddress are required' });
    }

    // TODO: verify txHash on-chain (Polygon RPC) and confirm amount
    // For now we award credits equal to amount (1 PHU81 = 10 credits)
    const creditsToAdd = Math.floor(Number(amount) * 10);
    if (creditsToAdd <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $inc: { credits: creditsToAdd } },
      { new: true }
    ).select('credits');

    res.json({
      message:  `Awarded ${creditsToAdd} credits`,
      credits:  user.credits,
      txHash,
    });
  } catch (err) {
    next(err);
  }
};

exports.getTokenInfo = (_req, res) => {
  res.json({
    name:     'PHU81',
    symbol:   'PHU81',
    network:  'Polygon',
    contract: process.env.PHU81_CONTRACT_ADDRESS || '',
    rate:     '1 PHU81 = 10 AI Credits',
  });
};
