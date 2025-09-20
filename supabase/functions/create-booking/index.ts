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

    const { 
      event_id, 
      user_name, 
      user_email, 
      user_phone, 
      special_requests,
      guests_count = 1 
    } = await req.json()

    // Validate required fields
    if (!event_id || !user_name || !user_email) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Missing required fields: event_id, user_name, user_email',
          timestamp: new Date().toISOString()
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        },
      )
    }

    // Check if event exists and is available
    const { data: event, error: eventError } = await supabaseClient
      .from('events')
      .select('id, title, max_attendees, current_attendees, is_public')
      .eq('id', event_id)
      .eq('is_public', true)
      .single()

    if (eventError || !event) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Event not found or not available',
          timestamp: new Date().toISOString()
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404,
        },
      )
    }

    // Check availability
    if (event.current_attendees + guests_count > event.max_attendees) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Not enough spots available',
          timestamp: new Date().toISOString()
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        },
      )
    }

    // Create booking
    const { data: booking, error: bookingError } = await supabaseClient
      .from('bookings')
      .insert({
        event_id,
        user_name,
        user_email,
        user_phone,
        special_requests,
        guests_count,
        status: 'confirmed',
        booking_date: new Date().toISOString()
      })
      .select()
      .single()

    if (bookingError) {
      throw bookingError
    }

    // Update event attendees count
    const { error: updateError } = await supabaseClient
      .from('events')
      .update({ 
        current_attendees: event.current_attendees + guests_count 
      })
      .eq('id', event_id)

    if (updateError) {
      // Rollback booking if update fails
      await supabaseClient
        .from('bookings')
        .delete()
        .eq('id', booking.id)
      
      throw updateError
    }

    // Send confirmation email (simulated)
    console.log(`Booking confirmation email sent to ${user_email} for event ${event.title}`)

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          booking_id: booking.id,
          event_title: event.title,
          confirmation_number: `BK${booking.id.toString().padStart(6, '0')}`,
          status: booking.status
        },
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 201,
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