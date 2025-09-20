import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

function csvToJson(csv: string) {
  const [head, ...rows] = csv.split('\n').filter(Boolean);
  const headers = head.split(',').map((h) => h.trim());
  return rows.map((line) => {
    const cols = line.split(',');
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => (obj[h] = (cols[i] || '').trim()));
    return obj;
  });
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const csvUrl = Deno.env.get('GSHEETS_MENU_PUBLIC_CSV');
    if (!csvUrl) {
      throw new Error('GSHEETS_MENU_PUBLIC_CSV not set');
    }

    const r = await fetch(csvUrl);
    const text = await r.text();
    const items = csvToJson(text);

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
