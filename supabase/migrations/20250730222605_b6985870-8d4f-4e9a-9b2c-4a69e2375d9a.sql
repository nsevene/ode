-- Create ingredients table with nutritional data
CREATE TABLE public.ingredients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  name_ru TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'other',
  calories_per_100g INTEGER NOT NULL,
  protein_per_100g NUMERIC(5,2) DEFAULT 0,
  carbs_per_100g NUMERIC(5,2) DEFAULT 0,
  fat_per_100g NUMERIC(5,2) DEFAULT 0,
  fiber_per_100g NUMERIC(5,2) DEFAULT 0,
  sugar_per_100g NUMERIC(5,2) DEFAULT 0,
  sodium_per_100g NUMERIC(5,2) DEFAULT 0,
  unit TEXT NOT NULL DEFAULT 'g', -- g, ml, pieces, etc
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create recipes table
CREATE TABLE public.recipes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  menu_item_id UUID REFERENCES public.menu_items(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  name_ru TEXT NOT NULL,
  description TEXT,
  description_ru TEXT,
  servings INTEGER NOT NULL DEFAULT 1,
  prep_time_minutes INTEGER NOT NULL DEFAULT 30,
  cooking_method TEXT,
  difficulty_level TEXT DEFAULT 'medium',
  chef_notes TEXT,
  total_calories INTEGER GENERATED ALWAYS AS (0) STORED, -- Will be calculated via trigger
  total_weight_g NUMERIC(8,2) DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create recipe ingredients junction table
CREATE TABLE public.recipe_ingredients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  recipe_id UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  ingredient_id UUID NOT NULL REFERENCES public.ingredients(id) ON DELETE CASCADE,
  quantity NUMERIC(8,2) NOT NULL,
  unit TEXT NOT NULL DEFAULT 'g',
  preparation_notes TEXT, -- e.g., "chopped", "diced", "cooked"
  is_optional BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  UNIQUE(recipe_id, ingredient_id)
);

-- Enable RLS
ALTER TABLE public.ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipe_ingredients ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ingredients
CREATE POLICY "Anyone can view ingredients" 
ON public.ingredients FOR SELECT USING (true);

CREATE POLICY "Admins can manage ingredients" 
ON public.ingredients FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE user_id = auth.uid() AND role = 'admin'::app_role
));

-- RLS Policies for recipes
CREATE POLICY "Anyone can view recipes" 
ON public.recipes FOR SELECT USING (true);

CREATE POLICY "Chefs and admins can create recipes" 
ON public.recipes FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE user_id = auth.uid() AND role IN ('admin'::app_role, 'chef'::app_role)
));

CREATE POLICY "Recipe creators and admins can update recipes" 
ON public.recipes FOR UPDATE 
USING (created_by = auth.uid() OR EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE user_id = auth.uid() AND role = 'admin'::app_role
));

-- RLS Policies for recipe_ingredients
CREATE POLICY "Anyone can view recipe ingredients" 
ON public.recipe_ingredients FOR SELECT USING (true);

CREATE POLICY "Recipe owners can manage recipe ingredients" 
ON public.recipe_ingredients FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.recipes r 
  WHERE r.id = recipe_id AND (
    r.created_by = auth.uid() OR 
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'::app_role)
  )
));

-- Function to calculate recipe calories
CREATE OR REPLACE FUNCTION public.calculate_recipe_nutrition(recipe_id_param UUID)
RETURNS TABLE(
  total_calories INTEGER,
  total_protein NUMERIC,
  total_carbs NUMERIC,
  total_fat NUMERIC,
  total_weight NUMERIC
) 
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    ROUND(SUM(
      (ri.quantity / 100.0) * i.calories_per_100g
    ))::INTEGER as total_calories,
    ROUND(SUM(
      (ri.quantity / 100.0) * i.protein_per_100g
    ), 2) as total_protein,
    ROUND(SUM(
      (ri.quantity / 100.0) * i.carbs_per_100g
    ), 2) as total_carbs,
    ROUND(SUM(
      (ri.quantity / 100.0) * i.fat_per_100g
    ), 2) as total_fat,
    ROUND(SUM(ri.quantity), 2) as total_weight
  FROM public.recipe_ingredients ri
  JOIN public.ingredients i ON ri.ingredient_id = i.id
  WHERE ri.recipe_id = recipe_id_param;
