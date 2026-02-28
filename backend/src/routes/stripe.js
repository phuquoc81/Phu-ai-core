import express from 'express'
import { createCheckoutSession, createPortalSession } from '../controllers/stripeController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

router.post('/checkout', createCheckoutSession)
router.post('/portal', protect, createPortalSession)

export default router
