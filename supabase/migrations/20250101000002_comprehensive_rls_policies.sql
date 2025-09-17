-- Comprehensive Row Level Security (RLS) Policies
-- This migration implements strict security policies for all tables
-- Default behavior: DENY ALL access, then grant specific permissions

-- ==============================================
-- 1. ENABLE RLS ON ALL TABLES
-- ==============================================

-- Enable RLS on all existing tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investor_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_intents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kitchens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.digital_assets ENABLE ROW LEVEL SECURITY;

-- ==============================================
-- 2. PROFILES TABLE POLICIES
-- ==============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;

-- Users can only SELECT their own profile
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

-- Users can only UPDATE their own profile
CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Users can INSERT their own profile
CREATE POLICY "Users can insert their own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

-- Admins can SELECT all profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role = 'admin'::app_role
    )
);

-- Admins can UPDATE all profiles
CREATE POLICY "Admins can update all profiles"
ON public.profiles
FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role = 'admin'::app_role
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role = 'admin'::app_role
    )
);

-- ==============================================
-- 3. BOOKINGS TABLE POLICIES
-- ==============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can insert their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can update their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can view all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can update all bookings" ON public.bookings;

-- Users can SELECT only their own bookings
CREATE POLICY "Users can view their own bookings"
ON public.bookings
FOR SELECT
USING (auth.uid() = user_id);

-- Users can INSERT bookings for themselves
CREATE POLICY "Users can insert their own bookings"
ON public.bookings
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can UPDATE only their own bookings
CREATE POLICY "Users can update their own bookings"
ON public.bookings
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Admins can SELECT all bookings
CREATE POLICY "Admins can view all bookings"
ON public.bookings
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role = 'admin'::app_role
    )
);

-- Admins can UPDATE all bookings
CREATE POLICY "Admins can update all bookings"
ON public.bookings
FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role = 'admin'::app_role
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role = 'admin'::app_role
    )
);

-- ==============================================
-- 4. ORDERS TABLE POLICIES
-- ==============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can insert their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can update their own orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update all orders" ON public.orders;

-- Users can SELECT only their own orders
CREATE POLICY "Users can view their own orders"
ON public.orders
FOR SELECT
USING (auth.uid() = user_id);

-- Users can INSERT orders for themselves
CREATE POLICY "Users can insert their own orders"
ON public.orders
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can UPDATE only their own orders
CREATE POLICY "Users can update their own orders"
ON public.orders
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Admins can SELECT all orders
CREATE POLICY "Admins can view all orders"
ON public.orders
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role = 'admin'::app_role
    )
);

-- Admins can UPDATE all orders
CREATE POLICY "Admins can update all orders"
ON public.orders
FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role = 'admin'::app_role
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role = 'admin'::app_role
    )
);

-- ==============================================
-- 5. ORDER_ITEMS TABLE POLICIES
-- ==============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own order items" ON public.order_items;
DROP POLICY IF EXISTS "Users can insert their own order items" ON public.order_items;
DROP POLICY IF EXISTS "Admins can view all order items" ON public.order_items;

-- Users can SELECT order items for their own orders
CREATE POLICY "Users can view their own order items"
ON public.order_items
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.orders 
        WHERE id = order_id 
        AND user_id = auth.uid()
    )
);

-- Users can INSERT order items for their own orders
CREATE POLICY "Users can insert their own order items"
ON public.order_items
FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.orders 
        WHERE id = order_id 
        AND user_id = auth.uid()
    )
);

-- Admins can SELECT all order items
CREATE POLICY "Admins can view all order items"
ON public.order_items
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role = 'admin'::app_role
    )
);

-- ==============================================
-- 6. TENANT_APPLICATIONS TABLE POLICIES
-- ==============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own tenant applications" ON public.tenant_applications;
DROP POLICY IF EXISTS "Users can insert their own tenant applications" ON public.tenant_applications;
DROP POLICY IF EXISTS "Admins can view all tenant applications" ON public.tenant_applications;
DROP POLICY IF EXISTS "Admins can update all tenant applications" ON public.tenant_applications;

-- Users can SELECT only their own tenant applications
CREATE POLICY "Users can view their own tenant applications"
ON public.tenant_applications
FOR SELECT
USING (auth.uid() = user_id);

-- Users can INSERT tenant applications for themselves
CREATE POLICY "Users can insert their own tenant applications"
ON public.tenant_applications
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Admins can SELECT all tenant applications
CREATE POLICY "Admins can view all tenant applications"
ON public.tenant_applications
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role = 'admin'::app_role
    )
);

