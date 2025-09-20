import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { UserRole } from '../../types/auth'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: UserRole
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { user, isLoading, isAuthenticated } = useAuthStore()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="ode-bg-gray" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="loading-spinner" style={{ width: '64px', height: '64px' }}></div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requiredRole && user.role !== requiredRole) {
    return (
      <div className="ode-bg-gray" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="ode-card" style={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}>
          <div style={{ margin: '0 auto 16px', width: '48px', height: '48px', background: '#fef2f2', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg style={{ width: '24px', height: '24px', color: '#dc2626' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="ode-text-2xl ode-font-bold ode-text-charcoal ode-mb-2">Доступ запрещен</h1>
          <p className="ode-text-gray ode-mb-6">
            У вас нет прав для доступа к этой странице
          </p>
          <button
            onClick={() => window.history.back()}
            className="ode-btn ode-btn-primary"
          >
            Назад
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

export default ProtectedRoute
