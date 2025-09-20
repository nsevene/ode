-- CMS Core Entities Migration
-- Создание основных сущностей для управления контентом

-- 1. KITCHENS MANAGEMENT
CREATE TABLE public.kitchens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  long_description TEXT,
  image_url TEXT,
  gallery_urls TEXT[],
  location TEXT NOT NULL,
  floor_plan_position JSONB,
  capacity INTEGER DEFAULT 0,
  equipment TEXT[],
  amenities TEXT[],
  cuisine_type TEXT NOT NULL,
  price_per_hour_usd INTEGER DEFAULT 0,
  is_available BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER DEFAULT 0,
  contact_person TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  opening_hours JSONB,
  special_requirements TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. SPACES MANAGEMENT
CREATE TABLE public.spaces (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  long_description TEXT,
  image_url TEXT,
  gallery_urls TEXT[],
  floor TEXT NOT NULL,
  area_sqm INTEGER DEFAULT 0,
  capacity INTEGER DEFAULT 0,
  space_type TEXT NOT NULL,
  amenities TEXT[],
  equipment TEXT[],
  price_per_hour_usd INTEGER DEFAULT 0,
  is_available BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER DEFAULT 0,
  contact_person TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  opening_hours JSONB,
  special_requirements TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. EXPERIENCES MANAGEMENT
CREATE TABLE public.experiences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  long_description TEXT,
  image_url TEXT,
  gallery_urls TEXT[],
  category TEXT NOT NULL,
  price_usd INTEGER DEFAULT 0,
  duration_minutes INTEGER DEFAULT 60,
  capacity INTEGER DEFAULT 1,
  difficulty_level TEXT DEFAULT 'easy',
  location TEXT NOT NULL,
  schedule JSONB,
  includes TEXT[],
  requirements TEXT[],
  excludes TEXT[],
  age_restriction INTEGER,
  contact_person TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  booking_policy TEXT,
  cancellation_policy TEXT,
  is_available BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER DEFAULT 0,
  tags TEXT[],
  highlights TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 4. TENANTS MANAGEMENT
CREATE TABLE public.tenants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  long_description TEXT,
  logo_url TEXT,
  gallery_urls TEXT[],
  business_type TEXT NOT NULL,
  cuisine_type TEXT,
  contact_person TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  website_url TEXT,
  social_media JSONB,
  business_license TEXT,
  tax_id TEXT,
  address TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 5. CONTENT MANAGEMENT
CREATE TABLE public.content_blocks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  content_type TEXT NOT NULL,
  page_section TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS на всех таблицах
ALTER TABLE public.kitchens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_blocks ENABLE ROW LEVEL SECURITY;

-- RLS Policies для публичного доступа
CREATE POLICY "Kitchens are publicly readable" ON public.kitchens FOR SELECT USING (true);
CREATE POLICY "Spaces are publicly readable" ON public.spaces FOR SELECT USING (true);
CREATE POLICY "Experiences are publicly readable" ON public.experiences FOR SELECT USING (true);
CREATE POLICY "Tenants are publicly readable" ON public.tenants FOR SELECT USING (is_active = true);
CREATE POLICY "Content blocks are publicly readable" ON public.content_blocks FOR SELECT USING (is_active = true);

-- RLS Policies для админов
CREATE POLICY "Admins can manage kitchens" ON public.kitchens FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'::app_role));

CREATE POLICY "Admins can manage spaces" ON public.spaces FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'::app_role));

CREATE POLICY "Admins can manage experiences" ON public.experiences FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'::app_role));

CREATE POLICY "Admins can manage tenants" ON public.tenants FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'::app_role));

CREATE POLICY "Admins can manage content" ON public.content_blocks FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'::app_role));

-- Triggers для обновления updated_at
CREATE TRIGGER update_kitchens_updated_at BEFORE UPDATE ON public.kitchens FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_spaces_updated_at BEFORE UPDATE ON public.spaces FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_experiences_updated_at BEFORE UPDATE ON public.experiences FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON public.tenants FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_content_blocks_updated_at BEFORE UPDATE ON public.content_blocks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Индексы для производительности
CREATE INDEX idx_kitchens_slug ON public.kitchens(slug);
CREATE INDEX idx_kitchens_cuisine_type ON public.kitchens(cuisine_type);
CREATE INDEX idx_kitchens_is_available ON public.kitchens(is_available);

CREATE INDEX idx_spaces_slug ON public.spaces(slug);
CREATE INDEX idx_spaces_floor ON public.spaces(floor);
CREATE INDEX idx_spaces_space_type ON public.spaces(space_type);
CREATE INDEX idx_spaces_is_available ON public.spaces(is_available);

CREATE INDEX idx_experiences_slug ON public.experiences(slug);
CREATE INDEX idx_experiences_category ON public.experiences(category);
CREATE INDEX idx_experiences_is_available ON public.experiences(is_available);

CREATE INDEX idx_tenants_slug ON public.tenants(slug);
CREATE INDEX idx_tenants_business_type ON public.tenants(business_type);
CREATE INDEX idx_tenants_is_active ON public.tenants(is_active);

CREATE INDEX idx_content_blocks_page_section ON public.content_blocks(page_section);
CREATE INDEX idx_content_blocks_is_active ON public.content_blocks(is_active);
