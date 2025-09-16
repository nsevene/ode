import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { z } from 'https://esm.sh/zod@3.23.8';

// Validation schemas
const bookingSchema = z.object({
  booking_date: z.string().datetime(),
  booking_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  guests: z.number().int().min(1).max(20),
  special_requests: z.string().optional(),
  guest_name: z.string().min(2).optional(),
  guest_email: z.string().email().optional(),
  guest_phone: z.string().min(10).optional(),
}).refine(
  (data) => data.guest_name && data.guest_email && data.guest_phone,
  {
    message: 'Guest information is required for booking',
    path: ['guest_name'],
  }
);

const updateBookingSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']).optional(),
  special_requests: z.string().optional(),
});

// Error handling
interface AppError {
  type: string;
  message: string;
  code?: string;
  details?: any;
}

const createError = (type: string, message: string, code?: string, details?: any): AppError => ({
  type,
  message,
  code,
  details,
});

const handleError = (error: unknown): AppError => {
  console.error('Function error:', error);
  
  if (error instanceof z.ZodError) {
    return createError(
      'VALIDATION_ERROR',
      'Invalid input data',
      'VALIDATION_FAILED',
      error.errors
    );
  }
  
  if (error && typeof error === 'object' && 'message' in error) {
    return createError(
      'UNKNOWN_ERROR',
      (error as any).message,
      'UNKNOWN_ERROR',
      error
    );
  }
  
  return createError(
    'UNKNOWN_ERROR',
    'An unknown error occurred',
    'UNKNOWN_ERROR',
    error
  );
};

// Security checks
const validateAuth = async (supabase: any): Promise<{ user: any; role: string } | null> => {
  const authHeader = Deno.env.get('Authorization') || '';
  if (!authHeader) {
    throw createError('AUTH_ERROR', 'Authorization header required', 'MISSING_AUTH');
  }
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw createError('AUTH_ERROR', 'Invalid authentication', 'INVALID_AUTH');
  }
  
  // Check user role
  const { data: roleData, error: roleError } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single();
    
  if (roleError || !roleData) {
    throw createError('AUTH_ERROR', 'User role not found', 'NO_ROLE');
  }
  
  return { user, role: roleData.role };
};

const validatePermission = (role: string, requiredRoles: string[]): void => {
  if (!requiredRoles.includes(role)) {
    throw createError(
      'AUTHZ_ERROR',
      'Insufficient permissions',
      'INSUFFICIENT_PERMISSIONS'
    );
  }
};

