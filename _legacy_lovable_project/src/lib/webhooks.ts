// Webhook handlers for Stripe and Resend
import { sendOrderConfirmation, sendBookingConfirmation } from './email';

// Stripe webhook events
export interface StripeWebhookEvent {
  id: string;
  type: string;
  data: {
    object: any;
  };
  created: number;
}

// Stripe webhook handler
export const handleStripeWebhook = async (event: StripeWebhookEvent) => {
  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;

      case 'payment_intent.canceled':
        await handlePaymentCanceled(event.data.object);
        break;

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    console.error('Error handling Stripe webhook:', error);
    throw error;
  }
};

// Payment succeeded handler
const handlePaymentSucceeded = async (paymentIntent: any) => {
  try {
    const { id, amount, currency, metadata } = paymentIntent;

    console.log('Payment succeeded:', id);

    // Update order status in database
    await updateOrderStatus(id, 'paid');

    // Send confirmation email if customer email is available
    if (metadata.customer_email) {
      const orderData = await getOrderData(id);
      if (orderData) {
        await sendOrderConfirmation(metadata.customer_email, orderData);
      }
    }

    // Log successful payment
    console.log(`Payment ${id} succeeded: ${amount} ${currency}`);
  } catch (error) {
    console.error('Error handling payment succeeded:', error);
  }
};

// Payment failed handler
const handlePaymentFailed = async (paymentIntent: any) => {
  try {
    const { id, last_payment_error } = paymentIntent;

    console.log('Payment failed:', id, last_payment_error);

    // Update order status in database
    await updateOrderStatus(id, 'payment_failed');

    // Send failure notification to customer
    if (paymentIntent.metadata.customer_email) {
      await sendPaymentFailureNotification(
        paymentIntent.metadata.customer_email,
        id,
        last_payment_error?.message || 'Payment failed'
      );
    }
  } catch (error) {
    console.error('Error handling payment failed:', error);
  }
};

// Payment canceled handler
const handlePaymentCanceled = async (paymentIntent: any) => {
  try {
    const { id } = paymentIntent;

    console.log('Payment canceled:', id);

    // Update order status in database
    await updateOrderStatus(id, 'canceled');
  } catch (error) {
    console.error('Error handling payment canceled:', error);
  }
};

// Invoice payment succeeded handler
const handleInvoicePaymentSucceeded = async (invoice: any) => {
  try {
    const { id, customer_email, amount_paid } = invoice;

    console.log('Invoice payment succeeded:', id);

    // Handle subscription or recurring payment
    if (customer_email) {
      await sendInvoicePaymentConfirmation(customer_email, id, amount_paid);
    }
  } catch (error) {
    console.error('Error handling invoice payment succeeded:', error);
  }
};

