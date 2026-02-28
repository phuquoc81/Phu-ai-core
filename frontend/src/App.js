import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Home     from './pages/Home';
import Pricing  from './pages/Pricing';
import Dashboard from './pages/Dashboard';
import TeamPage from './pages/Team';
import UsagePage from './pages/Usage';
import Billing  from './pages/Billing';
import Invoices from './pages/Invoices';
import Success  from './pages/Success';
import Cancel   from './pages/Cancel';

function PrivateRoute ({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/" replace />;
}

export default function App () {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"        element={<Home />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/success" element={<Success />} />
          <Route path="/cancel"  element={<Cancel />} />

          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/team"      element={<PrivateRoute><TeamPage /></PrivateRoute>} />
          <Route path="/usage"     element={<PrivateRoute><UsagePage /></PrivateRoute>} />
          <Route path="/billing"   element={<PrivateRoute><Billing /></PrivateRoute>} />
          <Route path="/invoices"  element={<PrivateRoute><Invoices /></PrivateRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
