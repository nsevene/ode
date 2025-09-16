-- Create tables for Taste Compass 2.0 integration and NFC Passport system

-- Table for tracking user progress through taste sectors
CREATE TABLE public.taste_compass_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  sector_name TEXT NOT NULL,
  visit_count INTEGER NOT NULL DEFAULT 0,
  first_visit_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_visit_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed BOOLEAN NOT NULL DEFAULT false,
  nfc_taps INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  UNIQUE(user_id, sector_name)
);

-- Enable RLS
ALTER TABLE public.taste_compass_progress ENABLE ROW LEVEL SECURITY;

-- RLS policies for taste compass progress
CREATE POLICY "Users can view their own taste compass progress" 
ON public.taste_compass_progress 
FOR SELECT 
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert their own taste compass progress" 
ON public.taste_compass_progress 
FOR INSERT 
WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own taste compass progress" 
ON public.taste_compass_progress 
FOR UPDATE 
USING (auth.uid()::text = user_id::text)
WITH CHECK (auth.uid()::text = user_id::text);

-- Table for NFC Passport achievements and rewards
CREATE TABLE public.taste_passport_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  achievement_type TEXT NOT NULL, -- 'sector_completed', 'all_sectors_visited', 'compass_master', etc.
  achievement_name TEXT NOT NULL,
  description TEXT,
  reward_points INTEGER DEFAULT 0,
  unlock_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.taste_passport_achievements ENABLE ROW LEVEL SECURITY;

-- RLS policies for achievements
CREATE POLICY "Users can view their own achievements" 
ON public.taste_passport_achievements 
FOR SELECT 
USING (auth.uid()::text = user_id::text);

CREATE POLICY "System can insert achievements for users" 
ON public.taste_passport_achievements 
FOR INSERT 
WITH CHECK (true); -- Allow system to create achievements

-- Add taste compass fields to bookings table
ALTER TABLE public.bookings 
ADD COLUMN taste_sectors TEXT[] DEFAULT '{}',
ADD COLUMN passport_enabled BOOLEAN DEFAULT false,
ADD COLUMN nfc_passport_id TEXT;

-- Function to track NFC passport interaction
CREATE OR REPLACE FUNCTION public.track_nfc_interaction(
  p_user_id UUID,
  p_sector_name TEXT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
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
$$;

-- Function to generate NFC passport ID
CREATE OR REPLACE FUNCTION public.generate_nfc_passport_id()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    passport_id TEXT;
    exists_check BOOLEAN;
BEGIN
    LOOP
        -- Generate 8 character alphanumeric passport ID
        passport_id := 'ODE' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 5));
        
        -- Check if passport ID already exists
        SELECT EXISTS(SELECT 1 FROM public.bookings WHERE nfc_passport_id = passport_id) INTO exists_check;
        
        -- Exit loop if passport ID is unique
        IF NOT exists_check THEN
            EXIT;
        END IF;
    END LOOP;
    
    RETURN passport_id;
END;
$$;

-- Add trigger to update updated_at for taste_compass_progress
CREATE TRIGGER update_taste_compass_progress_updated_at
BEFORE UPDATE ON public.taste_compass_progress
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();