-- Admins can UPDATE all tenant applications
CREATE POLICY "Admins can update all tenant applications"
ON public.tenant_applications
FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role = 'admin'::app_role
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role = 'admin'::app_role
    )
);

-- ==============================================
-- 7. INVESTOR_APPLICATIONS TABLE POLICIES
-- ==============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own investor applications" ON public.investor_applications;
DROP POLICY IF EXISTS "Users can insert their own investor applications" ON public.investor_applications;
DROP POLICY IF EXISTS "Admins can view all investor applications" ON public.investor_applications;
DROP POLICY IF EXISTS "Admins can update all investor applications" ON public.investor_applications;

-- Users can SELECT only their own investor applications
CREATE POLICY "Users can view their own investor applications"
ON public.investor_applications
FOR SELECT
USING (auth.uid() = user_id);

-- Users can INSERT investor applications for themselves
CREATE POLICY "Users can insert their own investor applications"
ON public.investor_applications
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Admins can SELECT all investor applications
CREATE POLICY "Admins can view all investor applications"
ON public.investor_applications
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role = 'admin'::app_role
    )
);

-- Admins can UPDATE all investor applications
CREATE POLICY "Admins can update all investor applications"
ON public.investor_applications
FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role = 'admin'::app_role
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role = 'admin'::app_role
    )
);

-- ==============================================
-- 8. NOTIFICATIONS TABLE POLICIES
-- ==============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Admins can view all notifications" ON public.notifications;
DROP POLICY IF EXISTS "Admins can insert all notifications" ON public.notifications;

-- Users can SELECT only their own notifications
CREATE POLICY "Users can view their own notifications"
ON public.notifications
FOR SELECT
USING (auth.uid() = user_id);

-- Users can UPDATE only their own notifications
CREATE POLICY "Users can update their own notifications"
ON public.notifications
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Admins can SELECT all notifications
CREATE POLICY "Admins can view all notifications"
ON public.notifications
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role = 'admin'::app_role
    )
);

-- Admins can INSERT notifications for any user
CREATE POLICY "Admins can insert all notifications"
ON public.notifications
FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role = 'admin'::app_role
    )
);

-- ==============================================
-- 9. ANALYTICS_EVENTS TABLE POLICIES
-- ==============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own analytics events" ON public.analytics_events;
DROP POLICY IF EXISTS "Users can insert their own analytics events" ON public.analytics_events;
DROP POLICY IF EXISTS "Admins can view all analytics events" ON public.analytics_events;

-- Users can SELECT only their own analytics events
CREATE POLICY "Users can view their own analytics events"
ON public.analytics_events
FOR SELECT
USING (auth.uid() = user_id);

-- Users can INSERT analytics events for themselves
CREATE POLICY "Users can insert their own analytics events"
ON public.analytics_events
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Admins can SELECT all analytics events
CREATE POLICY "Admins can view all analytics events"
ON public.analytics_events
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role = 'admin'::app_role
    )
);

-- ==============================================
-- 10. USER_PREFERENCES TABLE POLICIES
-- ==============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own preferences" ON public.user_preferences;
DROP POLICY IF EXISTS "Users can update their own preferences" ON public.user_preferences;
DROP POLICY IF EXISTS "Users can insert their own preferences" ON public.user_preferences;

-- Users can SELECT only their own preferences
CREATE POLICY "Users can view their own preferences"
ON public.user_preferences
FOR SELECT
USING (auth.uid() = user_id);

-- Users can UPDATE only their own preferences
CREATE POLICY "Users can update their own preferences"
ON public.user_preferences
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Users can INSERT preferences for themselves
CREATE POLICY "Users can insert their own preferences"
ON public.user_preferences
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- ==============================================
-- 11. PAYMENT_INTENTS TABLE POLICIES
-- ==============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own payment intents" ON public.payment_intents;
DROP POLICY IF EXISTS "Users can insert their own payment intents" ON public.payment_intents;
DROP POLICY IF EXISTS "Admins can view all payment intents" ON public.payment_intents;

-- Users can SELECT only their own payment intents
CREATE POLICY "Users can view their own payment intents"
ON public.payment_intents
FOR SELECT
USING (auth.uid() = user_id);

-- Users can INSERT payment intents for themselves
CREATE POLICY "Users can insert their own payment intents"
ON public.payment_intents
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Admins can SELECT all payment intents
CREATE POLICY "Admins can view all payment intents"
ON public.payment_intents
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role = 'admin'::app_role
    )
);

-- ==============================================
-- 12. REVIEWS TABLE POLICIES
-- ==============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view all reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can insert their own reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can update their own reviews" ON public.reviews;
DROP POLICY IF EXISTS "Admins can view all reviews" ON public.reviews;
DROP POLICY IF EXISTS "Admins can update all reviews" ON public.reviews;

