import express from 'express'
import { body } from 'express-validator'
import { createCheckoutSession, createPortalSession } from '../controllers/stripeController.js'
import { protect } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'

const router = express.Router()

// Allowed Stripe Price IDs — must match your Stripe Dashboard products
const ALLOWED_PRICE_IDS = [
  'price_starter',
  'price_basic',
  'price_standard',
  'price_plus',
  'price_phuai',
  'price_phuaipro',
  'price_phuairev'
]

const checkoutRules = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('priceId')
    .isString().trim()
    .custom(val => {
      if (!ALLOWED_PRICE_IDS.includes(val)) {
        throw new Error('Invalid plan selected')
      }
      return true
    })
]

router.post('/checkout', checkoutRules, validate, createCheckoutSession)
router.post('/portal', protect, createPortalSession)

export default router
