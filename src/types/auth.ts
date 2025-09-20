export const UserRole = {
  Admin: 'admin',
  Tenant: 'tenant',
  Investor: 'investor',
  Public: 'public',
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

// Base user interface
export interface User {
  id: string;
  email: string;
  role: UserRole;
  display_name?: string;
  first_name?: string;
  last_name?: string;
  is_active: boolean;
  organization_id?: string;
  created_at?: string;
  updated_at?: string;
}

// Organization interface
export interface Organization {
  id: string;
  name: string;
  display_name?: string;
  slug: string;
  business_type?: string;
  is_active: boolean;
}

// Organization membership interface
export interface Membership {
  id: string;
  organization_id: string;
  user_id: string;
  org_role: 'owner' | 'admin' | 'member' | 'viewer';
  status: 'active' | 'pending' | 'suspended' | 'inactive';
  organization: Organization;
}

// JWT Claims structure
export interface JWTClaims {
  sub: string;           // user id
  email: string;
  role: string;          // system role (admin, investor, tenant)
  orgs: Array<{          // organizations user belongs to
    id: string;
    role: string;        // org role (owner, admin, member, viewer)
  }>;
  current_org?: string;  // currently selected organization id
  iat: number;
  exp: number;
}

// Enhanced auth user with memberships and current org
export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  display_name?: string;
  memberships: Membership[];
  current_org?: Organization;
}

// Request/Response interfaces
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  role: UserRole;
  first_name?: string;
  last_name?: string;
  display_name?: string;
}

export interface LoginResponse {
  success: boolean;
  user: AuthUser;
  access_token: string;
}

export interface RegisterResponse {
  success: boolean;
  user: AuthUser;
  access_token: string;
}

export interface RefreshResponse {
  success: boolean;
  access_token: string;
}

export interface MeResponse {
  success: boolean;
  user: AuthUser;
}

export interface SwitchOrgRequest {
  organization_id: string;
}

export interface SwitchOrgResponse {
  success: boolean;
  access_token: string;
  current_org: Organization;
}

// Auth store interface
export interface AuthStoreState {
  // User state
  user: AuthUser | null;
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  accessToken: string | null;

  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, role: UserRole, firstName?: string, lastName?: string, displayName?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  checkAuth: () => Promise<void>;
  switchOrganization: (organizationId: string) => Promise<boolean>;
  
  // Setters
  setUser: (user: AuthUser | null) => void;
  setRole: (role: UserRole) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setAccessToken: (token: string | null) => void;

  // Getters
  getCurrentOrg: () => Organization | null;
  hasRole: (role: UserRole) => boolean;
  hasOrgRole: (orgRole: string) => boolean;
  canAccessBucket: (bucketName: string) => boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  role: UserRole;
  first_name?: string;
  last_name?: string;
  display_name?: string;
}