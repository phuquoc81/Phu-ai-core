'use strict';

const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role:   { type: String, enum: ['owner', 'admin', 'member'], default: 'member' },
  joinedAt: { type: Date, default: Date.now },
});

const teamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    // Billing
    stripeCustomerId:  { type: String, default: null },
    subscriptionId:    { type: String, default: null },
    subscriptionStatus:{ type: String, default: 'inactive' },
    subscriptionPlan:  { type: String, enum: ['free', 'starter', 'pro', 'enterprise'], default: 'free' },
    seats:             { type: Number, default: 1, min: 1 },

    members: [memberSchema],

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Team', teamSchema);
