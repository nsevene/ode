import { serve } from 'std/server';
import { corsHeaders } from '../_shared/cors.ts';
import { createClient } from 'supabase-js';

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { orderDetails, cartItems, userId, paymentIntentId } =
      await req.json();

    // 1. Create the main order record
    const { data: orderData, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        user_id: userId,
        status: 'pending',
        total_amount: orderDetails.totalAmount,
        payment_intent_id: paymentIntentId,
        delivery_address: orderDetails.deliveryAddress,
        customer_name: orderDetails.customerName,
        customer_phone: orderDetails.phone,
        special_instructions: orderDetails.specialInstructions,
      })
      .select()
      .single();

    if (orderError)
      throw new Error(`Failed to create order: ${orderError.message}`);

    const orderId = orderData.id;

    // 2. Create order items records
    const itemsToInsert = cartItems.map((item: any) => ({
      order_id: orderId,
      menu_item_id: item.id,
      quantity: item.quantity,
      price_at_purchase: item.price,
    }));

    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .insert(itemsToInsert);

    if (itemsError) {
      // If items fail, we should ideally roll back the order creation.
      // For now, we'll log the error.
      console.error(
        `Failed to insert order items for order ${orderId}: ${itemsError.message}`
      );
      throw new Error(`Failed to save order items: ${itemsError.message}`);
    }

    // 3. (Optional) Trigger other processes, like sending notifications

    return new Response(JSON.stringify({ success: true, orderId: orderId }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
