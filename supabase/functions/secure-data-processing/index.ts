import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.52.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DataProcessingRequest {
  action: 'validate' | 'sanitize' | 'encrypt' | 'decrypt' | 'audit';
  data: any;
  dataType: 'booking' | 'payment' | 'user' | 'tenant' | 'investor';
  userId?: string;
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
    const { action, data, dataType, userId }: DataProcessingRequest = await req.json();

    // Initialize Supabase with service role key for secure operations
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Get the requesting user
    const requestingUser = await getRequestingUser(req, supabase);
    if (!requestingUser) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }

    console.log(`Processing ${action} for ${dataType} data by user: ${requestingUser.email}`);

    let result: any;

    switch (action) {
      case 'validate':
        result = await validateData(data, dataType);
        break;
      
      case 'sanitize':
        result = await sanitizeData(data, dataType);
        break;
      
      case 'encrypt':
        result = await encryptData(data, dataType);
        break;
      
      case 'decrypt':
        result = await decryptData(data, dataType);
        break;
      
      case 'audit':
        result = await auditData(data, dataType, requestingUser.id, supabase);
        break;
      
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action. Supported actions: validate, sanitize, encrypt, decrypt, audit' }),
          { 
            status: 400, 
            headers: { 'Content-Type': 'application/json', ...corsHeaders } 
          }
        );
    }

    // Log the data processing action
    await supabase
      .from('security_logs')
      .insert({
        violation_type: 'data_processing',
        user_id: requestingUser.id,
        details: {
          action: action,
          data_type: dataType,
          timestamp: new Date().toISOString(),
          success: result.success || false
        }
      });

    return new Response(
      JSON.stringify(result),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error('Error in secure-data-processing function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

// Helper function to get the requesting user
async function getRequestingUser(req: Request, supabase: any) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return null;
  }

  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) {
    return null;
  }

  return user;
}

// Validate data based on type
async function validateData(data: any, dataType: string) {
  const validationRules = {
    booking: {
      required: ['guest_name', 'guest_email', 'booking_date', 'time_slot', 'guest_count'],
      email: ['guest_email'],
      phone: ['guest_phone'],
      date: ['booking_date'],
      number: ['guest_count']
    },
    payment: {
      required: ['amount', 'currency', 'booking_id'],
      number: ['amount'],
      string: ['currency', 'booking_id']
    },
    user: {
      required: ['email', 'full_name'],
      email: ['email'],
      string: ['full_name', 'phone']
    },
    tenant: {
      required: ['company_name', 'contact_person', 'email', 'business_type'],
      email: ['email'],
      phone: ['phone'],
      number: ['space_area', 'floor_number']
    },
    investor: {
      required: ['full_name', 'email', 'investment_amount'],
      email: ['email'],
      number: ['investment_amount']
    }
  };

  const rules = validationRules[dataType as keyof typeof validationRules];
  if (!rules) {
    return { success: false, error: 'Invalid data type' };
  }

  const errors: string[] = [];

  // Check required fields
  for (const field of rules.required) {
    if (!data[field] || data[field].toString().trim() === '') {
      errors.push(`Required field missing: ${field}`);
    }
  }

  // Validate email fields
  if (rules.email) {
    for (const field of rules.email) {
      if (data[field] && !isValidEmail(data[field])) {
        errors.push(`Invalid email format: ${field}`);
      }
    }
  }

  // Validate phone fields
  if (rules.phone) {
    for (const field of rules.phone) {
      if (data[field] && !isValidPhone(data[field])) {
        errors.push(`Invalid phone format: ${field}`);
      }
    }
  }

  // Validate date fields
  if (rules.date) {
    for (const field of rules.date) {
      if (data[field] && !isValidDate(data[field])) {
        errors.push(`Invalid date format: ${field}`);
      }
    }
  }

  // Validate number fields
  if (rules.number) {
    for (const field of rules.number) {
      if (data[field] && !isValidNumber(data[field])) {
        errors.push(`Invalid number format: ${field}`);
      }
    }
  }

  return {
    success: errors.length === 0,
    errors: errors,
    validated_data: errors.length === 0 ? data : null
  };
}

// Sanitize data to prevent XSS and injection attacks
async function sanitizeData(data: any, dataType: string) {
  const sanitizedData = { ...data };

  // Sanitize string fields
  for (const key in sanitizedData) {
    if (typeof sanitizedData[key] === 'string') {
      // Remove HTML tags and dangerous characters
      sanitizedData[key] = sanitizedData[key]
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/[<>'"]/g, '') // Remove dangerous characters
        .trim();
    }
  }

  // Additional sanitization based on data type
  if (dataType === 'booking') {
    // Sanitize special requests
    if (sanitizedData.special_requests) {
      sanitizedData.special_requests = sanitizedData.special_requests
        .replace(/[<>'"]/g, '')
        .substring(0, 500); // Limit length
    }
  }

  if (dataType === 'tenant') {
    // Sanitize description
    if (sanitizedData.description) {
      sanitizedData.description = sanitizedData.description
        .replace(/[<>'"]/g, '')
        .substring(0, 1000); // Limit length
    }
  }

  return {
    success: true,
    sanitized_data: sanitizedData
  };
}

// Encrypt sensitive data
async function encryptData(data: any, dataType: string) {
  const sensitiveFields = {
    booking: ['guest_phone', 'special_requests'],
    payment: ['card_number', 'cvv'],
    user: ['phone', 'address'],
    tenant: ['phone', 'description'],
    investor: ['phone', 'address']
  };

  const fields = sensitiveFields[dataType as keyof typeof sensitiveFields] || [];
  const encryptedData = { ...data };

  for (const field of fields) {
    if (encryptedData[field]) {
      // Simple base64 encoding for demo (use proper encryption in production)
      encryptedData[field] = btoa(encryptedData[field]);
    }
  }

  return {
    success: true,
    encrypted_data: encryptedData
  };
}

// Decrypt sensitive data
async function decryptData(data: any, dataType: string) {
  const sensitiveFields = {
    booking: ['guest_phone', 'special_requests'],
    payment: ['card_number', 'cvv'],
    user: ['phone', 'address'],
    tenant: ['phone', 'description'],
    investor: ['phone', 'address']
  };

  const fields = sensitiveFields[dataType as keyof typeof sensitiveFields] || [];
  const decryptedData = { ...data };

  for (const field of fields) {
    if (decryptedData[field]) {
      try {
        // Simple base64 decoding for demo (use proper decryption in production)
        decryptedData[field] = atob(decryptedData[field]);
      } catch (error) {
        console.error(`Error decrypting field ${field}:`, error);
      }
    }
  }

  return {
    success: true,
    decrypted_data: decryptedData
  };
}

// Audit data access and changes
async function auditData(data: any, dataType: string, userId: string, supabase: any) {
  const auditRecord = {
    user_id: userId,
    data_type: dataType,
    action: 'data_access',
    data_hash: await hashData(data),
    timestamp: new Date().toISOString(),
    ip_address: 'unknown', // Would be extracted from request headers
    user_agent: 'unknown' // Would be extracted from request headers
  };

  const { error } = await supabase
    .from('data_audit_logs')
    .insert(auditRecord);

  if (error) {
    console.error('Error logging audit:', error);
  }

  return {
    success: true,
    audit_id: auditRecord.data_hash,
    message: 'Data access audited'
  };
}

// Helper functions
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

function isValidNumber(value: any): boolean {
  return !isNaN(parseFloat(value)) && isFinite(value);
}

async function hashData(data: any): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(JSON.stringify(data));
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

serve(handler);
