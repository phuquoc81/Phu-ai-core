'use strict';

require('dotenv').config();

const express       = require('express');
const helmet        = require('helmet');
const cors          = require('cors');
const morgan        = require('morgan');

const connectDB     = require('./config/db');
const errorHandler  = require('./middleware/errorHandler');
const logger        = require('./utils/logger');

// ── Routes ──────────────────────────────────────────────────
const stripeRoutes   = require('./routes/stripe');
const aiRoutes       = require('./routes/ai');
const teamRoutes     = require('./routes/team');
const usageRoutes    = require('./routes/usage');
const web3Routes     = require('./routes/web3');
const adminRoutes    = require('./routes/admin');
const invoiceRoutes  = require('./routes/invoices');
const webhookRoutes  = require('./routes/webhook');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Database ─────────────────────────────────────────────────
connectDB();

// ── Security headers ─────────────────────────────────────────
app.use(helmet());

// ── CORS ─────────────────────────────────────────────────────
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:3000')
  .split(',')
  .map(o => o.trim());

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

// ── Stripe webhook MUST receive raw body ─────────────────────
app.use('/api/webhook', express.raw({ type: 'application/json' }), webhookRoutes);

// ── Body parsers ─────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ── HTTP logger ──────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined', { stream: { write: msg => logger.info(msg.trim()) } }));
}

// ── Health check ─────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok', ts: new Date().toISOString() }));

// ── API routes ───────────────────────────────────────────────
app.use('/api/stripe',   stripeRoutes);
app.use('/api/ai',       aiRoutes);
app.use('/api/team',     teamRoutes);
app.use('/api/usage',    usageRoutes);
app.use('/api/web3',     web3Routes);
app.use('/api/admin',    adminRoutes);
app.use('/api/invoices', invoiceRoutes);

// ── Global error handler ──────────────────────────────────────
app.use(errorHandler);

// ── Start ─────────────────────────────────────────────────────
if (require.main === module) {
  const mongoose = require('mongoose');
  const server = app.listen(PORT, () => logger.info(`PhuAI Nexus Pro backend running on port ${PORT}`));

  const shutdown = (signal) => {
    logger.info(`${signal} received — shutting down gracefully`);
    server.close(async () => {
      logger.info('HTTP server closed');
      try {
        await mongoose.connection.close();
        logger.info('MongoDB connection closed');
      } catch (err) {
        logger.error(`Error closing MongoDB connection: ${err.message}`);
      }
      process.exit(0);
    });
    // Force exit if graceful shutdown takes too long
    setTimeout(() => {
      logger.warn('Graceful shutdown timed out — forcing exit');
      process.exit(1);
    }, 10000).unref();
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT',  () => shutdown('SIGINT'));
}

module.exports = app;
