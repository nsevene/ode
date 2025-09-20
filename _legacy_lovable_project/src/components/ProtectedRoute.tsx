import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import LoadingSpinner from '@/components/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'moderator' | 'user';
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole = 'user',
  redirectTo = '/auth',
}) => {
  const { user, loading: authLoading } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user role:', error);
          setUserRole('user'); // Default role
        } else {
          setUserRole(data.role);
        }
      } catch (error) {
        console.error('Error in fetchUserRole:', error);
        setUserRole('user');
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchUserRole();
    }
  }, [user, authLoading]);

  // Show loading spinner while checking authentication and role
  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Redirect to auth if not authenticated
  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  // Check role permissions
  const hasPermission = () => {
    if (requiredRole === 'user') return true;
    if (requiredRole === 'moderator')
      return userRole === 'moderator' || userRole === 'admin';
    if (requiredRole === 'admin') return userRole === 'admin';
    return false;
  };

  // Redirect to unauthorized page if insufficient permissions
  if (!hasPermission()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-light">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Доступ запрещен
            </h1>
            <p className="text-gray-600 mb-6">
              У вас недостаточно прав для доступа к этой странице.
            </p>
            <button
              onClick={() => window.history.back()}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Вернуться назад
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
