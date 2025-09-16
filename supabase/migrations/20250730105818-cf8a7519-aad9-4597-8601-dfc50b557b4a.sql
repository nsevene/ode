-- Создание таблицы промо-кодов
CREATE TABLE public.promo_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed_amount', 'free_item')),
  discount_value INTEGER NOT NULL,
  min_order_amount INTEGER DEFAULT 0,
  max_discount_amount INTEGER,
  usage_limit INTEGER,
  usage_count INTEGER NOT NULL DEFAULT 0,
  user_usage_limit INTEGER DEFAULT 1,
  valid_from TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  valid_until TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  applicable_to TEXT[] DEFAULT '{}', -- experience types, menu items, etc.
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Таблица использования промо-кодов
CREATE TABLE public.promo_code_usages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  promo_code_id UUID NOT NULL REFERENCES public.promo_codes(id) ON DELETE CASCADE,
  user_id UUID,
  guest_email TEXT,
  booking_id UUID,
  order_id UUID,
  discount_amount INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Таблица автоматических акций
CREATE TABLE public.marketing_campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('birthday', 'loyalty_tier', 'first_booking', 'return_customer', 'seasonal', 'abandoned_cart')),
  trigger_conditions JSONB NOT NULL,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed_amount', 'free_item', 'upgrade')),
  discount_value INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  email_template TEXT,
  push_notification_template TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Таблица применения кампаний
CREATE TABLE public.campaign_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL REFERENCES public.marketing_campaigns(id) ON DELETE CASCADE,
  user_id UUID,
  guest_email TEXT,
  promo_code_generated TEXT,
  applied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  booking_id UUID,
  order_id UUID,
  discount_amount INTEGER
);

-- Расширение таблицы профилей для рефералов
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS referral_earnings INTEGER DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS referral_count INTEGER DEFAULT 0;

-- Таблица реферальных транзакций
CREATE TABLE public.referral_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  referred_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('signup_bonus', 'booking_commission', 'milestone_bonus')),
  amount INTEGER NOT NULL,
  booking_id UUID,
  description TEXT,
  processed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Включаем RLS
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_code_usages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_transactions ENABLE ROW LEVEL SECURITY;

-- Политики для промо-кодов
CREATE POLICY "Anyone can view active promo codes" ON public.promo_codes
  FOR SELECT USING (is_active = true AND (valid_until IS NULL OR valid_until > now()));

CREATE POLICY "Admins can manage promo codes" ON public.promo_codes
  FOR ALL USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'::app_role));

-- Политики для использования промо-кодов
CREATE POLICY "Users can view their promo code usages" ON public.promo_code_usages
  FOR SELECT USING (auth.uid() = user_id OR guest_email IS NOT NULL);

CREATE POLICY "Users can insert their promo code usages" ON public.promo_code_usages
  FOR INSERT WITH CHECK (auth.uid() = user_id OR (user_id IS NULL AND guest_email IS NOT NULL));

-- Политики для кампаний
CREATE POLICY "Admins can manage campaigns" ON public.marketing_campaigns
  FOR ALL USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'::app_role));

CREATE POLICY "Anyone can view active campaigns" ON public.marketing_campaigns
  FOR SELECT USING (is_active = true);

-- Политики для применения кампаний
CREATE POLICY "Users can view their campaign applications" ON public.campaign_applications
  FOR SELECT USING (auth.uid() = user_id OR guest_email IS NOT NULL);

CREATE POLICY "System can insert campaign applications" ON public.campaign_applications
  FOR INSERT WITH CHECK (true);

-- Политики для реферальных транзакций
CREATE POLICY "Users can view their referral transactions" ON public.referral_transactions
  FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

CREATE POLICY "System can insert referral transactions" ON public.referral_transactions
  FOR INSERT WITH CHECK (true);

-- Функция для генерации промо-кода
CREATE OR REPLACE FUNCTION public.generate_promo_code(prefix TEXT DEFAULT 'ODE')
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    code TEXT;
    exists_check BOOLEAN;
BEGIN
    LOOP
        code := prefix || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6));
        SELECT EXISTS(SELECT 1 FROM public.promo_codes WHERE promo_codes.code = code) INTO exists_check;
        IF NOT exists_check THEN
            EXIT;
        END IF;
    END LOOP;
    RETURN code;
END;
$$;

-- Функция для автоматического применения кампаний
CREATE OR REPLACE FUNCTION public.apply_marketing_campaigns(
  p_user_id UUID DEFAULT NULL,
  p_guest_email TEXT DEFAULT NULL,
  p_trigger_type TEXT DEFAULT 'booking',
  p_context JSONB DEFAULT '{}'::jsonb
)
RETURNS TABLE(campaign_id UUID, promo_code TEXT, discount_amount INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    campaign_record RECORD;
    generated_code TEXT;
    user_profile RECORD;
BEGIN
    -- Получаем профиль пользователя если есть
    IF p_user_id IS NOT NULL THEN
        SELECT * INTO user_profile FROM public.profiles WHERE id = p_user_id;
    END IF;
    
    -- Проходим по активным кампаниям
    FOR campaign_record IN 
        SELECT * FROM public.marketing_campaigns 
        WHERE is_active = true 
        AND (start_date IS NULL OR start_date <= now())
        AND (end_date IS NULL OR end_date > now())
    LOOP
        -- Проверяем условия триггера
        IF campaign_record.type = 'first_booking' AND p_trigger_type = 'booking' THEN
            -- Проверяем что это первое бронирование
            IF p_user_id IS NOT NULL THEN
                IF NOT EXISTS(SELECT 1 FROM public.bookings WHERE user_id = p_user_id AND status = 'confirmed') THEN
                    -- Генерируем промо-код
                    generated_code := public.generate_promo_code('FIRST');
                    
                    -- Создаем промо-код
                    INSERT INTO public.promo_codes (code, title, description, discount_type, discount_value, usage_limit, user_usage_limit, valid_until)
                    VALUES (generated_code, campaign_record.title, campaign_record.description, campaign_record.discount_type, campaign_record.discount_value, 1, 1, now() + interval '30 days');
                    
                    -- Записываем применение кампании
                    INSERT INTO public.campaign_applications (campaign_id, user_id, guest_email, promo_code_generated)
                    VALUES (campaign_record.id, p_user_id, p_guest_email, generated_code);
                    
                    RETURN QUERY SELECT campaign_record.id, generated_code, campaign_record.discount_value;
                END IF;
            END IF;
        END IF;
        
        -- Добавляем другие типы кампаний по необходимости
    END LOOP;
END;
$$;

-- Триггер для обновления времени
CREATE OR REPLACE FUNCTION public.update_updated_at_marketing()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_promo_codes_updated_at
  BEFORE UPDATE ON public.promo_codes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_marketing();

CREATE TRIGGER update_marketing_campaigns_updated_at
  BEFORE UPDATE ON public.marketing_campaigns
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_marketing();