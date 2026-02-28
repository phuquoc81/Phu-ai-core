import React from 'react'

export default function Cancel() {
  return (
    <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>😕</div>
      <h1 style={{ marginBottom: '1rem' }}>Payment Cancelled</h1>
      <p style={{ color: '#8888aa', marginBottom: '2rem' }}>
        No worries — your payment was not processed. You can try again whenever you're ready.
      </p>
      <a
        href="/pricing"
        style={{ padding: '0.75rem 1.5rem', background: '#6c63ff', color: '#fff', textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold' }}
      >
        Back to Pricing
      </a>
    </div>
  )
}
