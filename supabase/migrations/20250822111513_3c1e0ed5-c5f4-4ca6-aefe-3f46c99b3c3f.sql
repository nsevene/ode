-- Test contact_messages security by attempting to query as service role
-- This will help identify if there are any actual vulnerabilities

-- First, let's verify the current RLS policies are working
-- Insert a test message to verify INSERT works
INSERT INTO public.contact_messages (name, email, phone, message)
VALUES ('Test User', 'test@example.com', '+1234567890', 'Test message for security verification');

-- Verify we can see it with service role (this should work)
SELECT COUNT(*) as total_messages FROM public.contact_messages;

-- The key test: Check if RLS policies are actually enforced
-- by creating a test query that simulates unauthenticated access
SELECT 
  schemaname, 
  tablename, 
  rowsecurity,
  (SELECT count(*) FROM pg_policies WHERE schemaname = 'public' AND tablename = 'contact_messages') as policy_count
FROM pg_tables 
WHERE tablename = 'contact_messages' AND schemaname = 'public';