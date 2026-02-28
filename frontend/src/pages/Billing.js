import React from 'react';
import { redirectToPortal } from '../services/stripe';

export default function Billing () {
  const handlePortal = async () => {
    try {
      await redirectToPortal();
    } catch (err) {
      console.error(err);
      alert('Could not open billing portal. Please try again.');
    }
  };

  return (
    <div className="page-billing">
      <h1>Billing</h1>
      <p>Manage your subscription, update payment methods, and view past invoices through the Stripe customer portal.</p>
      <button className="btn btn--primary" onClick={handlePortal}>
        Open Billing Portal
      </button>
    </div>
  );
}
