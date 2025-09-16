-- Fix contact_messages table security - ensure no public read access
-- Drop existing policies and recreate with stricter controls

DROP POLICY IF EXISTS "Only admins can read contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Anyone can send contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Only admins can update contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Only admins can delete contact messages" ON public.contact_messages;

-- Create secure policies that explicitly require authentication for read access
CREATE POLICY "Authenticated users can send contact messages" 
ON public.contact_messages 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Only authenticated admins can read contact messages" 
ON public.contact_messages 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 
    FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::app_role
  )
);

CREATE POLICY "Only authenticated admins can update contact messages" 
ON public.contact_messages 
FOR UPDATE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 
    FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::app_role
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::app_role
  )
);

CREATE POLICY "Only authenticated admins can delete contact messages" 
ON public.contact_messages 
FOR DELETE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 
    FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::app_role
  )
);

-- Also ensure RLS is enabled (should already be, but let's confirm)
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;