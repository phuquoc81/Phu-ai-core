'use strict';

const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema(
  {
    userId:           { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    teamId:           { type: mongoose.Schema.Types.ObjectId, ref: 'Team', default: null },
    stripeInvoiceId:  { type: String, default: null },
    invoiceNumber:    { type: String, required: true, unique: true },
    amount:           { type: Number, required: true },       // in cents
    currency:         { type: String, default: 'usd' },
    tax:              { type: Number, default: 0 },           // in cents
    status:           { type: String, enum: ['draft', 'open', 'paid', 'void'], default: 'draft' },
    pdfUrl:           { type: String, default: null },
    description:      { type: String, default: '' },
    periodStart:      { type: Date, default: null },
    periodEnd:        { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Invoice', invoiceSchema);
