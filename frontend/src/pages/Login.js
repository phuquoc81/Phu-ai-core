import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const API = process.env.REACT_APP_API_URL

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (mode === 'register') {
      if (password !== confirm) {
        setError('Passwords do not match.')
        return
      }
      if (password.length < 8) {
        setError('Password must be at least 8 characters.')
        return
      }
      if (!/[A-Z]/.test(password)) {
        setError('Password must contain at least one uppercase letter.')
        return
      }
      if (!/[0-9]/.test(password)) {
        setError('Password must contain at least one number.')
        return
      }
    }

    setLoading(true)
    try {
      if (mode === 'login') {
        await login(email, password)
        navigate('/dashboard')
      } else {
        const res = await fetch(`${API}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        })
        const data = await res.json()
        if (!res.ok) {
          setError(data.message || 'Registration failed.')
          return
        }
        // Auto-login after register
        await login(email, password)
        navigate('/dashboard')
      }
    } catch {
      setError('Unable to connect. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    borderRadius: '8px',
    border: '1px solid #444',
    background: '#0d0d1a',
    color: '#fff',
    marginBottom: '1rem',
    boxSizing: 'border-box',
    fontSize: '1rem'
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0d0d1a', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: '420px', background: '#1a1a2e', border: '1px solid #333', borderRadius: '16px', padding: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🧠</div>
          <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Phu AI Core</h1>
          <p style={{ color: '#8888aa', marginTop: '0.5rem', marginBottom: 0 }}>
            {mode === 'login' ? 'Sign in to your account' : 'Create your account'}
          </p>
        </div>

        <div style={{ display: 'flex', marginBottom: '1.5rem', borderRadius: '8px', overflow: 'hidden', border: '1px solid #333' }}>
          {['login', 'register'].map(m => (
            <button
              key={m}
              type="button"
              onClick={() => { setMode(m); setError('') }}
              style={{
                flex: 1,
                padding: '0.6rem',
                background: mode === m ? '#6c63ff' : 'transparent',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                fontWeight: mode === m ? 'bold' : 'normal',
                textTransform: 'capitalize'
              }}
            >
              {m === 'login' ? 'Sign In' : 'Register'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <label htmlFor="login-email" style={{ display: 'block', marginBottom: '0.4rem', color: '#8888aa', fontSize: '0.875rem' }}>
            Email address
          </label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            autoComplete="email"
            style={inputStyle}
          />

          <label htmlFor="login-password" style={{ display: 'block', marginBottom: '0.4rem', color: '#8888aa', fontSize: '0.875rem' }}>
            Password
          </label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder={mode === 'register' ? 'Min 8 chars, 1 uppercase, 1 number' : 'Enter your password'}
            required
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            style={inputStyle}
          />

          {mode === 'register' && (
            <>
              <label htmlFor="login-confirm" style={{ display: 'block', marginBottom: '0.4rem', color: '#8888aa', fontSize: '0.875rem' }}>
                Confirm password
              </label>
              <input
                id="login-confirm"
                type="password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder="Re-enter your password"
                required
                autoComplete="new-password"
                style={inputStyle}
              />
            </>
          )}

          {error && (
            <p role="alert" style={{ color: '#ff6b6b', marginBottom: '1rem', fontSize: '0.875rem' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: '#6c63ff',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              fontSize: '1rem',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#8888aa', fontSize: '0.875rem' }}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            type="button"
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}
            style={{ background: 'none', border: 'none', color: '#6c63ff', cursor: 'pointer', fontWeight: 'bold', padding: 0, fontSize: '0.875rem' }}
          >
            {mode === 'login' ? 'Register' : 'Sign In'}
          </button>
        </p>

        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          <a href="/pricing" style={{ color: '#6c63ff', fontSize: '0.875rem' }}>View Plans &amp; Pricing →</a>
        </p>
      </div>
    </div>
  )
}
