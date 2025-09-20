# Ручная настройка данных

**Дата:** 18 сентября 2025 г.  
**Статус:** 📋 ИНСТРУКЦИЯ

---

## 🎯 Цель

Настроить тестовые данные и администратора вручную через Supabase Dashboard.

---

## 📋 Пошаговая инструкция

### 1. Создание тестового администратора

1. **Откройте Supabase Dashboard**
   - Перейдите на https://supabase.com/dashboard
   - Выберите проект ODE Food Hall

2. **Создайте пользователя**
   - Перейдите в "Authentication" → "Users"
   - Нажмите "Add user"
   - Email: `admin@ode.com`
   - Password: `admin123`
   - Отметьте "Email Confirm"

3. **Назначьте роль администратора**
   - Перейдите в "SQL Editor"
   - Выполните запрос:

```sql
-- Найти ID пользователя
SELECT id, email FROM auth.users WHERE email = 'admin@ode.com';

-- Назначить роль admin (замените USER_ID на реальный ID)
INSERT INTO public.user_roles (user_id, role) 
VALUES ('USER_ID_ЗДЕСЬ', 'admin')
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
```

### 2. Заполнение таблицы kitchens

Выполните в SQL Editor:

```sql
-- Вставка тестовых кухонь
INSERT INTO public.kitchens (
  id, name, slug, description, long_description, image_url, 
  location, cuisine_type, price_per_hour_usd, is_available, is_featured,
  contact_person, contact_phone, contact_email, opening_hours
) VALUES 
-- Dolce Italia
(
  gen_random_uuid(),
  'Dolce Italia',
  'dolce-italia',
  'Authentic Italian cuisine with fresh pasta and traditional recipes',
  'Experience the authentic flavors of Italy with our handcrafted pasta, wood-fired pizzas, and traditional Italian dishes.',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800',
  'Ground Floor, Sector A',
  'italian',
  150,
  true,
  true,
  'Marco Rossi',
  '+62-812-3456-7890',
  'marco@dolceitalia.com',
  '{"monday": "10:00-22:00", "tuesday": "10:00-22:00", "wednesday": "10:00-22:00", "thursday": "10:00-22:00", "friday": "10:00-23:00", "saturday": "10:00-23:00", "sunday": "10:00-22:00"}'
),

-- Spicy Asia
(
  gen_random_uuid(),
  'Spicy Asia',
  'spicy-asia',
  'Pan-Asian cuisine with bold flavors and fresh ingredients',
  'Discover the vibrant tastes of Asia with our carefully curated selection of dishes from Thailand, Vietnam, Japan, and Korea.',
  'https://images.unsplash.com/photo-1555939594-58d7cb561a1a?w=800',
  'Ground Floor, Sector B',
  'asian',
  120,
  true,
  true,
  'Li Wei',
  '+62-812-3456-7891',
  'liwei@spicyasia.com',
  '{"monday": "11:00-23:00", "tuesday": "11:00-23:00", "wednesday": "11:00-23:00", "thursday": "11:00-23:00", "friday": "11:00-24:00", "saturday": "11:00-24:00", "sunday": "11:00-23:00"}'
),

-- Wild Bali
(
  gen_random_uuid(),
  'Wild Bali',
  'wild-bali',
  'Traditional Balinese cuisine with modern presentation',
  'Immerse yourself in the rich culinary heritage of Bali with our traditional recipes passed down through generations.',
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
  'Ground Floor, Sector C',
  'indonesian',
  100,
  true,
  true,
  'Made Sari',
  '+62-812-3456-7892',
  'made@wildbali.com',
  '{"monday": "10:00-22:00", "tuesday": "10:00-22:00", "wednesday": "10:00-22:00", "thursday": "10:00-22:00", "friday": "10:00-23:00", "saturday": "10:00-23:00", "sunday": "10:00-22:00"}'
),

-- Ferment Sector
(
  gen_random_uuid(),
  'Ferment Sector',
  'ferment-sector',
  'Fermented foods and probiotic-rich dishes',
  'Explore the world of fermentation with our artisanal kombucha, kimchi, miso, and other probiotic-rich foods.',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
  'First Floor, Sector D',
  'fermented',
  80,
  true,
  false,
  'Sarah Kim',
  '+62-812-3456-7893',
  'sarah@fermentsector.com',
  '{"monday": "09:00-21:00", "tuesday": "09:00-21:00", "wednesday": "09:00-21:00", "thursday": "09:00-21:00", "friday": "09:00-22:00", "saturday": "09:00-22:00", "sunday": "09:00-21:00"}'
),

-- Smoke Sector
(
  gen_random_uuid(),
  'Smoke Sector',
  'smoke-sector',
  'Artisanal smoked meats and BBQ specialties',
  'Indulge in our carefully smoked meats, fish, and vegetables using traditional smoking techniques.',
  'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
  'First Floor, Sector E',
  'bbq',
  180,
  true,
  true,
  'Jake Thompson',
  '+62-812-3456-7894',
  'jake@smokesector.com',
  '{"monday": "12:00-23:00", "tuesday": "12:00-23:00", "wednesday": "12:00-23:00", "thursday": "12:00-23:00", "friday": "12:00-24:00", "saturday": "12:00-24:00", "sunday": "12:00-23:00"}'
),

-- Spice Sector
(
  gen_random_uuid(),
  'Spice Sector',
  'spice-sector',
  'Bold spices and aromatic dishes from around the world',
  'Embark on a journey through the world''s spice routes with our carefully crafted dishes featuring premium spices.',
  'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800',
  'First Floor, Sector F',
  'spicy',
  130,
  true,
  false,
  'Raj Patel',
  '+62-812-3456-7895',
  'raj@spicesector.com',
  '{"monday": "11:00-22:00", "tuesday": "11:00-22:00", "wednesday": "11:00-22:00", "thursday": "11:00-22:00", "friday": "11:00-23:00", "saturday": "11:00-23:00", "sunday": "11:00-22:00"}'
),

-- Sour-Herb Sector
(
  gen_random_uuid(),
  'Sour-Herb Sector',
  'sour-herb-sector',
  'Fresh herbs and tangy flavors for health-conscious diners',
  'Discover the power of fresh herbs and tangy flavors with our health-focused menu featuring seasonal ingredients.',
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
  'Second Floor, Sector G',
  'healthy',
  90,
  true,
  false,
  'Emma Green',
  '+62-812-3456-7896',
  'emma@sourherbsector.com',
  '{"monday": "08:00-20:00", "tuesday": "08:00-20:00", "wednesday": "08:00-20:00", "thursday": "08:00-20:00", "friday": "08:00-21:00", "saturday": "08:00-21:00", "sunday": "08:00-20:00"}'
),

-- Sweet Sector
(
  gen_random_uuid(),
  'Sweet Sector',
  'sweet-sector',
  'Artisanal desserts and sweet treats',
  'Satisfy your sweet tooth with our handcrafted desserts, pastries, and confections made with premium ingredients.',
  'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800',
  'Second Floor, Sector H',
  'dessert',
  60,
  true,
  false,
  'Pierre Dubois',
  '+62-812-3456-7897',
  'pierre@sweetsector.com',
  '{"monday": "10:00-22:00", "tuesday": "10:00-22:00", "wednesday": "10:00-22:00", "thursday": "10:00-22:00", "friday": "10:00-23:00", "saturday": "10:00-23:00", "sunday": "10:00-22:00"}'
);
```

