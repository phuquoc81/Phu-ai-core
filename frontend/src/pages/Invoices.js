import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function Invoices () {
  const [invoices, setInvoices] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    api.get('/invoices')
      .then(r => setInvoices(r.data.invoices))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading…</p>;

  return (
    <div className="page-invoices">
      <h1>Invoices</h1>
      {invoices.length === 0 ? (
        <p className="text-muted">No invoices yet.</p>
      ) : (
        <table className="invoice-table">
          <thead>
            <tr>
              <th>Invoice #</th><th>Date</th><th>Amount</th><th>Status</th><th>PDF</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map(inv => (
              <tr key={inv._id}>
                <td>{inv.invoiceNumber}</td>
                <td>{new Date(inv.createdAt).toLocaleDateString()}</td>
                <td>${(inv.amount / 100).toFixed(2)} {inv.currency.toUpperCase()}</td>
                <td><span className={`badge badge--${inv.status}`}>{inv.status}</span></td>
                <td>
                  <a
                    href={`${process.env.REACT_APP_API_URL}/invoices/${inv._id}/pdf`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn--sm"
                  >
                    Download
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
