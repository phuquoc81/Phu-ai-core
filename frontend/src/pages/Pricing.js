import React from 'react';
import PricingCard from '../components/PricingCard';
import { useAuth } from '../context/AuthContext';

const PLANS = [
  { plan: 'free',       displayName: 'Free',       price: 0 },
  { plan: 'starter',    displayName: 'Starter',    price: 2900 },
  { plan: 'pro',        displayName: 'Pro',        price: 7900 },
  { plan: 'enterprise', displayName: 'Enterprise', price: 29900 },
];

export default function Pricing () {
  const { user } = useAuth();

  return (
    <div className="page-pricing">
      <h1>Choose a Plan</h1>
      <p className="subtitle">Scale as you grow. Cancel anytime.</p>
      <div className="pricing-grid">
        {PLANS.map(p => (
          <PricingCard
            key={p.plan}
            {...p}
            current={user?.subscriptionPlan === p.plan}
          />
        ))}
      </div>
    </div>
  );
}
