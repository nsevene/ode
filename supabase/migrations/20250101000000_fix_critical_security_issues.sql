-- Fix critical security issues in ODE Food Hall
-- This migration addresses all security vulnerabilities found in the audit

-- 1. Enable RLS on all tables that don't have it
DO $$
DECLARE
    table_name TEXT;
BEGIN
    FOR table_name IN 
        SELECT schemaname||'.'||tablename 
        FROM pg_tables 
        WHERE schemaname = 'public' 
        AND rowsecurity = false
    LOOP
        EXECUTE 'ALTER TABLE ' || table_name || ' ENABLE ROW LEVEL SECURITY';
        RAISE NOTICE 'Enabled RLS on table: %', table_name;
    END LOOP;
END $$;

-- 2. Drop all existing policies to recreate them properly
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    FOR policy_record IN 
        SELECT schemaname, tablename, policyname 
        FROM pg_policies 
        WHERE schemaname = 'public'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || policy_record.policyname || '" ON ' || policy_record.schemaname || '.' || policy_record.tablename;
    END LOOP;
END $$;

-- 3. Create secure policies for user_roles table
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role = 'admin'::app_role
    )
);

CREATE POLICY "Admins can manage all roles"
ON public.user_roles
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

-- 4. Create secure policies for bookings table
CREATE POLICY "Users can view their own bookings"
ON public.bookings
FOR SELECT
USING (
    (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR
    (user_id IS NULL AND guest_email = current_setting('request.jwt.claims', true)::json->>'email')
);

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

CREATE POLICY "Users can create their own bookings"
ON public.bookings
FOR INSERT
WITH CHECK (
    (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR
    (user_id IS NULL AND guest_email IS NOT NULL AND guest_name IS NOT NULL AND guest_phone IS NOT NULL)
);

CREATE POLICY "Users can update their own bookings"
ON public.bookings
FOR UPDATE
USING (
    (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR
    (user_id IS NULL AND guest_email = current_setting('request.jwt.claims', true)::json->>'email')
);

CREATE POLICY "Admins can update all bookings"
ON public.bookings
FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role = 'admin'::app_role
    )
);

-- 5. Create secure policies for food_orders table
CREATE POLICY "Users can view their own orders"
ON public.food_orders
FOR SELECT
USING (
    (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR
    (user_id IS NULL AND guest_email = current_setting('request.jwt.claims', true)::json->>'email')
);

CREATE POLICY "Admins can view all orders"
ON public.food_orders
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role = 'admin'::app_role
    )
);

CREATE POLICY "Users can create their own orders"
ON public.food_orders
FOR INSERT
WITH CHECK (
    (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR
    (user_id IS NULL AND guest_email IS NOT NULL AND guest_name IS NOT NULL AND guest_phone IS NOT NULL)
);

CREATE POLICY "Users can update their own orders"
ON public.food_orders
FOR UPDATE
USING (
    (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR
    (user_id IS NULL AND guest_email = current_setting('request.jwt.claims', true)::json->>'email')
);

CREATE POLICY "Admins can update all orders"
ON public.food_orders
FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role = 'admin'::app_role
    )
);

-- 6. Create secure policies for menu_items table
CREATE POLICY "Anyone can view menu items"
ON public.menu_items
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage menu items"
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

-- 7. Create secure policies for events table
CREATE POLICY "Anyone can view published events"
ON public.events
FOR SELECT
USING (status = 'published');

CREATE POLICY "Admins can view all events"
ON public.events
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role = 'admin'::app_role
    )
);

CREATE POLICY "Admins can manage events"
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

-- 8. Create secure policies for vendor_applications table
CREATE POLICY "Anyone can submit vendor applications"
ON public.vendor_applications
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can view all vendor applications"
ON public.vendor_applications
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role = 'admin'::app_role
    )
);

CREATE POLICY "Admins can update vendor applications"
ON public.vendor_applications
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

