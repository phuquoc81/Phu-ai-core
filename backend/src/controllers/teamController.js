import Team from '../models/Team.js'
import User from '../models/User.js'
import { asyncHandler } from '../middleware/errorHandler.js'

export const createTeam = asyncHandler(async (req, res) => {
  const { name } = req.body
  const team = await Team.create({ name, owner: req.user.id, members: [req.user.id] })
  res.status(201).json(team)
})

export const getTeam = asyncHandler(async (req, res) => {
  const team = await Team.findOne({ owner: req.user.id }).populate('members', 'email role')
  if (!team) return res.status(404).json({ message: 'No team found' })
  res.json(team)
})

export const addMember = asyncHandler(async (req, res) => {
  const { email } = req.body
  const team = await Team.findOne({ owner: req.user.id })
  if (!team) return res.status(404).json({ message: 'No team found' })

  if (team.members.length >= team.seats) {
    return res.status(403).json({ message: 'Seat limit reached. Please upgrade your plan.' })
  }

  const member = await User.findOne({ email })
  if (!member) return res.status(404).json({ message: 'User not found' })

  if (team.members.includes(member._id)) {
    return res.status(409).json({ message: 'User already in team' })
  }

  team.members.push(member._id)
  await team.save()

  res.json(team)
})

export const removeMember = asyncHandler(async (req, res) => {
  const { userId } = req.params
  const team = await Team.findOne({ owner: req.user.id })
  if (!team) return res.status(404).json({ message: 'No team found' })

  team.members = team.members.filter(m => m.toString() !== userId)
  await team.save()

  res.json(team)
})
