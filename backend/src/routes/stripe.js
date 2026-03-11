'use strict';

const router     = require('express').Router();
const controller = require('../controllers/stripeController');
const auth       = require('../middleware/auth');
const { defaultLimiter } = require('../middleware/rateLimiter');

router.post('/checkout',     defaultLimiter, auth, controller.createCheckoutSession);
router.post('/portal',       defaultLimiter, auth, controller.createPortalSession);

module.exports = router;
