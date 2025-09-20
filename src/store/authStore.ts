import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import { UserRole } from '../types/auth'

interface User {
  id: string
  email: string
  role: UserRole
  created_at?: string
  updated_at?: string
}

interface AuthStoreState {
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

export const useAuthStore = create<AuthStoreState>((set, get) => ({
  user: null,
  role: UserRole.Public,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null })
    try {
      // Demo mode - simulate login
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      
      // Mock user data for demo
      const mockUser = {
        id: 'demo-user-id',
        email: email,
        role: email.includes('admin') ? UserRole.Admin : 
              email.includes('tenant') ? UserRole.Tenant : 
              email.includes('investor') ? UserRole.Investor : UserRole.Public,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      set({ 
        user: mockUser,
        role: mockUser.role,
        isAuthenticated: true,
        isLoading: false 
      })
      return true
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Login failed', isLoading: false })
      return false
    }
  },

  register: async (email: string, password: string, role: UserRole) => {
    set({ isLoading: true, error: null })
    try {
      // Demo mode - simulate registration
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      
      // Mock user data for demo
      const mockUser = {
        id: 'demo-user-id',
        email: email,
        role: role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      set({ 
        user: mockUser,
        role: role,
        isAuthenticated: true,
        isLoading: false 
      })
      return true
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Registration failed', isLoading: false })
      return false
    }
  },

  logout: async () => {
    set({ isLoading: true })
    try {
      // Demo mode - simulate logout
      await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API call
      
      set({ 
        user: null, 
        role: UserRole.Public,
        isAuthenticated: false,
        isLoading: false, 
        error: null 
      })
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Logout failed', isLoading: false })
    }
  },

  checkAuth: async () => {
    set({ isLoading: true })
    try {
      // Demo mode - check if user is already logged in
      const existingUser = get().user
      
      if (existingUser) {
        set({ 
          user: existingUser,
          role: existingUser.role,
          isAuthenticated: true,
          isLoading: false 
        })
      } else {
        set({ 
          user: null, 
          role: UserRole.Public,
          isAuthenticated: false,
          isLoading: false 
        })
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Auth check failed', 
        isLoading: false 
      })
    }
  },

  setUser: (user: User | null) => {
    set({ user, isAuthenticated: !!user })
    if (user) {
      set({ role: user.role })
    } else {
      set({ role: UserRole.Public })
    }
  },
  
  setRole: (role: UserRole) => set({ role }),
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  setError: (error: string | null) => set({ error }),
}))