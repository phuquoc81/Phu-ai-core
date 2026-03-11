import stripe from '../config/stripe.js'
import User from '../models/User.js'

// Allowlist of valid Stripe price IDs to prevent arbitrary price injection
const ALLOWED_PRICE_IDS = (process.env.STRIPE_ALLOWED_PRICE_IDS || '')
  .split(',')
  .map(id => id.trim())
  .filter(Boolean)

export const createCheckoutSession = async (req, res) => {
  try {
    const { priceId, email } = req.body

    if (!priceId || typeof priceId !== 'string') {
      return res.status(400).json({ message: 'priceId is required' })
    }

    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Valid email is required' })
    }

    if (ALLOWED_PRICE_IDS.length > 0 && !ALLOWED_PRICE_IDS.includes(priceId)) {
      return res.status(400).json({ message: 'Invalid price selection' })
    }

    let user = await User.findOne({ email })
    if (!user) user = await User.create({ email })

    let customer
    if (user.stripeCustomerId) {
      customer = await stripe.customers.retrieve(user.stripeCustomerId)
    } else {
      customer = await stripe.customers.create({ email })
      user.stripeCustomerId = customer.id
      await user.save()
    }

    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      automatic_tax: { enabled: true }, // Requires Stripe Tax to be enabled in the Stripe Dashboard
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`
    })

    res.json({ url: session.url })
  } catch (err) {
    console.error('createCheckoutSession error:', err.message)
    res.status(500).json({ message: 'Server error' })
  }
}

export const createPortalSession = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)

    if (!user?.stripeCustomerId) {
      return res.status(400).json({ message: 'No billing account found' })
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${process.env.FRONTEND_URL}/dashboard`
    })

    res.json({ url: session.url })
  } catch (err) {
    console.error('createPortalSession error:', err.message)
    res.status(500).json({ message: 'Server error' })
  }
}
