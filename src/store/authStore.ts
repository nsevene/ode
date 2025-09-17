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
          
          console.log('🔧 TESTING MODE: Any user becomes admin');
          
          // В режиме тестирования любой пользователь становится админом
          const mockUser = {
            id: 'test-admin-' + Date.now(),
            email: email,
            user_metadata: {
              full_name: 'Test Administrator'
            },
            aud: 'authenticated',
            role: 'authenticated',
            email_confirmed_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          } as User;

          const mockSession = {
            access_token: 'test-token-' + Date.now(),
            refresh_token: 'test-refresh-' + Date.now(),
            expires_in: 86400,
            token_type: 'bearer',
            user: mockUser
          } as Session;

          set({ 
            user: mockUser, 
            session: mockSession, 
            isAuthenticated: true,
            loading: false,
            role: 'admin', // ВСЕГДА админ в режиме тестирования
            permissions: ['admin:all', 'admin:read', 'admin:write', 'admin:delete', 'admin:manage']
          });

          console.log('✅ TESTING MODE SUCCESS:', email, 'Role: admin');
          return { success: true };
        } catch (error) {
          console.error('❌ TESTING MODE ERROR:', error);
          set({ loading: false });
          return { success: false, error: 'Authentication error: ' + error };
        }
      },

      signUp: async (email, password) => {
        try {
          set({ loading: true });
          
          console.log('🔧 TESTING MODE: Any new user becomes admin');
          
          // В режиме тестирования любой новый пользователь становится админом
          const mockUser = {
            id: 'test-signup-admin-' + Date.now(),
            email: email,
            user_metadata: {
              full_name: 'New Test Administrator'
            },
            aud: 'authenticated',
            role: 'authenticated',
            email_confirmed_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          } as User;

          const mockSession = {
            access_token: 'test-signup-token-' + Date.now(),
            refresh_token: 'test-signup-refresh-' + Date.now(),
            expires_in: 86400,
            token_type: 'bearer',
            user: mockUser
          } as Session;

          set({ 
            user: mockUser, 
            session: mockSession, 
            isAuthenticated: true,
            loading: false,
            role: 'admin', // ВСЕГДА админ в режиме тестирования
            permissions: ['admin:all', 'admin:read', 'admin:write', 'admin:delete', 'admin:manage']
          });

          console.log('✅ TESTING MODE SIGNUP SUCCESS:', email, 'Role: admin');
          return { success: true };
        } catch (error) {
          console.error('❌ TESTING MODE SIGNUP ERROR:', error);
          set({ loading: false });
          return { success: false, error: 'Authentication error: ' + error };
        }
      },

      signOut: async () => {
        try {
          set({ loading: true });
          
          console.log('🔧 TESTING MODE: Signing out');
          
          set({
            user: null,
            session: null,
            isAuthenticated: false,
            loading: false,
            role: null,
            permissions: [],
          });
        } catch (error) {
          console.error('❌ TESTING MODE SIGNOUT ERROR:', error);
          set({ loading: false });
        }
      },

      refreshSession: async () => {
        try {
          console.log('🔧 TESTING MODE: Session refresh - no action needed');
          // В режиме тестирования не нужно обновлять сессию
        } catch (error) {
          console.error('❌ TESTING MODE REFRESH ERROR:', error);
        }
      },

      checkRole: async () => {
        try {
          const { user } = get();
          if (!user) return;

          console.log('🔧 TESTING MODE: Setting role to admin for any user');
          
          // В режиме тестирования любой пользователь - админ
          set({ 
            role: 'admin',
            permissions: ['admin:all', 'admin:read', 'admin:write', 'admin:delete', 'admin:manage']
          });
        } catch (error) {
          console.error('❌ TESTING MODE ROLE CHECK ERROR:', error);
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
  becomeInstantAdmin: state.becomeInstantAdmin,
  reset: state.reset,
}));

export const useAuthPermissions = () => useAuthStore((state) => ({
  hasPermission: state.hasPermission,
  hasRole: state.hasRole,
  permissions: state.permissions,
  role: state.role,
}));
