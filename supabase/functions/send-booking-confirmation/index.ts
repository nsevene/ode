import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

interface BookingConfirmationRequest {
  bookingId: string;
  guestEmail: string;
  guestName: string;
  experienceType: string;
  bookingDate: string;
  timeSlot: string;
  guestCount: number;
  totalAmount?: number;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const bookingData: BookingConfirmationRequest = await req.json();
    console.log('Sending booking confirmation for:', bookingData.bookingId);

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Use the new email service
    const emailResponse = await supabase.functions.invoke(
      'send-booking-email',
      {
        body: {
          type: 'confirmation',
          bookingId: bookingData.bookingId,
          recipientEmail: bookingData.guestEmail,
        },
      }
    );

    if (emailResponse.error) {
      throw new Error(`Email service error: ${emailResponse.error.message}`);
    }

    console.log(
      'Booking confirmation email sent successfully:',
      emailResponse.data
    );

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Booking confirmation email sent successfully',
        emailData: emailResponse.data,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error in send-booking-confirmation function:', error);
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
