-- Clean up test data inserted during security analysis
DELETE FROM public.contact_messages WHERE email = 'test@example.com' AND name = 'Test User';