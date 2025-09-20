import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { Resend } from 'npm:resend@2.0.0';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

interface VendorEmailRequest {
  to: string;
  subject: string;
  content: string;
  vendor_name: string;
  company_name: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      to,
      subject,
      content,
      vendor_name,
      company_name,
    }: VendorEmailRequest = await req.json();

    console.log('Sending email to vendor:', {
      to,
      subject,
      vendor_name,
      company_name,
    });

    const emailResponse = await resend.emails.send({
      from: 'ODE Food Hall <noreply@odebaku.com>',
      to: [to],
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2D3748; font-size: 24px;">ODE Food Hall</h1>
            <p style="color: #718096; margin: 0;">Баку, Азербайджан</p>
          </div>
          
          <div style="background: #F7FAFC; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #2D3748; margin-top: 0;">Здравствуйте, ${vendor_name}!</h2>
            <div style="color: #4A5568; line-height: 1.6; white-space: pre-line;">
              ${content}
            </div>
          </div>
          
          <div style="border-top: 1px solid #E2E8F0; padding-top: 20px; text-align: center;">
            <p style="color: #718096; font-size: 14px; margin: 0;">
              С уважением,<br>
              Команда ODE Food Hall<br>
              <a href="mailto:info@odebaku.com" style="color: #3182CE;">info@odebaku.com</a><br>
              +994 12 345 67 89
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px;">
            <p style="color: #A0AEC0; font-size: 12px;">
              Это письмо отправлено автоматически из системы управления ODE Food Hall.
            </p>
          </div>
        </div>
      `,
    });

    console.log('Email sent successfully:', emailResponse);

    return new Response(
      JSON.stringify({
        success: true,
        messageId: emailResponse.data?.id,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error('Error in send-vendor-email function:', error);
    return new Response(
      JSON.stringify({
        error: error.message,
        success: false,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);
