-- Fix search_path security vulnerability for database functions
-- This prevents potential security issues where search_path could be manipulated

-- Update existing functions to include SET search_path = 'public'
CREATE OR REPLACE FUNCTION public.notify_booking_status_change()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
BEGIN
  -- Only send notification if status actually changed
  IF TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status THEN
    -- Insert notification for the user
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
$function$;

CREATE OR REPLACE FUNCTION public.assign_default_role()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
BEGIN
  -- Assign default 'user' role to new users
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  -- Make the first user an admin (for initial setup)
  IF (SELECT COUNT(*) FROM public.user_roles WHERE role = 'admin') = 0 THEN
    UPDATE public.user_roles 
    SET role = 'admin' 
    WHERE user_id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', NEW.email)
  );
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.track_nfc_interaction(p_user_id uuid, p_sector_name text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
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

CREATE OR REPLACE FUNCTION public.generate_nfc_passport_id()
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
DECLARE
    passport_id TEXT;
    exists_check BOOLEAN;
BEGIN
    LOOP
        passport_id := 'ODE' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 5));
        SELECT EXISTS(SELECT 1 FROM public.bookings WHERE nfc_passport_id = passport_id) INTO exists_check;
        IF NOT exists_check THEN
            EXIT;
        END IF;
    END LOOP;
    RETURN passport_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user_referral()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
BEGIN
    NEW.referral_code = public.generate_referral_code();
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_referral_reward(referrer_code text, new_user_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
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

CREATE OR REPLACE FUNCTION public.get_current_user_role()
 RETURNS app_role
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = 'public'
AS $function$
  SELECT role 
  FROM public.user_roles 
  WHERE user_id = auth.uid() 
  ORDER BY 
    CASE 
      WHEN role = 'admin' THEN 1
      WHEN role = 'moderator' THEN 2
      ELSE 3
    END
  LIMIT 1;
$function$;

CREATE OR REPLACE FUNCTION public.generate_referral_code()
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
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

CREATE OR REPLACE FUNCTION public.update_taste_alley_leaderboard()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
BEGIN
  -- Update or insert leaderboard entry
  INSERT INTO public.taste_alley_leaderboard (
    user_id, 
    display_name, 
    total_score, 
    user_level, 
    completed_sectors, 
    fastest_time, 
    achievements_count
  )
  VALUES (
    NEW.user_id,
    COALESCE((SELECT display_name FROM public.profiles WHERE id = NEW.user_id), 'Anonymous'),
    NEW.total_score,
    NEW.user_level,
    NEW.completed_sectors,
    NEW.fastest_time,
    NEW.achievements_count
  )
  ON CONFLICT (user_id) DO UPDATE SET
    total_score = NEW.total_score,
    user_level = NEW.user_level,
    completed_sectors = NEW.completed_sectors,
    fastest_time = LEAST(taste_alley_leaderboard.fastest_time, NEW.fastest_time),
    achievements_count = NEW.achievements_count,
    last_updated = now(),
    updated_at = now();
    
  -- Update rankings
  WITH ranked_users AS (
    SELECT 
      user_id,
      ROW_NUMBER() OVER (ORDER BY total_score DESC, user_level DESC, fastest_time ASC NULLS LAST) as new_rank
    FROM public.taste_alley_leaderboard
  )
  UPDATE public.taste_alley_leaderboard
  SET current_rank = ranked_users.new_rank
  FROM ranked_users
  WHERE taste_alley_leaderboard.user_id = ranked_users.user_id;
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.award_taste_alley_achievement(p_user_id uuid, p_achievement_id text, p_title text, p_description text, p_type text, p_reward_points integer)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
BEGIN
  -- Check if user already has this achievement
  IF NOT EXISTS (
    SELECT 1 FROM public.taste_alley_achievements 
    WHERE user_id = p_user_id AND achievement_id = p_achievement_id
  ) THEN
    -- Award the achievement
    INSERT INTO public.taste_alley_achievements (
      user_id, achievement_id, achievement_title, achievement_description, 
      achievement_type, reward_points
    ) VALUES (
      p_user_id, p_achievement_id, p_title, p_description, p_type, p_reward_points
    );
    
    -- Update progress with reward points and achievement count
    UPDATE public.taste_alley_progress 
    SET 
      total_score = total_score + p_reward_points,
      achievements_count = achievements_count + 1,
      updated_at = now()
    WHERE user_id = p_user_id;
  END IF;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;