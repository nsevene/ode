-- Fix critical RLS vulnerabilities in food_orders and order_items
-- Issue: Current policies allow guest users to potentially see other guests' data

-- Drop existing problematic policies for food_orders
DROP POLICY IF EXISTS "Users can view their own orders" ON public.food_orders;
DROP POLICY IF EXISTS "Users can update their own orders" ON public.food_orders;

-- Create secure policies for food_orders that properly isolate guest and user data
CREATE POLICY "Authenticated users can view their own orders"
ON public.food_orders
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Guests can view orders with matching email"
ON public.food_orders
FOR SELECT
TO anon
USING (user_id IS NULL AND guest_email IS NOT NULL);

CREATE POLICY "Authenticated users can update their own orders"
ON public.food_orders
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Admin access to all orders
CREATE POLICY "Admins can view all food orders"
ON public.food_orders
FOR ALL
TO authenticated
USING (EXISTS (
  SELECT 1 FROM user_roles 
  WHERE user_id = auth.uid() AND role = 'admin'::app_role
));

-- Fix order_items RLS - similar issue
DROP POLICY IF EXISTS "Users can view order items for their orders" ON public.order_items;

CREATE POLICY "Authenticated users can view their order items"
ON public.order_items
FOR SELECT
TO authenticated
USING (EXISTS (
  SELECT 1 FROM food_orders fo 
  WHERE fo.id = order_items.order_id 
  AND fo.user_id = auth.uid()
));

CREATE POLICY "Guests can view their order items"
ON public.order_items
FOR SELECT
TO anon
USING (EXISTS (
  SELECT 1 FROM food_orders fo 
  WHERE fo.id = order_items.order_id 
  AND fo.user_id IS NULL 
  AND fo.guest_email IS NOT NULL
));

CREATE POLICY "Admins can view all order items"
ON public.order_items
FOR ALL
TO authenticated
USING (EXISTS (
  SELECT 1 FROM user_roles 
  WHERE user_id = auth.uid() AND role = 'admin'::app_role
));

-- Fix storage RLS for vendor-documents bucket
-- Current issue: Too permissive policies

-- Create secure storage policies for vendor-documents
CREATE POLICY "Admins can manage vendor documents"
ON storage.objects
FOR ALL
TO authenticated
USING (
  bucket_id = 'vendor-documents' AND
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'::app_role
  )
);

CREATE POLICY "Tenants can view their own vendor documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'vendor-documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Tenants can upload their own vendor documents"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'vendor-documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Fix search path issues for functions
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT exists (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;