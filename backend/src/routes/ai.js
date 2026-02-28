import express from 'express'
import { protect } from '../middleware/auth.js'
import User from '../models/User.js'

const router = express.Router()

router.get('/secure-ai', protect, async (req, res) => {
  const user = await User.findById(req.user.id)

  if (!user) return res.status(404).json({ message: 'User not found' })

  if (user.subscriptionStatus !== 'active') {
    return res.status(403).json({ message: 'Upgrade required' })
  }

  res.json({ result: 'Phu AI Premium Access Granted' })
})

export default router
