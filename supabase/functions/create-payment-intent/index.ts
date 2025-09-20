import { serve } from 'std/server';
import { corsHeaders } from '../_shared/cors.ts';
import Stripe from 'stripe';
import { createClient } from 'supabase-js';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2024-06-20',
  httpClient: Stripe.createFetchHttpClient(),
});

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { items, userId } = await req.json();

    if (!userId) {
      throw new Error('User ID is required.');
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new Error('Cart items are required.');
    }

    const itemIds = items.map((item) => item.id);
    const { data: menuItems, error: dbError } = await supabaseAdmin
      .from('menu_items')
      .select('id, price')
      .in('id', itemIds);

    if (dbError) {
      throw new Error(`Database error: ${dbError.message}`);
    }

    let totalAmount = 0;
    for (const cartItem of items) {
      const dbItem = menuItems.find((item) => item.id === cartItem.id);
      if (!dbItem) {
        throw new Error(`Item with id ${cartItem.id} not found in database.`);
      }
      totalAmount += dbItem.price * cartItem.quantity;
    }

    // Amount must be in the smallest currency unit (e.g., cents for USD/EUR)
    const amountInCents = Math.round(totalAmount * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd', // or your desired currency
      automatic_payment_methods: { enabled: true },
      metadata: {
        userId: userId,
        cartItems: JSON.stringify(
          items.map((i) => ({ id: i.id, quantity: i.quantity }))
        ),
      },
    });

    return new Response(
      JSON.stringify({
        client_secret: paymentIntent.client_secret,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
