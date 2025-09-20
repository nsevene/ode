import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { Resend } from 'npm:resend@4.0.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.52.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

interface InvestorCallRequest {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  investment_range?: string;
  investment_timeline?: string;
  message?: string;
  preferred_time?: string;
  preferred_method?: string;
}

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
    const requestData: InvestorCallRequest = await req.json();

    console.log('Processing investor intro call request:', {
      name: requestData.name,
      email: requestData.email,
      company: requestData.company,
    });

    // Validate required fields
    if (!requestData.name || !requestData.email) {
      return new Response(
        JSON.stringify({ error: 'Name and email are required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    // Insert into contact_messages table
    const { data: contact, error: dbError } = await supabase
      .from('contact_messages')
      .insert({
        name: requestData.name,
        email: requestData.email,
        phone: requestData.phone || '',
        message: `Investment Call Request\n\nCompany: ${requestData.company || 'Not specified'}\nInvestment Range: ${requestData.investment_range || 'Not specified'}\nTimeline: ${requestData.investment_timeline || 'Not specified'}\nPreferred Contact: ${requestData.preferred_method || 'Email'}\nBest Time: ${requestData.preferred_time || 'Any time'}\n\nMessage:\n${requestData.message || 'No additional message'}`,
        status: 'new',
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return new Response(JSON.stringify({ error: 'Failed to save request' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Send confirmation email to investor
    console.log(`Sending confirmation email to: ${requestData.email}`);

    const confirmationEmailResult = await resend.emails.send({
      from: 'ODE Food Hall <invest@odefoodhall.com>',
      to: [requestData.email],
      subject: 'Investment Discussion Request Received - ODE Food Hall',
      html: `
        <h1>Thank you for your interest, ${requestData.name}!</h1>
        <p>We have received your request for an investment discussion regarding ODE Food Hall.</p>
        
        <h2>Request Details:</h2>
        <ul>
          <li><strong>Name:</strong> ${requestData.name}</li>
          <li><strong>Email:</strong> ${requestData.email}</li>
          ${requestData.phone ? `<li><strong>Phone:</strong> ${requestData.phone}</li>` : ''}
          ${requestData.company ? `<li><strong>Company:</strong> ${requestData.company}</li>` : ''}
          ${requestData.investment_range ? `<li><strong>Investment Range:</strong> ${requestData.investment_range}</li>` : ''}
          ${requestData.investment_timeline ? `<li><strong>Timeline:</strong> ${requestData.investment_timeline}</li>` : ''}
          <li><strong>Preferred Contact:</strong> ${requestData.preferred_method || 'Email'}</li>
          <li><strong>Best Time:</strong> ${requestData.preferred_time || 'Any time'}</li>
        </ul>
        
        ${
          requestData.message
            ? `
        <h2>Your Message:</h2>
        <p>${requestData.message}</p>
        `
            : ''
        }
        
        <h2>Next Steps:</h2>
        <ol>
          <li>Our investment team will review your request</li>
          <li>We will schedule an intro call within 24-48 hours</li>
          <li>We'll share our investor deck and financial model</li>
          <li>Discuss next steps based on mutual interest</li>
        </ol>
        
        <p>We're excited to discuss this opportunity with you!</p>
        
        <p>Best regards,<br>
        ODE Food Hall Investment Team</p>
        
        <hr>
        <p style="font-size: 12px; color: #666;">
          ODE Food Hall, Ubud, Bali<br>
          Email: invest@odefoodhall.com<br>
          Phone: +62 811 1234 5678<br>
          WhatsApp: +62 811 1234 5678
        </p>
      `,
    });

    if (confirmationEmailResult.error) {
      console.error(
        'Failed to send confirmation email:',
        confirmationEmailResult.error
      );
    } else {
      console.log('Confirmation email sent successfully');
    }

    // Send notification email to investment team
    try {
      console.log('Sending notification email to invest@odefoodhall.com');

      const notificationEmailResult = await resend.emails.send({
        from: 'ODE System <system@odefoodhall.com>',
        to: ['invest@odefoodhall.com'],
        subject: `New Investment Call Request - ${requestData.name}${requestData.company ? ` (${requestData.company})` : ''}`,
        html: `
          <h1>New Investment Discussion Request</h1>
          
          <h2>Contact Information:</h2>
          <ul>
            <li><strong>Name:</strong> ${requestData.name}</li>
            <li><strong>Email:</strong> ${requestData.email}</li>
            <li><strong>Phone:</strong> ${requestData.phone || 'Not provided'}</li>
            <li><strong>Company:</strong> ${requestData.company || 'Not specified'}</li>
          </ul>
          
          <h2>Investment Details:</h2>
          <ul>
            <li><strong>Investment Range:</strong> ${requestData.investment_range || 'Not specified'}</li>
            <li><strong>Timeline:</strong> ${requestData.investment_timeline || 'Not specified'}</li>
            <li><strong>Preferred Contact Method:</strong> ${requestData.preferred_method || 'Email'}</li>
            <li><strong>Best Time to Contact:</strong> ${requestData.preferred_time || 'Any time'}</li>
          </ul>
          
          ${
            requestData.message
              ? `
          <h2>Message:</h2>
          <p>${requestData.message}</p>
          `
              : ''
          }
          
          <h2>Recommended Next Steps:</h2>
          <ol>
            <li>Review investor profile and investment criteria</li>
            <li>Schedule intro call within 24-48 hours</li>
            <li>Prepare and share relevant materials (deck, financial model)</li>
            <li>Follow up based on call outcome</li>
          </ol>
          
          <p><strong>Contact Record ID:</strong> ${contact.id}</p>
          
          <hr>
          <p><strong>Priority:</strong> High - Investment inquiry requires prompt response</p>
        `,
      });

      if (notificationEmailResult.error) {
        console.error(
          'Failed to send notification email:',
          notificationEmailResult.error
        );
      } else {
        console.log('Investment team notification sent successfully');
      }
    } catch (notificationError) {
      console.error('Error sending notification email:', notificationError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Investment call request submitted successfully',
        contact_id: contact.id,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error('Error in submit-investor-call function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);
