import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { UserRole } from '../../types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  requiredOrgRole?: string; // 'owner' | 'admin' | 'member' | 'viewer'
  requireOrganization?: boolean; // Require user to be in an organization
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole, 
  requiredOrgRole,
  requireOrganization = false
}) => {
  const { 
    user, 
    isLoading, 
    isAuthenticated, 
    checkAuth,
    hasRole,
    hasOrgRole,
    getCurrentOrg 
  } = useAuthStore();
  const location = useLocation();

  // Check authentication on mount and when location changes
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      checkAuth();
    }
  }, [isAuthenticated, isLoading, checkAuth, location.pathname]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="text-gray-600">Проверка аутентификации...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check system role requirement
  if (requiredRole && !hasRole(requiredRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Доступ запрещен</h2>
          <p className="text-gray-600 mb-6">
            У вас нет прав для доступа к этой странице. Требуется роль: <strong>{requiredRole}</strong>
          </p>
          <div className="space-y-3">
            <button
              onClick={() => window.history.back()}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Назад
            </button>
            <p className="text-sm text-gray-500">
              Ваша текущая роль: <strong>{user.role}</strong>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Check organization requirement
  const currentOrg = getCurrentOrg();
  if (requireOrganization && !currentOrg) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
            <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h6m-6 4h6m-2 8h.01" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Требуется организация</h2>
          <p className="text-gray-600 mb-6">
            Для доступа к этой странице вы должны быть членом организации. Обратитесь к администратору для получения доступа.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => window.history.back()}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Назад
            </button>
            {user.memberships && user.memberships.length > 0 && (
              <div className="text-left">
                <p className="text-sm font-medium text-gray-700 mb-2">Доступные организации:</p>
                <div className="space-y-1">
                  {user.memberships.map(membership => (
                    <div key={membership.id} className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      <strong>{membership.organization.display_name || membership.organization.name}</strong>
                      <span className="text-xs text-gray-500 ml-2">({membership.org_role})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Check organization role requirement
  if (requiredOrgRole && !hasOrgRole(requiredOrgRole)) {
    const currentOrgMembership = user.memberships?.find(
      m => m.organization_id === currentOrg?.id
    );

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-orange-100 mb-4">
            <svg className="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Недостаточно прав</h2>
          <p className="text-gray-600 mb-6">
            У вас нет необходимых прав в организации <strong>{currentOrg?.display_name || currentOrg?.name}</strong> 
            для доступа к этой странице.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => window.history.back()}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Назад
            </button>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
              <p><strong>Требуется:</strong> {requiredOrgRole}</p>
              <p><strong>У вас:</strong> {currentOrgMembership?.org_role || 'нет роли'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // All checks passed, render children
  return <>{children}</>;
};

export default ProtectedRoute;