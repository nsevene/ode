import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthSecurity } from '@/hooks/useAuthSecurity';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield } from 'lucide-react';

interface SecureRouteProps {
  children: ReactNode;
  requiredRole?: string;
  fallbackPath?: string;
}

export const SecureRoute = ({
  children,
  requiredRole = 'user',
  fallbackPath = '/auth',
}: SecureRouteProps) => {
  const navigate = useNavigate();
  const { isAuthenticated, validateUserRole } = useAuthSecurity();

  useEffect(() => {
    const checkAccess = async () => {
      if (!isAuthenticated) {
        console.warn('Access denied: User not authenticated');
        navigate(fallbackPath);
        return;
      }

      if (requiredRole && requiredRole !== 'user') {
        const hasRole = await validateUserRole(requiredRole);
        if (!hasRole) {
          console.warn(
            `Access denied: User lacks required role: ${requiredRole}`
          );
          navigate('/');
          return;
        }
      }
    };

    checkAccess();
  }, [isAuthenticated, requiredRole, validateUserRole, navigate, fallbackPath]);

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div>
      {children}

      {/* Security notice for admin routes */}
      {requiredRole === 'admin' && (
        <div className="fixed bottom-4 right-4 z-50">
          <Alert className="w-80 bg-red-50 border-red-200">
            <Shield className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              Режим администратора: все действия логируются
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
};
