-- Создание таблиц для системы онлайн-заказов

-- Таблица категорий блюд
CREATE TABLE public.food_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Таблица блюд
CREATE TABLE public.menu_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES public.food_categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  price_usd INTEGER NOT NULL, -- цена в центах
  image_url TEXT,
  ingredients TEXT[],
  allergens TEXT[],
  dietary_tags TEXT[], -- vegetarian, vegan, gluten-free, etc.
  prep_time_minutes INTEGER DEFAULT 15,
  calories INTEGER,
  is_available BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  spice_level INTEGER DEFAULT 0 CHECK (spice_level >= 0 AND spice_level <= 5),
  vendor_name TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Таблица заказов
CREATE TABLE public.food_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  guest_name TEXT,
  guest_email TEXT,
  guest_phone TEXT,
  order_number TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled')),
  total_amount INTEGER NOT NULL, -- общая сумма в центах
  subtotal INTEGER NOT NULL, -- сумма без налогов в центах
  tax_amount INTEGER DEFAULT 0,
  delivery_fee INTEGER DEFAULT 0,
  discount_amount INTEGER DEFAULT 0,
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_method TEXT,
  stripe_payment_intent_id TEXT,
  order_type TEXT NOT NULL DEFAULT 'pickup' CHECK (order_type IN ('pickup', 'delivery', 'dine_in')),
  delivery_address TEXT,
  special_instructions TEXT,
  estimated_prep_time INTEGER DEFAULT 20, -- в минутах
  actual_prep_time INTEGER,
  scheduled_for TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Таблица позиций заказа
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.food_orders(id) ON DELETE CASCADE,
  menu_item_id UUID NOT NULL REFERENCES public.menu_items(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price INTEGER NOT NULL, -- цена за единицу в центах
  total_price INTEGER NOT NULL, -- общая цена позиции в центах
  special_requests TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Генерация номера заказа
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TEXT AS $$
DECLARE
    order_num TEXT;
    exists_check BOOLEAN;
BEGIN
    LOOP
        order_num := 'ODE' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 4));
        SELECT EXISTS(SELECT 1 FROM public.food_orders WHERE order_number = order_num) INTO exists_check;
        IF NOT exists_check THEN
            EXIT;
        END IF;
    END LOOP;
    RETURN order_num;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Триггер для автоматической генерации номера заказа
CREATE OR REPLACE FUNCTION public.set_order_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
        NEW.order_number := public.generate_order_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_order_number_trigger
    BEFORE INSERT ON public.food_orders
    FOR EACH ROW
    EXECUTE FUNCTION public.set_order_number();

-- Триггер для обновления updated_at
CREATE TRIGGER update_food_categories_updated_at
    BEFORE UPDATE ON public.food_categories
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_menu_items_updated_at
    BEFORE UPDATE ON public.menu_items
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_food_orders_updated_at
    BEFORE UPDATE ON public.food_orders
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Включаем RLS для всех таблиц
ALTER TABLE public.food_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Политики RLS для категорий (все могут читать активные)
CREATE POLICY "Anyone can view active food categories" 
ON public.food_categories 
FOR SELECT 
USING (is_active = true);

-- Политики RLS для блюд (все могут читать доступные)
CREATE POLICY "Anyone can view available menu items" 
ON public.menu_items 
FOR SELECT 
USING (is_available = true);

