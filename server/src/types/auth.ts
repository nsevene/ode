export interface User {
  id: string;
  email: string;
  role: 'admin' | 'investor' | 'tenant' | 'public';
  display_name?: string;
  first_name?: string;
  last_name?: string;
  is_active: boolean;
  organization_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Organization {
  id: string;
  name: string;
  display_name?: string;
  slug: string;
  business_type?: string;
  is_active: boolean;
}

export interface Membership {
  id: string;
  organization_id: string;
  user_id: string;
  org_role: 'owner' | 'admin' | 'member' | 'viewer';
  status: 'active' | 'pending' | 'suspended' | 'inactive';
  organization: Organization;
}

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

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  display_name?: string;
  memberships: Membership[];
  current_org?: Organization;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  role: 'tenant' | 'investor';
  first_name?: string;
  last_name?: string;
  display_name?: string;
}

export interface SwitchOrgRequest {
  organization_id: string;
}