$$;

-- Trigger to update menu item calories when recipe changes
CREATE OR REPLACE FUNCTION public.update_menu_item_calories()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  recipe_nutrition RECORD;
BEGIN
  -- Get recipe nutrition
  SELECT * INTO recipe_nutrition 
  FROM public.calculate_recipe_nutrition(NEW.id);
  
  -- Update menu item if linked
  IF NEW.menu_item_id IS NOT NULL THEN
    UPDATE public.menu_items 
    SET calories = recipe_nutrition.total_calories
    WHERE id = NEW.menu_item_id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for recipe updates
CREATE TRIGGER update_menu_calories_on_recipe_change
  AFTER INSERT OR UPDATE ON public.recipes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_menu_item_calories();

-- Trigger for recipe ingredients changes
CREATE OR REPLACE FUNCTION public.update_recipe_calories_on_ingredient_change()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  recipe_nutrition RECORD;
BEGIN
  -- Get updated nutrition for the recipe
  SELECT * INTO recipe_nutrition 
  FROM public.calculate_recipe_nutrition(COALESCE(NEW.recipe_id, OLD.recipe_id));
  
  -- Update linked menu item
  UPDATE public.menu_items 
  SET calories = recipe_nutrition.total_calories
  WHERE id = (
    SELECT menu_item_id 
    FROM public.recipes 
    WHERE id = COALESCE(NEW.recipe_id, OLD.recipe_id)
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create trigger for recipe ingredients
CREATE TRIGGER update_calories_on_ingredient_change
  AFTER INSERT OR UPDATE OR DELETE ON public.recipe_ingredients
  FOR EACH ROW
  EXECUTE FUNCTION public.update_recipe_calories_on_ingredient_change();

-- Add updated_at triggers
CREATE TRIGGER update_ingredients_updated_at
  BEFORE UPDATE ON public.ingredients
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_recipes_updated_at
  BEFORE UPDATE ON public.recipes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample ingredients
INSERT INTO public.ingredients (name, name_ru, category, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g) VALUES
('Rice noodles', 'Рисовая лапша', 'grains', 109, 0.9, 25.0, 0.2),
('Shrimp', 'Креветки', 'seafood', 85, 20.1, 0.0, 1.4),
('Peanuts', 'Арахис', 'nuts', 567, 25.8, 16.1, 49.2),
('Bean sprouts', 'Ростки фасоли', 'vegetables', 23, 3.0, 4.0, 0.2),
('Eggs', 'Яйца', 'dairy', 155, 13.0, 1.1, 11.0),
('Tomato sauce', 'Томатный соус', 'sauces', 29, 1.6, 7.0, 0.2),
('Mozzarella cheese', 'Моцарелла', 'dairy', 300, 22.2, 2.2, 22.4),
('Fresh basil', 'Свежий базилик', 'herbs', 22, 3.2, 2.6, 0.6),
('Pizza dough', 'Тесто для пиццы', 'grains', 271, 8.1, 55.0, 2.7),
('Salmon', 'Лосось', 'seafood', 208, 25.4, 0.0, 12.4),
('Sushi rice', 'Рис для суши', 'grains', 130, 2.7, 28.0, 0.3),
('Nori seaweed', 'Нори', 'vegetables', 35, 5.8, 5.1, 0.3),
('Tuna', 'Тунец', 'seafood', 144, 30.0, 0.0, 1.0),
('Eel', 'Угорь', 'seafood', 184, 18.4, 0.0, 11.7),
('Mascarpone', 'Маскарпоне', 'dairy', 429, 4.8, 4.1, 44.0),
('Ladyfingers', 'Савоярди', 'grains', 395, 8.1, 76.0, 8.1),
('Coffee', 'Кофе', 'beverages', 1, 0.1, 0.0, 0.0),
('Cocoa powder', 'Какао порошок', 'other', 228, 19.6, 57.9, 13.7);

-- Add chef role to user_roles enum if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role' AND typtype = 'e') THEN
    CREATE TYPE app_role AS ENUM ('admin', 'user', 'chef');
  ELSE
    BEGIN
      ALTER TYPE app_role ADD VALUE 'chef';
    EXCEPTION WHEN duplicate_object THEN
      -- Role already exists, do nothing
    END;
  END IF;
END$$;