-- Политики RLS для заказов
CREATE POLICY "Users can view their own orders" 
ON public.food_orders 
FOR SELECT 
USING (
  (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR
  (auth.uid() IS NULL AND guest_email IS NOT NULL)
);

CREATE POLICY "Authenticated users can create orders" 
ON public.food_orders 
FOR INSERT 
WITH CHECK (
  (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR
  (user_id IS NULL AND guest_email IS NOT NULL AND guest_name IS NOT NULL)
);

CREATE POLICY "Users can update their own orders" 
ON public.food_orders 
FOR UPDATE 
USING (
  (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR
  (auth.uid() IS NULL AND guest_email IS NOT NULL)
);

-- Политики RLS для позиций заказа
CREATE POLICY "Users can view order items for their orders" 
ON public.order_items 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.food_orders fo 
    WHERE fo.id = order_id 
    AND (
      (auth.uid() IS NOT NULL AND fo.user_id = auth.uid()) OR
      (auth.uid() IS NULL AND fo.guest_email IS NOT NULL)
    )
  )
);

CREATE POLICY "Users can create order items for their orders" 
ON public.order_items 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.food_orders fo 
    WHERE fo.id = order_id 
    AND (
      (auth.uid() IS NOT NULL AND fo.user_id = auth.uid()) OR
      (fo.user_id IS NULL AND fo.guest_email IS NOT NULL)
    )
  )
);

-- Вставляем примеры данных
INSERT INTO public.food_categories (name, description, display_order, image_url) VALUES
('Бургеры', 'Сочные бургеры из свежих ингредиентов', 1, '/lovable-uploads/54e09b7b-cb56-4ad2-beff-b051ddc7a068.png'),
('Паста', 'Домашняя паста и соусы', 2, '/lovable-uploads/72f429cb-e3f6-44d1-a685-dd4002161507.png'),
('Суши', 'Свежие суши и роллы', 3, '/lovable-uploads/9ca55f6a-7071-45b6-9db4-8adf9147c448.png'),
('Салаты', 'Свежие и здоровые салаты', 4, '/lovable-uploads/eb0ecf72-72e4-4040-9c75-dbf57409f27d.png'),
('Напитки', 'Фреши, кофе и прохладительные напитки', 5, '/lovable-uploads/d6f6f18b-48dd-418c-af60-7b1db82dff84.png'),
('Десерты', 'Сладкие лакомства и выпечка', 6, '/lovable-uploads/f87f7680-1120-438b-9064-7951f566be15.png');

-- Добавляем примеры блюд
INSERT INTO public.menu_items (category_id, name, description, price_usd, image_url, ingredients, allergens, dietary_tags, prep_time_minutes, calories, is_featured, spice_level, vendor_name) VALUES
-- Бургеры
((SELECT id FROM public.food_categories WHERE name = 'Бургеры'), 'Signature Wagyu Burger', 'Фирменный бургер с говядиной Вагю, трюфельным майонезом и карамелизированным луком', 2800, '/lovable-uploads/54e09b7b-cb56-4ad2-beff-b051ddc7a068.png', ARRAY['говядина вагю', 'булочка бриошь', 'трюфельный майонез', 'карамелизированный лук', 'салат', 'помидор'], ARRAY['глютен', 'яйца'], ARRAY[], 20, 650, true, 0, 'Grill Master'),
((SELECT id FROM public.food_categories WHERE name = 'Бургеры'), 'Chicken Avocado Burger', 'Куриная грудка гриль с авокадо и соусом чили-лайм', 2200, '/lovable-uploads/54e09b7b-cb56-4ad2-beff-b051ddc7a068.png', ARRAY['куриная грудка', 'авокадо', 'соус чили-лайм', 'салат', 'красный лук'], ARRAY['глютен'], ARRAY[], 15, 520, false, 2, 'Grill Master'),

-- Паста
((SELECT id FROM public.food_categories WHERE name = 'Паста'), 'Truffle Pasta', 'Паста с черным трюфелем, пармезаном и белыми грибами', 2400, '/lovable-uploads/72f429cb-e3f6-44d1-a685-dd4002161507.png', ARRAY['паста фетучини', 'черный трюфель', 'пармезан', 'белые грибы', 'сливки'], ARRAY['глютен', 'молочные продукты'], ARRAY['vegetarian'], 18, 580, true, 0, 'Pasta Corner'),
((SELECT id FROM public.food_categories WHERE name = 'Паста'), 'Spicy Arrabbiata', 'Острая паста с томатным соусом, чесноком и перцем чили', 1800, '/lovable-uploads/72f429cb-e3f6-44d1-a685-dd4002161507.png', ARRAY['паста пенне', 'томаты', 'чеснок', 'перец чили', 'базилик'], ARRAY['глютен'], ARRAY['vegan'], 12, 420, false, 4, 'Pasta Corner'),

