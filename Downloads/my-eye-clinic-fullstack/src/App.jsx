import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MyLandingEye from './assets/eyecomponents/Landing.jsx'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import UserLogin from './pages/UserLogin'
import Register from './pages/Register'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename="/my-eye-clinic">
        <Routes>
          <Route path="/" element={<MyLandingEye />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
