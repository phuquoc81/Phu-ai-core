import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Phutum = () => {
  const [diagnostics, setDiagnostics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fixing, setFixing] = useState(false);
  const [error, setError] = useState('');

  const runDiagnostics = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/phutum/diagnostics');
      setDiagnostics(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to run Phutum diagnostics');
    } finally {
      setLoading(false);
    }
  };

  const applyAutoFix = async (issueId) => {
    setFixing(true);
    try {
      await api.post('/phutum/autofix', { issueId });
      alert('Phutum Core successfully applied the fix!');
      runDiagnostics(); // Refresh
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to apply auto-fix');
    } finally {
      setFixing(false);
    }
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem', borderBottom: '2px solid #6c63ff', paddingBottom: '1rem' }}>
        <h1 style={{ color: '#6c63ff', margin: 0 }}>PhuAI Phutum Core</h1>
        <p style={{ color: '#666' }}>The Ultimate Combined AI Agent Orchestrator</p>
      </header>

      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

      <section style={{ marginBottom: '2rem' }}>
        <button 
          onClick={runDiagnostics} 
          disabled={loading}
          style={{ padding: '0.75rem 1.5rem', background: '#6c63ff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          {loading ? 'Analyzing...' : 'Run System Diagnostics'}
        </button>
      </section>

      {diagnostics && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div style={{ padding: '1.5rem', background: '#f8f9fa', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3>System Health Score</h3>
            <div style={{ fontSize: '3rem', fontWeight: 'bold', color: diagnostics.overallHealth > 90 ? 'green' : 'orange' }}>
              {diagnostics.overallHealth}%
            </div>
            <p>Phutum Core has analyzed your entire ecosystem.</p>
          </div>

          <div style={{ padding: '1.5rem', background: '#f8f9fa', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3>Active AI Agents</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {diagnostics.agents.map((agent, i) => (
                <li key={i} style={{ marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>
                  <strong>{agent.name}:</strong> <span style={{ color: agent.status === 'optimal' ? 'green' : 'orange' }}>{agent.status.toUpperCase()}</span>
                  <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>{agent.findings}</p>
                  {agent.status === 'warning' && (
                    <button 
                      onClick={() => applyAutoFix(agent.name)}
                      disabled={fixing}
                      style={{ marginTop: '0.5rem', padding: '0.25rem 0.5rem', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                    >
                      {fixing ? 'Fixing...' : 'Apply Phutum Auto-Fix'}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Phutum;
