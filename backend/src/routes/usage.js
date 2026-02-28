import express from 'express'
import { protect } from '../middleware/auth.js'
import { getUsage, recordUsage } from '../controllers/usageController.js'

const router = express.Router()

router.get('/', protect, getUsage)
router.post('/record', protect, recordUsage)

export default router
