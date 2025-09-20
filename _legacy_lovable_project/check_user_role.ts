import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = 'https://ejwjrsgkxxrwlyfohdat.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqd2pyc2dreHhyd2x5Zm9oZGF0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzU0NDg1NywiZXhwIjoyMDY5MTIwODU3fQ.p-U1WEoAb1soC_6iNgny0IJRtWwT_cA3xmx16udKV_0';
const userEmail = 'just0aguest@gmail.com';

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Supabase URL or Service Role Key is missing.');
  Deno.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function checkUserRole() {
  try {
    // 1. Get the user from the auth schema to find their ID
    const { data: { user }, error: authError } = await supabase.auth.admin.getUserByEmail(userEmail);

    if (authError || !user) {
      console.error(`Error fetching user from auth schema for email ${userEmail}:`, authError?.message || 'User not found.');
      return;
    }
    const userId = user.id;
    console.log(`Successfully fetched user ID: ${userId}`);

    // 2. Query the user_roles table with the user ID
    const { data: userRole, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single();

    if (roleError) {
      if (roleError.code === 'PGRST116') {
        console.log(`No role found in 'user_roles' table for user ID ${userId}.`);
        return;
      }
      console.error(`Error fetching role for user ID ${userId}:`, roleError.message);
      return;
    }

    if (userRole) {
      console.log(`✅ The role for user ${userEmail} is: ${userRole.role}`);
    } else {
      console.log(`No role found for user ${userEmail} with ID ${userId}.`);
    }

  } catch (error) {
    // Catch potential errors with getUserByEmail not being a function
    if (error.message.includes('getUserByEmail is not a function')) {
        console.error('Error: The version of supabase-js being used does not support supabase.auth.admin.getUserByEmail(). Please check your dependency versions.');
    } else {
        console.error('An unexpected error occurred:', error.message);
    }
  }
}

checkUserRole();
