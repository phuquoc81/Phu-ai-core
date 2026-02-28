import React from 'react'

export default function Success() {
  return (
    <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
      <h1 style={{ color: '#00e5a0', marginBottom: '1rem' }}>Payment Successful!</h1>
      <p style={{ color: '#8888aa', marginBottom: '2rem' }}>
        Your subscription has been activated. Welcome to PhuAI Nexus Pro!
      </p>
      <a
        href="/dashboard"
        style={{ padding: '0.75rem 1.5rem', background: '#6c63ff', color: '#fff', textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold' }}
      >
        Go to Dashboard
      </a>
    </div>
  )
}
