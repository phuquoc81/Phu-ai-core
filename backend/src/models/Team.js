import mongoose from 'mongoose'

const TeamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  stripeCustomerId: String,
  subscriptionStatus: { type: String, default: 'inactive' },
  seats: { type: Number, default: 1 }
}, { timestamps: true })

export default mongoose.model('Team', TeamSchema)