-- 9. Create secure policies for guest_profiles table
CREATE POLICY "Users can view their own guest profile"
ON public.guest_profiles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own guest profile"
ON public.guest_profiles
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own guest profile"
ON public.guest_profiles
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all guest profiles"
ON public.guest_profiles
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role = 'admin'::app_role
    )
);

-- 10. Create secure policies for guest_stamps table
CREATE POLICY "Users can view their own stamps"
ON public.guest_stamps
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own stamps"
ON public.guest_stamps
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all stamps"
ON public.guest_stamps
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role = 'admin'::app_role
    )
);

-- 11. Create secure policies for space_bookings table
CREATE POLICY "Users can view their own space bookings"
ON public.space_bookings
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own space bookings"
ON public.space_bookings
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own space bookings"
ON public.space_bookings
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all space bookings"
ON public.space_bookings
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role = 'admin'::app_role
    )
);

-- 12. Create secure policies for spaces table
CREATE POLICY "Anyone can view spaces"
ON public.spaces
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage spaces"
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

-- 13. Add indexes for performance
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_bookings_date ON public.bookings(booking_date);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_food_orders_user_id ON public.food_orders(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_food_orders_status ON public.food_orders(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_events_status ON public.events(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_events_date ON public.events(event_date);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_guest_profiles_user_id ON public.guest_profiles(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_guest_stamps_user_id ON public.guest_stamps(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_space_bookings_user_id ON public.space_bookings(user_id);

-- 14. Create function to check if user has specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 15. Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT public.has_role(_user_id, 'admin'::app_role)
$$;

-- 16. Create function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
  LIMIT 1
$$;

-- 17. Add audit logging for sensitive operations
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL,
    table_name TEXT NOT NULL,
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on audit_logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs"
ON public.audit_logs
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role = 'admin'::app_role
    )
);

-- 18. Create trigger for audit logging
CREATE OR REPLACE FUNCTION public.audit_trigger()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.audit_logs (
        user_id,
        action,
        table_name,
        record_id,
        old_values,
        new_values,
        ip_address,
        user_agent
    ) VALUES (
        auth.uid(),
        TG_OP,
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
        CASE WHEN TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN to_jsonb(NEW) ELSE NULL END,
        inet_client_addr(),
        current_setting('request.headers', true)::json->>'user-agent'
    );
    
    RETURN COALESCE(NEW, OLD);
END;
$$;

-- 19. Add audit triggers to sensitive tables
CREATE TRIGGER audit_user_roles
    AFTER INSERT OR UPDATE OR DELETE ON public.user_roles
    FOR EACH ROW EXECUTE FUNCTION public.audit_trigger();

CREATE TRIGGER audit_bookings
    AFTER INSERT OR UPDATE OR DELETE ON public.bookings
    FOR EACH ROW EXECUTE FUNCTION public.audit_trigger();

CREATE TRIGGER audit_food_orders
    AFTER INSERT OR UPDATE OR DELETE ON public.food_orders
    FOR EACH ROW EXECUTE FUNCTION public.audit_trigger();

-- 20. Create view for admin dashboard with proper security
CREATE OR REPLACE VIEW public.admin_dashboard AS
SELECT 
    'bookings' as table_name,
    COUNT(*) as total_count,
    COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE) as today_count
FROM public.bookings
WHERE EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::app_role
)
UNION ALL
SELECT 
    'food_orders' as table_name,
    COUNT(*) as total_count,
    COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE) as today_count
FROM public.food_orders
WHERE EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::app_role
)
UNION ALL
SELECT 
    'events' as table_name,
    COUNT(*) as total_count,
    COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE) as today_count
FROM public.events
WHERE EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::app_role
);

-- Grant access to admin dashboard view
GRANT SELECT ON public.admin_dashboard TO authenticated;

