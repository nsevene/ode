-- Find and fix remaining functions without search_path
-- This query will show us which functions need fixing

SELECT 
    p.proname as function_name,
    n.nspname as schema_name,
    pg_get_function_arguments(p.oid) as arguments,
    CASE 
        WHEN p.proconfig IS NULL THEN 'NO search_path set'
        ELSE array_to_string(p.proconfig, ', ')
    END as current_config
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
AND p.proname NOT LIKE 'pg_%'
AND (p.proconfig IS NULL OR NOT EXISTS (
    SELECT 1 FROM unnest(p.proconfig) as cfg 
    WHERE cfg LIKE 'search_path=%'
))
ORDER BY p.proname;