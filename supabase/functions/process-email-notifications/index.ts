import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Email trigger function called');

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Listen for new notifications that need emails
    const { data: notifications, error: notificationsError } =
      await supabaseClient
        .from('user_notifications')
        .select('*')
        .eq('read', false)
        .not('data->>trigger_email', 'is', null)
        .order('created_at', { ascending: false })
        .limit(10);

    if (notificationsError) {
      console.error('Error fetching notifications:', notificationsError);
      throw notificationsError;
    }

    if (!notifications || notifications.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No notifications requiring emails found' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    console.log(`Processing ${notifications.length} notifications for email`);

    for (const notification of notifications) {
      if (notification.data?.trigger_email) {
        const emailType = notification.data.email_type;
        const points = notification.data.points;

        if (emailType === 'referral_bonus' || emailType === 'welcome_bonus') {
          // Call the referral email function
          const { error: emailError } = await supabaseClient.functions.invoke(
            'send-referral-emails',
            {
              body: {
                type: emailType,
                user_id: notification.user_id,
                points: points,
              },
            }
          );

          if (emailError) {
            console.error(`Failed to send ${emailType} email:`, emailError);
          } else {
            console.log(
              `Successfully sent ${emailType} email to user ${notification.user_id}`
            );

            // Mark notification as processed (remove email trigger)
            await supabaseClient
              .from('user_notifications')
              .update({
                data: {
                  ...notification.data,
                  trigger_email: null,
                  email_sent: true,
                  email_sent_at: new Date().toISOString(),
                },
              })
              .eq('id', notification.id);
          }
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Processed ${notifications.length} notifications`,
        processed: notifications.length,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
