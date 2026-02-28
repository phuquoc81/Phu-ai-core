'use strict';

const router     = require('express').Router();
const controller = require('../controllers/invoiceController');
const auth       = require('../middleware/auth');
const { defaultLimiter } = require('../middleware/rateLimiter');

router.get('/',               defaultLimiter, auth, controller.listInvoices);
router.get('/:id',            defaultLimiter, auth, controller.getInvoice);
router.get('/:id/pdf',        defaultLimiter, auth, controller.downloadInvoicePDF);

module.exports = router;
