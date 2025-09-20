import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/lib/config';

export const useRoles = () => {
  const { user, loading: authLoading } = useAuth();
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) {
        setUserRole('guest');
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
          setUserRole('guest'); // Default to guest if no role found
        } else {
          // Use database roles directly without mapping
          const dbRole = data.role;
          if (['admin', 'tenant', 'investor'].includes(dbRole)) {
            setUserRole(dbRole as UserRole);
          } else {
            setUserRole('guest');
          }
        }
      } catch (error) {
        console.error('Error in fetchUserRole:', error);
        setUserRole('guest');
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchUserRole();
    }
  }, [user, authLoading]);

  return {
    userRole,
    loading,
    isGuest: userRole === 'guest',
    isTenant: userRole === 'tenant',
    isInvestor: userRole === 'investor',
    isAdmin: userRole === 'admin', // Добавляем проверку admin роли
  };
};
