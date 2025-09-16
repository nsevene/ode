
-- Create table for taste alley quest progress
CREATE TABLE public.taste_alley_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  current_sector INTEGER NOT NULL DEFAULT 0,
  completed_sectors INTEGER NOT NULL DEFAULT 0,
  total_score INTEGER NOT NULL DEFAULT 0,
  user_level INTEGER NOT NULL DEFAULT 1,
  streak_count INTEGER NOT NULL DEFAULT 0,
  fastest_time INTEGER, -- in minutes
  total_quest_time INTEGER NOT NULL DEFAULT 0,
  quests_completed INTEGER NOT NULL DEFAULT 0,
  achievements_count INTEGER NOT NULL DEFAULT 0,
  current_multiplier DECIMAL(3,2) NOT NULL DEFAULT 1.00,
  last_activity_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for individual achievements
CREATE TABLE public.taste_alley_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  achievement_id TEXT NOT NULL,
  achievement_title TEXT NOT NULL,
  achievement_description TEXT NOT NULL,
  achievement_type TEXT NOT NULL, -- 'common', 'rare', 'epic', 'legendary'
  reward_points INTEGER NOT NULL DEFAULT 0,
  unlocked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for quest sessions
CREATE TABLE public.taste_alley_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  sectors_completed INTEGER NOT NULL DEFAULT 0,
  session_duration INTEGER NOT NULL DEFAULT 0, -- in minutes
  score_earned INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for leaderboard rankings
CREATE TABLE public.taste_alley_leaderboard (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  display_name TEXT NOT NULL,
  total_score INTEGER NOT NULL DEFAULT 0,
  user_level INTEGER NOT NULL DEFAULT 1,
  completed_sectors INTEGER NOT NULL DEFAULT 0,
  fastest_time INTEGER, -- in minutes
  achievements_count INTEGER NOT NULL DEFAULT 0,
  current_rank INTEGER NOT NULL DEFAULT 999999,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.taste_alley_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.taste_alley_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.taste_alley_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.taste_alley_leaderboard ENABLE ROW LEVEL SECURITY;

-- RLS policies for taste_alley_progress
CREATE POLICY "Users can view their own progress" 
  ON public.taste_alley_progress 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress" 
  ON public.taste_alley_progress 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" 
  ON public.taste_alley_progress 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- RLS policies for taste_alley_achievements
CREATE POLICY "Users can view their own achievements" 
  ON public.taste_alley_achievements 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert achievements" 
  ON public.taste_alley_achievements 
  FOR INSERT 
  WITH CHECK (true);

-- RLS policies for taste_alley_sessions
CREATE POLICY "Users can view their own sessions" 
  ON public.taste_alley_sessions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sessions" 
  ON public.taste_alley_sessions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- RLS policies for taste_alley_leaderboard
CREATE POLICY "Anyone can view leaderboard" 
  ON public.taste_alley_leaderboard 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can insert their own leaderboard entry" 
  ON public.taste_alley_leaderboard 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own leaderboard entry" 
  ON public.taste_alley_leaderboard 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_taste_alley_progress_user_id ON public.taste_alley_progress(user_id);
CREATE INDEX idx_taste_alley_achievements_user_id ON public.taste_alley_achievements(user_id);
CREATE INDEX idx_taste_alley_sessions_user_id ON public.taste_alley_sessions(user_id);
CREATE INDEX idx_taste_alley_leaderboard_rank ON public.taste_alley_leaderboard(current_rank);
CREATE INDEX idx_taste_alley_leaderboard_score ON public.taste_alley_leaderboard(total_score DESC);

-- Function to update leaderboard rankings
CREATE OR REPLACE FUNCTION public.update_taste_alley_leaderboard()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update leaderboard when progress changes
CREATE TRIGGER update_leaderboard_on_progress_change
  AFTER INSERT OR UPDATE ON public.taste_alley_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.update_taste_alley_leaderboard();

-- Function to award achievements
CREATE OR REPLACE FUNCTION public.award_taste_alley_achievement(
  p_user_id UUID,
  p_achievement_id TEXT,
  p_title TEXT,
  p_description TEXT,
  p_type TEXT,
  p_reward_points INTEGER
)
RETURNS VOID AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;
