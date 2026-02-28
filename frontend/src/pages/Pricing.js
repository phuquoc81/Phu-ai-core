import React, { useState } from 'react'
import api from '../services/api'

const PLANS = [
  { name: 'Starter', price: '$11.99/mo', priceId: 'price_starter', features: ['100 AI credits/mo', 'Basic AI access', 'Email support'] },
  { name: 'Basic', price: '$19.99/mo', priceId: 'price_basic', features: ['300 AI credits/mo', 'All AI tools', 'Priority support'] },
  { name: 'Standard', price: '$28.99/mo', priceId: 'price_standard', features: ['600 AI credits/mo', 'Advanced AI', 'API access'] },
  { name: 'Plus', price: '$36.99/mo', priceId: 'price_plus', features: ['1,000 AI credits/mo', 'Team features (2 seats)', 'Analytics'] },
  { name: 'Phu AI', price: '$49.99/mo', priceId: 'price_phuai', features: ['2,000 AI credits/mo', 'Team features (5 seats)', 'Revenue AI'] },
  { name: 'Phu AI Pro', price: '$59.99/mo', priceId: 'price_phuaipro', features: ['5,000 AI credits/mo', 'Team features (10 seats)', 'Full automation'] },
  { name: 'Phu AI Revenue', price: '$69.99/mo', priceId: 'price_phuairev', features: ['10,000 AI credits/mo', 'Unlimited seats', 'Enterprise support'] }
]

export default function Pricing() {
  const [email, setEmail] = useState('')
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan)
    setError('')
  }

  const handleSubscribe = async (e) => {
    e.preventDefault()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.')
      return
    }
    setLoading(true)
    try {
      const res = await api.post('/api/stripe/checkout', { priceId: selectedPlan.priceId, email })
      window.location.href = res.data.url
    } catch {
      setError('Error starting checkout. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Choose Your Plan</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {PLANS.map(plan => (
          <div
            key={plan.priceId}
            style={{
              border: selectedPlan?.priceId === plan.priceId ? '2px solid #6c63ff' : '1px solid #333',
              borderRadius: '12px', padding: '1.5rem', background: '#1a1a2e', cursor: 'pointer'
            }}
            onClick={() => handleSelectPlan(plan)}
          >
            <h2>{plan.name}</h2>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#6c63ff' }}>{plan.price}</p>
            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '1.5rem' }}>
              {plan.features.map(f => <li key={f} style={{ padding: '0.25rem 0' }}>✓ {f}</li>)}
            </ul>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); handleSelectPlan(plan) }}
              style={{ width: '100%', padding: '0.75rem', background: selectedPlan?.priceId === plan.priceId ? '#6c63ff' : 'transparent', color: selectedPlan?.priceId === plan.priceId ? '#fff' : '#6c63ff', border: '1px solid #6c63ff', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              {selectedPlan?.priceId === plan.priceId ? 'Selected' : 'Select Plan'}
            </button>
          </div>
        ))}
      </div>

      {selectedPlan && (
        <form onSubmit={handleSubscribe} style={{ maxWidth: '420px', margin: '0 auto', background: '#1a1a2e', border: '1px solid #333', borderRadius: '12px', padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Subscribe to {selectedPlan.name}</h3>
          <label htmlFor="checkout-email" style={{ display: 'block', marginBottom: '0.5rem', color: '#8888aa' }}>Email address</label>
          <input
            id="checkout-email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #444', background: '#0d0d1a', color: '#fff', marginBottom: '1rem', boxSizing: 'border-box' }}
          />
          {error && <p style={{ color: '#ff6b6b', marginBottom: '0.75rem' }}>{error}</p>}
          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '0.75rem', background: '#6c63ff', color: '#fff', border: 'none', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 'bold', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Redirecting to checkout…' : `Subscribe — ${selectedPlan.price}`}
          </button>
        </form>
      )}
    </div>
  )
}
