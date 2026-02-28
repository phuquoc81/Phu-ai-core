import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const register = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' })
  }

  const existing = await User.findOne({ email })
  if (existing) return res.status(409).json({ message: 'Email already registered' })

  const hashed = await bcrypt.hash(password, 10)
  const user = await User.create({ email, password: hashed })

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )

  res.status(201).json({ token, user: { id: user._id, email: user.email, role: user.role } })
}

export const login = async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })
  if (!user) return res.status(401).json({ message: 'Invalid credentials' })

  const match = await bcrypt.compare(password, user.password)
  if (!match) return res.status(401).json({ message: 'Invalid credentials' })

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )

  res.json({ token, user: { id: user._id, email: user.email, role: user.role, subscriptionStatus: user.subscriptionStatus } })
}

export const getMe = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password')
  if (!user) return res.status(404).json({ message: 'User not found' })
  res.json(user)
}