// Main function
serve(async (req) => {
  try {
    // 1. Validate HTTP method
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify(createError('METHOD_ERROR', 'Only POST method allowed', 'INVALID_METHOD')),
        { 
          status: 405, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }
    
    // 2. Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization') ?? '' },
        },
      }
    );
    
    // 3. Validate authentication
    const authResult = await validateAuth(supabase);
    if (!authResult) {
      return new Response(
        JSON.stringify(createError('AUTH_ERROR', 'Authentication failed', 'AUTH_FAILED')),
        { 
          status: 401, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }
    
    // 4. Parse and validate request body
    const body = await req.json();
    const action = body.action;
    
    if (!action || typeof action !== 'string') {
      return new Response(
        JSON.stringify(createError('VALIDATION_ERROR', 'Action is required', 'MISSING_ACTION')),
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }
    
    // 5. Handle different actions
    switch (action) {
      case 'create':
        return await handleCreateBooking(supabase, authResult, body);
      case 'update':
        return await handleUpdateBooking(supabase, authResult, body);
      case 'cancel':
        return await handleCancelBooking(supabase, authResult, body);
      case 'list':
        return await handleListBookings(supabase, authResult, body);
      default:
        return new Response(
          JSON.stringify(createError('VALIDATION_ERROR', 'Invalid action', 'INVALID_ACTION')),
          { 
            status: 400, 
            headers: { 'Content-Type': 'application/json' } 
          }
        );
    }
    
  } catch (error) {
    const appError = handleError(error);
    return new Response(
      JSON.stringify(appError),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
});

// Create booking handler
async function handleCreateBooking(supabase: any, auth: { user: any; role: string }, body: any) {
  // Validate input
  const validatedData = bookingSchema.parse(body);
  
  // Check permissions
  validatePermission(auth.role, ['admin', 'tenant', 'guest']);
  
  // Create booking
  const { data, error } = await supabase
    .from('bookings')
    .insert([{
      user_id: auth.user.id,
      ...validatedData,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }])
    .select()
    .single();
    
  if (error) {
    throw createError('DATABASE_ERROR', 'Failed to create booking', 'CREATE_FAILED', error);
  }
  
  return new Response(
    JSON.stringify({ 
      success: true, 
      data,
      message: 'Booking created successfully' 
    }),
    { 
      status: 201, 
      headers: { 'Content-Type': 'application/json' } 
    }
  );
}

// Update booking handler
async function handleUpdateBooking(supabase: any, auth: { user: any; role: string }, body: any) {
  // Validate input
  const validatedData = updateBookingSchema.parse(body);
  
  // Check permissions
  validatePermission(auth.role, ['admin', 'tenant']);
  
  // Check if user owns the booking or is admin
  const { data: existingBooking, error: fetchError } = await supabase
    .from('bookings')
    .select('user_id')
    .eq('id', validatedData.id)
    .single();
    
  if (fetchError) {
    throw createError('DATABASE_ERROR', 'Booking not found', 'NOT_FOUND', fetchError);
  }
  
  if (auth.role !== 'admin' && existingBooking.user_id !== auth.user.id) {
    throw createError('AUTHZ_ERROR', 'Cannot update other users bookings', 'FORBIDDEN');
  }
  
  // Update booking
  const { data, error } = await supabase
    .from('bookings')
    .update({
      ...validatedData,
      updated_at: new Date().toISOString(),
    })
    .eq('id', validatedData.id)
    .select()
    .single();
    
  if (error) {
    throw createError('DATABASE_ERROR', 'Failed to update booking', 'UPDATE_FAILED', error);
  }
  
  return new Response(
    JSON.stringify({ 
      success: true, 
      data,
      message: 'Booking updated successfully' 
    }),
    { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' } 
    }
  );
}

// Cancel booking handler
async function handleCancelBooking(supabase: any, auth: { user: any; role: string }, body: any) {
  const { id } = body;
  
  if (!id || typeof id !== 'string') {
    throw createError('VALIDATION_ERROR', 'Booking ID is required', 'MISSING_ID');
  }
  
  // Check permissions
  validatePermission(auth.role, ['admin', 'tenant', 'guest']);
  
  // Check if user owns the booking or is admin
  const { data: existingBooking, error: fetchError } = await supabase
    .from('bookings')
    .select('user_id, status')
    .eq('id', id)
    .single();
    
  if (fetchError) {
    throw createError('DATABASE_ERROR', 'Booking not found', 'NOT_FOUND', fetchError);
  }
  
  if (auth.role !== 'admin' && existingBooking.user_id !== auth.user.id) {
    throw createError('AUTHZ_ERROR', 'Cannot cancel other users bookings', 'FORBIDDEN');
  }
  
  if (existingBooking.status === 'cancelled') {
    throw createError('VALIDATION_ERROR', 'Booking is already cancelled', 'ALREADY_CANCELLED');
  }
  
  // Cancel booking
  const { data, error } = await supabase
    .from('bookings')
    .update({
      status: 'cancelled',
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();
    
  if (error) {
    throw createError('DATABASE_ERROR', 'Failed to cancel booking', 'CANCEL_FAILED', error);
  }
  
  return new Response(
    JSON.stringify({ 
      success: true, 
      data,
      message: 'Booking cancelled successfully' 
    }),
    { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' } 
    }
  );
}

// List bookings handler
async function handleListBookings(supabase: any, auth: { user: any; role: string }, body: any) {
  // Check permissions
  validatePermission(auth.role, ['admin', 'tenant', 'guest']);
  
  let query = supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false });
    
  // If not admin, only show user's own bookings
  if (auth.role !== 'admin') {
    query = query.eq('user_id', auth.user.id);
  }
  
  // Apply filters if provided
  if (body.status) {
    query = query.eq('status', body.status);
  }
  
  if (body.date_from) {
    query = query.gte('booking_date', body.date_from);
  }
  
  if (body.date_to) {
    query = query.lte('booking_date', body.date_to);
  }
  
  // Apply pagination
  const page = body.page || 1;
  const limit = body.limit || 10;
  const offset = (page - 1) * limit;
  
  query = query.range(offset, offset + limit - 1);
  
  const { data, error } = await query;
  
  if (error) {
    throw createError('DATABASE_ERROR', 'Failed to fetch bookings', 'FETCH_FAILED', error);
  }
  
  return new Response(
    JSON.stringify({ 
      success: true, 
      data,
      message: 'Bookings fetched successfully' 
    }),
    { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' } 
    }
  );
}
