import express from 'express'
import { protect } from '../middleware/auth.js'
import User from '../models/User.js'

const router = express.Router()

router.get('/secure-ai', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)

    if (!user) return res.status(404).json({ message: 'User not found' })

    if (user.subscriptionStatus !== 'active') {
      return res.status(403).json({ message: 'Upgrade required' })
    }

    res.json({ result: 'Phu AI Premium Access Granted' })
  } catch (err) {
    console.error('secure-ai error:', err.message)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
