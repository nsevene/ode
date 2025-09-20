import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

/**
 * Handles CORS preflight requests and sets the appropriate headers for
 * cross-origin resource sharing.
 * @param {Request} req The incoming request object.
 * @returns {Response | null} A response for the OPTIONS request or null.
 */
function handleCors(req: Request): Response | null {
  const allowedOrigins = [
    'https://www.odefoodhall.com',
    'https://framer.com',
    'http://localhost:8080', // For local development
    'http://127.0.0.1:8080',
  ];
  const origin = req.headers.get('Origin') || '';
  const corsHeaders: { [key: string]: string } = {
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
  };

  if (allowedOrigins.includes(origin)) {
    corsHeaders['Access-Control-Allow-Origin'] = origin;
  }

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  return null;
}

/**
 * Supabase Edge Function to get public information about active tenants.
 * @returns {Response} A JSON response containing a list of public tenants or an error message.
 */
serve(async (req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) {
    return corsResponse;
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase environment variables.');
    }

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: req.headers.get('Authorization')! } },
    });

    const { data: tenants, error } = await supabaseClient
      .from('tenants')
      .select('id, name, logo_url, cuisine_type, short_description')
      .eq('is_active', true);

    if (error) {
      console.error('Supabase query error:', error);
      throw error;
    }

    return new Response(JSON.stringify({ tenants }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error fetching public tenants:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