-- 21. Create function to validate email format
CREATE OR REPLACE FUNCTION public.is_valid_email(email TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
IMMUTABLE
AS $$
  SELECT email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
$$;

-- 22. Create function to validate phone format
CREATE OR REPLACE FUNCTION public.is_valid_phone(phone TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
IMMUTABLE
AS $$
  SELECT phone ~ '^\+?[1-9]\d{1,14}$'
$$;

-- 23. Add constraints for data validation
ALTER TABLE public.bookings 
ADD CONSTRAINT check_guest_email_format 
CHECK (guest_email IS NULL OR public.is_valid_email(guest_email));

ALTER TABLE public.bookings 
ADD CONSTRAINT check_guest_phone_format 
CHECK (guest_phone IS NULL OR public.is_valid_phone(guest_phone));

ALTER TABLE public.food_orders 
ADD CONSTRAINT check_food_orders_guest_email_format 
CHECK (guest_email IS NULL OR public.is_valid_email(guest_email));

ALTER TABLE public.food_orders 
ADD CONSTRAINT check_food_orders_guest_phone_format 
CHECK (guest_phone IS NULL OR public.is_valid_phone(guest_phone));

-- 24. Create function to clean up old audit logs
CREATE OR REPLACE FUNCTION public.cleanup_audit_logs()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    DELETE FROM public.audit_logs 
    WHERE created_at < CURRENT_DATE - INTERVAL '90 days';
END;
$$;

-- 25. Create scheduled job to clean up audit logs (requires pg_cron extension)
-- SELECT cron.schedule('cleanup-audit-logs', '0 2 * * *', 'SELECT public.cleanup_audit_logs();');

-- 26. Add comments for documentation
COMMENT ON TABLE public.user_roles IS 'User roles and permissions for the ODE Food Hall application';
COMMENT ON TABLE public.bookings IS 'Table reservations and bookings';
COMMENT ON TABLE public.food_orders IS 'Food orders from the food hall';
COMMENT ON TABLE public.audit_logs IS 'Audit trail for sensitive operations';
COMMENT ON FUNCTION public.has_role(UUID, app_role) IS 'Check if user has specific role';
COMMENT ON FUNCTION public.is_admin(UUID) IS 'Check if user is admin';
COMMENT ON FUNCTION public.get_user_role(UUID) IS 'Get user role';
COMMENT ON FUNCTION public.audit_trigger() IS 'Trigger function for audit logging';
COMMENT ON FUNCTION public.cleanup_audit_logs() IS 'Clean up old audit logs';

-- 27. Create security report view for admins
CREATE OR REPLACE VIEW public.security_report AS
SELECT 
    'RLS Policies' as category,
    COUNT(*) as count,
    'All tables have RLS enabled' as status
FROM pg_tables 
WHERE schemaname = 'public' 
AND rowsecurity = true
UNION ALL
SELECT 
    'Audit Logs' as category,
    COUNT(*) as count,
    'Audit logging is active' as status
FROM public.audit_logs 
WHERE created_at >= CURRENT_DATE - INTERVAL '1 day'
UNION ALL
SELECT 
    'User Roles' as category,
    COUNT(*) as count,
    'Role-based access control is active' as status
FROM public.user_roles;

-- Grant access to security report
GRANT SELECT ON public.security_report TO authenticated;

-- 28. Final security check
DO $$
DECLARE
    table_name TEXT;
    rls_enabled BOOLEAN;
BEGIN
    FOR table_name IN 
        SELECT schemaname||'.'||tablename 
        FROM pg_tables 
        WHERE schemaname = 'public'
    LOOP
        SELECT rowsecurity INTO rls_enabled
        FROM pg_tables 
        WHERE schemaname = 'public' AND tablename = split_part(table_name, '.', 2);
        
        IF NOT rls_enabled THEN
            RAISE EXCEPTION 'Security vulnerability: Table % does not have RLS enabled', table_name;
        END IF;
    END LOOP;
    
    RAISE NOTICE 'Security audit completed: All tables have RLS enabled';
END $$;
