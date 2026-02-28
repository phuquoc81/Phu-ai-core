import 'dotenv/config'
import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import connectDB from './config/db.js'
import stripe from './config/stripe.js'
import User from './models/User.js'

import authRoutes from './routes/auth.js'
import stripeRoutes from './routes/stripe.js'
import aiRoutes from './routes/ai.js'
import usageRoutes from './routes/usage.js'
import teamRoutes from './routes/team.js'
import adminRoutes from './routes/admin.js'

const app = express()

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false
})

const webhookLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false
})

// Stripe webhook MUST be registered before express.json()
app.post('/api/stripe/webhook',
  webhookLimiter,
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const sig = req.headers['stripe-signature']

    let event
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      )
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`)
    }

    if (event.type === 'customer.subscription.created' ||
        event.type === 'customer.subscription.updated') {
      const subscription = event.data.object
      const status = subscription.status === 'active' ? 'active' : 'inactive'
      await User.findOneAndUpdate(
        { stripeCustomerId: subscription.customer },
        { subscriptionStatus: status }
      )
    }

    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object
      await User.findOneAndUpdate(
        { stripeCustomerId: subscription.customer },
        { subscriptionStatus: 'inactive' }
      )
    }

    res.json({ received: true })
  }
)

// Security middleware
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}))

app.use('/api', limiter)

app.use(express.json())

// Connect to MongoDB
connectDB().catch(err => {
  console.error('MongoDB connection failed:', err.message)
  process.exit(1)
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/stripe', stripeRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/usage', usageRoutes)
app.use('/api/team', teamRoutes)
app.use('/api/admin', adminRoutes)

app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