-- Суши
((SELECT id FROM public.food_categories WHERE name = 'Суши'), 'Dragon Roll', 'Авторский ролл с угрем, авокадо и икрой тобико', 1800, '/lovable-uploads/9ca55f6a-7071-45b6-9db4-8adf9147c448.png', ARRAY['угорь', 'авокадо', 'икра тобико', 'рис', 'нори'], ARRAY['рыба'], ARRAY[], 15, 320, true, 0, 'Sushi Bar'),
((SELECT id FROM public.food_categories WHERE name = 'Суши'), 'Salmon Sashimi Set', 'Набор сашими из свежего лосося (8 кусочков)', 2000, '/lovable-uploads/9ca55f6a-7071-45b6-9db4-8adf9147c448.png', ARRAY['лосось', 'васаби', 'имбирь', 'соевый соус'], ARRAY['рыба'], ARRAY[], 8, 280, false, 0, 'Sushi Bar'),

-- Салаты
((SELECT id FROM public.food_categories WHERE name = 'Салаты'), 'Buddha Bowl', 'Питательная чаша с киноа, авокадо и овощами', 1600, '/lovable-uploads/eb0ecf72-72e4-4040-9c75-dbf57409f27d.png', ARRAY['киноа', 'авокадо', 'брокколи', 'морковь', 'тахини'], ARRAY[], ARRAY['vegan', 'gluten-free'], 10, 380, true, 0, 'Green Garden'),
((SELECT id FROM public.food_categories WHERE name = 'Салаты'), 'Caesar Salad', 'Классический салат Цезарь с курицей гриль', 1400, '/lovable-uploads/eb0ecf72-72e4-4040-9c75-dbf57409f27d.png', ARRAY['салат ромэн', 'куриная грудка', 'пармезан', 'соус цезарь', 'сухарики'], ARRAY['глютен', 'молочные продукты'], ARRAY[], 8, 420, false, 0, 'Green Garden'),

-- Напитки
((SELECT id FROM public.food_categories WHERE name = 'Напитки'), 'Fresh Orange Juice', 'Свежевыжатый апельсиновый сок', 800, '/lovable-uploads/d6f6f18b-48dd-418c-af60-7b1db82dff84.png', ARRAY['апельсины'], ARRAY[], ARRAY['vegan', 'gluten-free'], 3, 120, false, 0, 'Juice Bar'),
((SELECT id FROM public.food_categories WHERE name = 'Напитки'), 'Signature Coffee', 'Авторский кофе из зерен арабики', 600, '/lovable-uploads/d6f6f18b-48dd-418c-af60-7b1db82dff84.png', ARRAY['кофе арабика', 'молоко'], ARRAY['молочные продукты'], ARRAY['vegetarian'], 5, 80, true, 0, 'Coffee House'),

-- Десерты
((SELECT id FROM public.food_categories WHERE name = 'Десерты'), 'Chocolate Lava Cake', 'Шоколадный фондан с ванильным мороженым', 1200, '/lovable-uploads/f87f7680-1120-438b-9064-7951f566be15.png', ARRAY['темный шоколад', 'мука', 'яйца', 'ванильное мороженое'], ARRAY['глютен', 'молочные продукты', 'яйца'], ARRAY['vegetarian'], 12, 520, true, 0, 'Sweet Dreams'),
((SELECT id FROM public.food_categories WHERE name = 'Десерты'), 'Mango Sticky Rice', 'Традиционный тайский десерт с манго и кокосовым молоком', 1000, '/lovable-uploads/f87f7680-1120-438b-9064-7951f566be15.png', ARRAY['клейкий рис', 'манго', 'кокосовое молоко'], ARRAY[], ARRAY['vegan', 'gluten-free'], 15, 320, false, 0, 'Sweet Dreams');