import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { Resend } from 'npm:resend@4.0.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.52.1';
import { renderAsync } from 'npm:@react-email/components@0.0.22';
import React from 'npm:react@18.3.1';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TenantNotificationRequest {
  booking_id: string;
  status: 'approved' | 'rejected' | 'pending';
  admin_comment?: string;
  notify_admins?: boolean;
}

// Simple email template function (since React Email might have import issues in edge functions)
const createEmailHTML = (data: {
  company_name: string;
  contact_person: string;
  status: 'approved' | 'rejected' | 'pending';
  admin_comment?: string;
  booking_id: string;
}) => {
  const { company_name, contact_person, status, admin_comment, booking_id } = data;
  
  const statusText = {
    approved: 'одобрена',
    rejected: 'отклонена', 
    pending: 'находится на рассмотрении'
  };

  const statusColor = {
    approved: '#22c55e',
    rejected: '#ef4444',
    pending: '#f59e0b'
  };

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>ODE Food Hall - Обновление заявки</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #8B0000; margin-bottom: 10px;">ODE Food Hall</h1>
          <div style="width: 50px; height: 3px; background-color: #FFC107; margin: 0 auto;"></div>
        </div>

        <div style="background-color: #f8f9fa; padding: 30px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: ${statusColor[status]}; margin-top: 0;">
            ${status === 'approved' ? '🎉 Заявка одобрена!' : 
              status === 'rejected' ? '📋 Обновление заявки' : 
              '⏳ Заявка получена'}
          </h2>
          
          <p>Здравствуйте, <strong>${contact_person}</strong>!</p>
          
          <p>
            ${status === 'approved' 
              ? `Отличные новости! Ваша заявка от компании <strong>${company_name}</strong> на аренду помещения в ODE Food Hall была <strong style="color: ${statusColor[status]};">одобрена</strong>.`
              : status === 'rejected'
              ? `К сожалению, мы не можем одобрить заявку от компании <strong>${company_name}</strong> на аренду помещения в ODE Food Hall в данный момент.`
              : `Спасибо за вашу заявку от компании <strong>${company_name}</strong> на аренду помещения в ODE Food Hall. Ваша заявка получена и находится на рассмотрении.`
            }
          </p>

          ${admin_comment ? `
            <div style="background-color: #e9ecef; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid ${statusColor[status]};">
              <p style="margin: 0; font-weight: bold; color: #495057; font-size: 14px;">Комментарий от нашей команды:</p>
              <p style="margin: 8px 0 0 0; color: #495057; font-style: italic;">${admin_comment}</p>
            </div>
          ` : ''}

          ${status === 'approved' ? `
            <div style="background-color: #d4edda; border: 1px solid #c3e6cb; border-radius: 6px; padding: 20px; margin: 20px 0;">
              <p style="margin: 0 0 10px 0; font-weight: bold; color: #155724;">Следующие шаги:</p>
              <ul style="margin: 0; color: #155724;">
                <li>Наша команда свяжется с вами в течение 2-3 рабочих дней</li>
                <li>Мы обсудим детали договора аренды</li>
                <li>Запланируем встречу для осмотра помещения</li>
                <li>Проведем вас через процесс оформления</li>
              </ul>
            </div>
          ` : status === 'rejected' ? `
            <p style="color: #721c24;">
              Мы ценим ваш интерес к ODE Food Hall. Если у вас есть вопросы или вы хотели бы 
              обсудить возможности сотрудничества в будущем, не стесняйтесь обращаться к нам.
            </p>
          ` : `
            <p>
              Мы рассмотрим вашу заявку и свяжемся с вами в течение 2-3 рабочих дней. 
              Если у вас есть дополнительные вопросы, вы можете связаться с нами по указанным ниже контактам.
            </p>
          `}

          <div style="background-color: #fff; border: 1px solid #dee2e6; border-radius: 6px; padding: 20px; margin-top: 30px;">
            <p style="margin: 0 0 10px 0; font-weight: bold;">Контакты для связи:</p>
            <p style="margin: 5px 0;">📧 Email: <a href="mailto:tenants@odefoodhall.com" style="color: #8B0000;">tenants@odefoodhall.com</a></p>
            <p style="margin: 5px 0;">📱 Телефон: <a href="tel:+6236112345667" style="color: #8B0000;">+62 361 123 4567</a></p>
            <p style="margin: 5px 0;">📍 Адрес: Jl. Batu Bolong, Canggu, Bali</p>
          </div>
        </div>

        <div style="text-align: center; color: #6c757d; font-size: 14px; margin-top: 30px;">
          <p>С уважением,<br><strong>Команда ODE Food Hall</strong></p>
          <p style="font-size: 12px;">
            Номер заявки: ${booking_id.slice(-8)}<br>
            Это автоматическое письмо, пожалуйста, не отвечайте на него.
          </p>
        </div>
      </body>
    </html>
  `;
};

const createAdminNotificationHTML = (data: {
  company_name: string;
  contact_person: string;
  email: string;
  business_type: string;
  booking_id: string;
  status: string;
}) => {
  const { company_name, contact_person, email, business_type, booking_id, status } = data;
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>ODE Admin - Новая заявка на аренду</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #8B0000;">
          <h2 style="color: #8B0000; margin-top: 0;">🏢 Новая заявка на аренду</h2>
          
          <p>Получена новая заявка на аренду помещения:</p>
          
          <div style="background-color: #fff; padding: 15px; border-radius: 6px; margin: 15px 0;">
            <p><strong>Компания:</strong> ${company_name}</p>
            <p><strong>Контактное лицо:</strong> ${contact_person}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #8B0000;">${email}</a></p>
            <p><strong>Тип бизнеса:</strong> ${business_type}</p>
            <p><strong>Статус:</strong> <span style="color: #f59e0b;">На рассмотрении</span></p>
          </div>
          
          <div style="text-align: center; margin: 20px 0;">
            <a href="https://odefoodhall.com/admin" 
               style="background-color: #8B0000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Просмотреть в админ-панели
            </a>
          </div>
          
          <p style="font-size: 12px; color: #6c757d;">
            Номер заявки: ${booking_id.slice(-8)}<br>
            Время получения: ${new Date().toLocaleString('ru-RU')}
          </p>
        </div>
      </body>
    </html>
  `;
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { booking_id, status, admin_comment, notify_admins }: TenantNotificationRequest = await req.json();

    console.log(`Processing notification for booking ${booking_id}, status: ${status}`);

    // Get booking details
    const { data: booking, error: bookingError } = await supabase
      .from('space_bookings')
      .select('*')
      .eq('id', booking_id)
      .single();

    if (bookingError || !booking) {
      throw new Error(`Booking not found: ${bookingError?.message}`);
    }

    // Send notification to applicant
    const applicantEmailHTML = createEmailHTML({
      company_name: booking.company_name,
      contact_person: booking.contact_person,
      status: status,
      admin_comment: admin_comment,
      booking_id: booking_id
    });

    const subjectMap = {
      approved: `🎉 Ваша заявка одобрена - ${booking.company_name}`,
      rejected: `📋 Обновление по заявке - ${booking.company_name}`,
      pending: `⏳ Заявка получена - ${booking.company_name}`
    };

    console.log(`Sending email to applicant: ${booking.email}`);

    const applicantEmailResult = await resend.emails.send({
      from: 'ODE Food Hall <tenants@odefoodhall.com>',
      to: [booking.email],
      subject: subjectMap[status],
      html: applicantEmailHTML,
    });

    console.log('Applicant email sent:', applicantEmailResult);

    // Send notification to admins for new applications
    if (notify_admins && status === 'pending') {
      const adminEmailHTML = createAdminNotificationHTML({
        company_name: booking.company_name,
        contact_person: booking.contact_person,
        email: booking.email,
        business_type: booking.business_type,
        booking_id: booking_id,
        status: status
      });

      // Get admin emails
      const { data: adminUsers, error: adminError } = await supabase
        .from('user_roles')
        .select(`
          user_id,
          profiles!user_roles_user_id_fkey(id)
        `)
        .eq('role', 'admin');

      if (!adminError && adminUsers?.length) {
        // For demo purposes, send to a predefined admin email
        // In production, you'd get actual admin emails from the profiles
        console.log('Sending admin notification email');

        const adminEmailResult = await resend.emails.send({
          from: 'ODE System <system@odefoodhall.com>',
          to: ['admin@odefoodhall.com'], // Replace with actual admin emails
          subject: `🏢 Новая заявка на аренду от ${booking.company_name}`,
          html: adminEmailHTML,
        });

        console.log('Admin email sent:', adminEmailResult);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Notifications sent successfully',
        applicant_email: booking.email,
        status: status
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error('Error in send-tenant-notification function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack 
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);