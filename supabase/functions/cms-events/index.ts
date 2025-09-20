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
    const apiKey = Deno.env.get('AIRTABLE_API_KEY')!;
    const baseId = Deno.env.get('AIRTABLE_BASE_ID')!;
    const table = Deno.env.get('AIRTABLE_TABLE_EVENTS') || 'Events';

    const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(table)}?sort%5B0%5D%5Bfield%5D=Date&sort%5B0%5D%5Bdirection%5D=asc`;
    const r = await fetch(url, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    const json = await r.json();

    const items = (json.records || []).map((rec: any) => ({
      id: rec.id,
      title: rec.fields.Title,
      date: rec.fields.Date,
      time: rec.fields.Time,
      price: rec.fields.Price,
      venue: rec.fields.Venue,
      category: rec.fields.Category,
      age21: !!rec.fields.Age21,
      cta: rec.fields.CTA || '/events',
    }));

    return new Response(JSON.stringify({ items }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
        'Cache-Control': 's-maxage=120, stale-while-revalidate',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
