import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const [usage, setUsage] = useState(null)

  useEffect(() => {
    api.get('/api/usage').then(res => setUsage(res.data)).catch(() => {})
  }, [])

  const openBillingPortal = async () => {
    try {
      const res = await api.post('/api/stripe/portal')
      window.location.href = res.data.url
    } catch {
      alert('Unable to open billing portal. Please contact support.')
    }
  }

  if (!user) return <p style={{ padding: '2rem' }}>Please log in to access the dashboard.</p>

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Dashboard</h1>
        <button onClick={logout} style={{ padding: '0.5rem 1rem', background: 'transparent', border: '1px solid #555', borderRadius: '8px', color: '#fff', cursor: 'pointer' }}>
          Log Out
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: '#1a1a2e', border: '1px solid #333', borderRadius: '12px', padding: '1.5rem' }}>
          <p style={{ color: '#8888aa', marginBottom: '0.5rem' }}>Subscription</p>
          <p style={{ fontWeight: 'bold', color: user.subscriptionStatus === 'active' ? '#00e5a0' : '#ff6b6b' }}>
            {user.subscriptionStatus === 'active' ? '✓ Active' : '✗ Inactive'}
          </p>
        </div>
        {usage && (
          <>
            <div style={{ background: '#1a1a2e', border: '1px solid #333', borderRadius: '12px', padding: '1.5rem' }}>
              <p style={{ color: '#8888aa', marginBottom: '0.5rem' }}>AI Credits</p>
              <p style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>{usage.credits}</p>
            </div>
            <div style={{ background: '#1a1a2e', border: '1px solid #333', borderRadius: '12px', padding: '1.5rem' }}>
              <p style={{ color: '#8888aa', marginBottom: '0.5rem' }}>Total API Calls</p>
              <p style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>{usage.totalCalls}</p>
            </div>
          </>
        )}
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <button
          onClick={openBillingPortal}
          style={{ padding: '0.75rem 1.5rem', background: '#6c63ff', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Manage Billing
        </button>
      </div>
    </div>
  )
}
