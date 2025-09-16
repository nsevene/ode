import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import Stripe from 'https://esm.sh/stripe@14.21.0'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { 
      experienceType, 
      bookingDate, 
      timeSlot, 
      guestCount, 
      guestName, 
      guestEmail, 
      guestPhone, 
      specialRequests,
      tasteSectors,
      passportEnabled,
      nfcPassportId
    } = await req.json()

    console.log('Creating payment for:', { experienceType, bookingDate, timeSlot, guestCount })

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    })

    // Initialize Supabase with service role key for secure operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    )

    // Get event pricing
    const { data: eventData, error: eventError } = await supabaseAdmin
      .from('events')
      .select('price_usd, title')
      .eq('event_type', experienceType)
      .single()

    if (eventError || !eventData) {
      throw new Error(`Event not found: ${experienceType}`)
    }

    const totalAmount = eventData.price_usd * guestCount

    // Get user info if authenticated
    const authHeader = req.headers.get('Authorization')
    let userId = null
    
    if (authHeader) {
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_ANON_KEY') ?? ''
      )
      
      const token = authHeader.replace('Bearer ', '')
      const { data: userData } = await supabaseClient.auth.getUser(token)
      userId = userData.user?.id || null
    }

    // Create preliminary booking record
    const { data: bookingData, error: bookingError } = await supabaseAdmin
      .from('bookings')
      .insert({
        user_id: userId,
        experience_type: experienceType,
        booking_date: bookingDate,
        time_slot: timeSlot,
        guest_count: guestCount,
        guest_name: guestName,
        guest_email: guestEmail,
        guest_phone: guestPhone,
        special_requests: specialRequests,
        payment_status: 'pending',
        payment_amount: totalAmount,
        status: 'pending',
        taste_sectors: tasteSectors || [],
        passport_enabled: passportEnabled || false,
        nfc_passport_id: nfcPassportId || null
      })
      .select()
      .single()

    if (bookingError) {
      throw new Error(`Failed to create booking: ${bookingError.message}`)
    }

    console.log('Created booking:', bookingData.id)

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer_email: guestEmail,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${eventData.title} - ${guestCount} guest${guestCount > 1 ? 's' : ''}`,
              description: `Booking for ${bookingDate} at ${timeSlot}`,
            },
            unit_amount: eventData.price_usd,
          },
          quantity: guestCount,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/payment-success?session_id={CHECKOUT_SESSION_ID}&booking_id=${bookingData.id}`,
      cancel_url: `${req.headers.get('origin')}/payment-cancelled?booking_id=${bookingData.id}`,
      metadata: {
        booking_id: bookingData.id,
        experience_type: experienceType,
      },
    })

    // Update booking with Stripe session ID
    await supabaseAdmin
      .from('bookings')
      .update({ stripe_session_id: session.id })
      .eq('id', bookingData.id)

    console.log('Created Stripe session:', session.id)

    return new Response(
      JSON.stringify({ 
        url: session.url,
        booking_id: bookingData.id,
        amount: totalAmount 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Payment creation error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})