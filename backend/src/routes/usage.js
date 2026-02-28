'use strict';

const router     = require('express').Router();
const controller = require('../controllers/usageController');
const auth       = require('../middleware/auth');
const { aiLimiter } = require('../middleware/rateLimiter');

router.post('/track',    aiLimiter, auth, controller.trackUsage);
router.get('/balance',   auth,      controller.getBalance);
router.get('/history',   auth,      controller.getHistory);
router.get('/analytics', auth,      controller.getAnalytics);

module.exports = router;
