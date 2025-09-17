// Email configuration and utilities
import { Resend } from 'resend';

// Initialize Resend with API key or fallback for development
const apiKey = import.meta.env.VITE_RESEND_API_KEY || 'dev-key';
const resend = new Resend(apiKey);

export interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export const sendEmail = async (template: EmailTemplate) => {
  try {
    // In development mode without API key, just log the email
    if (import.meta.env.DEV && !import.meta.env.VITE_RESEND_API_KEY) {
      console.log('📧 Email would be sent:', {
        to: template.to,
        subject: template.subject,
        from: template.from || 'ODE Food Hall <noreply@odefoodhall.com>'
      });
      return { id: 'dev-email-id' };
    }

    const { data, error } = await resend.emails.send({
      from: template.from || 'ODE Food Hall <noreply@odefoodhall.com>',
      to: template.to,
      subject: template.subject,
      html: template.html,
    });

    if (error) {
      console.error('Email sending error:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
};

// Email templates
export const emailTemplates = {
  tenantApplication: {
    confirmation: (name: string) => ({
      subject: 'Thank you for your application to ODE Food Hall',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2c3e50;">Thank you for your application!</h1>
          <p>Dear ${name},</p>
          <p>Thank you for your interest in joining ODE Food Hall. We have received your application and will review it within 3 business days.</p>
          <p>We'll contact you soon to discuss the next steps.</p>
          <p>Best regards,<br>ODE Food Hall Team</p>
        </div>
      `
    }),
    notification: (applicationData: any) => ({
      subject: 'New tenant application received',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2c3e50;">New Tenant Application</h1>
          <p>A new tenant application has been received:</p>
          <ul>
            <li><strong>Name:</strong> ${applicationData.guest_name}</li>
            <li><strong>Email:</strong> ${applicationData.guest_email}</li>
            <li><strong>Phone:</strong> ${applicationData.guest_phone}</li>
            <li><strong>Business:</strong> ${applicationData.additional_data?.business_name || 'N/A'}</li>
            <li><strong>Type:</strong> ${applicationData.additional_data?.business_type || 'N/A'}</li>
          </ul>
          <p>Please review the application in the admin dashboard.</p>
        </div>
      `
    })
  },

  investorCall: {
    confirmation: (name: string) => ({
      subject: 'Investment consultation request received',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2c3e50;">Consultation Request Received</h1>
          <p>Dear ${name},</p>
          <p>Thank you for your interest in ODE Food Hall investment opportunity. We have received your consultation request and will contact you within 24 hours to schedule your meeting.</p>
          <p>We look forward to discussing this exciting opportunity with you.</p>
          <p>Best regards,<br>ODE Food Hall Investment Team</p>
        </div>
      `
    }),
    notification: (callData: any) => ({
      subject: 'New investment consultation request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2c3e50;">New Investment Consultation Request</h1>
          <p>A new investment consultation request has been received:</p>
          <ul>
            <li><strong>Name:</strong> ${callData.name}</li>
            <li><strong>Email:</strong> ${callData.email}</li>
            <li><strong>Phone:</strong> ${callData.phone}</li>
            <li><strong>Company:</strong> ${callData.company || 'N/A'}</li>
            <li><strong>Investment Range:</strong> ${callData.investmentRange || 'N/A'}</li>
          </ul>
          <p>Please contact the investor to schedule the consultation.</p>
        </div>
      `
    })
  }
};

// Email sending functions
export const sendTenantApplicationConfirmation = async (email: string, name: string) => {
  const template = emailTemplates.tenantApplication.confirmation(name);
  return await sendEmail({
    to: email,
    subject: template.subject,
    html: template.html
  });
};

export const sendTenantApplicationNotification = async (applicationData: any) => {
  const template = emailTemplates.tenantApplication.notification(applicationData);
  return await sendEmail({
    to: 'ops@odefoodhall.com',
    subject: template.subject,
    html: template.html
  });
};

export const sendInvestorCallConfirmation = async (email: string, name: string) => {
  const template = emailTemplates.investorCall.confirmation(name);
  return await sendEmail({
    to: email,
    subject: template.subject,
    html: template.html
  });
};

export const sendInvestorCallNotification = async (callData: any) => {
  const template = emailTemplates.investorCall.notification(callData);
  return await sendEmail({
    to: 'invest@odefoodhall.com',
    subject: template.subject,
    html: template.html
  });
};
