export const UserRole = {
  Admin: 'admin',
  Tenant: 'tenant',
  Investor: 'investor',
  Public: 'public',
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export interface User {
  id: string
  email: string
  role: UserRole
  created_at?: string
  updated_at?: string
}

export interface AuthStoreState {
  user: User | null
  role: UserRole
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, role: UserRole) => Promise<boolean>
  logout: () => Promise<void>
  setUser: (user: User | null) => void
  setRole: (role: UserRole) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  checkAuth: () => Promise<void>
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
  role: UserRole
}