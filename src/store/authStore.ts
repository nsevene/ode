import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  AuthStoreState, 
  AuthUser, 
  UserRole, 
  LoginResponse, 
  RegisterResponse, 
  RefreshResponse, 
  MeResponse, 
  SwitchOrgResponse,
  Organization 
} from '../types/auth';

const API_BASE_URL = 'http://localhost:3001/api/auth'; // Backend auth service

// Helper function to make authenticated requests
const makeAuthRequest = async (endpoint: string, options: RequestInit = {}): Promise<Response> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    credentials: 'include', // Include cookies for refresh tokens
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });
  return response;
};

// Helper function to make requests with Bearer token
const makeAuthRequestWithToken = async (endpoint: string, token: string, options: RequestInit = {}): Promise<Response> => {
  return makeAuthRequest(endpoint, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  });
};

export const useAuthStore = create<AuthStoreState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      role: UserRole.Public,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      accessToken: null,

      // Login action
      login: async (email: string, password: string): Promise<boolean> => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await makeAuthRequest('/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Login failed');
          }

          const data: LoginResponse = await response.json();
          
          set({
            user: data.user,
            role: data.user.role,
            isAuthenticated: true,
            accessToken: data.access_token,
            isLoading: false,
            error: null,
          });

          return true;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Login failed';
          set({ 
            error: errorMessage, 
            isLoading: false,
            user: null,
            isAuthenticated: false,
            accessToken: null 
          });
          return false;
        }
      },

      // Register action
      register: async (
        email: string, 
        password: string, 
        role: UserRole, 
        firstName?: string, 
        lastName?: string, 
        displayName?: string
      ): Promise<boolean> => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await makeAuthRequest('/register', {
            method: 'POST',
            body: JSON.stringify({ 
              email, 
              password, 
              role,
              first_name: firstName,
              last_name: lastName,
              display_name: displayName || firstName
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Registration failed');
          }

          const data: RegisterResponse = await response.json();
          
          set({
            user: data.user,
            role: data.user.role,
            isAuthenticated: true,
            accessToken: data.access_token,
            isLoading: false,
            error: null,
          });

          return true;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Registration failed';
          set({ 
            error: errorMessage, 
            isLoading: false,
            user: null,
            isAuthenticated: false,
            accessToken: null 
          });
          return false;
        }
      },

      // Logout action
      logout: async (): Promise<void> => {
        set({ isLoading: true });
        
        try {
          // Call logout endpoint to clear refresh token cookie
          await makeAuthRequest('/logout', {
            method: 'POST',
          });
        } catch (error) {
          console.warn('Logout request failed:', error);
          // Continue with local logout even if server request fails
        }

        // Clear local state
        set({
          user: null,
          role: UserRole.Public,
          isAuthenticated: false,
          accessToken: null,
          isLoading: false,
          error: null,
        });
      },

      // Refresh token action
      refreshToken: async (): Promise<boolean> => {
        try {
          const response = await makeAuthRequest('/refresh', {
            method: 'POST',
          });

          if (!response.ok) {
            throw new Error('Token refresh failed');
          }

          const data: RefreshResponse = await response.json();
          
          set({
            accessToken: data.access_token,
            error: null,
          });

          return true;
        } catch (error) {
          console.warn('Token refresh failed:', error);
          // If refresh fails, logout user
          get().logout();
          return false;
        }
      },

      // Check auth status
      checkAuth: async (): Promise<void> => {
        const { accessToken } = get();
        
        // If no access token, try to refresh
        if (!accessToken) {
          const refreshed = await get().refreshToken();
          if (!refreshed) {
            set({ isLoading: false });
            return;
          }
        }

        set({ isLoading: true });

        try {
          const currentToken = get().accessToken;
          if (!currentToken) {
            throw new Error('No access token available');
          }

          const response = await makeAuthRequestWithToken('/me', currentToken);

          if (!response.ok) {
            // Try to refresh token once
            const refreshed = await get().refreshToken();
            if (!refreshed) {
              throw new Error('Authentication failed');
            }

            // Retry with new token
            const newToken = get().accessToken;
            if (!newToken) {
              throw new Error('No new access token');
            }

            const retryResponse = await makeAuthRequestWithToken('/me', newToken);
            if (!retryResponse.ok) {
              throw new Error('Authentication failed after refresh');
            }

            const retryData: MeResponse = await retryResponse.json();
            set({
              user: retryData.user,
              role: retryData.user.role,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } else {
            const data: MeResponse = await response.json();
            set({
              user: data.user,
              role: data.user.role,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          }
        } catch (error) {
          console.warn('Auth check failed:', error);
          set({
            user: null,
            role: UserRole.Public,
            isAuthenticated: false,
            accessToken: null,
            isLoading: false,
            error: null,
          });
        }
      },

      // Switch organization
      switchOrganization: async (organizationId: string): Promise<boolean> => {
        const { accessToken } = get();
        if (!accessToken) {
          set({ error: 'Not authenticated' });
          return false;
        }

        set({ isLoading: true, error: null });

        try {
          const response = await makeAuthRequestWithToken('/switch-org', accessToken, {
            method: 'POST',
            body: JSON.stringify({ organization_id: organizationId }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to switch organization');
          }

          const data: SwitchOrgResponse = await response.json();
          
          // Update the current org in user data
          const currentUser = get().user;
          if (currentUser) {
            const updatedUser: AuthUser = {
              ...currentUser,
              current_org: data.current_org,
            };
            
            set({
              user: updatedUser,
              accessToken: data.access_token,
              isLoading: false,
              error: null,
            });
          }

          return true;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to switch organization';
          set({ 
            error: errorMessage, 
            isLoading: false 
          });
          return false;
        }
      },

      // Setters
      setUser: (user: AuthUser | null) => {
        set({ 
          user, 
          isAuthenticated: !!user,
          role: user?.role || UserRole.Public 
        });
      },

      setRole: (role: UserRole) => set({ role }),
      setLoading: (loading: boolean) => set({ isLoading: loading }),
      setError: (error: string | null) => set({ error }),
      setAccessToken: (token: string | null) => set({ accessToken: token }),

      // Getters
      getCurrentOrg: (): Organization | null => {
        const { user } = get();
        return user?.current_org || null;
      },

      hasRole: (role: UserRole): boolean => {
        const { user } = get();
        return user?.role === role;
      },

      hasOrgRole: (orgRole: string): boolean => {
        const { user } = get();
        if (!user?.current_org || !user.memberships) return false;
        
        const currentMembership = user.memberships.find(
          m => m.organization_id === user.current_org?.id
        );
        
        return currentMembership?.org_role === orgRole;
      },

      canAccessBucket: (bucketName: string): boolean => {
        const { user } = get();
        if (!user) return false;

        // Admin can access everything
        if (user.role === UserRole.Admin) return true;

        // Basic role-based bucket access
        const bucketRoleMap: Record<string, UserRole[]> = {
          'applications': [UserRole.Admin, UserRole.Tenant],
          'documents': [UserRole.Admin, UserRole.Tenant, UserRole.Investor],
          'images': [UserRole.Admin, UserRole.Tenant, UserRole.Investor],
          'presentations': [UserRole.Admin, UserRole.Investor],
          'reports': [UserRole.Admin, UserRole.Investor],
        };

        const allowedRoles = bucketRoleMap[bucketName];
        return allowedRoles ? allowedRoles.includes(user.role) : false;
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        role: state.role,
      }),
    }
  )
);