import express from 'express'
import { protect, adminOnly } from '../middleware/auth.js'
import stripe from '../config/stripe.js'
import User from '../models/User.js'

const router = express.Router()

router.get('/revenue', protect, adminOnly, async (req, res) => {
  try {
    const balance = await stripe.balance.retrieve()
    res.json(balance)
  } catch (err) {
    console.error('admin revenue error:', err.message)
    res.status(500).json({ message: 'Server error' })
  }
})

router.get('/tax-report', protect, adminOnly, async (req, res) => {
  try {
    const [taxes, balanceTransactions] = await Promise.all([
      stripe.taxRates.list({ limit: 100 }),
      stripe.balanceTransactions.list({ limit: 100 })
    ])
    res.json({ taxes, balanceTransactions })
  } catch (err) {
    console.error('admin tax-report error:', err.message)
    res.status(500).json({ message: 'Server error' })
  }
})

router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 })
    res.json(users)
  } catch (err) {
    console.error('admin users error:', err.message)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
