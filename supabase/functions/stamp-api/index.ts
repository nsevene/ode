import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Log all requests for security monitoring
  console.log('Stamp API request:', {
    method: req.method,
    url: req.url,
    timestamp: new Date().toISOString(),
    userAgent: req.headers.get('user-agent'),
    origin: req.headers.get('origin'),
  });

  try {
    const url = new URL(req.url);
    const action = url.pathname.split('/').pop();

    if (req.method === 'POST') {
      switch (action) {
        case 'collect-stamp':
          return await collectStamp(req);
        case 'verify-token':
          return await verifyToken(req);
        default:
          return new Response('Not found', {
            status: 404,
            headers: corsHeaders,
          });
      }
    }

    if (req.method === 'GET') {
      switch (action) {
        case 'progress':
          return await getProgress(req);
        case 'leaderboard':
          return await getLeaderboard(req);
        default:
          return new Response('Not found', {
            status: 404,
            headers: corsHeaders,
          });
      }
    }

    return new Response('Method not allowed', {
      status: 405,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function collectStamp(req: Request) {
  try {
    const body = await req.json();
    const { guest_id, zone_name, source = 'web', nfc_tag_id, jwt_token } = body;

    if (!guest_id || !zone_name) {
      return new Response(
        JSON.stringify({ error: 'guest_id and zone_name are required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Verify zone name is valid
    const validZones = [
      'ferment',
      'smoke',
      'spice',
      'umami',
      'sweet-salt',
      'sour-herb',
      'zero-waste',
    ];
    if (!validZones.includes(zone_name)) {
      return new Response(JSON.stringify({ error: 'Invalid zone name' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Use service role for database operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Call the database function to process stamp
    const { data, error } = await supabaseAdmin.rpc('process_guest_stamp', {
      p_guest_id: guest_id,
      p_zone_name: zone_name,
      p_source: source,
      p_nfc_tag_id: nfc_tag_id,
      p_jwt_token: jwt_token,
    });

    if (error) {
      console.error('Database error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to process stamp' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Collect stamp error:', error);
    return new Response(JSON.stringify({ error: 'Invalid request body' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function getProgress(req: Request) {
  try {
    const url = new URL(req.url);
    const guest_id = url.searchParams.get('guest_id');

    if (!guest_id) {
      return new Response(
        JSON.stringify({ error: 'guest_id parameter is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Use service role for database operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { data, error } = await supabaseAdmin.rpc('get_guest_progress', {
      p_guest_id: guest_id,
    });

    if (error) {
      console.error('Database error:', error);
      return new Response(JSON.stringify({ error: 'Failed to get progress' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Get progress error:', error);
    return new Response(JSON.stringify({ error: 'Failed to get progress' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function verifyToken(req: Request) {
  try {
    const body = await req.json();
    const { token } = body;

    if (!token) {
      return new Response(JSON.stringify({ error: 'token is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Here you would verify the JWT token
    // For now, we'll return a simple validation
    // In production, you should verify the JWT signature

    try {
      // Simple token validation (replace with proper JWT verification)
      const decoded = atob(token.split('.')[1]);
      const payload = JSON.parse(decoded);

      return new Response(
        JSON.stringify({
          valid: true,
          payload: payload,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({ valid: false, error: 'Invalid token format' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
  } catch (error) {
    console.error('Verify token error:', error);
    return new Response(JSON.stringify({ error: 'Invalid request body' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function getLeaderboard(req: Request) {
  try {
    // Use service role for database operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { data, error } = await supabaseAdmin
      .from('guest_profiles')
      .select('guest_id, total_stamps, current_streak, registration_date')
      .order('total_stamps', { ascending: false })
      .order('current_streak', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Database error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to get leaderboard' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(JSON.stringify({ leaderboard: data }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to get leaderboard' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
}
