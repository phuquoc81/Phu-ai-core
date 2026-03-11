'use strict';

const Team = require('../models/Team');
const User = require('../models/User');

// ── Create team ──────────────────────────────────────────────
exports.createTeam = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Team name is required' });

    const existing = await Team.findOne({ ownerId: req.user.id });
    if (existing) return res.status(409).json({ error: 'You already own a team' });

    const team = await Team.create({
      name,
      ownerId: req.user.id,
      members: [{ userId: req.user.id, role: 'owner' }],
    });

    await User.findByIdAndUpdate(req.user.id, { teamId: team._id });

    res.status(201).json({ team });
  } catch (err) {
    next(err);
  }
};

// ── Get team ─────────────────────────────────────────────────
exports.getTeam = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.teamId) return res.status(404).json({ error: 'No team found' });

    const team = await Team.findById(user.teamId)
      .populate('members.userId', 'name email')
      .lean();

    if (!team) return res.status(404).json({ error: 'Team not found' });
    res.json({ team });
  } catch (err) {
    next(err);
  }
};

// ── Add member ───────────────────────────────────────────────
exports.addMember = async (req, res, next) => {
  try {
    const { email, role } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const [team, invitee] = await Promise.all([
      Team.findOne({ ownerId: req.user.id }),
      User.findOne({ email: email.toLowerCase() }),
    ]);

    if (!team)    return res.status(404).json({ error: 'Team not found' });
    if (!invitee) return res.status(404).json({ error: 'User not found' });

    const alreadyMember = team.members.some(m => String(m.userId) === String(invitee._id));
    if (alreadyMember) return res.status(409).json({ error: 'User is already a team member' });

    if (team.members.length >= team.seats) {
      return res.status(402).json({ error: 'Seat limit reached. Upgrade your plan.' });
    }

    team.members.push({ userId: invitee._id, role: role || 'member' });
    await team.save();

    await User.findByIdAndUpdate(invitee._id, { teamId: team._id });

    res.json({ team });
  } catch (err) {
    next(err);
  }
};

// ── Remove member ─────────────────────────────────────────────
exports.removeMember = async (req, res, next) => {
  try {
    const { memberId } = req.params;

    const team = await Team.findOne({ ownerId: req.user.id });
    if (!team) return res.status(404).json({ error: 'Team not found' });

    if (String(memberId) === String(req.user.id)) {
      return res.status(400).json({ error: 'Owner cannot remove themselves' });
    }

    team.members = team.members.filter(m => String(m.userId) !== memberId);
    await team.save();

    await User.findByIdAndUpdate(memberId, { teamId: null });

    res.json({ team });
  } catch (err) {
    next(err);
  }
};