### 3. Создание категорий блюд

```sql
-- Вставка категорий блюд
INSERT INTO public.food_categories (id, name, description, display_order, is_active) VALUES
(gen_random_uuid(), 'Appetizers', 'Start your culinary journey with our delicious appetizers', 1, true),
(gen_random_uuid(), 'Main Courses', 'Hearty main dishes to satisfy your appetite', 2, true),
(gen_random_uuid(), 'Desserts', 'Sweet endings to perfect your meal', 3, true),
(gen_random_uuid(), 'Beverages', 'Refreshing drinks to complement your meal', 4, true),
(gen_random_uuid(), 'Specials', 'Chef''s special creations', 5, true);
```

### 4. Создание тестовых блюд

```sql
-- Вставка тестовых блюд для Dolce Italia
INSERT INTO public.menu_items (
  id, category_id, name, description, price_usd, image_url, 
  ingredients, allergens, dietary_tags, prep_time_minutes, 
  calories, is_available, is_featured, spice_level, vendor_name
) VALUES
-- Appetizers
(gen_random_uuid(), (SELECT id FROM public.food_categories WHERE name = 'Appetizers' LIMIT 1), 
 'Bruschetta al Pomodoro', 'Fresh tomato and basil bruschetta on artisan bread', 8, 
 'https://images.unsplash.com/photo-1572441713132-51c75654db73?w=400',
 ARRAY['tomatoes', 'basil', 'garlic', 'olive oil', 'bread'], 
 ARRAY['gluten'], ARRAY['vegetarian'], 10, 120, true, true, 0, 'Dolce Italia'),

-- Main Courses
(gen_random_uuid(), (SELECT id FROM public.food_categories WHERE name = 'Main Courses' LIMIT 1),
 'Spaghetti Carbonara', 'Classic Roman pasta with eggs, cheese, and pancetta', 18,
 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400',
 ARRAY['spaghetti', 'eggs', 'pecorino', 'pancetta', 'black pepper'],
 ARRAY['gluten', 'dairy', 'eggs'], ARRAY[], 15, 450, true, true, 1, 'Dolce Italia'),

(gen_random_uuid(), (SELECT id FROM public.food_categories WHERE name = 'Main Courses' LIMIT 1),
 'Margherita Pizza', 'Wood-fired pizza with tomato, mozzarella, and basil', 16,
 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
 ARRAY['pizza dough', 'tomato sauce', 'mozzarella', 'basil', 'olive oil'],
 ARRAY['gluten', 'dairy'], ARRAY['vegetarian'], 12, 380, true, true, 0, 'Dolce Italia'),

-- Desserts
(gen_random_uuid(), (SELECT id FROM public.food_categories WHERE name = 'Desserts' LIMIT 1),
 'Tiramisu', 'Classic Italian dessert with coffee and mascarpone', 12,
 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400',
 ARRAY['mascarpone', 'coffee', 'cocoa', 'ladyfingers', 'eggs'],
 ARRAY['dairy', 'eggs'], ARRAY[], 0, 320, true, false, 0, 'Dolce Italia');
```

---

## ✅ Проверка

После выполнения всех шагов:

1. **Проверьте вендоров:** Перейдите на `/vendors` - должны отображаться 8 секторов
2. **Проверьте меню:** Перейдите на `/menu` - должны отображаться блюда
3. **Проверьте админ-панель:** Войдите как `admin@ode.com` и перейдите на `/dashboard`

---

**Статус:** 🟡 ТРЕБУЕТ РУЧНОГО ВЫПОЛНЕНИЯ
