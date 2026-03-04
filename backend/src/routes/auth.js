import express from 'express'
import rateLimit from 'express-rate-limit'
import { body } from 'express-validator'
import { register, login, getMe } from '../controllers/authController.js'
import { protect } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'

const router = express.Router()

// Stricter rate limit for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: 'Too many auth attempts. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false
})

const registerRules = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/).withMessage('Password must contain an uppercase letter')
    .matches(/[0-9]/).withMessage('Password must contain a number')
]

const loginRules = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required')
]

router.post('/register', authLimiter, registerRules, validate, register)
router.post('/login', authLimiter, loginRules, validate, login)
router.get('/me', protect, getMe)

export default router
