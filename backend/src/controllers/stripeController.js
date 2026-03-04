import stripe from '../config/stripe.js'
import User from '../models/User.js'
import { asyncHandler } from '../middleware/errorHandler.js'

export const createCheckoutSession = asyncHandler(async (req, res) => {
  const { priceId, email } = req.body

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
})

export const createPortalSession = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)

  if (!user?.stripeCustomerId) {
    return res.status(400).json({ message: 'No billing account found' })
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${process.env.FRONTEND_URL}/dashboard`
  })

  res.json({ url: session.url })
})
