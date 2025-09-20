import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRoles } from '@/hooks/useRoles'; // Import useRoles
import { FullPageLoading } from '@/components/LoadingStates';

interface SecureRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const SecureRoute: React.FC<SecureRouteProps> = ({
  children,
  requiredRole,
}) => {
  const { user, loading: authLoading } = useAuth();
  const { userRole, loading: roleLoading } = useRoles(); // Get userRole from useRoles

  const loading = authLoading || roleLoading;

  if (loading) {
    return <FullPageLoading />;
  }

  if (!user) {
    // This could also be a redirect component
    return <div>Please log in to access this page.</div>;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <div>You don't have permission to access this page.</div>;
  }

  return <>{children}</>;
};

export default SecureRoute;
