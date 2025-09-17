import { createClient } from '@supabase/supabase-js';

// Development configuration - use mock data if no real Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo-key';

// Check if we're using demo credentials
const isDemo = supabaseUrl.includes('demo.supabase.co') || supabaseAnonKey === 'demo-key';

if (isDemo) {
  console.log('🔧 Using mock Supabase for development');
  // Import and use mock
  const { supabase: mockSupabase, adminFunctions: mockAdminFunctions } = await import('./supabase-mock');
  export { mockSupabase as supabase, mockAdminFunctions as adminFunctions };
} else {
  // Use real Supabase
  export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });

  // Admin functions for user management
  export const adminFunctions = {
    // Create user with admin role
    async createAdminUser(email: string, password: string, fullName: string) {
      try {
        // This would typically be done server-side with service role key
        // For now, we'll create a profile and let the user sign up normally
        const { data, error } = await supabase
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
        const { data, error } = await supabase
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
        const { data, error } = await supabase
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
        const { data, error } = await supabase
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