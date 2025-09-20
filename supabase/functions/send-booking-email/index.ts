import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { Resend } from 'npm:resend@2.0.0';
import { renderAsync } from 'npm:@react-email/components@0.0.22';
import React from 'npm:react@18.3.1';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

import { BookingConfirmationEmail } from './_templates/booking-confirmation.tsx';
import { BookingReminderEmail } from './_templates/booking-reminder.tsx';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  type: 'confirmation' | 'reminder' | 'cancellation';
  bookingId: string;
  recipientEmail?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, bookingId, recipientEmail }: EmailRequest = await req.json();

    console.log(`Processing ${type} email for booking ${bookingId}`);

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch booking details
    const { data: booking, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single();

    if (error || !booking) {
      console.error('Error fetching booking:', error);
      return new Response(JSON.stringify({ error: 'Booking not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const emailAddress = recipientEmail || booking.guest_email;
    if (!emailAddress) {
      return new Response(
        JSON.stringify({ error: 'No email address provided' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    let emailHtml: string;
    let subject: string;

    if (type === 'confirmation') {
      emailHtml = await renderAsync(
        React.createElement(BookingConfirmationEmail, {
          guestName: booking.guest_name,
          experienceType: booking.experience_type,
          bookingDate: booking.booking_date,
          timeSlot: booking.time_slot,
          guestCount: booking.guest_count,
          totalAmount: booking.payment_amount || 0,
          bookingId: booking.id,
          qrCodeUrl: generateQRCodeUrl(booking.id),
        })
      );
      subject = `Подтверждение бронирования в ODE Food Hall - ${formatDate(booking.booking_date)}`;
    } else if (type === 'reminder') {
      const bookingDateTime = new Date(
        `${booking.booking_date}T${booking.time_slot}`
      );
      const now = new Date();
      const hoursUntil = Math.round(
        (bookingDateTime.getTime() - now.getTime()) / (1000 * 60 * 60)
      );

      emailHtml = await renderAsync(
        React.createElement(BookingReminderEmail, {
          guestName: booking.guest_name,
          experienceType: booking.experience_type,
          bookingDate: booking.booking_date,
          timeSlot: booking.time_slot,
          guestCount: booking.guest_count,
          bookingId: booking.id,
          hoursUntil: Math.max(1, hoursUntil),
        })
      );
      subject = `Напоминание: ваше бронирование в ODE Food Hall через ${hoursUntil} ч.`;
    } else {
      return new Response(JSON.stringify({ error: 'Unsupported email type' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Send email
    const emailResponse = await resend.emails.send({
      from: 'ODE Food Hall <booking@ode-foodhall.com>',
      to: [emailAddress],
      subject: subject,
      html: emailHtml,
    });

    console.log('Email sent successfully:', emailResponse);

    // Log email in database
    await supabase.from('user_notifications' as any).insert({
      user_id: booking.user_id,
      type: 'booking',
      title: subject,
      message: `Email ${type} отправлен для бронирования ${bookingId}`,
      data: { bookingId, emailType: type, recipientEmail: emailAddress },
    });

    return new Response(
      JSON.stringify({
        success: true,
        emailId: emailResponse.data?.id,
        message: `${type} email sent successfully`,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error in send-booking-email function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
};

// Helper functions
const generateQRCodeUrl = (bookingId: string): string => {
  // Generate QR code URL using a QR code service
  const qrData = encodeURIComponent(
    `https://ode-food-hall.lovable.app/check-in/${bookingId}`
  );
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${qrData}`;
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

serve(handler);
