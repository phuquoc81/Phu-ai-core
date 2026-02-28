import React from 'react';
import { redirectToCheckout } from '../services/stripe';

const FEATURES = {
  free:       ['100 AI credits/month', '1 user', 'Basic models'],
  starter:    ['500 AI credits/month', '3 seats', 'Standard models', 'Email support'],
  pro:        ['2,000 AI credits/month', '10 seats', 'Advanced models', 'Priority support', 'Usage analytics'],
  enterprise: ['10,000 AI credits/month', 'Unlimited seats', 'All models', 'Dedicated support', 'SLA', 'Custom integrations'],
};

export default function PricingCard ({ plan, price, displayName, current }) {
  const features = FEATURES[plan] || [];

  const handleClick = async () => {
    if (plan === 'free') return;
    try {
      await redirectToCheckout(plan);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={`pricing-card${current ? ' pricing-card--current' : ''}`}>
      <h3 className="pricing-card__name">{displayName}</h3>
      <div className="pricing-card__price">
        <span className="pricing-card__amount">${(price / 100).toFixed(0)}</span>
        <span className="pricing-card__period">/mo</span>
      </div>
      <ul className="pricing-card__features">
        {features.map(f => <li key={f}>✓ {f}</li>)}
      </ul>
      <button
        className={`btn${plan === 'pro' ? ' btn--primary' : ''}`}
        onClick={handleClick}
        disabled={plan === 'free' || current}
      >
        {current ? 'Current plan' : plan === 'free' ? 'Free' : 'Get started'}
      </button>
    </div>
  );
}
