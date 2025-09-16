import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useRoles } from '@/hooks/useRoles';
import { hasRouteAccess, UserRole } from '@/lib/config';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Shield, ArrowLeft } from 'lucide-react';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  requiredPath: string;
  redirectTo?: string;
}

const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ 
  children, 
  requiredPath,
  redirectTo = '/auth'
}) => {
  const { user, loading: authLoading } = useAuth();
  const { userRole, loading: roleLoading } = useRoles();

  // Show loading while checking authentication and role
  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // If no user, redirect to auth (except for public routes)
  if (!user && !hasRouteAccess(requiredPath, 'guest')) {
    return <Navigate to={redirectTo} replace />;
  }

  // Check if user has access to this route
  const userRoleOrGuest: UserRole = userRole || 'guest';
  const hasAccess = hasRouteAccess(requiredPath, userRoleOrGuest);

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-muted/50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="mb-6">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Access Restricted
            </h1>
            <p className="text-muted-foreground mb-6">
              You don't have permission to access this section. 
              {userRole ? ` Your role: ${userRole}` : ' Please sign in with appropriate credentials.'}
            </p>
            
            <div className="space-y-3">
              <button
                onClick={() => window.history.back()}
                className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Go Back
              </button>
              
              {!user && (
                <button
                  onClick={() => window.location.href = '/auth'}
                  className="w-full bg-muted text-muted-foreground px-6 py-3 rounded-lg hover:bg-muted/80 transition-colors"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default RoleProtectedRoute;