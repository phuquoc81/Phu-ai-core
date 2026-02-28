'use strict';

const router     = require('express').Router();
const controller = require('../controllers/web3Controller');
const auth       = require('../middleware/auth');
const { defaultLimiter } = require('../middleware/rateLimiter');

router.get('/token-info',   controller.getTokenInfo);
router.post('/pay',         defaultLimiter, auth, controller.processPayment);

module.exports = router;
