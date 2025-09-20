import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

// Zod schema for customer details
const customerDetailsSchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email(),
});

// Zod schema for order items
const orderItemSchema = z.object({
  menu_item_id: z.string().uuid(),
  quantity: z.number().int().positive(),
});

// Zod schema for the entire delivery order
const deliveryOrderSchema = z.object({
  customer_details: customerDetailsSchema,
  items: z.array(orderItemSchema).min(1),
  total_price: z.number().positive(),
});

function handleCors(req: Request): Response | null {
  const allowedOrigins = [
    'https://www.odefoodhall.com',
    'https://framer.com',
    'http://localhost:8080',
    'http://127.0.0.1:8080',
  ];
  const origin = req.headers.get('Origin') || '';
  const corsHeaders: { [key: string]: string } = {
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (allowedOrigins.includes(origin)) {
    corsHeaders['Access-Control-Allow-Origin'] = origin;
  }

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  return null;
}

serve(async (req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 405,
    });
  }

  try {
    const body = await req.json();
    const validation = deliveryOrderSchema.safeParse(body);

    if (!validation.success) {
      return new Response(JSON.stringify({ error: 'Invalid input', details: validation.error.flatten() }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    const { customer_details, items, total_price } = validation.data;

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment variables.');
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    
    // In a real-world scenario, you would first verify the total_price against the menu_item_ids here.
    // This is a critical security step to prevent price tampering.
    // For this example, we trust the client-sent total_price.

    // 1. Create the main order record
    const { data: orderData, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        customer_details,
        total_price,
        status: 'received',
      })
      .select('id')
      .single();

    if (orderError) throw orderError;

    const new_order_id = orderData.id;

    // 2. Create the associated order_items records
    const orderItemsData = items.map(item => ({
      order_id: new_order_id,
      menu_item_id: item.menu_item_id,
      quantity: item.quantity,
    }));

    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .insert(orderItemsData);

    if (itemsError) {
      // If item insertion fails, you should ideally roll back the order creation.
      // This requires more complex transaction logic.
      console.error('Failed to insert order items, but order was created:', new_order_id);
      throw itemsError;
    }

    // Optional: Stripe integration would go here.
    // 1. Create a Stripe PaymentIntent with the total_price.
    // 2. Return the client_secret from the PaymentIntent to the client.
    // The client would then use this secret to confirm the payment.

    return new Response(JSON.stringify({ success: true, order_id: new_order_id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 201,
    });

  } catch (error) {
    console.error('Error creating delivery order:', error);
     if (error instanceof SyntaxError) {
        return new Response(JSON.stringify({ error: 'Invalid JSON format' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        });
    }
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