// Database operations
const updateOrderStatus = async (paymentIntentId: string, status: string) => {
  try {
    // Here you would update your database
    // For now, we'll just log it
    console.log(`Updating order status for ${paymentIntentId} to ${status}`);

    // Example database update:
    // await supabase
    //   .from('orders')
    //   .update({ status, payment_intent_id: paymentIntentId })
    //   .eq('payment_intent_id', paymentIntentId);
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

const getOrderData = async (paymentIntentId: string) => {
  try {
    // Here you would fetch order data from your database
    // For now, we'll return mock data
    console.log(`Fetching order data for ${paymentIntentId}`);

    // Example database query:
    // const { data: order } = await supabase
    //   .from('orders')
    //   .select('*, order_items(*, menu_items(*))')
    //   .eq('payment_intent_id', paymentIntentId)
    //   .single();

    return null; // Return null for now
  } catch (error) {
    console.error('Error fetching order data:', error);
    return null;
  }
};

// Email notification functions
const sendPaymentFailureNotification = async (
  email: string,
  paymentIntentId: string,
  errorMessage: string
) => {
  try {
    // Create payment failure email template
    const template = {
      subject: 'Ошибка оплаты заказа',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Ошибка оплаты</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #dc2626; margin-top: 0;">Ошибка оплаты заказа</h2>
            <p>К сожалению, произошла ошибка при обработке вашего платежа.</p>
            <p><strong>Причина:</strong> ${errorMessage}</p>
            <p><strong>ID платежа:</strong> ${paymentIntentId}</p>
          </div>
          
          <p>Пожалуйста, попробуйте оформить заказ снова или свяжитесь с нами для помощи.</p>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.VITE_APP_URL}/vendors" 
               style="background: #ea580c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Попробовать снова
            </a>
          </div>
        </body>
        </html>
      `,
      text: `
        Ошибка оплаты заказа
        
        К сожалению, произошла ошибка при обработке вашего платежа.
        
        Причина: ${errorMessage}
        ID платежа: ${paymentIntentId}
        
        Пожалуйста, попробуйте оформить заказ снова или свяжитесь с нами для помощи.
      `,
    };

    // Send email
    await fetch('/api/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: email,
        from: 'ODE Food Hall <noreply@odefoodhall.com>',
        subject: template.subject,
        html: template.html,
        text: template.text,
      }),
    });
  } catch (error) {
    console.error('Error sending payment failure notification:', error);
  }
};

const sendInvoicePaymentConfirmation = async (
  email: string,
  invoiceId: string,
  amount: number
) => {
  try {
    const formatPrice = (amount: number) => {
      return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 0,
      }).format(amount / 100);
    };

    const template = {
      subject: 'Платеж по счету подтвержден',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Платеж подтвержден</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #166534; margin-top: 0;">Платеж подтвержден</h2>
            <p>Ваш платеж по счету успешно обработан.</p>
            <p><strong>Сумма:</strong> ${formatPrice(amount)}</p>
            <p><strong>ID счета:</strong> ${invoiceId}</p>
          </div>
          
          <p>Спасибо за использование ODE Food Hall!</p>
        </body>
        </html>
      `,
      text: `
        Платеж по счету подтвержден
        
        Ваш платеж по счету успешно обработан.
        
        Сумма: ${formatPrice(amount)}
        ID счета: ${invoiceId}
        
        Спасибо за использование ODE Food Hall!
      `,
    };

    await fetch('/api/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: email,
        from: 'ODE Food Hall <noreply@odefoodhall.com>',
        subject: template.subject,
        html: template.html,
        text: template.text,
      }),
    });
  } catch (error) {
    console.error('Error sending invoice payment confirmation:', error);
  }
};

// Webhook signature verification
export const verifyStripeSignature = (
  payload: string,
  signature: string,
  secret: string
): boolean => {
  try {
    // Here you would implement Stripe signature verification
    // For now, we'll return true for development
    console.log('Verifying Stripe signature...');
    return true;
  } catch (error) {
    console.error('Error verifying Stripe signature:', error);
    return false;
  }
};

// Resend webhook handler
export const handleResendWebhook = async (event: any) => {
  try {
    switch (event.type) {
      case 'email.sent':
        console.log('Email sent successfully:', event.data.id);
        break;

      case 'email.delivered':
        console.log('Email delivered:', event.data.id);
        break;

      case 'email.bounced':
        console.log('Email bounced:', event.data.id);
        break;

      case 'email.complained':
        console.log('Email complained:', event.data.id);
        break;

      default:
        console.log(`Unhandled Resend event type: ${event.type}`);
    }
  } catch (error) {
    console.error('Error handling Resend webhook:', error);
    throw error;
  }
};

// Webhook endpoint handler
export const handleWebhook = async (req: Request) => {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature') || '';
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

    // Verify signature
    if (!verifyStripeSignature(body, signature, webhookSecret)) {
      return new Response('Invalid signature', { status: 400 });
    }

    // Parse event
    const event = JSON.parse(body);

    // Handle event
    await handleStripeWebhook(event);

    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response('Webhook error', { status: 500 });
  }
};
