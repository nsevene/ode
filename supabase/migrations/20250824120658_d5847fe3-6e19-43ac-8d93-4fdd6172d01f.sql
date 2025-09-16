-- Fix remaining functions with search path security warnings

-- 1. Fix all functions missing SET search_path = public
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE 
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT exists (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    order_num TEXT;
    exists_check BOOLEAN;
BEGIN
    LOOP
        order_num := 'ODE' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 4));
        SELECT EXISTS(SELECT 1 FROM public.food_orders WHERE order_number = order_num) INTO exists_check;
        IF NOT exists_check THEN
            EXIT;
        END IF;
    END LOOP;
    RETURN order_num;
END;
$$;

CREATE OR REPLACE FUNCTION public.set_order_number()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
    IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
        NEW.order_number := public.generate_order_number();
    END IF;
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.generate_promo_code(prefix text DEFAULT 'ODE'::text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    code TEXT;
    exists_check BOOLEAN;
BEGIN
    LOOP
        code := prefix || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6));
        SELECT EXISTS(SELECT 1 FROM public.promo_codes WHERE promo_codes.code = code) INTO exists_check;
        IF NOT exists_check THEN
            EXIT;
        END IF;
    END LOOP;
    RETURN code;
END;
$$;

CREATE OR REPLACE FUNCTION public.notify_booking_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.user_notifications (
      user_id,
      type,
      title,
      message,
      data
    ) VALUES (
      COALESCE(NEW.user_id, OLD.user_id),
      'booking',
      'Статус бронирования изменен',
      'Статус вашего бронирования #' || NEW.id || ' изменен на: ' || NEW.status,
      jsonb_build_object(
        'booking_id', NEW.id,
        'old_status', OLD.status,
        'new_status', NEW.status,
        'booking_date', NEW.booking_date,
        'time_slot', NEW.time_slot
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_availability(p_experience_type text, p_booking_date date)
RETURNS TABLE(time_slot time without time zone, is_available boolean, booked_count bigint)
LANGUAGE sql
STABLE 
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

-- Continue with remaining functions...
CREATE OR REPLACE FUNCTION public.assign_default_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  IF (SELECT COUNT(*) FROM public.user_roles WHERE role = 'admin') = 0 THEN
    UPDATE public.user_roles 
    SET role = 'admin' 
    WHERE user_id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$;