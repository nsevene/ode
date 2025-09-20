# Настройка Supabase для ODPortal

## Шаг 1: Создание проекта Supabase

1. Перейдите на [supabase.com](https://supabase.com)
2. Войдите в аккаунт или создайте новый
3. Нажмите "New Project"
4. Выберите организацию и создайте новый проект
5. Дождитесь завершения создания проекта

## Шаг 2: Получение учетных данных

1. В панели Supabase перейдите в Settings > API
2. Скопируйте:
   - **Project URL** (например: `https://your-project-id.supabase.co`)
   - **anon public** ключ

## Шаг 3: Настройка переменных окружения

Создайте файл `.env` в корне проекта со следующим содержимым:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Замените `your-project-id` и `your-anon-key-here` на ваши реальные значения.

## Шаг 4: Создание таблиц в Supabase

Выполните следующие SQL запросы в SQL Editor Supabase:

### Таблица profiles
```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'public',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Включить RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Политика для чтения собственного профиля
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Политика для обновления собственного профиля
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Политика для вставки собственного профиля
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
```

### Таблица menu_items
```sql
CREATE TABLE menu_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  is_public BOOLEAN DEFAULT false,
  allergens TEXT[],
  nutrition_info JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Включить RLS
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

-- Политика для публичного доступа к публичным элементам меню
CREATE POLICY "Public menu items are viewable by everyone" ON menu_items
  FOR SELECT USING (is_public = true);
```

### Таблица events
```sql
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  location TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  max_attendees INTEGER DEFAULT 50,
  current_attendees INTEGER DEFAULT 0,
  price DECIMAL(10,2) DEFAULT 0,
  is_public BOOLEAN DEFAULT false,
  registration_required BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Включить RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Политика для публичного доступа к публичным событиям
CREATE POLICY "Public events are viewable by everyone" ON events
  FOR SELECT USING (is_public = true);
```

### Таблица bookings
```sql
CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  user_phone TEXT,
  special_requests TEXT,
  guests_count INTEGER DEFAULT 1,
  status TEXT DEFAULT 'confirmed',
  booking_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Включить RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Политика для создания бронирований
CREATE POLICY "Anyone can create bookings" ON bookings
  FOR INSERT WITH CHECK (true);
```

## Шаг 5: Настройка Edge Functions

1. Установите Supabase CLI:
```bash
npm install -g supabase
```

2. Инициализируйте проект:
```bash
supabase init
```

3. Свяжите с вашим проектом:
```bash
supabase link --project-ref your-project-id
```

4. Деплой функций:
```bash
supabase functions deploy
```

## Шаг 6: Тестирование

После настройки всех компонентов:

1. Перезапустите dev сервер: `npm run dev`
2. Откройте приложение в браузере
3. Протестируйте все функции через тестовые страницы

## Демо-режим

Если вы хотите просто протестировать интерфейс без настройки Supabase, приложение будет работать в демо-режиме с mock-данными.