-- Users can SELECT all reviews (public data)
CREATE POLICY "Users can view all reviews"
ON public.reviews
FOR SELECT
USING (true);

-- Users can INSERT reviews for themselves
CREATE POLICY "Users can insert their own reviews"
ON public.reviews
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can UPDATE only their own reviews
CREATE POLICY "Users can update their own reviews"
ON public.reviews
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Admins can SELECT all reviews
CREATE POLICY "Admins can view all reviews"
ON public.reviews
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role = 'admin'::app_role
    )
);

-- Admins can UPDATE all reviews
CREATE POLICY "Admins can update all reviews"
ON public.reviews
FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role = 'admin'::app_role
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role = 'admin'::app_role
    )
);

-- ==============================================
-- 13. EVENTS TABLE POLICIES
-- ==============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view all events" ON public.events;
DROP POLICY IF EXISTS "Admins can manage all events" ON public.events;

-- Users can SELECT all events (public data)
CREATE POLICY "Users can view all events"
ON public.events
FOR SELECT
USING (true);

-- Admins can manage all events
CREATE POLICY "Admins can manage all events"
ON public.events
FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role = 'admin'::app_role
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role = 'admin'::app_role
    )
);

-- ==============================================
-- 14. EVENT_REGISTRATIONS TABLE POLICIES
-- ==============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own event registrations" ON public.event_registrations;
DROP POLICY IF EXISTS "Users can insert their own event registrations" ON public.event_registrations;
DROP POLICY IF EXISTS "Admins can view all event registrations" ON public.event_registrations;

-- Users can SELECT only their own event registrations
CREATE POLICY "Users can view their own event registrations"
ON public.event_registrations
FOR SELECT
USING (auth.uid() = user_id);

-- Users can INSERT event registrations for themselves
CREATE POLICY "Users can insert their own event registrations"
ON public.event_registrations
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Admins can SELECT all event registrations
CREATE POLICY "Admins can view all event registrations"
ON public.event_registrations
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role = 'admin'::app_role
    )
);

-- ==============================================
-- 15. MENU_ITEMS TABLE POLICIES
-- ==============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view all menu items" ON public.menu_items;
DROP POLICY IF EXISTS "Admins can manage all menu items" ON public.menu_items;

-- Users can SELECT all menu items (public data)
CREATE POLICY "Users can view all menu items"
ON public.menu_items
FOR SELECT
USING (true);

-- Admins can manage all menu items
CREATE POLICY "Admins can manage all menu items"
ON public.menu_items
FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role = 'admin'::app_role
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role = 'admin'::app_role
    )
);

-- ==============================================
-- 16. KITCHENS TABLE POLICIES
-- ==============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view all kitchens" ON public.kitchens;
DROP POLICY IF EXISTS "Admins can manage all kitchens" ON public.kitchens;

-- Users can SELECT all kitchens (public data)
CREATE POLICY "Users can view all kitchens"
ON public.kitchens
FOR SELECT
USING (true);

-- Admins can manage all kitchens
CREATE POLICY "Admins can manage all kitchens"
ON public.kitchens
FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role = 'admin'::app_role
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role = 'admin'::app_role
    )
);

-- ==============================================
-- 17. SPACES TABLE POLICIES
-- ==============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view all spaces" ON public.spaces;
DROP POLICY IF EXISTS "Admins can manage all spaces" ON public.spaces;

-- Users can SELECT all spaces (public data)
CREATE POLICY "Users can view all spaces"
ON public.spaces
FOR SELECT
USING (true);

-- Admins can manage all spaces
CREATE POLICY "Admins can manage all spaces"
ON public.spaces
FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role = 'admin'::app_role
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role = 'admin'::app_role
    )
);

-- ==============================================
-- 18. TENANTS TABLE POLICIES
-- ==============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view all tenants" ON public.tenants;
DROP POLICY IF EXISTS "Admins can manage all tenants" ON public.tenants;

-- Users can SELECT all tenants (public data)
CREATE POLICY "Users can view all tenants"
ON public.tenants
FOR SELECT
USING (true);

-- Admins can manage all tenants
CREATE POLICY "Admins can manage all tenants"
ON public.tenants
FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role = 'admin'::app_role
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role = 'admin'::app_role
    )
);

-- ==============================================
-- 19. INVESTORS TABLE POLICIES
-- ==============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view all investors" ON public.investors;
DROP POLICY IF EXISTS "Admins can manage all investors" ON public.investors;

-- Users can SELECT all investors (public data)
CREATE POLICY "Users can view all investors"
ON public.investors
FOR SELECT
USING (true);

