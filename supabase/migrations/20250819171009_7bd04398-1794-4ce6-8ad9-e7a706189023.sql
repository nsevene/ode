-- Create guest profiles table for PWA users
CREATE TABLE public.guest_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  guest_id TEXT NOT NULL UNIQUE, -- External PWA guest ID
  phone TEXT,
  email TEXT,
  name TEXT,
  registration_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  total_stamps INTEGER NOT NULL DEFAULT 0,
  current_streak INTEGER NOT NULL DEFAULT 0,
  last_stamp_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create stamps table for zone visits
CREATE TABLE public.guest_stamps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  guest_id TEXT NOT NULL, -- References guest_profiles.guest_id
  zone_name TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  source TEXT NOT NULL DEFAULT 'web', -- 'nfc' or 'web'
  nfc_tag_id TEXT,
  location_verified BOOLEAN NOT NULL DEFAULT false,
  jwt_token TEXT, -- For verification
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create rewards table for completed quest rewards
CREATE TABLE public.guest_rewards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  guest_id TEXT NOT NULL,
  reward_type TEXT NOT NULL,
  reward_title TEXT NOT NULL,
  reward_description TEXT,
  issued_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  claimed_date TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'claimed', 'expired'
  reward_value INTEGER, -- For discount amounts, etc.
  promo_code TEXT, -- Generated promo code if applicable
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.guest_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guest_stamps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guest_rewards ENABLE ROW LEVEL SECURITY;

-- RLS policies for guest_profiles
CREATE POLICY "Guests can view their own profile" 
ON public.guest_profiles 
FOR SELECT 
USING (true); -- Public read for now, will add JWT verification

CREATE POLICY "System can insert guest profiles" 
ON public.guest_profiles 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "System can update guest profiles" 
ON public.guest_profiles 
FOR UPDATE 
USING (true);

-- RLS policies for guest_stamps
CREATE POLICY "Anyone can view stamps" 
ON public.guest_stamps 
FOR SELECT 
USING (true);

CREATE POLICY "System can insert stamps" 
ON public.guest_stamps 
FOR INSERT 
WITH CHECK (true);

-- RLS policies for guest_rewards
CREATE POLICY "Guests can view their rewards" 
ON public.guest_rewards 
FOR SELECT 
USING (true);

CREATE POLICY "System can manage rewards" 
ON public.guest_rewards 
FOR ALL 
USING (true);

-- Create indexes for performance
CREATE INDEX idx_guest_profiles_guest_id ON public.guest_profiles(guest_id);
CREATE INDEX idx_guest_stamps_guest_id ON public.guest_stamps(guest_id);
CREATE INDEX idx_guest_stamps_zone ON public.guest_stamps(zone_name);
CREATE INDEX idx_guest_stamps_timestamp ON public.guest_stamps(timestamp);
CREATE INDEX idx_guest_rewards_guest_id ON public.guest_rewards(guest_id);
CREATE INDEX idx_guest_rewards_status ON public.guest_rewards(status);

