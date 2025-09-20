import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.52.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

interface RoleManagementRequest {
  action: 'assign' | 'revoke' | 'list' | 'check';
  userEmail?: string;
  userId?: string;
  role?: 'admin' | 'tenant' | 'investor' | 'internal' | 'guest';
  targetUserEmail?: string;
  targetUserId?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', {
      status: 405,
      headers: corsHeaders,
    });
  }

  try {
    const {
      action,
      userEmail,
      userId,
      role,
      targetUserEmail,
      targetUserId,
    }: RoleManagementRequest = await req.json();

    // Initialize Supabase with service role key for secure operations
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Get the requesting user's role
    const requestingUser = await getRequestingUser(req, supabase);
    if (!requestingUser) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    const requestingUserRole = await getUserRole(requestingUser.id, supabase);

    // Only admins can manage roles
    if (requestingUserRole !== 'admin') {
      return new Response(
        JSON.stringify({
          error: 'Insufficient permissions. Admin role required.',
        }),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    console.log(
      `Processing role management action: ${action} by user: ${requestingUser.email}`
    );

    switch (action) {
      case 'assign':
        return await assignRole(
          supabase,
          targetUserEmail,
          targetUserId,
          role!,
          corsHeaders
        );

      case 'revoke':
        return await revokeRole(
          supabase,
          targetUserEmail,
          targetUserId,
          role!,
          corsHeaders
        );

      case 'list':
        return await listUserRoles(supabase, corsHeaders);

      case 'check':
        return await checkUserRole(
          supabase,
          targetUserEmail,
          targetUserId,
          corsHeaders
        );

      default:
        return new Response(
          JSON.stringify({
            error:
              'Invalid action. Supported actions: assign, revoke, list, check',
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          }
        );
    }
  } catch (error: any) {
    console.error('Error in user-roles-management function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

// Helper function to get the requesting user
async function getRequestingUser(req: Request, supabase: any) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return null;
  }

  const token = authHeader.replace('Bearer ', '');
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    return null;
  }

  return user;
}

// Helper function to get user role
async function getUserRole(userId: string, supabase: any): Promise<string> {
  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    return 'guest';
  }

  return data.role;
}

// Assign role to user
async function assignRole(
  supabase: any,
  userEmail?: string,
  userId?: string,
  role?: string,
  corsHeaders: any
) {
  if (!role) {
    return new Response(
      JSON.stringify({ error: 'Role is required for assignment' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }

  let targetUserId = userId;

  // If email provided, get user ID
  if (userEmail && !userId) {
    const { data: userData, error: userError } =
      await supabase.auth.admin.getUserByEmail(userEmail);
    if (userError || !userData.user) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
    targetUserId = userData.user.id;
  }

  if (!targetUserId) {
    return new Response(
      JSON.stringify({ error: 'User ID or email is required' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }

  // Insert or update role
  const { data, error } = await supabase
    .from('user_roles')
    .upsert(
      {
        user_id: targetUserId,
        role: role,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'user_id,role',
      }
    )
    .select()
    .single();

  if (error) {
    console.error('Error assigning role:', error);
    return new Response(JSON.stringify({ error: 'Failed to assign role' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // Log the role assignment
  await supabase.from('security_logs').insert({
    violation_type: 'role_assignment',
    user_id: targetUserId,
    details: {
      action: 'assign',
      role: role,
      assigned_by: 'admin',
      timestamp: new Date().toISOString(),
    },
  });

  return new Response(
    JSON.stringify({
      success: true,
      message: `Role ${role} assigned successfully`,
      user_id: targetUserId,
      role: role,
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    }
  );
}

// Revoke role from user
async function revokeRole(
  supabase: any,
  userEmail?: string,
  userId?: string,
  role?: string,
  corsHeaders: any
) {
  if (!role) {
    return new Response(
      JSON.stringify({ error: 'Role is required for revocation' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }

  let targetUserId = userId;

  // If email provided, get user ID
  if (userEmail && !userId) {
    const { data: userData, error: userError } =
      await supabase.auth.admin.getUserByEmail(userEmail);
    if (userError || !userData.user) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
    targetUserId = userData.user.id;
  }

  if (!targetUserId) {
    return new Response(
      JSON.stringify({ error: 'User ID or email is required' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }

  // Delete role
  const { error } = await supabase
    .from('user_roles')
    .delete()
    .eq('user_id', targetUserId)
    .eq('role', role);

  if (error) {
    console.error('Error revoking role:', error);
    return new Response(JSON.stringify({ error: 'Failed to revoke role' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // Log the role revocation
  await supabase.from('security_logs').insert({
    violation_type: 'role_revocation',
    user_id: targetUserId,
    details: {
      action: 'revoke',
      role: role,
      revoked_by: 'admin',
      timestamp: new Date().toISOString(),
    },
  });

  return new Response(
    JSON.stringify({
      success: true,
      message: `Role ${role} revoked successfully`,
      user_id: targetUserId,
      role: role,
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    }
  );
}

// List all user roles
async function listUserRoles(supabase: any, corsHeaders: any) {
  const { data, error } = await supabase
    .from('user_roles')
    .select(
      `
      id,
      user_id,
      role,
      created_at,
      updated_at,
      profiles:user_id (
        id,
        email,
        full_name
      )
    `
    )
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error listing user roles:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to list user roles' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }

  return new Response(
    JSON.stringify({
      success: true,
      roles: data,
      count: data.length,
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    }
  );
}

// Check user role
async function checkUserRole(
  supabase: any,
  userEmail?: string,
  userId?: string,
  corsHeaders: any
) {
  let targetUserId = userId;

  // If email provided, get user ID
  if (userEmail && !userId) {
    const { data: userData, error: userError } =
      await supabase.auth.admin.getUserByEmail(userEmail);
    if (userError || !userData.user) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
    targetUserId = userData.user.id;
  }

  if (!targetUserId) {
    return new Response(
      JSON.stringify({ error: 'User ID or email is required' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }

  const { data, error } = await supabase
    .from('user_roles')
    .select('role, created_at, updated_at')
    .eq('user_id', targetUserId);

  if (error) {
    console.error('Error checking user role:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to check user role' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }

  return new Response(
    JSON.stringify({
      success: true,
      user_id: targetUserId,
      roles: data,
      primary_role: data.length > 0 ? data[0].role : 'guest',
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    }
  );
}

serve(handler);
