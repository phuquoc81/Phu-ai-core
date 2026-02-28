import React from 'react';
import { Link } from 'react-router-dom';

export default function Home () {
  return (
    <div className="page-home">
      <header className="hero">
        <h1>PhuAI Nexus Pro</h1>
        <p className="hero__subtitle">Enterprise AI Platform — Subscription billing, usage analytics, team management, and Web3 payments in one platform.</p>
        <div className="hero__cta">
          <Link to="/pricing" className="btn btn--primary btn--lg">View Pricing</Link>
          <Link to="/dashboard" className="btn btn--outline btn--lg">Dashboard</Link>
        </div>
      </header>

      <section className="features">
        {[
          { icon: '🧠', title: 'AI Models', desc: 'Access multiple AI models with per-call credit tracking.' },
          { icon: '💳', title: 'Stripe Billing', desc: 'Subscription plans with usage-based metered billing.' },
          { icon: '👥', title: 'Team Accounts', desc: 'Multi-seat billing and team member management.' },
          { icon: '🔗', title: 'Web3 Payments', desc: 'Pay with PHU81 tokens on Polygon network.' },
          { icon: '📊', title: 'Analytics', desc: 'Real-time usage charts and credit forecasts.' },
          { icon: '🧾', title: 'Invoices', desc: 'PDF invoices with automated tax calculation.' },
        ].map(f => (
          <div key={f.title} className="feature-card">
            <span className="feature-card__icon">{f.icon}</span>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
