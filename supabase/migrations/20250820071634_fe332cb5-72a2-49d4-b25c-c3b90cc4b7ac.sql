-- Fix critical security vulnerability: Restrict access to guest_profiles table
-- Remove overly permissive RLS policies and implement proper access control

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Guests can view their own profile" ON public.guest_profiles;
DROP POLICY IF EXISTS "System can insert guest profiles" ON public.guest_profiles;
DROP POLICY IF EXISTS "System can update guest profiles" ON public.guest_profiles;

-- Create restrictive RLS policies for guest_profiles
-- Only allow access through database functions (security definer functions)
CREATE POLICY "Only system functions can access guest profiles"
ON public.guest_profiles
FOR ALL
USING (false)
WITH CHECK (false);

-- Update the existing database functions to be SECURITY DEFINER
-- This allows them to bypass RLS when needed for legitimate operations
ALTER FUNCTION public.process_guest_stamp(TEXT, TEXT, TEXT, TEXT, TEXT) SECURITY DEFINER;
ALTER FUNCTION public.get_guest_progress(TEXT) SECURITY DEFINER;

-- Also fix similar issues with related tables for consistency
-- Drop and recreate policies for guest_stamps
DROP POLICY IF EXISTS "Anyone can view stamps" ON public.guest_stamps;
DROP POLICY IF EXISTS "System can insert stamps" ON public.guest_stamps;

CREATE POLICY "Only system functions can access guest stamps"
ON public.guest_stamps
FOR ALL
USING (false)
WITH CHECK (false);

-- Drop and recreate policies for guest_rewards
DROP POLICY IF EXISTS "Guests can view their rewards" ON public.guest_rewards;
DROP POLICY IF EXISTS "System can manage rewards" ON public.guest_rewards;

CREATE POLICY "Only system functions can access guest rewards"
ON public.guest_rewards
FOR ALL
USING (false)
WITH CHECK (false);

-- Add a secure function for guests to view their own progress (if needed by frontend)
CREATE OR REPLACE FUNCTION public.get_guest_profile_secure(p_guest_id TEXT, p_verification_token TEXT DEFAULT NULL)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  guest_record RECORD;
  result JSON;
BEGIN
  -- Basic validation - could add token verification here if needed
  IF p_guest_id IS NULL OR LENGTH(p_guest_id) < 3 THEN
    RETURN json_build_object('error', 'Invalid guest_id');
  END IF;
  
  -- Get guest profile (this function can access the table due to SECURITY DEFINER)
  SELECT * INTO guest_record FROM public.guest_profiles WHERE guest_id = p_guest_id;
  
  IF guest_record IS NULL THEN
    RETURN json_build_object('error', 'Guest not found');
  END IF;
  
  -- Return only non-sensitive information
  result := json_build_object(
    'guest_id', guest_record.guest_id,
    'total_stamps', guest_record.total_stamps,
    'current_streak', guest_record.current_streak,
    'registration_date', guest_record.registration_date,
    'last_stamp_date', guest_record.last_stamp_date
    -- Deliberately exclude name, email, phone for privacy
  );
  
  RETURN result;
END;
$$;