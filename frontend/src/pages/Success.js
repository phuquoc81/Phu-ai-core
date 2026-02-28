import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

export default function Success () {
  const [params] = useSearchParams();
  const sessionId = params.get('session_id');

  useEffect(() => {
    if (sessionId) {
      // Backend processes subscription via webhook; nothing more to do here
    }
  }, [sessionId]);

  return (
    <div className="page-success">
      <h1>🎉 Payment Successful!</h1>
      <p>Your subscription is now active. Welcome to PhuAI Nexus Pro!</p>
      <Link to="/dashboard" className="btn btn--primary">Go to Dashboard</Link>
    </div>
  );
}
