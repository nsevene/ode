-- Fix critical security vulnerability in bookings table RLS policies
-- Issue: Guest bookings and admin access not properly secured

-- First, drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Authenticated users can create their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Guest bookings allowed" ON public.bookings;
DROP POLICY IF EXISTS "Users can update their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;

-- 1. SELECT policies - restrict access to booking owners and admins only
CREATE POLICY "Users can view their own bookings"
ON public.bookings
FOR SELECT
USING (
  -- Authenticated users can see their own bookings
  (auth.uid() IS NOT NULL AND user_id = auth.uid())
);

CREATE POLICY "Admins can view all bookings"
ON public.bookings
FOR SELECT
USING (
  -- Users with admin role can see all bookings
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::app_role
  )
);

-- 2. INSERT policies - allow authenticated users and validated guests
CREATE POLICY "Authenticated users can create their own bookings"
ON public.bookings
FOR INSERT
WITH CHECK (
  -- Must be authenticated and user_id matches
  (auth.uid() IS NOT NULL AND user_id = auth.uid())
);

CREATE POLICY "Guest bookings allowed with validation"
ON public.bookings
FOR INSERT
WITH CHECK (
  -- Guest bookings must have null user_id but valid guest info
  (user_id IS NULL) 
  AND (guest_email IS NOT NULL) 
  AND (guest_name IS NOT NULL)
  AND (guest_email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'::text)
  AND (LENGTH(guest_name) >= 2)
  AND (guest_phone IS NOT NULL)
);

-- 3. UPDATE policies - restrict to owners and admins
CREATE POLICY "Users can update their own bookings"
ON public.bookings
FOR UPDATE
USING (
  -- Only authenticated users can update their own bookings
  (auth.uid() IS NOT NULL AND user_id = auth.uid())
);

CREATE POLICY "Admins can update all bookings"
ON public.bookings
FOR UPDATE
USING (
  -- Admins can update any booking
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::app_role
  )
);

-- 4. DELETE policies - only admins can delete (soft delete recommended instead)
CREATE POLICY "Only admins can delete bookings"
ON public.bookings
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::app_role
  )
);

-- 5. Create a secure function for guests to access their own bookings
-- This provides a secure way for guests to view their booking without exposing all guest bookings
CREATE OR REPLACE FUNCTION public.get_guest_booking_secure(
  p_booking_id UUID,
  p_guest_email TEXT,
  p_verification_code TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  booking_record RECORD;
  result JSON;
BEGIN
  -- Validate inputs
  IF p_booking_id IS NULL OR p_guest_email IS NULL THEN
    RETURN json_build_object('error', 'Missing required parameters');
  END IF;
  
  -- Get booking with exact match on ID and email
  SELECT * INTO booking_record 
  FROM public.bookings 
  WHERE id = p_booking_id 
    AND guest_email = p_guest_email
    AND user_id IS NULL; -- Ensure it's a guest booking
  
  IF booking_record IS NULL THEN
    RETURN json_build_object('error', 'Booking not found or access denied');
  END IF;
  
  -- Return booking details (exclude sensitive internal fields)
  result := json_build_object(
    'id', booking_record.id,
    'booking_date', booking_record.booking_date,
    'time_slot', booking_record.time_slot,
    'guest_count', booking_record.guest_count,
    'experience_type', booking_record.experience_type,
    'status', booking_record.status,
    'payment_status', booking_record.payment_status,
    'payment_amount', booking_record.payment_amount,
    'special_requests', booking_record.special_requests,
    'guest_name', booking_record.guest_name,
    'guest_email', booking_record.guest_email,
    'guest_phone', booking_record.guest_phone,
    'created_at', booking_record.created_at
  );
  
  RETURN result;
END;
$$;