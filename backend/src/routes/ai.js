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

router.post('/codegen', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)

    if (!user) return res.status(404).json({ message: 'User not found' })

    if (user.subscriptionStatus !== 'active') {
      return res.status(403).json({ message: 'Upgrade required' })
    }

    const { prompt, language } = req.body

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return res.status(400).json({ message: 'prompt is required' })
    }

    const safeLanguage = typeof language === 'string' ? language.trim() : 'javascript'

    // Placeholder response — replace with actual AI provider call
    res.json({
      language: safeLanguage,
      prompt: prompt.trim(),
      code: `// AI CodeGen placeholder for: ${prompt.trim().slice(0, 80)}\n// Connect an AI provider (e.g. OpenAI) to generate real code.`
    })
  } catch (err) {
    console.error('codegen error:', err.message)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
