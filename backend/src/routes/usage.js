'use strict';

const router     = require('express').Router();
const controller = require('../controllers/usageController');
const auth       = require('../middleware/auth');
const { aiLimiter, defaultLimiter } = require('../middleware/rateLimiter');

router.post('/track',    aiLimiter,      auth, controller.trackUsage);
router.get('/balance',   defaultLimiter, auth, controller.getBalance);
router.get('/history',   defaultLimiter, auth, controller.getHistory);
router.get('/analytics', defaultLimiter, auth, controller.getAnalytics);

module.exports = router;
