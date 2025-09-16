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
    const { sessionId, bookingId } = await req.json()

    console.log('Verifying payment:', { sessionId, bookingId })

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    })

    // Initialize Supabase with service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    )

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    console.log('Stripe session status:', session.payment_status)

    if (session.payment_status === 'paid') {
      // Update booking status to confirmed
      const { error: updateError } = await supabaseAdmin
        .from('bookings')
        .update({
          payment_status: 'paid',
          status: 'confirmed',
          stripe_payment_intent_id: session.payment_intent as string,
        })
        .eq('id', bookingId)

      if (updateError) {
        throw new Error(`Failed to update booking: ${updateError.message}`)
      }

      console.log('Payment verified and booking confirmed:', bookingId)

      // Get booking details for email
      const { data: bookingDetails, error: fetchError } = await supabaseAdmin
        .from('bookings')
        .select(`
          *,
          events!inner(title, price_usd)
        `)
        .eq('id', bookingId)
        .single()

      if (!fetchError && bookingDetails) {
        // Send confirmation email
        try {
          await supabaseAdmin.functions.invoke('send-booking-confirmation', {
            body: {
              guestName: bookingDetails.guest_name,
              guestEmail: bookingDetails.guest_email,
              experienceTitle: bookingDetails.events.title,
              bookingDate: bookingDetails.booking_date,
              timeSlot: bookingDetails.time_slot,
              guestCount: bookingDetails.guest_count,
              totalAmount: bookingDetails.payment_amount,
              bookingId: bookingDetails.id,
              specialRequests: bookingDetails.special_requests
            }
          })
          console.log('Confirmation email sent for booking:', bookingId)
        } catch (emailError) {
          console.error('Failed to send confirmation email:', emailError)
          // Don't fail the payment verification if email fails
        }
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          status: 'paid',
          booking_id: bookingId 
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    } else {
      return new Response(
        JSON.stringify({ 
          success: false, 
          status: session.payment_status,
          booking_id: bookingId 
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }
  } catch (error) {
    console.error('Payment verification error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})