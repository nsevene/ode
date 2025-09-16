-- Fix critical security vulnerability in space_bookings table
-- Restrict access to sensitive business application data

-- Drop existing policies to rebuild with proper security
DROP POLICY IF EXISTS "Admins can update space bookings" ON public.space_bookings;
DROP POLICY IF EXISTS "Admins can view all space bookings" ON public.space_bookings;
DROP POLICY IF EXISTS "Anyone can submit space booking applications" ON public.space_bookings;

-- Create secure SELECT policy - only admins can view sensitive business data
CREATE POLICY "Only admins can view space bookings" 
ON public.space_bookings 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE user_id = auth.uid() AND role = 'admin'::app_role
));

-- Create secure INSERT policy - allow applications but no data exposure
CREATE POLICY "Anyone can submit space booking applications" 
ON public.space_bookings 
FOR INSERT 
WITH CHECK (true);

-- Create secure UPDATE policy - only admins can update
CREATE POLICY "Only admins can update space bookings" 
ON public.space_bookings 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE user_id = auth.uid() AND role = 'admin'::app_role
))
WITH CHECK (EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE user_id = auth.uid() AND role = 'admin'::app_role
));

-- Create secure DELETE policy - only admins can delete
CREATE POLICY "Only admins can delete space bookings" 
ON public.space_bookings 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE user_id = auth.uid() AND role = 'admin'::app_role
));