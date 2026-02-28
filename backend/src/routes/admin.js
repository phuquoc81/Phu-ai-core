'use strict';

const router  = require('express').Router();
const auth    = require('../middleware/auth');
const User    = require('../models/User');
const Usage   = require('../models/Usage');
const Invoice = require('../models/Invoice');

// Admin-only guard
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  next();
};

// ── Revenue summary ──────────────────────────────────────────
router.get('/revenue', auth, adminOnly, async (req, res, next) => {
  try {
    const [total, paid] = await Promise.all([
      Invoice.aggregate([{ $group: { _id: null, total: { $sum: '$amount' }, tax: { $sum: '$tax' } } }]),
      Invoice.aggregate([{ $match: { status: 'paid' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
    ]);

    res.json({
      totalRevenue:  total[0]  ? total[0].total  : 0,
      totalTax:      total[0]  ? total[0].tax     : 0,
      paidRevenue:   paid[0]   ? paid[0].total    : 0,
    });
  } catch (err) {
    next(err);
  }
});

// ── User stats ────────────────────────────────────────────────
router.get('/users', auth, adminOnly, async (req, res, next) => {
  try {
    const [totalUsers, activeSubscribers] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ subscriptionStatus: 'active' }),
    ]);
    res.json({ totalUsers, activeSubscribers });
  } catch (err) {
    next(err);
  }
});

// ── Usage stats ───────────────────────────────────────────────
router.get('/usage', auth, adminOnly, async (req, res, next) => {
  try {
    const days  = parseInt(req.query.days) || 30;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const agg = await Usage.aggregate([
      { $match: { createdAt: { $gte: since } } },
      { $group: {
          _id:          { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          totalCredits: { $sum: '$credits' },
          calls:        { $sum: 1 },
      }},
      { $sort: { _id: 1 } },
    ]);

    res.json({ analytics: agg, days });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
