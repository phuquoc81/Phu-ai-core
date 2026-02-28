'use strict';

const stripe  = require('../config/stripe');
const User    = require('../models/User');
const logger  = require('../utils/logger');

const PRICE_IDS = {
  starter:    process.env.STRIPE_PRICE_STARTER,
  pro:        process.env.STRIPE_PRICE_PRO,
  enterprise: process.env.STRIPE_PRICE_ENTERPRISE,
};

const PLAN_CREDITS = { starter: 500, pro: 2000, enterprise: 10000 };

// ── Create checkout session ──────────────────────────────────
exports.createCheckoutSession = async (req, res, next) => {
  try {
    const { plan } = req.body;
    if (!PRICE_IDS[plan]) {
      return res.status(400).json({ error: 'Invalid plan' });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Ensure Stripe customer exists
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name:  user.name,
        metadata: { userId: String(user._id) },
      });
      customerId = customer.id;
      user.stripeCustomerId = customerId;
      await user.save();
    }

    const session = await stripe.checkout.sessions.create({
      customer:   customerId,
      mode:       'subscription',
      line_items: [{ price: PRICE_IDS[plan], quantity: 1 }],
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${process.env.FRONTEND_URL}/cancel`,
      metadata:    { userId: String(user._id), plan },
    });

    res.json({ url: session.url });
  } catch (err) {
    next(err);
  }
};

// ── Customer portal ──────────────────────────────────────────
exports.createPortalSession = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.stripeCustomerId) {
      return res.status(400).json({ error: 'No billing account found' });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer:   user.stripeCustomerId,
      return_url: `${process.env.FRONTEND_URL}/billing`,
    });

    res.json({ url: session.url });
  } catch (err) {
    next(err);
  }
};

// ── Webhook handler ──────────────────────────────────────────
exports.handleWebhook = async (req, res, next) => {
  const sig    = req.headers['stripe-signature'];
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, secret);
  } catch (err) {
    logger.warn(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await _handleCheckoutComplete(event.data.object);
        break;
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        await _handleSubscriptionChange(event.data.object);
        break;
      default:
        logger.info(`Unhandled event type: ${event.type}`);
    }
    res.json({ received: true });
  } catch (err) {
    next(err);
  }
};

async function _handleCheckoutComplete (session) {
  const userId = session.metadata && session.metadata.userId;
  const plan   = session.metadata && session.metadata.plan;
  if (!userId) return;

  const user = await User.findById(userId);
  if (!user) return;

  user.subscriptionId     = session.subscription;
  user.subscriptionStatus = 'active';
  user.subscriptionPlan   = plan;
  user.credits            = (user.credits || 0) + (PLAN_CREDITS[plan] || 0);
  await user.save();
}

async function _handleSubscriptionChange (subscription) {
  const customer = await stripe.customers.retrieve(subscription.customer);
  const userId   = customer.metadata && customer.metadata.userId;
  if (!userId) return;

  const user = await User.findById(userId);
  if (!user) return;

  user.subscriptionStatus    = subscription.status;
  user.subscriptionPeriodEnd = new Date(subscription.current_period_end * 1000);

  if (subscription.status !== 'active') {
    user.subscriptionPlan = 'free';
  }
  await user.save();
}
