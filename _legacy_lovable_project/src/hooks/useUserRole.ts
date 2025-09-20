import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

type UserRole = 'user' | 'moderator' | 'admin';

export const useUserRole = () => {
  const [role, setRole] = useState<UserRole>('user');
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) {
        setRole('user');
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase.rpc('get_user_role', {
          _user_id: user.id,
        });

        if (error) {
          console.error('Error fetching user role:', error);
          setRole('user');
        } else {
          setRole((data as UserRole) || 'user');
        }
      } catch (error) {
        console.error('Error in useUserRole:', error);
        setRole('user');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRole();
  }, [user]);

  const hasRole = (requiredRole: UserRole): boolean => {
    const roleHierarchy = { user: 0, moderator: 1, admin: 2 };
    const userLevel = roleHierarchy[role];
    const requiredLevel = roleHierarchy[requiredRole];
    return userLevel >= requiredLevel;
  };

  const isAdmin = (): boolean => hasRole('admin');
  const isModerator = (): boolean => hasRole('moderator');

  return {
    role,
    isLoading,
    hasRole,
    isAdmin,
    isModerator,
    isUser: role === 'user',
  };
};
