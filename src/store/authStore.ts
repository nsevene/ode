import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { handleError, displayError } from '@/lib/error-handling';

interface AuthState {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  loading: boolean;
  role: string | null;
  permissions: string[];
}

interface AuthActions {
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  setRole: (role: string | null) => void;
  setPermissions: (permissions: string[]) => void;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
  checkRole: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
  reset: () => void;
}

type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
  user: null,
  session: null,
  isAuthenticated: false,
  loading: true,
  role: null,
  permissions: [],
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      setSession: (session) => set({ session }),
      
      setLoading: (loading) => set({ loading }),
      
      setRole: (role) => set({ role }),
      
      setPermissions: (permissions) => set({ permissions }),

      signIn: async (email, password) => {
        try {
          set({ loading: true });
          
          // Проверяем, используем ли мы mock Supabase
          const isMockMode = !import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL === 'mock';
          
          if (isMockMode) {
            // Mock аутентификация для разработки
            console.log('🔧 Using mock authentication for development');
            
            // Проверяем стандартные данные админа
            if (email === 'admin@odefoodhall.com' && password === 'Admin123!') {
              const mockUser = {
                id: 'admin-mock-' + Date.now(),
                email: email,
                user_metadata: {
                  full_name: 'System Administrator'
                }
              };
              
              const mockSession = {
                access_token: 'mock-token-' + Date.now(),
                refresh_token: 'mock-refresh-' + Date.now(),
                user: mockUser
              };

              set({ 
                user: mockUser, 
                session: mockSession, 
                isAuthenticated: true,
                loading: false,
                role: 'admin',
                permissions: ['admin:read', 'admin:write', 'admin:delete', 'admin:manage']
              });

              return { success: true };
            }
            
            // Для других пользователей создаем guest
            const mockUser = {
              id: 'user-mock-' + Date.now(),
              email: email,
              user_metadata: {
                full_name: 'Guest User'
              }
            };
            
            const mockSession = {
              access_token: 'mock-token-' + Date.now(),
              refresh_token: 'mock-refresh-' + Date.now(),
              user: mockUser
            };

            set({ 
              user: mockUser, 
              session: mockSession, 
              isAuthenticated: true,
              loading: false,
              role: 'guest',
              permissions: ['guest:read']
            });

            return { success: true };
          }
          
          // Реальная аутентификация через Supabase
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) {
            const appError = handleError(error);
            displayError(appError);
            return { success: false, error: appError.message };
          }

          set({ 
            user: data.user, 
            session: data.session, 
            isAuthenticated: true,
            loading: false 
          });

          // Check user role after successful login
          await get().checkRole();

          return { success: true };
        } catch (error) {
          const appError = handleError(error);
          displayError(appError);
          set({ loading: false });
          return { success: false, error: appError.message };
        }
      },

      signUp: async (email, password) => {
        try {
          set({ loading: true });
          
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
          });

          if (error) {
            const appError = handleError(error);
            displayError(appError);
            return { success: false, error: appError.message };
          }

          set({ 
            user: data.user, 
            session: data.session, 
            isAuthenticated: !!data.user,
            loading: false 
          });

          return { success: true };
        } catch (error) {
          const appError = handleError(error);
          displayError(appError);
          set({ loading: false });
          return { success: false, error: appError.message };
        }
      },

      signOut: async () => {
        try {
          set({ loading: true });
          
          const { error } = await supabase.auth.signOut();
          
          if (error) {
            const appError = handleError(error);
            displayError(appError);
            return;
          }

          set({
            user: null,
            session: null,
            isAuthenticated: false,
            loading: false,
            role: null,
            permissions: [],
          });
        } catch (error) {
          const appError = handleError(error);
          displayError(appError);
          set({ loading: false });
        }
      },

      refreshSession: async () => {
        try {
          const { data, error } = await supabase.auth.refreshSession();
          
          if (error) {
            console.error('Session refresh error:', error);
            return;
          }

          set({ 
            session: data.session,
            user: data.session?.user || null,
            isAuthenticated: !!data.session?.user
          });
        } catch (error) {
          console.error('Session refresh error:', error);
        }
      },

      checkRole: async () => {
        try {
          const { user } = get();
          if (!user) return;

          const { data, error } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)
            .single();

          if (error) {
            console.error('Role check error:', error);
            return;
          }

          const role = data?.role || 'guest';
          set({ role });

          // Set permissions based on role
          const permissions = getPermissionsForRole(role);
          set({ permissions });
        } catch (error) {
          console.error('Role check error:', error);
        }
      },

      hasPermission: (permission) => {
        const { permissions } = get();
        return permissions.includes(permission);
      },

      hasRole: (role) => {
        const { role: userRole } = get();
        return userRole === role;
      },

      reset: () => {
        set(initialState);
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        session: state.session,
        isAuthenticated: state.isAuthenticated,
        role: state.role,
        permissions: state.permissions,
      }),
    }
  )
);

// Helper function to get permissions for a role
function getPermissionsForRole(role: string): string[] {
  const rolePermissions: Record<string, string[]> = {
    admin: [
      'read:all',
      'write:all',
      'delete:all',
      'manage:users',
      'manage:bookings',
      'manage:orders',
      'manage:menu',
      'manage:events',
      'manage:analytics',
      'manage:settings',
    ],
    tenant: [
      'read:own',
      'write:own',
      'manage:own_bookings',
      'manage:own_orders',
      'manage:own_menu',
      'manage:own_analytics',
    ],
    investor: [
      'read:analytics',
      'read:financials',
      'read:reports',
    ],
    internal: [
      'read:all',
      'write:bookings',
      'write:orders',
      'manage:events',
    ],
    guest: [
      'read:public',
      'create:booking',
      'create:order',
    ],
  };

  return rolePermissions[role] || rolePermissions.guest;
}

// Selectors for better performance
export const useAuth = () => useAuthStore((state) => ({
  user: state.user,
  session: state.session,
  isAuthenticated: state.isAuthenticated,
  loading: state.loading,
  role: state.role,
  permissions: state.permissions,
}));

export const useAuthActions = () => useAuthStore((state) => ({
  signIn: state.signIn,
  signUp: state.signUp,
  signOut: state.signOut,
  refreshSession: state.refreshSession,
  checkRole: state.checkRole,
  hasPermission: state.hasPermission,
  hasRole: state.hasRole,
  reset: state.reset,
}));

export const useAuthPermissions = () => useAuthStore((state) => ({
  hasPermission: state.hasPermission,
  hasRole: state.hasRole,
  permissions: state.permissions,
  role: state.role,
}));
