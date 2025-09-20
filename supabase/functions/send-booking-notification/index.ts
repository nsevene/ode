import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { Resend } from 'npm:resend@2.0.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

interface BookingNotificationRequest {
  bookingId: string;
  type: 'confirmation' | 'reminder' | 'cancellation' | 'status_update';
  recipientEmail: string;
  recipientName: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      bookingId,
      type,
      recipientEmail,
      recipientName,
    }: BookingNotificationRequest = await req.json();

    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch booking details
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select(
        `
        *,
        events:experience_type (
          title,
          description,
          venue
        )
      `
      )
      .eq('id', bookingId)
      .single();

    if (bookingError || !booking) {
      throw new Error('Booking not found');
    }

    // Generate email content based on type
    let subject = '';
    let htmlContent = '';

    switch (type) {
      case 'confirmation':
        subject = `✅ Подтверждение бронирования - ODE Ubud Bazaar`;
        htmlContent = generateConfirmationEmail(booking, recipientName);
        break;
      case 'reminder':
        subject = `⏰ Напоминание о бронировании - ODE Ubud Bazaar`;
        htmlContent = generateReminderEmail(booking, recipientName);
        break;
      case 'cancellation':
        subject = `❌ Отмена бронирования - ODE Ubud Bazaar`;
        htmlContent = generateCancellationEmail(booking, recipientName);
        break;
      case 'status_update':
        subject = `📋 Обновление статуса бронирования - ODE Ubud Bazaar`;
        htmlContent = generateStatusUpdateEmail(booking, recipientName);
        break;
      default:
        throw new Error('Invalid notification type');
    }

    // Send email
    const emailResponse = await resend.emails.send({
      from: 'ODE Ubud Bazaar <booking@resend.dev>',
      to: [recipientEmail],
      subject: subject,
      html: htmlContent,
    });

    // Log notification in database
    await supabase.from('user_notifications').insert({
      user_id: booking.user_id,
      type: 'booking',
      title: subject,
      message: `Email уведомление отправлено на ${recipientEmail}`,
      data: {
        email_id: emailResponse.data?.id,
        booking_id: bookingId,
        notification_type: type,
      },
    });

    console.log('Booking email sent successfully:', emailResponse);

    return new Response(
      JSON.stringify({
        success: true,
        emailId: emailResponse.data?.id,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error('Error in send-booking-notification function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
};

function generateConfirmationEmail(
  booking: any,
  recipientName: string
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Подтверждение бронирования</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #8B4513, #D4AF37); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; }
        .booking-details { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
        .detail-row:last-child { border-bottom: none; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; color: #666; }
        .btn { display: inline-block; background: #D4AF37; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Бронирование подтверждено!</h1>
          <p>Спасибо за выбор ODE Ubud Bazaar</p>
        </div>
        
        <div class="content">
          <h2>Здравствуйте, ${recipientName}!</h2>
          <p>Мы рады подтвердить ваше бронирование. Вот детали:</p>
          
          <div class="booking-details">
            <h3>📋 Детали бронирования</h3>
            <div class="detail-row">
              <strong>ID бронирования:</strong>
              <span>${booking.id}</span>
            </div>
            <div class="detail-row">
              <strong>Опыт:</strong>
              <span>${booking.experience_type}</span>
            </div>
            <div class="detail-row">
              <strong>Дата:</strong>
              <span>${new Date(booking.booking_date).toLocaleDateString('ru-RU')}</span>
            </div>
            <div class="detail-row">
              <strong>Время:</strong>
              <span>${booking.time_slot}</span>
            </div>
            <div class="detail-row">
              <strong>Количество гостей:</strong>
              <span>${booking.guest_count}</span>
            </div>
            <div class="detail-row">
              <strong>Сумма:</strong>
              <span>${(booking.payment_amount / 100).toFixed(2)} USD</span>
            </div>
            ${
              booking.special_requests
                ? `
            <div class="detail-row">
              <strong>Особые пожелания:</strong>
              <span>${booking.special_requests}</span>
            </div>
            `
                : ''
            }
          </div>
          
          <p><strong>Что дальше?</strong></p>
          <ul>
            <li>Прибудьте за 15 минут до назначенного времени</li>
            <li>Возьмите с собой документ, удостоверяющий личность</li>
            <li>Мы отправим напоминание за день до посещения</li>
          </ul>
          
          <div style="text-align: center;">
            <a href="https://ace5a7fd-30d9-4826-beef-eeaf082338ad.lovableproject.com/my-bookings" class="btn">
              Просмотреть бронирование
            </a>
          </div>
        </div>
        
        <div class="footer">
          <p>ODE Ubud Bazaar | Ubud, Bali</p>
          <p>Если у вас есть вопросы, свяжитесь с нами: booking@odeubud.com</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateReminderEmail(booking: any, recipientName: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Напоминание о бронировании</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #FF6B35, #F7931E); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; }
        .reminder-box { background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 8px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>⏰ Напоминание о бронировании</h1>
          <p>Завтра ваш особенный день в ODE Ubud Bazaar!</p>
        </div>
        
        <div class="content">
          <h2>Здравствуйте, ${recipientName}!</h2>
          
          <div class="reminder-box">
            <h3>🗓️ Завтра ${new Date(booking.booking_date).toLocaleDateString('ru-RU')}</h3>
            <p><strong>Время:</strong> ${booking.time_slot}</p>
            <p><strong>Гостей:</strong> ${booking.guest_count}</p>
            <p><strong>Опыт:</strong> ${booking.experience_type}</p>
          </div>
          
          <p><strong>Подготовка к посещению:</strong></p>
          <ul>
            <li>✅ Прибудьте за 15 минут до времени</li>
            <li>🆔 Возьмите документ удостоверяющий личность</li>
            <li>📱 Сохраните этот email для справки</li>
            <li>🍽️ Приходите с хорошим аппетитом!</li>
          </ul>
          
          <p>Мы с нетерпением ждем встречи с вами!</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateCancellationEmail(
  booking: any,
  recipientName: string
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Отмена бронирования</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #dc3545; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>❌ Бронирование отменено</h1>
        </div>
        
        <div class="content">
          <h2>Здравствуйте, ${recipientName}</h2>
          <p>Ваше бронирование #${booking.id} было отменено.</p>
          <p>Если это произошло по ошибке, пожалуйста, свяжитесь с нами.</p>
          <p>Будем рады видеть вас в другое время!</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateStatusUpdateEmail(
  booking: any,
  recipientName: string
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Обновление статуса</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #17a2b8; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📋 Обновление бронирования</h1>
        </div>
        
        <div class="content">
          <h2>Здравствуйте, ${recipientName}</h2>
          <p>Статус вашего бронирования был обновлен.</p>
          <p><strong>Текущий статус:</strong> ${booking.status}</p>
          <p><strong>Статус оплаты:</strong> ${booking.payment_status}</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

serve(handler);
