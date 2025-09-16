-- Расширяем таблицу events для календаря
ALTER TABLE public.events 
ADD COLUMN IF NOT EXISTS event_date date NOT NULL DEFAULT CURRENT_DATE,
ADD COLUMN IF NOT EXISTS start_time time without time zone NOT NULL DEFAULT '18:00'::time,
ADD COLUMN IF NOT EXISTS end_time time without time zone NOT NULL DEFAULT '20:00'::time,
ADD COLUMN IF NOT EXISTS venue text DEFAULT 'ODE Food Hall',
ADD COLUMN IF NOT EXISTS instructor text,
ADD COLUMN IF NOT EXISTS image_url text,
ADD COLUMN IF NOT EXISTS available_spots integer NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'tasting';

-- Обновляем политику RLS для чтения событий
DROP POLICY IF EXISTS "Events are publicly readable" ON public.events;
CREATE POLICY "Events are publicly readable" 
ON public.events 
FOR SELECT 
USING (status = 'active' AND event_date >= CURRENT_DATE);

-- Добавляем индекс для быстрого поиска по дате
CREATE INDEX IF NOT EXISTS idx_events_date ON public.events(event_date, start_time);

-- Добавляем несколько примеров событий с уникальными event_type
INSERT INTO public.events (
  title, 
  description, 
  event_type, 
  event_date, 
  start_time, 
  end_time, 
  price_usd, 
  duration_minutes, 
  max_guests,
  available_spots,
  venue, 
  instructor, 
  category,
  image_url
) VALUES 
(
  'Винная дегустация: Терруары мира',
  'Исследуйте различия между французскими, итальянскими и новосветскими винами. Узнайте о влиянии климата и почвы на вкус вина.',
  'wine_tasting_terroir',
  CURRENT_DATE + INTERVAL '2 days',
  '18:00',
  '20:00',
  75,
  120,
  12,
  8,
  'Wine Staircase',
  'Сомелье Мария Петрова',
  'tasting',
  '/lovable-uploads/5a02d773-9b89-4a29-ac97-07e8608431ef.png'
),
(
  'Мастер-класс: Паста от шефа',
  'Научитесь готовить аутентичную итальянскую пасту с нуля. Включает приготовление соуса и дегустацию с вином.',
  'pasta_masterclass',
  CURRENT_DATE + INTERVAL '3 days',
  '16:00',
  '18:30',
  95,
  150,
  8,
  5,
  'Dolce Italia Corner',
  'Шеф Джованни Росси',
  'cooking',
  '/lovable-uploads/c249dca9-bfb0-49e1-89cc-41abfb0c64ad.png'
),
(
  'Балийские специи: Секреты аутентичной кухни',
  'Погрузитесь в мир балийских специй и традиционных методов приготовления. Приготовьте 3 блюда.',
  'balinese_cooking',
  CURRENT_DATE + INTERVAL '5 days',
  '15:00',
  '17:30',
  85,
  150,
  10,
  7,
  'Wild Bali Corner',
  'Шеф Кетут Сари',
  'cooking',
  '/lovable-uploads/6b12deec-e3be-4eaf-9569-9704ec9a2f6c.png'
),
(
  'Живая музыка: Jazz & Wine',
  'Насладитесь живой джазовой музыкой в сопровождении изысканных вин и закусок.',
  'jazz_evening',
  CURRENT_DATE + INTERVAL '1 day',
  '19:30',
  '22:00',
  45,
  150,
  30,
  25,
  'Second Floor Lounge',
  'Джаз-трио "Ubud Nights"',
  'entertainment',
  '/lovable-uploads/2109f2a7-74ec-4216-b0a3-322a7bdd5ebb.png'
),
(
  'Дегустация азиатской уличной еды',
  'Путешествие по вкусам Азии: от тайских салатов до вьетнамских супов. 8 мини-блюд.',
  'asian_street_food',
  CURRENT_DATE + INTERVAL '4 days',
  '17:00',
  '19:00',
  65,
  120,
  15,
  12,
  'Spicy Asia Corner',
  'Шеф Лин Ченг',
  'tasting',
  '/lovable-uploads/54e09b7b-cb56-4ad2-beff-b051ddc7a068.png'
),
(
  'Семейный мастер-класс: Готовим с детьми',
  'Веселый кулинарный мастер-класс для всей семьи. Дети учатся готовить простые и вкусные блюда.',
  'family_cooking_class',
  CURRENT_DATE + INTERVAL '6 days',
  '14:00',
  '16:00',
  40,
  120,
  6,
  4,
  'Kids Area',
  'Аниматор-повар Анна',
  'family',
  '/lovable-uploads/9661fa44-47b8-4375-9a53-04abf298479f.png'
);