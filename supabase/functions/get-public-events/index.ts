import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    // Get query parameters
    const url = new URL(req.url)
    const limit = parseInt(url.searchParams.get('limit') || '10')
    const category = url.searchParams.get('category')
    const date_from = url.searchParams.get('date_from')
    const date_to = url.searchParams.get('date_to')

    // Build query
    let query = supabaseClient
      .from('events')
      .select(`
        id,
        title,
        description,
        event_date,
        start_time,
        end_time,
        location,
        category,
        image_url,
        max_attendees,
        current_attendees,
        price,
        is_public,
        registration_required
      `)
      .eq('is_public', true)
      .gte('event_date', new Date().toISOString().split('T')[0]) // Only future events
      .order('event_date', { ascending: true })
      .order('start_time', { ascending: true })
      .limit(limit)

    // Apply filters
    if (category) {
      query = query.eq('category', category)
    }
    if (date_from) {
      query = query.gte('event_date', date_from)
    }
    if (date_to) {
      query = query.lte('event_date', date_to)
    }

    const { data: events, error } = await query

    if (error) {
      throw error
    }

    // Add availability status
    const eventsWithAvailability = events.map(event => ({
      ...event,
      is_available: event.current_attendees < event.max_attendees,
      spots_remaining: event.max_attendees - event.current_attendees
    }))

    return new Response(
      JSON.stringify({
        success: true,
        data: eventsWithAvailability,
        count: eventsWithAvailability.length,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})