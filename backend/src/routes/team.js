import express from 'express'
import { protect } from '../middleware/auth.js'
import { createTeam, getTeam, addMember, removeMember } from '../controllers/teamController.js'

const router = express.Router()

router.post('/', protect, createTeam)
router.get('/', protect, getTeam)
router.post('/members', protect, addMember)
router.delete('/members/:userId', protect, removeMember)

export default router
