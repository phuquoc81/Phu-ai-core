import React from 'react';
import { Link } from 'react-router-dom';

export default function Cancel () {
  return (
    <div className="page-cancel">
      <h1>Checkout Cancelled</h1>
      <p>No charge was made. You can try again anytime.</p>
      <Link to="/pricing" className="btn btn--primary">Back to Pricing</Link>
    </div>
  );
}
