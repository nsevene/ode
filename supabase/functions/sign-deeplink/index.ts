import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { create } from "https://deno.land/x/djwt@v2.8/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Log incoming request for security monitoring
    console.log('Deeplink signing request:', {
      method: req.method,
      url: req.url,
      timestamp: new Date().toISOString(),
      userAgent: req.headers.get('user-agent')
    });
    const url = new URL(req.url);
    const zone = url.searchParams.get('zone');
    const guest_id = url.searchParams.get('guest_id');
    const source = url.searchParams.get('source') || 'nfc';
    
    if (!zone) {
      throw new Error('zone parameter required');
    }

    const secret = Deno.env.get('JWT_SECRET')!;
    const ttlHours = Number(Deno.env.get('JWT_TTL_HOURS') || 48);
    
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign", "verify"]
    );

    const payload = { zone, source, ...(guest_id && { guest_id }) };
    const token = await create({ alg: "HS256", typ: "JWT" }, payload, key);

    return new Response(
      JSON.stringify({ token }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json'
        } 
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})