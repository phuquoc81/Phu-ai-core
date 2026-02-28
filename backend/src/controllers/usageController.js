'use strict';

const Usage = require('../models/Usage');
const User  = require('../models/User');

// ── Track a single AI call ───────────────────────────────────
exports.trackUsage = async (req, res, next) => {
  try {
    const { endpoint, model, tokens, metadata } = req.body;
    const credits = Math.max(1, Math.ceil((tokens || 0) / 1000));

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (user.credits < credits) {
      return res.status(402).json({ error: 'Insufficient credits' });
    }

    user.credits -= credits;
    await user.save();

    const record = await Usage.create({
      userId:   user._id,
      teamId:   user.teamId || null,
      endpoint: endpoint || 'unknown',
      model:    model    || 'default',
      tokens:   tokens   || 0,
      credits,
      metadata: metadata || {},
    });

    res.json({ creditsUsed: credits, creditsRemaining: user.credits, usageId: record._id });
  } catch (err) {
    next(err);
  }
};

// ── Get credit balance ───────────────────────────────────────
exports.getBalance = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('credits subscriptionPlan');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ credits: user.credits, plan: user.subscriptionPlan });
  } catch (err) {
    next(err);
  }
};

// ── Get usage history ────────────────────────────────────────
exports.getHistory = async (req, res, next) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 20);
    const skip  = (page - 1) * limit;

    const [records, total] = await Promise.all([
      Usage.find({ userId: req.user.id })
           .sort({ createdAt: -1 })
           .skip(skip)
           .limit(limit)
           .lean(),
      Usage.countDocuments({ userId: req.user.id }),
    ]);

    res.json({ records, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

// ── Get aggregate analytics ──────────────────────────────────
exports.getAnalytics = async (req, res, next) => {
  try {
    const days  = parseInt(req.query.days) || 30;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const agg = await Usage.aggregate([
      { $match: { userId: req.user._id, createdAt: { $gte: since } } },
      {
        $group: {
          _id:          { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          totalCredits: { $sum: '$credits' },
          totalTokens:  { $sum: '$tokens' },
          calls:        { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({ analytics: agg, days });
  } catch (err) {
    next(err);
  }
};
