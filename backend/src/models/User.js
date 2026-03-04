import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: String,
  stripeCustomerId: String,
  subscriptionStatus: { type: String, default: 'inactive' },
  subscriptionPlan: { type: String, default: null },
  role: { type: String, default: 'user' }
}, { timestamps: true })

export default mongoose.model('User', UserSchema)
