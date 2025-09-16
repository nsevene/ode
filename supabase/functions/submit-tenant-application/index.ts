import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { Resend } from 'npm:resend@4.0.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.52.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

interface TenantApplicationData {
  company_name: string;
  contact_person: string;
  email: string;
  phone: string;
  business_type: string;
  cuisine_type?: string;
  description: string;
  space_id?: string;
  space_name: string;
  space_area: number;
  floor_number: number;
  lease_start_date?: string;
  lease_duration: string;
  investment_budget?: string;
  expected_revenue?: string;
  has_food_license: boolean;
  previous_experience?: string;
  special_requirements?: string;
  preferred_contact_method?: string;
  best_contact_time?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { 
      status: 405, 
      headers: corsHeaders 
    });
  }

  try {
    const applicationData: TenantApplicationData = await req.json();

    console.log('Processing tenant application:', {
      company_name: applicationData.company_name,
      email: applicationData.email,
      space_name: applicationData.space_name
    });

    // Validate required fields
    if (!applicationData.company_name || !applicationData.email || !applicationData.contact_person) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }

    // Insert into database
    const { data: booking, error: dbError } = await supabase
      .from('space_bookings')
      .insert({
        company_name: applicationData.company_name,
        contact_person: applicationData.contact_person,
        email: applicationData.email,
        phone: applicationData.phone,
        business_type: applicationData.business_type,
        cuisine_type: applicationData.cuisine_type,
        description: applicationData.description,
        space_id: parseInt(applicationData.space_id || '1'),
        space_name: applicationData.space_name,
        space_area: applicationData.space_area,
        floor_number: applicationData.floor_number,
        lease_start_date: applicationData.lease_start_date,
        lease_duration: applicationData.lease_duration,
        investment_budget: applicationData.investment_budget,
        expected_revenue: applicationData.expected_revenue,
        has_food_license: applicationData.has_food_license || false,
        previous_experience: applicationData.previous_experience,
        special_requirements: applicationData.special_requirements,
        preferred_contact_method: applicationData.preferred_contact_method || 'email',
        best_contact_time: applicationData.best_contact_time,
        status: 'pending'
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return new Response(
        JSON.stringify({ error: 'Failed to save application' }),
        { 
          status: 500, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }

    // Send confirmation email to applicant
    console.log(`Sending confirmation email to: ${applicationData.email}`);

    const applicantEmailResult = await resend.emails.send({
      from: 'ODE Food Hall <tenants@odefoodhall.com>',
      to: [applicationData.email],
      subject: 'Application Received - ODE Food Hall',
      html: `
        <h1>Thank you for your application, ${applicationData.contact_person}!</h1>
        <p>We have received your tenant application for <strong>${applicationData.space_name}</strong>.</p>
        
        <h2>Application Details:</h2>
        <ul>
          <li><strong>Company:</strong> ${applicationData.company_name}</li>
          <li><strong>Business Type:</strong> ${applicationData.business_type}</li>
          <li><strong>Cuisine:</strong> ${applicationData.cuisine_type || 'Not specified'}</li>
          <li><strong>Space:</strong> ${applicationData.space_name} (${applicationData.space_area} m²)</li>
          <li><strong>Lease Duration:</strong> ${applicationData.lease_duration}</li>
        </ul>
        
        <p>Our team will review your application and contact you within 2-3 business days.</p>
        
        <p>Best regards,<br>
        ODE Food Hall Tenant Relations Team</p>
        
        <hr>
        <p style="font-size: 12px; color: #666;">
          ODE Food Hall, Ubud, Bali<br>
          Email: tenants@odefoodhall.com<br>
          Phone: +62 811 1234 5678
        </p>
      `,
    });

    if (applicantEmailResult.error) {
      console.error('Failed to send applicant email:', applicantEmailResult.error);
    } else {
      console.log('Applicant email sent successfully');
    }

    // Send notification email to ops team
    try {
      console.log('Sending admin notification email to ops@odefoodhall.com');

      const adminEmailResult = await resend.emails.send({
        from: 'ODE System <system@odefoodhall.com>',
        to: ['ops@odefoodhall.com'],
        subject: `New Tenant Application - ${applicationData.company_name}`,
        html: `
          <h1>New Tenant Application Received</h1>
          
          <h2>Company Information:</h2>
          <ul>
            <li><strong>Company Name:</strong> ${applicationData.company_name}</li>
            <li><strong>Contact Person:</strong> ${applicationData.contact_person}</li>
            <li><strong>Email:</strong> ${applicationData.email}</li>
            <li><strong>Phone:</strong> ${applicationData.phone}</li>
            <li><strong>Business Type:</strong> ${applicationData.business_type}</li>
            <li><strong>Cuisine Type:</strong> ${applicationData.cuisine_type || 'Not specified'}</li>
          </ul>
          
          <h2>Space Requirements:</h2>
          <ul>
            <li><strong>Requested Space:</strong> ${applicationData.space_name}</li>
            <li><strong>Space Area:</strong> ${applicationData.space_area} m²</li>
            <li><strong>Floor Number:</strong> ${applicationData.floor_number}</li>
            <li><strong>Preferred Start Date:</strong> ${applicationData.lease_start_date || 'Flexible'}</li>
            <li><strong>Lease Duration:</strong> ${applicationData.lease_duration}</li>
          </ul>
          
          <h2>Business Details:</h2>
          <ul>
            <li><strong>Investment Budget:</strong> ${applicationData.investment_budget || 'Not specified'}</li>
            <li><strong>Expected Revenue:</strong> ${applicationData.expected_revenue || 'Not specified'}</li>
            <li><strong>Food License:</strong> ${applicationData.has_food_license ? 'Yes' : 'No'}</li>
            <li><strong>Previous Experience:</strong> ${applicationData.previous_experience || 'Not specified'}</li>
          </ul>
          
          <h2>Description:</h2>
          <p>${applicationData.description}</p>
          
          ${applicationData.special_requirements ? `
          <h2>Special Requirements:</h2>
          <p>${applicationData.special_requirements}</p>
          ` : ''}
          
          <h2>Contact Preferences:</h2>
          <ul>
            <li><strong>Preferred Method:</strong> ${applicationData.preferred_contact_method || 'Email'}</li>
            <li><strong>Best Time:</strong> ${applicationData.best_contact_time || 'Any time'}</li>
          </ul>
          
          <p><strong>Application ID:</strong> ${booking.id}</p>
          
          <hr>
          <p>Please review this application and follow up within 2-3 business days.</p>
        `,
      });

      if (adminEmailResult.error) {
        console.error('Failed to send admin email:', adminEmailResult.error);
      } else {
        console.log('Admin notification email sent successfully');
      }
    } catch (adminEmailError) {
      console.error('Error sending admin email:', adminEmailError);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Application submitted successfully',
        application_id: booking.id
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error('Error in submit-tenant-application function:', error);
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