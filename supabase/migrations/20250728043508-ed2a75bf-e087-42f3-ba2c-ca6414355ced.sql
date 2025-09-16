
-- Создаем таблицу для ежедневных квестов
CREATE TABLE public.daily_quests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  quest_type TEXT NOT NULL CHECK (quest_type IN ('visit_sector', 'spend_time', 'complete_mini_game', 'share_achievement', 'invite_friend')),
  target_value INTEGER NOT NULL DEFAULT 1,
  reward_points INTEGER NOT NULL DEFAULT 50,
  reward_description TEXT,
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE NOT NULL DEFAULT CURRENT_DATE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Создаем таблицу для отслеживания прогресса ежедневных квестов пользователей
CREATE TABLE public.user_daily_quest_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  quest_id UUID REFERENCES public.daily_quests NOT NULL,
  current_progress INTEGER NOT NULL DEFAULT 0,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, quest_id)
);

-- Создаем таблицу для мини-игр
CREATE TABLE public.mini_games (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  sector_id TEXT NOT NULL,
  game_type TEXT NOT NULL CHECK (game_type IN ('memory', 'quiz', 'timing', 'puzzle')),
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  base_points INTEGER NOT NULL DEFAULT 25,
  time_limit INTEGER, -- в секундах
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Создаем таблицу для результатов мини-игр
CREATE TABLE public.user_mini_game_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  game_id UUID REFERENCES public.mini_games NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  time_taken INTEGER, -- в секундах
  points_earned INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Создаем таблицу для расширенных достижений
CREATE TABLE public.achievement_definitions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  achievement_id TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  achievement_type TEXT NOT NULL CHECK (achievement_type IN ('common', 'rare', 'epic', 'legendary')),
  category TEXT NOT NULL CHECK (category IN ('exploration', 'social', 'gaming', 'time', 'points')),
  condition_type TEXT NOT NULL CHECK (condition_type IN ('sector_completion', 'points_earned', 'time_spent', 'mini_games_won', 'daily_quests_completed', 'achievements_unlocked')),
  condition_value INTEGER NOT NULL,
  reward_points INTEGER NOT NULL,
  reward_description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Добавляем RLS политики для ежедневных квестов
ALTER TABLE public.daily_quests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active daily quests" ON public.daily_quests FOR SELECT USING (is_active = true);

-- Добавляем RLS политики для прогресса ежедневных квестов
ALTER TABLE public.user_daily_quest_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own quest progress" ON public.user_daily_quest_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own quest progress" ON public.user_daily_quest_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own quest progress" ON public.user_daily_quest_progress FOR UPDATE USING (auth.uid() = user_id);

-- Добавляем RLS политики для мини-игр
ALTER TABLE public.mini_games ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active mini games" ON public.mini_games FOR SELECT USING (is_active = true);

-- Добавляем RLS политики для результатов мини-игр
ALTER TABLE public.user_mini_game_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own game results" ON public.user_mini_game_results FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own game results" ON public.user_mini_game_results FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Добавляем RLS политики для определений достижений
ALTER TABLE public.achievement_definitions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active achievements" ON public.achievement_definitions FOR SELECT USING (is_active = true);

-- Вставляем начальные ежедневные квесты
INSERT INTO public.daily_quests (title, description, quest_type, target_value, reward_points, reward_description, start_date, end_date) VALUES
('Первый визит дня', 'Посетите любой сектор в Taste Alley', 'visit_sector', 1, 50, 'Дополнительные очки за активность'),
('Исследователь времени', 'Проведите 15 минут в Taste Alley', 'spend_time', 15, 75, 'Бонус за погружение'),
('Игровой мастер', 'Завершите 2 мини-игры', 'complete_mini_game', 2, 100, 'Награда за игровые навыки'),
('Поделиться успехом', 'Поделитесь достижением в социальных сетях', 'share_achievement', 1, 60, 'Социальная активность');

-- Вставляем мини-игры для каждого сектора
INSERT INTO public.mini_games (name, description, sector_id, game_type, difficulty, base_points, time_limit) VALUES
('Память ферментации', 'Запомните последовательность процессов ферментации', 'ferment', 'memory', 'easy', 25, 60),
('Викторина о дыме', 'Ответьте на вопросы о методах копчения', 'smoke', 'quiz', 'medium', 35, 120),
('Тайминг специй', 'Добавьте специи в правильном порядке и времени', 'spice', 'timing', 'medium', 40, 90),
('Пазл умами', 'Соберите молекулярную структуру глутамата', 'umami', 'puzzle', 'hard', 50, 180);

-- Вставляем расширенные определения достижений
INSERT INTO public.achievement_definitions (achievement_id, title, description, achievement_type, category, condition_type, condition_value, reward_points, reward_description) VALUES
('daily_warrior', 'Ежедневный воин', 'Завершите 5 ежедневных квестов', 'common', 'exploration', 'daily_quests_completed', 5, 150, 'Специальная награда за постоянство'),
('game_master', 'Мастер игр', 'Выиграйте 10 мини-игр', 'rare', 'gaming', 'mini_games_won', 10, 250, 'Эксклюзивный игровой бейдж'),
('time_lord', 'Властелин времени', 'Проведите 2 часа в Taste Alley', 'rare', 'time', 'time_spent', 120, 200, 'Временная награда'),
('social_butterfly', 'Социальная бабочка', 'Поделитесь 5 достижениями', 'common', 'social', 'achievements_unlocked', 5, 100, 'Социальная активность'),
('point_collector', 'Коллекционер очков', 'Наберите 2000 очков', 'epic', 'points', 'points_earned', 2000, 400, 'Эпическая награда за достижения'),
('ultimate_explorer', 'Абсолютный исследователь', 'Разблокируйте 15 достижений', 'legendary', 'exploration', 'achievements_unlocked', 15, 500, 'Легендарный статус исследователя');

-- Создаем функцию для автоматического создания ежедневных квестов
CREATE OR REPLACE FUNCTION create_daily_quests()
RETURNS void AS $$
BEGIN
  -- Обновляем дату окончания вчерашних квестов
  UPDATE public.daily_quests 
  SET is_active = false 
  WHERE end_date < CURRENT_DATE;
  
  -- Создаем новые квесты на сегодня, если их еще нет
  INSERT INTO public.daily_quests (title, description, quest_type, target_value, reward_points, reward_description, start_date, end_date)
  SELECT 
    'Ежедневный визит', 
    'Посетите любой сектор сегодня', 
    'visit_sector', 
    1, 
    50, 
    'Ежедневная награда', 
    CURRENT_DATE, 
    CURRENT_DATE
  WHERE NOT EXISTS (
    SELECT 1 FROM public.daily_quests 
    WHERE start_date = CURRENT_DATE AND quest_type = 'visit_sector'
  );
END;
$$ LANGUAGE plpgsql;
