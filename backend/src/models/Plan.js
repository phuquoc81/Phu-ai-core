'use strict';

const mongoose = require('mongoose');

const planSchema = new mongoose.Schema(
  {
    name:          { type: String, required: true, unique: true },
    displayName:   { type: String, required: true },
    stripePriceId: { type: String, default: null },
    price:         { type: Number, required: true },   // monthly, in cents
    currency:      { type: String, default: 'usd' },
    credits:       { type: Number, default: 0 },       // monthly AI credits
    seats:         { type: Number, default: 1 },
    features:      [String],
    isActive:      { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Plan', planSchema);