-- Admins can manage all investors
CREATE POLICY "Admins can manage all investors"
ON public.investors
FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role = 'admin'::app_role
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role = 'admin'::app_role
    )
);

-- ==============================================
-- 20. MARKETING_CAMPAIGNS TABLE POLICIES
-- ==============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can manage all marketing campaigns" ON public.marketing_campaigns;

-- Admins can manage all marketing campaigns
CREATE POLICY "Admins can manage all marketing campaigns"
ON public.marketing_campaigns
FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role = 'admin'::app_role
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role = 'admin'::app_role
    )
);

-- ==============================================
-- 21. DIGITAL_ASSETS TABLE POLICIES
-- ==============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can manage all digital assets" ON public.digital_assets;

-- Admins can manage all digital assets
CREATE POLICY "Admins can manage all digital assets"
ON public.digital_assets
FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role = 'admin'::app_role
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role = 'admin'::app_role
    )
);

-- ==============================================
-- 22. CREATE SECURITY AUDIT FUNCTION
-- ==============================================

-- Function to audit RLS policies
CREATE OR REPLACE FUNCTION public.audit_rls_policies()
RETURNS TABLE(
    table_name TEXT,
    policy_name TEXT,
    policy_type TEXT,
    policy_definition TEXT
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT 
        schemaname||'.'||tablename as table_name,
        policyname as policy_name,
        permissive as policy_type,
        definition as policy_definition
    FROM pg_policies 
    WHERE schemaname = 'public'
    ORDER BY tablename, policyname;
$$;

-- ==============================================
-- 23. CREATE SECURITY MONITORING FUNCTION
-- ==============================================

-- Function to monitor security violations
CREATE OR REPLACE FUNCTION public.log_security_violation(
    violation_type TEXT,
    user_id UUID DEFAULT auth.uid(),
    details JSONB DEFAULT '{}'::jsonb
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.security_logs (
        violation_type,
        user_id,
        details,
        created_at
    ) VALUES (
        violation_type,
        user_id,
        details,
        now()
    );
EXCEPTION
    WHEN OTHERS THEN
        -- Log to system logs if table doesn't exist
        RAISE LOG 'Security violation: % - User: % - Details: %', 
            violation_type, user_id, details;
END;
$$;

-- ==============================================
-- 24. CREATE SECURITY LOGS TABLE
-- ==============================================

-- Create security logs table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.security_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    violation_type TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on security logs
ALTER TABLE public.security_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view security logs
CREATE POLICY "Admins can view security logs"
ON public.security_logs
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role = 'admin'::app_role
    )
);

-- ==============================================
-- 25. CREATE SECURITY SUMMARY
-- ==============================================

-- Function to get security summary
CREATE OR REPLACE FUNCTION public.get_security_summary()
RETURNS JSON
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT json_build_object(
        'total_tables', (
            SELECT COUNT(*) 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name NOT LIKE 'pg_%'
        ),
        'tables_with_rls', (
            SELECT COUNT(*) 
            FROM pg_class c
            JOIN pg_namespace n ON n.oid = c.relnamespace
            WHERE n.nspname = 'public'
            AND c.relrowsecurity = true
        ),
        'total_policies', (
            SELECT COUNT(*) 
            FROM pg_policies 
            WHERE schemaname = 'public'
        ),
        'security_violations_today', (
            SELECT COUNT(*) 
            FROM public.security_logs 
            WHERE created_at >= CURRENT_DATE
        )
    );
$$;

-- ==============================================
-- 26. FINAL SECURITY CHECK
-- ==============================================

-- Verify all tables have RLS enabled
DO $$
DECLARE
    table_record RECORD;
    rls_enabled_count INTEGER := 0;
    total_tables INTEGER := 0;
BEGIN
    -- Count tables with RLS enabled
    SELECT COUNT(*) INTO rls_enabled_count
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
    AND c.relrowsecurity = true;
    
    -- Count total tables
    SELECT COUNT(*) INTO total_tables
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name NOT LIKE 'pg_%';
    
    -- Log results
    RAISE NOTICE 'RLS Security Setup Complete:';
    RAISE NOTICE 'Total tables: %', total_tables;
    RAISE NOTICE 'Tables with RLS enabled: %', rls_enabled_count;
    RAISE NOTICE 'Security coverage: %', 
        CASE 
            WHEN total_tables > 0 THEN ROUND((rls_enabled_count::DECIMAL / total_tables) * 100, 2)
            ELSE 0 
        END || '%';
    
    -- Verify critical tables have RLS
    IF rls_enabled_count < total_tables THEN
        RAISE WARNING 'Some tables may not have RLS enabled. Please check manually.';
    END IF;
END $$;
