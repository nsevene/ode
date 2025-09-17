import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { apiClient } from '@/lib/api-client';
import { USER_ROLES } from '@/lib/constants';

// Types
interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface UserState {
  // Data
  users: User[];
  currentUser: User | null;
  selectedUser: User | null;
  
  // UI State
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
  
  // Filters and pagination
  filters: {
    role?: string;
    is_active?: boolean;
    search?: string;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  
  // Actions
  setUsers: (users: User[]) => void;
  setCurrentUser: (user: User | null) => void;
  setSelectedUser: (user: User | null) => void;
  
  // Loading states
  setLoading: (loading: boolean) => void;
  setCreating: (creating: boolean) => void;
  setUpdating: (updating: boolean) => void;
  setDeleting: (deleting: boolean) => void;
  setError: (error: string | null) => void;
  
  // Filters
  setFilters: (filters: Partial<UserState['filters']>) => void;
  clearFilters: () => void;
  
  // Pagination
  setPagination: (pagination: Partial<UserState['pagination']>) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  
  // CRUD operations
  fetchUsers: () => Promise<void>;
  createUser: (userData: Omit<User, 'id' | 'created_at' | 'updated_at'>) => Promise<User | null>;
  updateUser: (id: string, userData: Partial<User>) => Promise<User | null>;
  deleteUser: (id: string) => Promise<boolean>;
  promoteToAdmin: (id: string) => Promise<boolean>;
  demoteFromAdmin: (id: string) => Promise<boolean>;
  
  // Utility
  getUserById: (id: string) => User | null;
  getUsersByRole: (role: string) => User[];
  getActiveUsers: () => User[];
  clearUsers: () => void;
}

// Initial state
const initialState = {
  users: [],
  currentUser: null,
  selectedUser: null,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  filters: {},
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  }
};

