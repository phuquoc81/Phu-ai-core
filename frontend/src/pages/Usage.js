import React, { useEffect, useState } from 'react';
import api from '../services/api';
import UsageChart from '../components/UsageChart';
import CreditsDisplay from '../components/CreditsDisplay';

export default function UsagePage () {
  const [analytics, setAnalytics] = useState([]);
  const [balance,   setBalance]   = useState(null);
  const [days,      setDays]      = useState(30);

  useEffect(() => {
    Promise.all([
      api.get(`/usage/analytics?days=${days}`),
      api.get('/usage/balance'),
    ]).then(([a, b]) => {
      setAnalytics(a.data.analytics);
      setBalance(b.data);
    }).catch(console.error);
  }, [days]);

  return (
    <div className="page-usage">
      <h1>Usage Analytics</h1>
      {balance && <CreditsDisplay credits={balance.credits} plan={balance.plan} />}

      <div className="days-filter">
        {[7, 14, 30, 90].map(d => (
          <button
            key={d}
            className={`btn btn--sm${days === d ? ' btn--active' : ''}`}
            onClick={() => setDays(d)}
          >
            {d}d
          </button>
        ))}
      </div>

      <UsageChart analytics={analytics} />
    </div>
  );
}
