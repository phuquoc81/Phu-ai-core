'use strict';

const router     = require('express').Router();
const controller = require('../controllers/stripeController');

// Raw body already parsed by server.js
router.post('/', controller.handleWebhook);

module.exports = router;
