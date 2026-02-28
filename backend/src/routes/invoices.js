'use strict';

const router     = require('express').Router();
const controller = require('../controllers/invoiceController');
const auth       = require('../middleware/auth');

router.get('/',               auth, controller.listInvoices);
router.get('/:id',            auth, controller.getInvoice);
router.get('/:id/pdf',        auth, controller.downloadInvoicePDF);

module.exports = router;