-- Function to process stamp creation and check for rewards
CREATE OR REPLACE FUNCTION public.process_guest_stamp(
  p_guest_id TEXT,
  p_zone_name TEXT,
  p_source TEXT DEFAULT 'web',
  p_nfc_tag_id TEXT DEFAULT NULL,
  p_jwt_token TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  guest_record RECORD;
  stamp_count INTEGER;
  zone_count INTEGER;
  reward_record RECORD;
  result JSON;
BEGIN
  -- Get or create guest profile
  SELECT * INTO guest_record FROM public.guest_profiles WHERE guest_id = p_guest_id;
  
  IF guest_record IS NULL THEN
    INSERT INTO public.guest_profiles (guest_id, total_stamps, current_streak)
    VALUES (p_guest_id, 0, 0)
    RETURNING * INTO guest_record;
  END IF;
  
  -- Check if guest already has stamp for this zone today
  SELECT COUNT(*) INTO zone_count 
  FROM public.guest_stamps 
  WHERE guest_id = p_guest_id 
    AND zone_name = p_zone_name 
    AND DATE(timestamp) = CURRENT_DATE;
    
  IF zone_count > 0 THEN
    -- Return existing stamp info
    result := json_build_object(
      'success', true,
      'message', 'Already collected stamp for this zone today',
      'duplicate', true,
      'total_stamps', guest_record.total_stamps
    );
    RETURN result;
  END IF;
  
  -- Insert new stamp
  INSERT INTO public.guest_stamps (guest_id, zone_name, source, nfc_tag_id, jwt_token)
  VALUES (p_guest_id, p_zone_name, p_source, p_nfc_tag_id, p_jwt_token);
  
  -- Update guest profile
  SELECT COUNT(DISTINCT zone_name) INTO stamp_count 
  FROM public.guest_stamps 
  WHERE guest_id = p_guest_id;
  
  UPDATE public.guest_profiles 
  SET 
    total_stamps = stamp_count,
    last_stamp_date = now(),
    current_streak = CASE 
      WHEN last_stamp_date IS NULL OR DATE(last_stamp_date) < CURRENT_DATE - INTERVAL '1 day' 
      THEN 1 
      ELSE current_streak + 1 
    END,
    updated_at = now()
  WHERE guest_id = p_guest_id;
  
  -- Check for rewards
  CASE 
    WHEN stamp_count = 7 THEN
      -- All zones completed - create main reward
      INSERT INTO public.guest_rewards (guest_id, reward_type, reward_title, reward_description, reward_value)
      VALUES (p_guest_id, 'quest_complete', 'Taste Compass Master', 'Congratulations! You completed all 7 zones. Claim your reward!', 1000);
      
      result := json_build_object(
        'success', true,
        'message', 'Congratulations! Quest completed!',
        'stamp_collected', true,
        'total_stamps', stamp_count,
        'quest_completed', true,
        'reward_unlocked', true
      );
    WHEN stamp_count = 6 THEN
      -- One zone left - encouragement
      result := json_build_object(
        'success', true,
        'message', 'Almost there! Only 1 zone left!',
        'stamp_collected', true,
        'total_stamps', stamp_count,
        'zones_remaining', 1
      );
    WHEN stamp_count IN (3, 5) THEN
      -- Milestone rewards
      INSERT INTO public.guest_rewards (guest_id, reward_type, reward_title, reward_description, reward_value)
      VALUES (p_guest_id, 'milestone', 'Progress Reward', 'Keep going! Here''s a bonus for your progress.', 100);
      
      result := json_build_object(
        'success', true,
        'message', 'Milestone reached! Bonus unlocked!',
        'stamp_collected', true,
        'total_stamps', stamp_count,
        'milestone_reward', true
      );
    ELSE
      result := json_build_object(
        'success', true,
        'message', 'Stamp collected successfully!',
        'stamp_collected', true,
        'total_stamps', stamp_count
      );
  END CASE;
  
  RETURN result;
END;
$$;

-- Function to get guest progress
CREATE OR REPLACE FUNCTION public.get_guest_progress(p_guest_id TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  guest_record RECORD;
  stamps_array JSON;
  rewards_array JSON;
  result JSON;
BEGIN
  -- Get guest profile
  SELECT * INTO guest_record FROM public.guest_profiles WHERE guest_id = p_guest_id;
  
  IF guest_record IS NULL THEN
    RETURN json_build_object('error', 'Guest not found');
  END IF;
  
  -- Get collected stamps
  SELECT json_agg(json_build_object(
    'zone_name', zone_name,
    'timestamp', timestamp,
    'source', source
  )) INTO stamps_array
  FROM public.guest_stamps 
  WHERE guest_id = p_guest_id
  ORDER BY timestamp DESC;
  
  -- Get rewards
  SELECT json_agg(json_build_object(
    'id', id,
    'type', reward_type,
    'title', reward_title,
    'description', reward_description,
    'value', reward_value,
    'status', status,
    'issued_date', issued_date,
    'promo_code', promo_code
  )) INTO rewards_array
  FROM public.guest_rewards 
  WHERE guest_id = p_guest_id
  ORDER BY issued_date DESC;
  
  result := json_build_object(
    'guest_id', guest_record.guest_id,
    'total_stamps', guest_record.total_stamps,
    'current_streak', guest_record.current_streak,
    'registration_date', guest_record.registration_date,
    'last_stamp_date', guest_record.last_stamp_date,
    'stamps', COALESCE(stamps_array, '[]'::json),
    'rewards', COALESCE(rewards_array, '[]'::json)
  );
  
  RETURN result;
END;
$$;

-- Add trigger for updated_at
CREATE TRIGGER update_guest_profiles_updated_at
BEFORE UPDATE ON public.guest_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_guest_rewards_updated_at
BEFORE UPDATE ON public.guest_rewards
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();