// Mock Supabase client for development
export const supabase = {
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
        }
      }),
      order: (column: string, options: any) => ({
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
      })
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

// Mock admin functions
export const adminFunctions = {
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
