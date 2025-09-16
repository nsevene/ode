-- Fix critical RLS security issues

-- 1. Add missing vendor_applications table (referenced in security scan)
CREATE TABLE IF NOT EXISTS public.vendor_applications (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    company_name text NOT NULL,
    contact_person text NOT NULL,
    email text NOT NULL,
    phone text NOT NULL,
    business_type text NOT NULL,
    cuisine_type text,
    description text NOT NULL,
    expected_revenue text,
    investment_budget text,
    previous_experience text,
    special_requirements text,
    status text NOT NULL DEFAULT 'pending'::text,
    admin_notes text,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on vendor_applications
ALTER TABLE public.vendor_applications ENABLE ROW LEVEL SECURITY;

-- 2. Fix guest booking data access - only allow guests to view their own bookings with verification
DROP POLICY IF EXISTS "Guest bookings allowed with validation" ON public.bookings;
CREATE POLICY "Guest bookings can be created with validation" 
ON public.bookings 
FOR INSERT 
WITH CHECK (
    (user_id IS NULL) AND 
    (guest_email IS NOT NULL) AND 
    (guest_name IS NOT NULL) AND 
    (guest_email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'::text) AND 
    (length(guest_name) >= 2) AND 
    (guest_phone IS NOT NULL)
);

-- Add secure guest booking view policy
CREATE POLICY "Guests can only view their own bookings with email verification" 
ON public.bookings 
FOR SELECT 
USING (
    (user_id IS NULL) AND 
    (guest_email = current_setting('request.jwt.claims', true)::json->>'guest_email')
);

-- 3. Strengthen food orders RLS - prevent access to other users' orders
DROP POLICY IF EXISTS "Guests can view orders with matching email" ON public.food_orders;
CREATE POLICY "Guests can only view their own orders with verification" 
ON public.food_orders 
FOR SELECT 
USING (
    (user_id IS NULL) AND 
    (guest_email IS NOT NULL) AND
    (guest_email = current_setting('request.jwt.claims', true)::json->>'guest_email')
);

-- 4. Add RLS policies for vendor_applications
CREATE POLICY "Anyone can submit vendor applications" 
ON public.vendor_applications 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Only admins can view vendor applications" 
ON public.vendor_applications 
FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() AND role = 'admin'::app_role
    )
);

CREATE POLICY "Only admins can update vendor applications" 
ON public.vendor_applications 
FOR UPDATE 
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() AND role = 'admin'::app_role
    )
) 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() AND role = 'admin'::app_role
    )
);

CREATE POLICY "Only admins can delete vendor applications" 
ON public.vendor_applications 
FOR DELETE 
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() AND role = 'admin'::app_role
    )
);

-- 5. Add updated_at trigger for vendor_applications
CREATE TRIGGER update_vendor_applications_updated_at
BEFORE UPDATE ON public.vendor_applications
FOR EACH ROW
EXECUTE FUNCTION public.update_vendor_applications_updated_at();

-- 6. Strengthen order_items policies to prevent cross-user access
DROP POLICY IF EXISTS "Guests can view their order items" ON public.order_items;
CREATE POLICY "Guests can only view their verified order items" 
ON public.order_items 
FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.food_orders fo 
        WHERE fo.id = order_items.order_id 
        AND fo.user_id IS NULL 
        AND fo.guest_email IS NOT NULL
        AND fo.guest_email = current_setting('request.jwt.claims', true)::json->>'guest_email'
    )
);

-- 7. Fix storage policies for vendor-documents bucket
-- Ensure only document owners or admins can access vendor documents
CREATE POLICY IF NOT EXISTS "Only document owners can view vendor documents" 
ON storage.objects 
FOR SELECT 
USING (
    bucket_id = 'vendor-documents' AND (
        -- Admin access
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() AND role = 'admin'::app_role
        ) OR
        -- Owner access based on folder structure (user_id/file)
        auth.uid()::text = (storage.foldername(name))[1]
    )
);

CREATE POLICY IF NOT EXISTS "Only authenticated users can upload vendor documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
    bucket_id = 'vendor-documents' AND 
    auth.uid() IS NOT NULL AND
    auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY IF NOT EXISTS "Only document owners can update vendor documents" 
ON storage.objects 
FOR UPDATE 
USING (
    bucket_id = 'vendor-documents' AND (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() AND role = 'admin'::app_role
        ) OR
        auth.uid()::text = (storage.foldername(name))[1]
    )
);

CREATE POLICY IF NOT EXISTS "Only document owners can delete vendor documents" 
ON storage.objects 
FOR DELETE 
USING (
    bucket_id = 'vendor-documents' AND (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() AND role = 'admin'::app_role
        ) OR
        auth.uid()::text = (storage.foldername(name))[1]
    )
);