-- Fix critical security vulnerability in vendor_communications table
-- Restrict access to sensitive business correspondence between admins and vendors

-- Drop existing policies to rebuild with proper security
DROP POLICY IF EXISTS "Admins can manage vendor communications" ON public.vendor_communications;
DROP POLICY IF EXISTS "Vendors can view their communications" ON public.vendor_communications;
DROP POLICY IF EXISTS "Anyone can create vendor communications" ON public.vendor_communications;

-- Create secure SELECT policy - only admins and relevant vendors can view
CREATE POLICY "Only admins and relevant vendors can read communications" 
ON public.vendor_communications 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'::app_role
  ) OR
  EXISTS (
    SELECT 1 FROM public.vendor_applications va
    WHERE va.id = vendor_communications.vendor_application_id AND va.email = (
      SELECT email FROM auth.users WHERE id = auth.uid()
    )
  )
);

-- Create secure INSERT policy - only admins can create communications
CREATE POLICY "Only admins can create vendor communications" 
ON public.vendor_communications 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE user_id = auth.uid() AND role = 'admin'::app_role
));

-- Create secure UPDATE policy - only admins can update
CREATE POLICY "Only admins can update vendor communications" 
ON public.vendor_communications 
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
CREATE POLICY "Only admins can delete vendor communications" 
ON public.vendor_communications 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE user_id = auth.uid() AND role = 'admin'::app_role
));