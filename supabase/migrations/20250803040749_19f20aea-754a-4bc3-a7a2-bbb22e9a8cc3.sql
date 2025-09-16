-- Fix search_path security warnings by adding SET search_path TO 'public' to all functions

-- 1. Fix generate_order_number function
CREATE OR REPLACE FUNCTION public.generate_order_number()
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
$function$;

-- 2. Fix set_order_number function
CREATE OR REPLACE FUNCTION public.set_order_number()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
BEGIN
    IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
        NEW.order_number := public.generate_order_number();
    END IF;
    RETURN NEW;
END;
$function$;

-- 3. Fix generate_promo_code function
CREATE OR REPLACE FUNCTION public.generate_promo_code(prefix text DEFAULT 'ODE'::text)
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
        code := prefix || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6));
        SELECT EXISTS(SELECT 1 FROM public.promo_codes WHERE promo_codes.code = code) INTO exists_check;
        IF NOT exists_check THEN
            EXIT;
        END IF;
    END LOOP;
    RETURN code;
END;
$function$;

-- 4. Fix apply_marketing_campaigns function
CREATE OR REPLACE FUNCTION public.apply_marketing_campaigns(p_user_id uuid DEFAULT NULL::uuid, p_guest_email text DEFAULT NULL::text, p_trigger_type text DEFAULT 'booking'::text, p_context jsonb DEFAULT '{}'::jsonb)
 RETURNS TABLE(campaign_id uuid, promo_code text, discount_amount integer)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
    campaign_record RECORD;
    generated_code TEXT;
    user_profile RECORD;
BEGIN
    -- Получаем профиль пользователя если есть
    IF p_user_id IS NOT NULL THEN
        SELECT * INTO user_profile FROM public.profiles WHERE id = p_user_id;
    END IF;
    
    -- Проходим по активным кампаниям
    FOR campaign_record IN 
        SELECT * FROM public.marketing_campaigns 
        WHERE is_active = true 
        AND (start_date IS NULL OR start_date <= now())
        AND (end_date IS NULL OR end_date > now())
    LOOP
        -- Проверяем условия триггера
        IF campaign_record.type = 'first_booking' AND p_trigger_type = 'booking' THEN
            -- Проверяем что это первое бронирование
            IF p_user_id IS NOT NULL THEN
                IF NOT EXISTS(SELECT 1 FROM public.bookings WHERE user_id = p_user_id AND status = 'confirmed') THEN
                    -- Генерируем промо-код
                    generated_code := public.generate_promo_code('FIRST');
                    
                    -- Создаем промо-код
                    INSERT INTO public.promo_codes (code, title, description, discount_type, discount_value, usage_limit, user_usage_limit, valid_until)
                    VALUES (generated_code, campaign_record.title, campaign_record.description, campaign_record.discount_type, campaign_record.discount_value, 1, 1, now() + interval '30 days');
                    
                    -- Записываем применение кампании
                    INSERT INTO public.campaign_applications (campaign_id, user_id, guest_email, promo_code_generated)
                    VALUES (campaign_record.id, p_user_id, p_guest_email, generated_code);
                    
                    RETURN QUERY SELECT campaign_record.id, generated_code, campaign_record.discount_value;
                END IF;
            END IF;
        END IF;
        
        -- Добавляем другие типы кампаний по необходимости
    END LOOP;
END;
$function$;

-- 5. Fix handle_referral_reward function
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

-- 6. Fix generate_referral_code function
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
        code := UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6));
        SELECT EXISTS(SELECT 1 FROM public.profiles WHERE referral_code = code) INTO exists_check;
        IF NOT exists_check THEN
            EXIT;
        END IF;
    END LOOP;
    RETURN code;
END;
$function$;

-- 7. Fix track_nfc_interaction function
CREATE OR REPLACE FUNCTION public.track_nfc_interaction(p_user_id uuid, p_sector_name text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Insert or update progress for this sector
  INSERT INTO public.taste_compass_progress (user_id, sector_name, visit_count, nfc_taps, last_visit_date)
  VALUES (p_user_id, p_sector_name, 1, 1, now())
  ON CONFLICT (user_id, sector_name)
  DO UPDATE SET 
    visit_count = taste_compass_progress.visit_count + 1,
    nfc_taps = taste_compass_progress.nfc_taps + 1,
    last_visit_date = now(),
    updated_at = now();
    
  -- Mark sector as completed after 3 visits
  UPDATE public.taste_compass_progress 
  SET completed = true, updated_at = now()
  WHERE user_id = p_user_id 
    AND sector_name = p_sector_name 
    AND visit_count >= 3 
    AND completed = false;
    
  -- Check if user completed this sector for the first time
  IF (SELECT completed FROM public.taste_compass_progress WHERE user_id = p_user_id AND sector_name = p_sector_name) = true AND
     (SELECT COUNT(*) FROM public.taste_passport_achievements WHERE user_id = p_user_id AND achievement_type = 'sector_completed' AND achievement_name = p_sector_name) = 0 THEN
    
    -- Award sector completion achievement
    INSERT INTO public.taste_passport_achievements (user_id, achievement_type, achievement_name, description, reward_points)
    VALUES (p_user_id, 'sector_completed', p_sector_name, 'Completed ' || p_sector_name || ' taste sector', 50);
    
    -- Award loyalty points
    INSERT INTO public.loyalty_programs (user_id, points) 
    VALUES (p_user_id, 50)
    ON CONFLICT (user_id) 
    DO UPDATE SET points = loyalty_programs.points + 50, updated_at = now();
  END IF;
  
  -- Check if user completed all 8 sectors
  IF (SELECT COUNT(*) FROM public.taste_compass_progress WHERE user_id = p_user_id AND completed = true) = 8 AND
     (SELECT COUNT(*) FROM public.taste_passport_achievements WHERE user_id = p_user_id AND achievement_type = 'compass_master') = 0 THEN
    
    -- Award Compass Master achievement
    INSERT INTO public.taste_passport_achievements (user_id, achievement_type, achievement_name, description, reward_points)
    VALUES (p_user_id, 'compass_master', 'Taste Compass Master', 'Completed all 8 taste sectors', 200);
    
    -- Award bonus loyalty points
    INSERT INTO public.loyalty_programs (user_id, points) 
    VALUES (p_user_id, 200)
    ON CONFLICT (user_id) 
    DO UPDATE SET points = loyalty_programs.points + 200, updated_at = now();
    
    -- Create special notification
    INSERT INTO public.user_notifications (user_id, type, title, message, data)
    VALUES (p_user_id, 'achievement', 'Taste Compass Master!', 'Congratulations! You have completed all 8 taste sectors and earned the Taste Compass Master achievement!', 
            jsonb_build_object('achievement', 'compass_master', 'points', 200, 'trigger_email', true, 'email_type', 'compass_master'));
  END IF;
END;
$function$;