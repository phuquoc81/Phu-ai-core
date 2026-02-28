import React from 'react';

export default function CreditsDisplay ({ credits, plan }) {
  const tiers = { free: 100, starter: 500, pro: 2000, enterprise: 10000 };
  const max   = tiers[plan] || 100;
  const pct   = Math.min(100, Math.round((credits / max) * 100));

  return (
    <div className="credits-display">
      <div className="credits-display__header">
        <span className="credits-display__label">AI Credits</span>
        <span className="credits-display__value">{credits} / {max}</span>
      </div>
      <div className="credits-display__bar-bg">
        <div
          className="credits-display__bar-fill"
          style={{ width: `${pct}%`, background: pct < 20 ? '#ff6584' : '#6c63ff' }}
        />
      </div>
      <p className="credits-display__plan">Plan: {plan}</p>
    </div>
  );
}
