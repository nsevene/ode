-- Fix critical RLS security issues on bookings table

-- 1. Drop the overly permissive public policy
DROP POLICY IF EXISTS "Public can check slot availability" ON public.bookings;

-- 2. Create a function for safe availability checking without exposing customer data
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
  WITH time_slots AS (
    SELECT (date '2000-01-01' + (interval '30 minutes' * generate_series(0, 21)))::time as time_slot
    FROM generate_series(0, 21)
    WHERE (date '2000-01-01' + (interval '30 minutes' * generate_series(0, 21)))::time BETWEEN '11:00'::time AND '22:00'::time
  )
  SELECT 
    ts.time_slot,
    CASE WHEN COUNT(b.id) = 0 THEN true ELSE false END as is_available,
    COUNT(b.id) as booked_count
  FROM time_slots ts
  LEFT JOIN public.bookings b ON 
    b.time_slot = ts.time_slot 
    AND b.experience_type = p_experience_type 
    AND b.booking_date = p_booking_date
    AND b.status = 'confirmed'
  GROUP BY ts.time_slot
  ORDER BY ts.time_slot;
$$;

-- 3. Fix the INSERT policy to include proper WITH CHECK validation
DROP POLICY IF EXISTS "Users can create bookings" ON public.bookings;

CREATE POLICY "Authenticated users can create their own bookings" 
ON public.bookings 
FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL AND 
  (user_id = auth.uid() OR user_id IS NULL)
);

-- 4. Create a separate policy for guest bookings (where user_id is null)
CREATE POLICY "Guest bookings allowed" 
ON public.bookings 
FOR INSERT 
WITH CHECK (
  user_id IS NULL AND 
  guest_email IS NOT NULL AND 
  guest_name IS NOT NULL
);

-- 5. Fix the database function security by setting search_path
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

-- 6. Add trigger for updated_at if not exists
DROP TRIGGER IF EXISTS update_bookings_updated_at ON public.bookings;
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 7. Grant necessary permissions for the availability function
GRANT EXECUTE ON FUNCTION public.get_availability(text, date) TO anon, authenticated;