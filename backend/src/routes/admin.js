import express from 'express'
import { protect, adminOnly } from '../middleware/auth.js'
import { asyncHandler } from '../middleware/errorHandler.js'
import stripe from '../config/stripe.js'
import User from '../models/User.js'

const router = express.Router()

router.get('/revenue', protect, adminOnly, asyncHandler(async (req, res) => {
  const balance = await stripe.balance.retrieve()
  res.json(balance)
}))

router.get('/tax-report', protect, adminOnly, asyncHandler(async (req, res) => {
  const [taxes, balanceTransactions] = await Promise.all([
    stripe.taxRates.list({ limit: 100 }),
    stripe.balanceTransactions.list({ limit: 100 })
  ])
  res.json({ taxes, balanceTransactions })
}))

router.get('/users', protect, adminOnly, asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 })
  res.json(users)
}))

export default router
