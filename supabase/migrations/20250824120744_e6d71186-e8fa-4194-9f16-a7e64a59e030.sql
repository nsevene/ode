-- Fix critical RLS vulnerabilities - Part 2 (handle existing policies)

-- 1. Fix guest access to food_orders - replace existing policy
DROP POLICY IF EXISTS "Guests can view orders with matching email" ON public.food_orders;

CREATE POLICY "Guests can view orders with validated details" 
ON public.food_orders 
FOR SELECT 
USING (
  (user_id IS NULL) 
  AND (guest_email IS NOT NULL) 
  AND (guest_name IS NOT NULL)
  AND (order_number IS NOT NULL)
);

-- 2. Fix order_items policies
DROP POLICY IF EXISTS "Guests can view their order items" ON public.order_items;

CREATE POLICY "Guests can view validated order items" 
ON public.order_items 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 
    FROM food_orders fo 
    WHERE fo.id = order_items.order_id 
    AND fo.user_id IS NULL 
    AND fo.guest_email IS NOT NULL 
    AND fo.guest_name IS NOT NULL
    AND fo.order_number IS NOT NULL
  )
);

-- 3. Fix storage policies - drop and recreate with unique names
DROP POLICY IF EXISTS "Secure vendor documents access" ON storage.objects;
DROP POLICY IF EXISTS "Secure vendor documents upload" ON storage.objects; 
DROP POLICY IF EXISTS "Secure vendor documents update" ON storage.objects;
DROP POLICY IF EXISTS "Secure vendor documents delete" ON storage.objects;
DROP POLICY IF EXISTS "Secure contracts access" ON storage.objects;
DROP POLICY IF EXISTS "Admin documents access" ON storage.objects;
DROP POLICY IF EXISTS "User documents access" ON storage.objects;
DROP POLICY IF EXISTS "User documents upload" ON storage.objects;

-- 4. Create new secure storage policies
CREATE POLICY "Vendor docs view access" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'vendor-documents' 
  AND (
    EXISTS (
      SELECT 1 FROM user_roles ur 
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
    )
    OR auth.uid()::text = (storage.foldername(name))[1]
  )
);

CREATE POLICY "Vendor docs insert access" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'vendor-documents' 
  AND auth.uid() IS NOT NULL 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Contracts admin access" 
ON storage.objects 
FOR ALL 
USING (
  bucket_id = 'contracts' 
  AND EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
  )
);

CREATE POLICY "Admin docs full access" 
ON storage.objects 
FOR ALL 
USING (
  bucket_id = 'admin-documents' 
  AND EXISTS (
    SELECT 1 FROM user_roles ur 
    WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
  )
);

CREATE POLICY "User docs own access" 
ON storage.objects 
FOR ALL 
USING (
  bucket_id = 'user-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 5. Fix functions with search path security warnings
CREATE OR REPLACE FUNCTION public.update_updated_at_column_secure()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_marketing_secure()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER  
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;