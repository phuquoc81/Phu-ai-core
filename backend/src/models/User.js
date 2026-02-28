'use strict';

const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name:  { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },

    role: { type: String, enum: ['user', 'admin'], default: 'user' },

    // Stripe
    stripeCustomerId:       { type: String, default: null },
    subscriptionId:         { type: String, default: null },
    subscriptionStatus:     { type: String, default: 'inactive' },
    subscriptionPlan:       { type: String, enum: ['free', 'starter', 'pro', 'enterprise'], default: 'free' },
    subscriptionPeriodEnd:  { type: Date,   default: null },

    // AI Credits
    credits: { type: Number, default: 0, min: 0 },

    // Team membership
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', default: null },

    // Misc
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema);
