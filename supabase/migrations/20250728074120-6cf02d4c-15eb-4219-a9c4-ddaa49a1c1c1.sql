-- Create mini_games table
CREATE TABLE public.mini_games (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  sector_id TEXT NOT NULL,
  game_type TEXT NOT NULL CHECK (game_type IN ('memory', 'quiz', 'timing', 'puzzle')),
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  base_points INTEGER NOT NULL DEFAULT 10,
  time_limit INTEGER NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_mini_game_results table
CREATE TABLE public.user_mini_game_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  game_id UUID NOT NULL REFERENCES public.mini_games(id),
  score INTEGER NOT NULL DEFAULT 0,
  time_taken INTEGER NULL,
  points_earned INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create daily_quests table
CREATE TABLE public.daily_quests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  quest_type TEXT NOT NULL,
  target_value INTEGER NOT NULL DEFAULT 1,
  reward_points INTEGER NOT NULL DEFAULT 10,
  reward_description TEXT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  quest_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_quest_progress table
CREATE TABLE public.user_quest_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  quest_id UUID NOT NULL REFERENCES public.daily_quests(id),
  current_progress INTEGER NOT NULL DEFAULT 0,
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, quest_id)
);

-- Enable RLS on all tables
ALTER TABLE public.mini_games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_mini_game_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_quest_progress ENABLE ROW LEVEL SECURITY;

-- RLS policies for mini_games
CREATE POLICY "Anyone can view active mini games" 
ON public.mini_games 
FOR SELECT 
USING (is_active = true);

-- RLS policies for user_mini_game_results
CREATE POLICY "Users can view their own game results" 
ON public.user_mini_game_results 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own game results" 
ON public.user_mini_game_results 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- RLS policies for daily_quests
CREATE POLICY "Anyone can view active daily quests" 
ON public.daily_quests 
FOR SELECT 
USING (is_active = true AND quest_date = CURRENT_DATE);

-- RLS policies for user_quest_progress
CREATE POLICY "Users can view their own quest progress" 
ON public.user_quest_progress 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own quest progress" 
ON public.user_quest_progress 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own quest progress" 
ON public.user_quest_progress 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Add triggers for updated_at
CREATE TRIGGER update_mini_games_updated_at
BEFORE UPDATE ON public.mini_games
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_daily_quests_updated_at
BEFORE UPDATE ON public.daily_quests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_quest_progress_updated_at
BEFORE UPDATE ON public.user_quest_progress
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample mini games
INSERT INTO public.mini_games (name, description, sector_id, game_type, difficulty, base_points, time_limit) VALUES
('Memory Match', 'Match pairs of taste-related cards', 'taste_sector_1', 'memory', 'easy', 10, 60),
('Flavor Quiz', 'Answer questions about ingredients', 'taste_sector_2', 'quiz', 'medium', 15, 90),
('Speed Tasting', 'Identify flavors quickly', 'taste_sector_3', 'timing', 'hard', 25, 30),
('Puzzle Chef', 'Solve cooking puzzles', 'taste_sector_4', 'puzzle', 'medium', 20, 120);

-- Insert some sample daily quests
INSERT INTO public.daily_quests (title, description, quest_type, target_value, reward_points, reward_description) VALUES
('Visit 3 Food Vendors', 'Explore different food stalls today', 'vendor_visits', 3, 50, '50 loyalty points'),
('Try 2 New Dishes', 'Step out of your comfort zone', 'new_dishes', 2, 30, '30 loyalty points'),
('Play 5 Mini Games', 'Complete mini games in any sector', 'mini_games', 5, 40, '40 loyalty points'),
('Share Your Experience', 'Post about your visit on social media', 'social_share', 1, 25, '25 loyalty points');