// Store
export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        
        // Data setters
        setUsers: (users: User[]) => {
          set((state) => {
            state.users = users;
          });
        },
        
        setCurrentUser: (user: User | null) => {
          set((state) => {
            state.currentUser = user;
          });
        },
        
        setSelectedUser: (user: User | null) => {
          set((state) => {
            state.selectedUser = user;
          });
        },
        
        // Loading states
        setLoading: (loading: boolean) => {
          set((state) => {
            state.isLoading = loading;
          });
        },
        
        setCreating: (creating: boolean) => {
          set((state) => {
            state.isCreating = creating;
          });
        },
        
        setUpdating: (updating: boolean) => {
          set((state) => {
            state.isUpdating = updating;
          });
        },
        
        setDeleting: (deleting: boolean) => {
          set((state) => {
            state.isDeleting = deleting;
          });
        },
        
        setError: (error: string | null) => {
          set((state) => {
            state.error = error;
          });
        },
        
        // Filters
        setFilters: (filters: Partial<UserState['filters']>) => {
          set((state) => {
            state.filters = { ...state.filters, ...filters };
          });
        },
        
        clearFilters: () => {
          set((state) => {
            state.filters = {};
          });
        },
        
        // Pagination
        setPagination: (pagination: Partial<UserState['pagination']>) => {
          set((state) => {
            state.pagination = { ...state.pagination, ...pagination };
          });
        },
        
        setPage: (page: number) => {
          set((state) => {
            state.pagination.page = page;
          });
        },
        
        setLimit: (limit: number) => {
          set((state) => {
            state.pagination.limit = limit;
            state.pagination.page = 1; // Reset to first page
          });
        },
        
        // CRUD operations
        fetchUsers: async () => {
          const state = get();
          set((state) => {
            state.isLoading = true;
            state.error = null;
          });
          
          try {
            const response = await apiClient.supabaseQuery<User>('profiles', {
              select: '*',
              filters: state.filters,
              order: { column: 'created_at', ascending: false },
              limit: state.pagination.limit,
              offset: (state.pagination.page - 1) * state.pagination.limit
            });
            
            if (response.success && response.data) {
              set((state) => {
                state.users = response.data!;
                state.pagination.total = response.data!.length;
                state.pagination.totalPages = Math.ceil(state.pagination.total / state.pagination.limit);
              });
            } else {
              set((state) => {
                state.error = response.error || 'Failed to fetch users';
              });
            }
          } catch (error) {
            set((state) => {
              state.error = error instanceof Error ? error.message : 'Unknown error';
            });
          } finally {
            set((state) => {
              state.isLoading = false;
            });
          }
        },
        
        createUser: async (userData: Omit<User, 'id' | 'created_at' | 'updated_at'>) => {
          set((state) => {
            state.isCreating = true;
            state.error = null;
          });
          
          try {
            const response = await apiClient.supabaseInsert<User>('profiles', userData);
            
            if (response.success && response.data) {
              set((state) => {
                state.users.unshift(response.data!);
              });
              return response.data;
            } else {
              set((state) => {
                state.error = response.error || 'Failed to create user';
              });
              return null;
            }
          } catch (error) {
            set((state) => {
              state.error = error instanceof Error ? error.message : 'Unknown error';
            });
            return null;
          } finally {
            set((state) => {
              state.isCreating = false;
            });
          }
        },
        
        updateUser: async (id: string, userData: Partial<User>) => {
          set((state) => {
            state.isUpdating = true;
            state.error = null;
          });
          
          try {
            const response = await apiClient.supabaseUpdate<User>('profiles', id, userData);
            
            if (response.success && response.data) {
              set((state) => {
                const index = state.users.findIndex(user => user.id === id);
                if (index !== -1) {
                  state.users[index] = response.data!;
                }
              });
              return response.data;
            } else {
              set((state) => {
                state.error = response.error || 'Failed to update user';
              });
              return null;
            }
          } catch (error) {
            set((state) => {
              state.error = error instanceof Error ? error.message : 'Unknown error';
            });
            return null;
          } finally {
            set((state) => {
              state.isUpdating = false;
            });
          }
        },
        
        deleteUser: async (id: string) => {
          set((state) => {
            state.isDeleting = true;
            state.error = null;
          });
          
          try {
            const response = await apiClient.supabaseDelete<User>('profiles', id);
            
            if (response.success) {
              set((state) => {
                state.users = state.users.filter(user => user.id !== id);
              });
              return true;
            } else {
              set((state) => {
                state.error = response.error || 'Failed to delete user';
              });
              return false;
            }
          } catch (error) {
            set((state) => {
              state.error = error instanceof Error ? error.message : 'Unknown error';
            });
            return false;
          } finally {
            set((state) => {
              state.isDeleting = false;
            });
          }
        },
        
        promoteToAdmin: async (id: string) => {
          set((state) => {
            state.isUpdating = true;
            state.error = null;
          });
          
          try {
            const response = await apiClient.supabaseInsert('user_roles', {
              user_id: id,
              role: USER_ROLES.ADMIN
            });
            
            if (response.success) {
              set((state) => {
                const user = state.users.find(u => u.id === id);
                if (user) {
                  user.role = USER_ROLES.ADMIN;
                }
              });
              return true;
            } else {
              set((state) => {
                state.error = response.error || 'Failed to promote user to admin';
              });
              return false;
            }
          } catch (error) {
            set((state) => {
              state.error = error instanceof Error ? error.message : 'Unknown error';
            });
            return false;
          } finally {
            set((state) => {
              state.isUpdating = false;
            });
          }
        },
        
        demoteFromAdmin: async (id: string) => {
          set((state) => {
            state.isUpdating = true;
            state.error = null;
          });
          
          try {
            const response = await apiClient.supabaseDelete('user_roles', id);
            
            if (response.success) {
              set((state) => {
                const user = state.users.find(u => u.id === id);
                if (user) {
                  user.role = USER_ROLES.GUEST;
                }
              });
              return true;
            } else {
              set((state) => {
                state.error = response.error || 'Failed to demote user from admin';
              });
              return false;
            }
          } catch (error) {
            set((state) => {
              state.error = error instanceof Error ? error.message : 'Unknown error';
            });
            return false;
          } finally {
            set((state) => {
              state.isUpdating = false;
            });
          }
        },
        
        // Utility functions
        getUserById: (id: string) => {
          const state = get();
          return state.users.find(user => user.id === id) || null;
        },
        
        getUsersByRole: (role: string) => {
          const state = get();
          return state.users.filter(user => user.role === role);
        },
        
        getActiveUsers: () => {
          const state = get();
          return state.users.filter(user => user.is_active);
        },
        
        clearUsers: () => {
          set((state) => {
            state.users = [];
            state.currentUser = null;
            state.selectedUser = null;
          });
        }
      })),
      {
        name: 'user-store',
        partialize: (state) => ({
          currentUser: state.currentUser,
          filters: state.filters,
          pagination: state.pagination
        })
      }
    ),
    {
      name: 'user-store'
    }
  )
);

// Selectors
export const useUsers = () => useUserStore((state) => state.users);
export const useCurrentUser = () => useUserStore((state) => state.currentUser);
export const useSelectedUser = () => useUserStore((state) => state.selectedUser);
export const useUserLoading = () => useUserStore((state) => state.isLoading);
export const useUserCreating = () => useUserStore((state) => state.isCreating);
export const useUserUpdating = () => useUserStore((state) => state.isUpdating);
export const useUserDeleting = () => useUserStore((state) => state.isDeleting);
export const useUserError = () => useUserStore((state) => state.error);
export const useUserFilters = () => useUserStore((state) => state.filters);
export const useUserPagination = () => useUserStore((state) => state.pagination);

// Actions
export const useUserActions = () => useUserStore((state) => ({
  setUsers: state.setUsers,
  setCurrentUser: state.setCurrentUser,
  setSelectedUser: state.setSelectedUser,
  setLoading: state.setLoading,
  setCreating: state.setCreating,
  setUpdating: state.setUpdating,
  setDeleting: state.setDeleting,
  setError: state.setError,
  setFilters: state.setFilters,
  clearFilters: state.clearFilters,
  setPagination: state.setPagination,
  setPage: state.setPage,
  setLimit: state.setLimit,
  fetchUsers: state.fetchUsers,
  createUser: state.createUser,
  updateUser: state.updateUser,
  deleteUser: state.deleteUser,
  promoteToAdmin: state.promoteToAdmin,
  demoteFromAdmin: state.demoteFromAdmin,
  getUserById: state.getUserById,
  getUsersByRole: state.getUsersByRole,
  getActiveUsers: state.getActiveUsers,
  clearUsers: state.clearUsers
}));
