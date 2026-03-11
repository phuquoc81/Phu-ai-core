'use strict';

const mongoose = require('mongoose');

const usageSchema = new mongoose.Schema(
  {
    userId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    teamId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Team', default: null },
    endpoint: { type: String, required: true },
    model:    { type: String, default: 'default' },
    tokens:   { type: Number, default: 0 },
    credits:  { type: Number, default: 1 },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

usageSchema.index({ userId: 1, createdAt: -1 });
usageSchema.index({ teamId: 1, createdAt: -1 });

module.exports = mongoose.model('Usage', usageSchema);
