import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  type: 'referral_bonus' | 'welcome_bonus';
  user_id: string;
  referrer_id?: string;
  points: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { type, user_id, referrer_id, points }: EmailRequest =
      await req.json();

    console.log(`Processing ${type} email for user ${user_id}`);

    // Get user profile
    const { data: userProfile, error: userError } = await supabaseClient
      .from('profiles')
      .select('id, display_name')
      .eq('id', user_id)
      .single();

    if (userError) {
      console.error('Error fetching user profile:', userError);
      throw userError;
    }

    // Get user email from auth.users (service role required)
    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.admin.getUserById(user_id);

    if (authError || !user?.email) {
      console.error('Error fetching user email:', authError);
      throw new Error('Could not fetch user email');
    }

    let emailHtml = '';
    let subject = '';

    if (type === 'referral_bonus' && referrer_id) {
      // Get referrer profile
      const { data: referrerProfile } = await supabaseClient
        .from('profiles')
        .select('display_name')
        .eq('id', referrer_id)
        .single();

      subject = '🎉 Referral Bonus Earned at ODE Food Hall!';
      emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center;">
            <h1>Congratulations!</h1>
            <p>You've earned a referral bonus!</p>
          </div>
          
          <div style="padding: 30px 20px;">
            <p>Hi ${userProfile.display_name || 'there'},</p>
            
            <p>Great news! Someone used your referral link to join ODE Food Hall, and you've earned <strong>${points} loyalty points</strong> as a reward!</p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin: 0 0 10px 0; color: #667eea;">Your Referral Reward:</h3>
              <p style="margin: 0; font-size: 18px;"><strong>+${points} Points</strong></p>
            </div>
            
            <p>These points can be used for:</p>
            <ul>
              <li>Discounts on future bookings</li>
              <li>Free appetizers and drinks</li>
              <li>Exclusive access to special events</li>
            </ul>
            
            <p>Keep sharing your referral code to earn more rewards!</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://ode-food-hall.lovable.app/dashboard" 
                 style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                View Your Points
              </a>
            </div>
            
            <p>Thank you for helping us grow the ODE Food Hall community!</p>
            
            <p>Best regards,<br>The ODE Food Hall Team</p>
          </div>
        </div>
      `;
    } else if (type === 'welcome_bonus') {
      subject = '🎉 Welcome to ODE Food Hall - Bonus Points Included!';
      emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center;">
            <h1>Welcome to ODE Food Hall!</h1>
            <p>Your culinary journey begins here</p>
          </div>
          
          <div style="padding: 30px 20px;">
            <p>Hi ${userProfile.display_name || 'there'},</p>
            
            <p>Welcome to ODE Food Hall! We're thrilled to have you join our community of food lovers.</p>
            
            <p>As a special welcome gift, you've received <strong>${points} loyalty points</strong> to get you started!</p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin: 0 0 10px 0; color: #667eea;">Your Welcome Bonus:</h3>
              <p style="margin: 0; font-size: 18px;"><strong>+${points} Points</strong></p>
            </div>
            
            <p>Here's what you can do with your points:</p>
            <ul>
              <li>Get discounts on wine tasting experiences</li>
              <li>Enjoy free appetizers at our food corners</li>
              <li>Access exclusive member-only events</li>
            </ul>
            
            <p>Ready to explore? Book your first experience and start earning more points!</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://ode-food-hall.lovable.app/" 
                 style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Start Exploring
              </a>
            </div>
            
            <p>We can't wait to serve you amazing food and create unforgettable memories!</p>
            
            <p>Best regards,<br>The ODE Food Hall Team</p>
          </div>
        </div>
      `;
    }

    // Send email using Resend API
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY not configured');
    }

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'ODE Food Hall <noreply@ode-food-hall.com>',
        to: [user.email],
        subject: subject,
        html: emailHtml,
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error('Resend API error:', errorText);
      throw new Error(`Failed to send email: ${errorText}`);
    }

    const emailResult = await emailResponse.json();
    console.log('Email sent successfully:', emailResult);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Email sent successfully',
        id: emailResult.id,
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
