-- Fix Function Search Path Mutable warnings
-- Add search_path to all existing functions for security

-- Fix get_availability function
CREATE OR REPLACE FUNCTION public.get_availability(p_experience_type text, p_booking_date date)
 RETURNS TABLE(time_slot time without time zone, is_available boolean, booked_count bigint)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  WITH time_slots AS (
    SELECT DISTINCT 
      CASE 
        WHEN i = 0 THEN '11:00'::time
        WHEN i = 1 THEN '11:30'::time
        WHEN i = 2 THEN '12:00'::time
        WHEN i = 3 THEN '12:30'::time
        WHEN i = 4 THEN '13:00'::time
        WHEN i = 5 THEN '13:30'::time
        WHEN i = 6 THEN '14:00'::time
        WHEN i = 7 THEN '14:30'::time
        WHEN i = 8 THEN '15:00'::time
        WHEN i = 9 THEN '15:30'::time
        WHEN i = 10 THEN '16:00'::time
        WHEN i = 11 THEN '16:30'::time
        WHEN i = 12 THEN '17:00'::time
        WHEN i = 13 THEN '17:30'::time
        WHEN i = 14 THEN '18:00'::time
        WHEN i = 15 THEN '18:30'::time
        WHEN i = 16 THEN '19:00'::time
        WHEN i = 17 THEN '19:30'::time
        WHEN i = 18 THEN '20:00'::time
        WHEN i = 19 THEN '20:30'::time
        WHEN i = 20 THEN '21:00'::time
        WHEN i = 21 THEN '21:30'::time
        ELSE '22:00'::time
      END as time_slot
    FROM generate_series(0, 22) i
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
$function$;

-- Fix generate_referral_code function
CREATE OR REPLACE FUNCTION public.generate_referral_code()
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
    code TEXT;
    exists_check BOOLEAN;
BEGIN
    LOOP
        -- Generate 6 character alphanumeric code
        code := UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6));
        
        -- Check if code already exists
        SELECT EXISTS(SELECT 1 FROM public.profiles WHERE referral_code = code) INTO exists_check;
        
        -- Exit loop if code is unique
        IF NOT exists_check THEN
            EXIT;
        END IF;
    END LOOP;
    
    RETURN code;
END;
$function$;

-- Fix handle_referral_reward function
CREATE OR REPLACE FUNCTION public.handle_referral_reward(referrer_code text, new_user_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
    referrer_id UUID;
BEGIN
    -- Find referrer by code
    SELECT id INTO referrer_id FROM public.profiles WHERE referral_code = referrer_code;
    
    IF referrer_id IS NOT NULL AND referrer_id != new_user_id THEN
        -- Update referred_by for new user
        UPDATE public.profiles SET referred_by = referrer_id WHERE id = new_user_id;
        
        -- Give 25 points to both users
        INSERT INTO public.loyalty_programs (user_id, points) 
        VALUES (referrer_id, 25), (new_user_id, 25)
        ON CONFLICT (user_id) 
        DO UPDATE SET points = loyalty_programs.points + 25;
        
        -- Create notifications
        INSERT INTO public.user_notifications (user_id, type, title, message, data)
        VALUES 
        (referrer_id, 'referral', 'Referral Bonus!', 'You earned 25 points for referring a friend!', jsonb_build_object('points', 25, 'trigger_email', true, 'email_type', 'referral_bonus')),
        (new_user_id, 'welcome', 'Welcome Bonus!', 'You received 25 points for joining through a referral!', jsonb_build_object('points', 25, 'trigger_email', true, 'email_type', 'welcome_bonus'));
    END IF;
END;
$function$;