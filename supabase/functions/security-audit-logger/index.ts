import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { event_type, user_id, details, ip_address, user_agent, timestamp } =
      await req.json();

    // Log security event for monitoring
    console.log('Security Event Received:', {
      event_type,
      user_id,
      timestamp,
      ip_address,
      user_agent: user_agent?.substring(0, 100), // Truncate long user agents
      details_keys: details ? Object.keys(details) : [],
    });

    // Get client IP from headers if not provided
    const clientIP =
      ip_address ||
      req.headers.get('x-forwarded-for') ||
      req.headers.get('cf-connecting-ip') ||
      'unknown';

    // Store security event (if needed for compliance)
    // const { error } = await supabase
    //   .from('security_events')
    //   .insert({
    //     event_type,
    //     user_id,
    //     details,
    //     ip_address: clientIP,
    //     user_agent,
    //     timestamp: timestamp || new Date().toISOString()
    //   })

    // For now, just log to console for monitoring
    console.log('Security audit:', {
      type: event_type,
      user: user_id,
      ip: clientIP,
      time: timestamp,
      details,
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Security event logged',
        event_id: crypto.randomUUID(),
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Security logging error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Failed to log security event',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
