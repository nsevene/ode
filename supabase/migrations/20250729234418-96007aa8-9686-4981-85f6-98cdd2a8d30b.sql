-- Fix RLS policy for vendor_applications to allow anonymous submissions
DROP POLICY IF EXISTS "Allow vendor application submissions" ON public.vendor_applications;

CREATE POLICY "Allow vendor application submissions" ON public.vendor_applications
FOR INSERT 
WITH CHECK (true);

-- Fix missing unique constraint for taste_alley_progress ON CONFLICT
DROP TABLE IF EXISTS public.taste_alley_progress CASCADE;

CREATE TABLE public.taste_alley_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  current_sector INTEGER NOT NULL DEFAULT 0,
  completed_sectors INTEGER NOT NULL DEFAULT 0,
  total_score INTEGER NOT NULL DEFAULT 0,
  user_level INTEGER NOT NULL DEFAULT 1,
  streak_count INTEGER NOT NULL DEFAULT 0,
  total_quest_time INTEGER NOT NULL DEFAULT 0,
  quests_completed INTEGER NOT NULL DEFAULT 0,
  achievements_count INTEGER NOT NULL DEFAULT 0,
  current_multiplier NUMERIC NOT NULL DEFAULT 1.00,
  fastest_time INTEGER,
  last_activity_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.taste_alley_progress ENABLE ROW LEVEL SECURITY;

-- Recreate RLS policies
CREATE POLICY "Users can view their own progress" ON public.taste_alley_progress
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress" ON public.taste_alley_progress
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" ON public.taste_alley_progress
FOR UPDATE USING (auth.uid() = user_id);

-- Fix daily_quests table structure
DROP TABLE IF EXISTS public.daily_quests CASCADE;

CREATE TABLE public.daily_quests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  quest_type TEXT NOT NULL,
  target_value INTEGER NOT NULL DEFAULT 1,
  reward_points INTEGER NOT NULL DEFAULT 10,
  reward_description TEXT,
  quest_date DATE NOT NULL DEFAULT CURRENT_DATE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.daily_quests ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Anyone can view active daily quests" ON public.daily_quests
FOR SELECT USING (is_active = true AND quest_date = CURRENT_DATE);

-- Create user_daily_quest_progress table
CREATE TABLE public.user_daily_quest_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  quest_id UUID NOT NULL REFERENCES public.daily_quests(id),
  current_progress INTEGER NOT NULL DEFAULT 0,
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, quest_id)
);

-- Enable RLS
ALTER TABLE public.user_daily_quest_progress ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own quest progress" ON public.user_daily_quest_progress
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own quest progress" ON public.user_daily_quest_progress
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own quest progress" ON public.user_daily_quest_progress
FOR UPDATE USING (auth.uid() = user_id);

-- Recreate trigger for taste_alley_progress updates
CREATE TRIGGER update_taste_alley_progress_trigger
BEFORE UPDATE ON public.taste_alley_progress
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Recreate leaderboard update trigger  
CREATE TRIGGER taste_alley_leaderboard_update
AFTER INSERT OR UPDATE ON public.taste_alley_progress
FOR EACH ROW EXECUTE FUNCTION public.update_taste_alley_leaderboard();