'use strict';

const PDFDocument = require('pdfkit');
const Invoice     = require('../models/Invoice');

// ── List invoices ─────────────────────────────────────────────
exports.listInvoices = async (req, res, next) => {
  try {
    const invoices = await Invoice.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
    res.json({ invoices });
  } catch (err) {
    next(err);
  }
};

// ── Get single invoice ────────────────────────────────────────
exports.getInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findOne({ _id: req.params.id, userId: req.user.id }).lean();
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
    res.json({ invoice });
  } catch (err) {
    next(err);
  }
};

// ── Generate PDF for an invoice ───────────────────────────────
exports.downloadInvoicePDF = async (req, res, next) => {
  try {
    const invoice = await Invoice.findOne({ _id: req.params.id, userId: req.user.id });
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="invoice-${invoice.invoiceNumber}.pdf"`);

    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(res);

    doc.fontSize(24).text('PhuAI Nexus Pro', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Invoice #${invoice.invoiceNumber}`);
    doc.text(`Date: ${invoice.createdAt.toDateString()}`);
    doc.text(`Status: ${invoice.status.toUpperCase()}`);
    doc.moveDown();
    doc.text(`Description: ${invoice.description || 'Subscription'}`);
    doc.text(`Amount: ${(invoice.amount / 100).toFixed(2)} ${invoice.currency.toUpperCase()}`);
    if (invoice.tax) {
      doc.text(`Tax: ${(invoice.tax / 100).toFixed(2)} ${invoice.currency.toUpperCase()}`);
      doc.text(`Total: ${((invoice.amount + invoice.tax) / 100).toFixed(2)} ${invoice.currency.toUpperCase()}`);
    }

    doc.end();
  } catch (err) {
    next(err);
  }
};
