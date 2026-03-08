import Usage from '../models/Usage.js'

const CREDITS_PER_PLAN = {
  starter: 100,
  basic: 300,
  standard: 600,
  plus: 1000,
  phuai: 2000,
  phuaipro: 5000,
  phuairev: 10000
}

export const getUsage = async (req, res) => {
  try {
    let usage = await Usage.findOne({ user: req.user.id })
    if (!usage) usage = await Usage.create({ user: req.user.id })
    res.json(usage)
  } catch (err) {
    console.error('getUsage error:', err.message)
    res.status(500).json({ message: 'Server error' })
  }
}

export const recordUsage = async (req, res) => {
  try {
    let usage = await Usage.findOne({ user: req.user.id })
    if (!usage) usage = await Usage.create({ user: req.user.id })

    if (usage.credits <= 0) {
      return res.status(402).json({ message: 'No credits remaining. Please upgrade your plan.' })
    }

    usage.credits -= 1
    usage.totalCalls += 1
    await usage.save()

    res.json({ creditsRemaining: usage.credits, totalCalls: usage.totalCalls })
  } catch (err) {
    console.error('recordUsage error:', err.message)
    res.status(500).json({ message: 'Server error' })
  }
}

export const addCredits = async (req, res) => {
  try {
    const { userId, plan } = req.body
    const credits = CREDITS_PER_PLAN[plan] || 0

    const usage = await Usage.findOneAndUpdate(
      { user: userId },
      { $inc: { credits } },
      { upsert: true, new: true }
    )

    res.json(usage)
  } catch (err) {
    console.error('addCredits error:', err.message)
    res.status(500).json({ message: 'Server error' })
  }
}
