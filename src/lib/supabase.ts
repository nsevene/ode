import { createClient } from '@supabase/supabase-js';

// Development configuration - use mock data if no real Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo-key';

// Check if we're using demo credentials
const isDemo = supabaseUrl.includes('demo.supabase.co') || supabaseAnonKey === 'demo-key';

// Create the appropriate client
let supabaseClient: any;
let adminFunctions: any;

if (isDemo) {
  console.log('🔧 Using mock Supabase for development');
  // Use mock implementation
  const mockSupabase = {
    auth: {
      signUp: async (credentials: any) => {
        console.log('Mock signUp:', credentials);
        return {
          data: {
            user: {
              id: 'mock-user-id',
              email: credentials.email,
              created_at: new Date().toISOString()
            },
            session: {
              access_token: 'mock-token',
              refresh_token: 'mock-refresh-token'
            }
          },
          error: null
        };
      },
      signInWithPassword: async (credentials: any) => {
        console.log('Mock signIn:', credentials);
        return {
          data: {
            user: {
              id: 'mock-user-id',
              email: credentials.email,
              created_at: new Date().toISOString()
            },
            session: {
              access_token: 'mock-token',
              refresh_token: 'mock-refresh-token'
            }
          },
          error: null
        };
      },
      signOut: async () => {
        console.log('Mock signOut');
        return { error: null };
      },
      getUser: async () => {
        return {
          data: {
            user: {
              id: 'mock-user-id',
              email: 'admin@odefoodhall.com',
              created_at: new Date().toISOString()
            }
          },
          error: null
        };
      }
    },
    from: (table: string) => ({
      select: (columns: string) => ({
        eq: (column: string, value: any) => ({
          single: async () => {
            console.log(`Mock select from ${table} where ${column} = ${value}`);
            return {
              data: {
                id: 'mock-id',
                email: 'admin@odefoodhall.com',
                full_name: 'System Administrator',
                role: 'admin',
                is_active: true,
                created_at: new Date().toISOString()
              },
              error: null
            };
          },
          limit: (count: number) => ({
            then: async (callback: any) => {
              console.log(`Mock select from ${table} where ${column} = ${value} limit ${count}`);
              return callback({
                data: [{
                  id: 'mock-id',
                  email: 'admin@odefoodhall.com',
                  full_name: 'System Administrator',
                  role: 'admin',
                  is_active: true,
                  created_at: new Date().toISOString()
                }],
                error: null
              });
            }
          })
        }),
        order: (column: string, options: any) => ({
          limit: (count: number) => ({
            then: async (callback: any) => {
              console.log(`Mock select from ${table} order by ${column} limit ${count}`);
              const mockUsers = [
                {
                  id: 'mock-admin-id',
                  email: 'admin@odefoodhall.com',
                  full_name: 'System Administrator',
                  role: 'admin',
                  is_active: true,
                  created_at: new Date().toISOString()
                },
                {
                  id: 'mock-user-id',
                  email: 'user@example.com',
                  full_name: 'John Doe',
                  role: 'guest',
                  is_active: true,
                  created_at: new Date().toISOString()
                }
              ];
              return callback({
                data: mockUsers.slice(0, count),
                error: null
              });
            }
          }),
          then: async (callback: any) => {
            console.log(`Mock select from ${table} order by ${column}`);
            const mockUsers = [
              {
                id: 'mock-admin-id',
                email: 'admin@odefoodhall.com',
                full_name: 'System Administrator',
                role: 'admin',
                is_active: true,
                created_at: new Date().toISOString()
              },
              {
                id: 'mock-user-id',
                email: 'user@example.com',
                full_name: 'John Doe',
                role: 'guest',
                is_active: true,
                created_at: new Date().toISOString()
              }
            ];
            return callback({
              data: mockUsers,
              error: null
            });
          }
        }),
        limit: (count: number) => ({
          then: async (callback: any) => {
            console.log(`Mock select from ${table} limit ${count}`);
            const mockUsers = [
              {
                id: 'mock-admin-id',
                email: 'admin@odefoodhall.com',
                full_name: 'System Administrator',
                role: 'admin',
                is_active: true,
                created_at: new Date().toISOString()
              },
              {
                id: 'mock-user-id',
                email: 'user@example.com',
                full_name: 'John Doe',
                role: 'guest',
                is_active: true,
                created_at: new Date().toISOString()
              }
            ];
            return callback({
              data: mockUsers.slice(0, count),
              error: null
            });
          }
        }),
        then: async (callback: any) => {
          console.log(`Mock select from ${table}`);
          const mockUsers = [
            {
              id: 'mock-admin-id',
              email: 'admin@odefoodhall.com',
              full_name: 'System Administrator',
              role: 'admin',
              is_active: true,
              created_at: new Date().toISOString()
            },
            {
              id: 'mock-user-id',
              email: 'user@example.com',
              full_name: 'John Doe',
              role: 'guest',
              is_active: true,
              created_at: new Date().toISOString()
            }
          ];
          return callback({
            data: mockUsers,
            error: null
          });
        }
      }),
      insert: (data: any) => ({
        then: async (callback: any) => {
          console.log(`Mock insert into ${table}:`, data);
          return callback({
            data: {
              id: 'mock-new-id',
              ...data,
              created_at: new Date().toISOString()
            },
            error: null
          });
        }
      }),
      update: (data: any) => ({
        eq: (column: string, value: any) => ({
          then: async (callback: any) => {
            console.log(`Mock update ${table} set ${JSON.stringify(data)} where ${column} = ${value}`);
            return callback({
              data: { id: value, ...data },
              error: null
            });
          }
        })
      })
    })
  };

  supabaseClient = mockSupabase;
  adminFunctions = {
    async createAdminUser(email: string, password: string, fullName: string) {
      console.log('Mock createAdminUser:', { email, fullName });
      return {
        data: {
          id: 'mock-admin-id',
          email,
          full_name: fullName,
          role: 'admin',
          is_active: true,
          created_at: new Date().toISOString()
        },
        error: null
      };
    },

    async getAllUsers() {
      console.log('Mock getAllUsers');
      return {
        data: [
          {
            id: 'mock-admin-id',
            email: 'admin@odefoodhall.com',
            full_name: 'System Administrator',
            role: 'admin',
            is_active: true,
            created_at: new Date().toISOString()
          },
          {
            id: 'mock-user-id',
            email: 'user@example.com',
            full_name: 'John Doe',
            role: 'guest',
            is_active: true,
            created_at: new Date().toISOString()
          }
        ],
        error: null
      };
    },

    async updateUserRole(userId: string, newRole: string) {
      console.log('Mock updateUserRole:', { userId, newRole });
      return {
        data: { id: userId, role: newRole },
        error: null
      };
    },

    async toggleUserStatus(userId: string, isActive: boolean) {
      console.log('Mock toggleUserStatus:', { userId, isActive });
      return {
        data: { id: userId, is_active: !isActive },
        error: null
      };
    }
  };
} else {
  // Use real Supabase
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });

  adminFunctions = {
    // Create user with admin role
    async createAdminUser(email: string, password: string, fullName: string) {
      try {
        const { data, error } = await supabaseClient
          .from('profiles')
          .insert({
            email,
            full_name: fullName,
            role: 'admin',
            is_active: true
          });

        if (error) throw error;
        return { data, error: null };
      } catch (error) {
        console.error('Error creating admin user:', error);
        return { data: null, error };
      }
    },

    // Get all users (admin only)
    async getAllUsers() {
      try {
        const { data, error } = await supabaseClient
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        return { data, error: null };
      } catch (error) {
        console.error('Error fetching users:', error);
        return { data: null, error };
      }
    },

    // Update user role
    async updateUserRole(userId: string, newRole: string) {
      try {
        const { data, error } = await supabaseClient
          .from('profiles')
          .update({ role: newRole })
          .eq('id', userId);

        if (error) throw error;
        return { data, error: null };
      } catch (error) {
        console.error('Error updating user role:', error);
        return { data: null, error };
      }
    },

    // Toggle user active status
    async toggleUserStatus(userId: string, isActive: boolean) {
      try {
        const { data, error } = await supabaseClient
          .from('profiles')
          .update({ is_active: !isActive })
          .eq('id', userId);

        if (error) throw error;
        return { data, error: null };
      } catch (error) {
        console.error('Error updating user status:', error);
        return { data: null, error };
      }
    }
  };
}

// Export the configured client and functions
export const supabase = supabaseClient;
export { adminFunctions };
