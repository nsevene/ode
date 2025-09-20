import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.52.1';
import Stripe from 'https://esm.sh/stripe@14.21.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
});

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  { auth: { persistSession: false } }
);

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', {
      status: 405,
      headers: corsHeaders,
    });
  }

  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      return new Response(
        JSON.stringify({ error: 'Missing stripe signature' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    // Verify webhook signature
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET not configured');
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return new Response(JSON.stringify({ error: 'Invalid signature' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    console.log(`Processing webhook event: ${event.type}`);

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(
          event.data.object as Stripe.Checkout.Session
        );
        break;

      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(
          event.data.object as Stripe.PaymentIntent
        );
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(
          event.data.object as Stripe.PaymentIntent
        );
        break;

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(
          event.data.object as Stripe.Invoice
        );
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (error: any) {
    console.error('Error in payment-webhook function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

// Handle successful checkout session
async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  console.log('Checkout session completed:', session.id);

  const bookingId = session.metadata?.booking_id;
  if (!bookingId) {
    console.error('No booking_id in session metadata');
    return;
  }

  // Update booking status
  const { error: updateError } = await supabase
    .from('bookings')
    .update({
      payment_status: 'completed',
      stripe_session_id: session.id,
      stripe_payment_intent_id: session.payment_intent as string,
      status: 'confirmed',
      updated_at: new Date().toISOString(),
    })
    .eq('id', bookingId);

  if (updateError) {
    console.error('Error updating booking:', updateError);
    return;
  }

  // Create payment record
  const { error: paymentError } = await supabase
    .from('payment_intents')
    .insert({
      id: session.payment_intent as string,
      booking_id: bookingId,
      amount: session.amount_total,
      currency: session.currency,
      status: 'succeeded',
      stripe_session_id: session.id,
      customer_email: session.customer_email,
      created_at: new Date().toISOString(),
    });

  if (paymentError) {
    console.error('Error creating payment record:', paymentError);
  }

  // Send confirmation email
  try {
    const { data: booking } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single();

    if (booking) {
      // Trigger email notification
      await supabase.functions.invoke('send-booking-email', {
        body: {
          type: 'confirmation',
          bookingId: bookingId,
          recipientEmail: booking.guest_email,
        },
      });
    }
  } catch (emailError) {
    console.error('Error sending confirmation email:', emailError);
  }

  console.log('Booking confirmed and payment processed:', bookingId);
}

// Handle successful payment intent
async function handlePaymentIntentSucceeded(
  paymentIntent: Stripe.PaymentIntent
) {
  console.log('Payment intent succeeded:', paymentIntent.id);

  // Update payment record
  const { error } = await supabase
    .from('payment_intents')
    .update({
      status: 'succeeded',
      updated_at: new Date().toISOString(),
    })
    .eq('id', paymentIntent.id);

  if (error) {
    console.error('Error updating payment intent:', error);
  }
}

// Handle failed payment intent
async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment intent failed:', paymentIntent.id);

  // Update payment record
  const { error } = await supabase
    .from('payment_intents')
    .update({
      status: 'failed',
      failure_reason:
        paymentIntent.last_payment_error?.message || 'Payment failed',
      updated_at: new Date().toISOString(),
    })
    .eq('id', paymentIntent.id);

  if (error) {
    console.error('Error updating payment intent:', error);
  }

  // Update booking status
  const { data: payment } = await supabase
    .from('payment_intents')
    .select('booking_id')
    .eq('id', paymentIntent.id)
    .single();

  if (payment?.booking_id) {
    await supabase
      .from('bookings')
      .update({
        payment_status: 'failed',
        status: 'cancelled',
        updated_at: new Date().toISOString(),
      })
      .eq('id', payment.booking_id);
  }
}

// Handle successful invoice payment
async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log('Invoice payment succeeded:', invoice.id);

  // Handle subscription or recurring payment logic here
  // This would be for tenant rent, membership fees, etc.
}

// Handle failed invoice payment
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.log('Invoice payment failed:', invoice.id);

  // Handle failed recurring payment logic here
  // This would trigger dunning management, suspension, etc.
}

serve(handler);
