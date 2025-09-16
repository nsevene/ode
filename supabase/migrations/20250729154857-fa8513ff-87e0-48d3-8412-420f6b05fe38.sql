-- Update RLS policy to allow guest submissions for vendor applications
DROP POLICY IF EXISTS "Anyone can submit vendor applications" ON public.vendor_applications;

CREATE POLICY "Anyone can submit vendor applications" 
ON public.vendor_applications 
FOR INSERT 
WITH CHECK (true);