import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const LANGUAGES = [
  'javascript', 'typescript', 'python', 'go', 'rust', 'java', 'csharp', 'php', 'ruby', 'bash'
]

export default function CodeGen() {
  const { user } = useAuth()
  const [prompt, setPrompt] = useState('')
  const [language, setLanguage] = useState('javascript')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  if (!user) {
    return (
      <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <p style={{ color: '#8888aa', marginBottom: '1.5rem' }}>Please sign in to use the Code Generator.</p>
        <a href="/login" style={{ padding: '0.75rem 1.5rem', background: '#6c63ff', color: '#fff', textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold' }}>
          Sign In
        </a>
      </div>
    )
  }

  if (user.subscriptionStatus !== 'active') {
    return (
      <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
        <h2 style={{ marginBottom: '1rem' }}>Subscription Required</h2>
        <p style={{ color: '#8888aa', marginBottom: '1.5rem' }}>
          The AI Code Generator requires an active plan. Upgrade to get started.
        </p>
        <a href="/pricing" style={{ padding: '0.75rem 1.5rem', background: '#6c63ff', color: '#fff', textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold' }}>
          View Plans
        </a>
      </div>
    )
  }

  const handleGenerate = async (e) => {
    e.preventDefault()
    if (!prompt.trim()) {
      setError('Please enter a prompt.')
      return
    }
    setError('')
    setResult(null)
    setCopied(false)
    setLoading(true)
    try {
      const res = await api.post('/api/ai/codegen', { prompt, language })
      setResult(res.data)
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Code generation failed. Please try again.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    if (!result?.code) return
    navigator.clipboard.writeText(result.code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const selectStyle = {
    padding: '0.6rem 1rem',
    borderRadius: '8px',
    border: '1px solid #444',
    background: '#0d0d1a',
    color: '#fff',
    fontSize: '0.95rem',
    cursor: 'pointer'
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '0.5rem' }}>⚡ AI Code Generator</h1>
      <p style={{ color: '#8888aa', marginBottom: '2rem' }}>
        Describe what you want to build and Phu AI will write the code for you.
      </p>

      <form onSubmit={handleGenerate}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <label htmlFor="codegen-lang" style={{ color: '#8888aa', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>
            Language:
          </label>
          <select
            id="codegen-lang"
            value={language}
            onChange={e => setLanguage(e.target.value)}
            style={selectStyle}
          >
            {LANGUAGES.map(l => (
              <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>
            ))}
          </select>
        </div>

        <textarea
          id="codegen-prompt"
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="e.g. Write a function that sorts an array of objects by a given key, with ascending and descending support."
          rows={5}
          maxLength={2000}
          required
          style={{
            width: '100%',
            padding: '1rem',
            borderRadius: '8px',
            border: '1px solid #444',
            background: '#1a1a2e',
            color: '#fff',
            fontSize: '1rem',
            resize: 'vertical',
            boxSizing: 'border-box',
            marginBottom: '0.5rem'
          }}
        />
        <p style={{ color: '#555', fontSize: '0.8rem', textAlign: 'right', marginBottom: '1rem' }}>
          {prompt.length}/2000
        </p>

        {error && (
          <p role="alert" style={{ color: '#ff6b6b', marginBottom: '1rem' }}>{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '0.75rem 2rem',
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
          {loading ? 'Generating…' : '⚡ Generate Code'}
        </button>
      </form>

      {result && (
        <div style={{ marginTop: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h3 style={{ margin: 0 }}>
              Generated {result.language.charAt(0).toUpperCase() + result.language.slice(1)} Code
            </h3>
            <button
              type="button"
              onClick={handleCopy}
              style={{
                padding: '0.4rem 1rem',
                background: copied ? '#00e5a0' : 'transparent',
                color: copied ? '#0d0d1a' : '#6c63ff',
                border: '1px solid',
                borderColor: copied ? '#00e5a0' : '#6c63ff',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '0.875rem',
                transition: 'all 0.2s'
              }}
            >
              {copied ? '✓ Copied!' : 'Copy'}
            </button>
          </div>
          <pre style={{
            background: '#0d0d1a',
            border: '1px solid #333',
            borderRadius: '8px',
            padding: '1.5rem',
            overflowX: 'auto',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            color: '#e0e0ff',
            fontSize: '0.9rem',
            lineHeight: 1.6,
            margin: 0
          }}>
            <code>{result.code}</code>
          </pre>
          <p style={{ color: '#555', fontSize: '0.8rem', marginTop: '0.5rem', textAlign: 'right' }}>
            Generated at {new Date(result.generatedAt).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  )
}
