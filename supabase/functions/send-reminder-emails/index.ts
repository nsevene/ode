import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting reminder email cron job...');

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get current time and calculate time ranges for reminders
    const now = new Date();
    const in2Hours = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // Find bookings that need reminders (2 hours and 24 hours before)
    const { data: upcomingBookings, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('status', 'confirmed')
      .gte('booking_date', now.toISOString().split('T')[0])
      .lte('booking_date', in24Hours.toISOString().split('T')[0]);

    if (error) {
      throw new Error(`Error fetching bookings: ${error.message}`);
    }

    let remindersSent = 0;
    const results = [];

    for (const booking of upcomingBookings || []) {
      try {
        const bookingDateTime = new Date(
          `${booking.booking_date}T${booking.time_slot}`
        );
        const timeDiff = bookingDateTime.getTime() - now.getTime();
        const hoursUntil = timeDiff / (1000 * 60 * 60);

        // Send 24-hour reminder
        if (hoursUntil <= 24 && hoursUntil > 23) {
          console.log(`Sending 24h reminder for booking ${booking.id}`);

          const reminderResponse = await supabase.functions.invoke(
            'send-booking-email',
            {
              body: {
                type: 'reminder',
                bookingId: booking.id,
              },
            }
          );

          if (reminderResponse.error) {
            console.error(
              `Error sending 24h reminder for ${booking.id}:`,
              reminderResponse.error
            );
          } else {
            console.log(`24h reminder sent for booking ${booking.id}`);
            remindersSent++;
            results.push({
              bookingId: booking.id,
              type: '24h reminder',
              status: 'sent',
              hoursUntil: Math.round(hoursUntil),
            });
          }
        }

        // Send 2-hour reminder
        if (hoursUntil <= 2 && hoursUntil > 1) {
          console.log(`Sending 2h reminder for booking ${booking.id}`);

          const reminderResponse = await supabase.functions.invoke(
            'send-booking-email',
            {
              body: {
                type: 'reminder',
                bookingId: booking.id,
              },
            }
          );

          if (reminderResponse.error) {
            console.error(
              `Error sending 2h reminder for ${booking.id}:`,
              reminderResponse.error
            );
          } else {
            console.log(`2h reminder sent for booking ${booking.id}`);
            remindersSent++;
            results.push({
              bookingId: booking.id,
              type: '2h reminder',
              status: 'sent',
              hoursUntil: Math.round(hoursUntil),
            });
          }
        }
      } catch (bookingError) {
        console.error(`Error processing booking ${booking.id}:`, bookingError);
        results.push({
          bookingId: booking.id,
          type: 'error',
          status: 'failed',
          error: bookingError.message,
        });
      }
    }

    console.log(
      `Reminder cron job completed. Sent ${remindersSent} reminders.`
    );

    return new Response(
      JSON.stringify({
        success: true,
        message: `Sent ${remindersSent} reminder emails`,
        totalBookingsChecked: upcomingBookings?.length || 0,
        remindersSent,
        results,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error in send-reminder-emails cron job:', error);
    return new Response(
      JSON.stringify({
        error: error.message,
        success: false,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};

serve(handler);
