import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ContentManager from './pages/ContentManager'
import BlogManager from './pages/BlogManager'
import WebinarManager from './pages/WebinarManager'
import AppManager from './pages/AppManager'
import SocialMediaManager from './pages/SocialMediaManager'
import AffiliateManager from './pages/AffiliateManager'
import SupportManager from './pages/SupportManager'
import UserManager from './pages/UserManager'
import AdminLayout from './components/AdminLayout'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="content" element={<ContentManager />} />
        <Route path="blog" element={<BlogManager />} />
        <Route path="webinars" element={<WebinarManager />} />
        <Route path="apps" element={<AppManager />} />
        <Route path="social-media" element={<SocialMediaManager />} />
        <Route path="affiliates" element={<AffiliateManager />} />
        <Route path="support" element={<SupportManager />} />
        <Route path="users" element={<UserManager />} />
      </Route>
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

export default App 