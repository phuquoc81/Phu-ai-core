import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Pricing from './pages/Pricing'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import CodeGen from './pages/CodeGen'
import Success from './pages/Success'
import Cancel from './pages/Cancel'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/codegen" element={<CodeGen />} />
          <Route path="/success" element={<Success />} />
          <Route path="/cancel" element={<Cancel />} />
          <Route path="*" element={<Pricing />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
