import mongoose from 'mongoose'

const UsageSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  credits: { type: Number, default: 0 },
  totalCalls: { type: Number, default: 0 },
  lastReset: { type: Date, default: Date.now }
}, { timestamps: true })

export default mongoose.model('Usage', UsageSchema)
