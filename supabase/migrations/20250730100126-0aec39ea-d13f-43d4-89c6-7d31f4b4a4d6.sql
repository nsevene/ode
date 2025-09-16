-- Добавляем примеры блюд в меню
INSERT INTO public.menu_items (category_id, name, description, price_usd, image_url, ingredients, allergens, dietary_tags, prep_time_minutes, calories, is_featured, spice_level, vendor_name) VALUES
-- Бургеры
((SELECT id FROM public.food_categories WHERE name = 'Бургеры'), 'Signature Wagyu Burger', 'Фирменный бургер с говядиной Вагю, трюфельным майонезом и карамелизированным луком', 2800, '/lovable-uploads/54e09b7b-cb56-4ad2-beff-b051ddc7a068.png', ARRAY['говядина вагю', 'булочка бриошь', 'трюфельный майонез', 'карамелизированный лук', 'салат', 'помидор'], ARRAY['глютен', 'яйца'], ARRAY[]::TEXT[], 20, 650, true, 0, 'Grill Master'),
((SELECT id FROM public.food_categories WHERE name = 'Бургеры'), 'Chicken Avocado Burger', 'Куриная грудка гриль с авокадо и соусом чили-лайм', 2200, '/lovable-uploads/54e09b7b-cb56-4ad2-beff-b051ddc7a068.png', ARRAY['куриная грудка', 'авокадо', 'соус чили-лайм', 'салат', 'красный лук'], ARRAY['глютен'], ARRAY[]::TEXT[], 15, 520, false, 2, 'Grill Master'),

-- Паста
((SELECT id FROM public.food_categories WHERE name = 'Паста'), 'Truffle Pasta', 'Паста с черным трюфелем, пармезаном и белыми грибами', 2400, '/lovable-uploads/72f429cb-e3f6-44d1-a685-dd4002161507.png', ARRAY['паста фетучини', 'черный трюфель', 'пармезан', 'белые грибы', 'сливки'], ARRAY['глютен', 'молочные продукты'], ARRAY['vegetarian'], 18, 580, true, 0, 'Pasta Corner'),
((SELECT id FROM public.food_categories WHERE name = 'Паста'), 'Spicy Arrabbiata', 'Острая паста с томатным соусом, чесноком и перцем чили', 1800, '/lovable-uploads/72f429cb-e3f6-44d1-a685-dd4002161507.png', ARRAY['паста пенне', 'томаты', 'чеснок', 'перец чили', 'базилик'], ARRAY['глютен'], ARRAY['vegan'], 12, 420, false, 4, 'Pasta Corner'),

-- Суши
((SELECT id FROM public.food_categories WHERE name = 'Суши'), 'Dragon Roll', 'Авторский ролл с угрем, авокадо и икрой тобико', 1800, '/lovable-uploads/9ca55f6a-7071-45b6-9db4-8adf9147c448.png', ARRAY['угорь', 'авокадо', 'икра тобико', 'рис', 'нори'], ARRAY['рыба'], ARRAY[]::TEXT[], 15, 320, true, 0, 'Sushi Bar'),
((SELECT id FROM public.food_categories WHERE name = 'Суши'), 'Salmon Sashimi Set', 'Набор сашими из свежего лосося (8 кусочков)', 2000, '/lovable-uploads/9ca55f6a-7071-45b6-9db4-8adf9147c448.png', ARRAY['лосось', 'васаби', 'имбирь', 'соевый соус'], ARRAY['рыба'], ARRAY[]::TEXT[], 8, 280, false, 0, 'Sushi Bar'),

-- Салаты
((SELECT id FROM public.food_categories WHERE name = 'Салаты'), 'Buddha Bowl', 'Питательная чаша с киноа, авокадо и овощами', 1600, '/lovable-uploads/eb0ecf72-72e4-4040-9c75-dbf57409f27d.png', ARRAY['киноа', 'авокадо', 'брокколи', 'морковь', 'тахини'], ARRAY[]::TEXT[], ARRAY['vegan', 'gluten-free'], 10, 380, true, 0, 'Green Garden'),
((SELECT id FROM public.food_categories WHERE name = 'Салаты'), 'Caesar Salad', 'Классический салат Цезарь с курицей гриль', 1400, '/lovable-uploads/eb0ecf72-72e4-4040-9c75-dbf57409f27d.png', ARRAY['салат ромэн', 'куриная грудка', 'пармезан', 'соус цезарь', 'сухарики'], ARRAY['глютен', 'молочные продукты'], ARRAY[]::TEXT[], 8, 420, false, 0, 'Green Garden'),

-- Напитки
((SELECT id FROM public.food_categories WHERE name = 'Напитки'), 'Fresh Orange Juice', 'Свежевыжатый апельсиновый сок', 800, '/lovable-uploads/d6f6f18b-48dd-418c-af60-7b1db82dff84.png', ARRAY['апельсины'], ARRAY[]::TEXT[], ARRAY['vegan', 'gluten-free'], 3, 120, false, 0, 'Juice Bar'),
((SELECT id FROM public.food_categories WHERE name = 'Напитки'), 'Signature Coffee', 'Авторский кофе из зерен арабики', 600, '/lovable-uploads/d6f6f18b-48dd-418c-af60-7b1db82dff84.png', ARRAY['кофе арабика', 'молоко'], ARRAY['молочные продукты'], ARRAY['vegetarian'], 5, 80, true, 0, 'Coffee House'),

-- Десерты
((SELECT id FROM public.food_categories WHERE name = 'Десерты'), 'Chocolate Lava Cake', 'Шоколадный фондан с ванильным мороженым', 1200, '/lovable-uploads/f87f7680-1120-438b-9064-7951f566be15.png', ARRAY['темный шоколад', 'мука', 'яйца', 'ванильное мороженое'], ARRAY['глютен', 'молочные продукты', 'яйца'], ARRAY['vegetarian'], 12, 520, true, 0, 'Sweet Dreams'),
((SELECT id FROM public.food_categories WHERE name = 'Десерты'), 'Mango Sticky Rice', 'Традиционный тайский десерт с манго и кокосовым молоком', 1000, '/lovable-uploads/f87f7680-1120-438b-9064-7951f566be15.png', ARRAY['клейкий рис', 'манго', 'кокосовое молоко'], ARRAY[]::TEXT[], ARRAY['vegan', 'gluten-free'], 15, 320, false, 0, 'Sweet Dreams');