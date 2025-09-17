import { createClient } from '@supabase/supabase-js';

// Production configuration - use real Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ejwjrsgkxxrwlyfohdat.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqd2pyc2dreHhyd2x5Zm9oZGF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM1NDQ4NTcsImV4cCI6MjA2OTEyMDg1N30.ayt6cFCW0m9uXbYV73yb-TusfcQehWzMQpP8t3eXqdg';

// Create real Supabase client
const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

const adminFunctions = {
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
  },

  // Find user by email
  async findUserByEmail(email: string) {
    try {
      const { data, error } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('email', email)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error finding user by email:', error);
      return { data: null, error };
    }
  }
};

// Export the configured client and functions
export const supabase = supabaseClient;
export { adminFunctions };
