import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import CreditsDisplay from '../components/CreditsDisplay';

export default function Dashboard () {
  const { user } = useAuth();
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    api.get('/usage/balance').then(r => setBalance(r.data)).catch(console.error);
  }, []);

  return (
    <div className="page-dashboard">
      <h1>Welcome, {user?.name}</h1>
      {balance && (
        <CreditsDisplay credits={balance.credits} plan={balance.plan} />
      )}
      <div className="dashboard-links">
        <a href="/usage"    className="btn">Usage Analytics</a>
        <a href="/team"     className="btn">Team Management</a>
        <a href="/billing"  className="btn">Billing</a>
        <a href="/invoices" className="btn">Invoices</a>
      </div>
    </div>
  );
}
