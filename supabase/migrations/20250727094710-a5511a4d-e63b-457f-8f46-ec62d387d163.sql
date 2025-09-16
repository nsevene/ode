-- Fix critical RLS security issues on bookings table

-- 1. Drop the overly permissive public policy
DROP POLICY IF EXISTS "Public can check slot availability" ON public.bookings;

-- 2. Create a secure policy for checking availability without exposing customer data
-- This policy allows reading only the booking_date, time_slot, and experience_type for availability checking
CREATE POLICY "Public can check availability data only" 
ON public.bookings 
FOR SELECT 
USING (true);

-- However, we need to create a view or function for safe availability checking
-- Let's create a function that returns only availability info without customer data
CREATE OR REPLACE FUNCTION public.get_availability(
  p_experience_type text,
  p_booking_date date
) RETURNS TABLE (
  time_slot time,
  is_available boolean,
  booked_count bigint
) 
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT 
    b.time_slot,
    CASE WHEN COUNT(b.id) = 0 THEN true ELSE false END as is_available,
    COUNT(b.id) as booked_count
  FROM (
    -- Generate all possible time slots
    SELECT generate_series(
      '11:00'::time,
      '22:00'::time, 
      '30 minutes'::interval
    )::time as time_slot
  ) slots
  LEFT JOIN public.bookings b ON 
    b.time_slot = slots.time_slot 
    AND b.experience_type = p_experience_type 
    AND b.booking_date = p_booking_date
    AND b.status = 'confirmed'
  GROUP BY slots.time_slot, b.time_slot
  ORDER BY slots.time_slot;
$$;

-- 3. Now remove the public SELECT policy and replace with more restrictive ones
DROP POLICY IF EXISTS "Public can check availability data only" ON public.bookings;

-- Users can only view their own bookings
-- Keep the existing policy as it's already correct
-- CREATE POLICY "Users can view their own bookings" ON public.bookings FOR SELECT USING (user_id = auth.uid());

-- 4. Fix the INSERT policy to include proper WITH CHECK validation
DROP POLICY IF EXISTS "Users can create bookings" ON public.bookings;

CREATE POLICY "Authenticated users can create their own bookings" 
ON public.bookings 
FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL AND 
  (user_id = auth.uid() OR user_id IS NULL)
);

-- 5. Create a separate policy for guest bookings (where user_id is null)
CREATE POLICY "Guest bookings allowed" 
ON public.bookings 
FOR INSERT 
WITH CHECK (
  user_id IS NULL AND 
  guest_email IS NOT NULL AND 
  guest_name IS NOT NULL
);

-- 6. Fix the database function security by setting search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
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

-- 7. Add trigger for updated_at if not exists
DROP TRIGGER IF EXISTS update_bookings_updated_at ON public.bookings;
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 8. Grant necessary permissions for the availability function
GRANT EXECUTE ON FUNCTION public.get_availability(text, date) TO anon, authenticated;