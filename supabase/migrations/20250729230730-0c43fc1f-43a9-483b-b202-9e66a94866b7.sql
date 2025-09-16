-- Fix RLS policy for vendor_applications table to allow guest submissions
DROP POLICY IF EXISTS "Anyone can submit vendor applications" ON public.vendor_applications;

-- Create a new policy that allows both authenticated and anonymous users to submit applications
CREATE POLICY "Allow vendor application submissions"
ON public.vendor_applications
FOR INSERT
WITH CHECK (true);