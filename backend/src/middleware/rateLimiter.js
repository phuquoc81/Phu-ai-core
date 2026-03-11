'use strict';

const rateLimit = require('express-rate-limit');

const defaultLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max:      100,
  standardHeaders: true,
  legacyHeaders:   false,
  message: { error: 'Too many requests, please try again later.' },
});

const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max:      30,
  standardHeaders: true,
  legacyHeaders:   false,
  message: { error: 'AI rate limit exceeded. Please wait before sending more requests.' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max:      10,
  standardHeaders: true,
  legacyHeaders:   false,
  message: { error: 'Too many authentication attempts.' },
});

module.exports = { defaultLimiter, aiLimiter, authLimiter };
