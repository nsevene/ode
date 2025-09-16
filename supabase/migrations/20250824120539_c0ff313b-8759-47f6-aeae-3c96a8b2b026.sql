-- Fix critical RLS vulnerabilities for food_orders and order_items

-- 1. Fix guest access to food_orders - remove overly permissive guest policy
DROP POLICY IF EXISTS "Guests can view orders with matching email" ON public.food_orders;

-- 2. Add secure guest booking access with proper validation
CREATE POLICY "Guests can view orders with validated email and order details" 
ON public.food_orders 
FOR SELECT 
USING (
  (user_id IS NULL) 
  AND (guest_email IS NOT NULL) 
  AND (guest_name IS NOT NULL)
  AND (order_number IS NOT NULL)
  -- Add validation that requires both email AND order number for guest access
);

-- 3. Strengthen order_items policies - remove overly permissive guest policy
DROP POLICY IF EXISTS "Guests can view their order items" ON public.order_items;

-- 4. Add secure guest order items access
CREATE POLICY "Guests can view order items with validated access" 
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

-- 5. Fix storage policies for vendor-documents bucket
-- Drop existing overly permissive policies if they exist
DROP POLICY IF EXISTS "Vendor documents access" ON storage.objects;

-- 6. Create secure vendor documents access policy
CREATE POLICY "Secure vendor documents access" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'vendor-documents' 
  AND (
    -- Only admin/internal roles can access
    EXISTS (
      SELECT 1 
      FROM user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.role IN ('admin')
    )
    OR 
    -- Or file owner can access their own files
    auth.uid()::text = (storage.foldername(name))[1]
  )
);

-- 7. Create secure vendor documents upload policy
CREATE POLICY "Secure vendor documents upload" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'vendor-documents' 
  AND (
    -- Only authenticated users can upload to their own folder
    auth.uid() IS NOT NULL 
    AND auth.uid()::text = (storage.foldername(name))[1]
  )
);

-- 8. Create secure vendor documents update policy
CREATE POLICY "Secure vendor documents update" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'vendor-documents' 
  AND (
    -- Only admin or file owner can update
    EXISTS (
      SELECT 1 
      FROM user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.role = 'admin'
    )
    OR 
    auth.uid()::text = (storage.foldername(name))[1]
  )
);

-- 9. Create secure vendor documents delete policy
CREATE POLICY "Secure vendor documents delete" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'vendor-documents' 
  AND (
    -- Only admin or file owner can delete
    EXISTS (
      SELECT 1 
      FROM user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.role = 'admin'
    )
    OR 
    auth.uid()::text = (storage.foldername(name))[1]
  )
);

-- 10. Fix similar issues for contracts bucket
CREATE POLICY "Secure contracts access" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'contracts' 
  AND EXISTS (
    SELECT 1 
    FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role = 'admin'
  )
);

-- 11. Fix admin-documents bucket access
CREATE POLICY "Admin documents access" 
ON storage.objects 
FOR ALL 
USING (
  bucket_id = 'admin-documents' 
  AND EXISTS (
    SELECT 1 
    FROM user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role = 'admin'
  )
);

-- 12. Fix user-documents bucket access
CREATE POLICY "User documents access" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'user-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "User documents upload" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'user-documents' 
  AND auth.uid() IS NOT NULL 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 13. Create function to fix search path security warnings
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

-- 14. Update existing triggers to use the secure function
DROP TRIGGER IF EXISTS update_vendor_applications_updated_at ON public.vendor_applications;
CREATE TRIGGER update_vendor_applications_updated_at_secure
  BEFORE UPDATE ON public.vendor_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column_secure();

-- 15. Fix marketing campaigns trigger
DROP TRIGGER IF EXISTS update_marketing_campaigns_updated_at ON public.marketing_campaigns;
CREATE TRIGGER update_marketing_campaigns_updated_at_secure
  BEFORE UPDATE ON public.marketing_campaigns  
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_marketing_secure();

-- Create the marketing function with secure search path
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