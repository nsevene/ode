-- Add referral functionality to profiles table
ALTER TABLE public.profiles ADD COLUMN referral_code TEXT UNIQUE;
ALTER TABLE public.profiles ADD COLUMN referred_by UUID REFERENCES public.profiles(id);

-- Create function to generate referral codes
CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS TEXT AS $$
DECLARE
    code TEXT;
    exists_check BOOLEAN;
BEGIN
    LOOP
        -- Generate 6 character alphanumeric code
        code := UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6));
        
        -- Check if code already exists
        SELECT EXISTS(SELECT 1 FROM public.profiles WHERE referral_code = code) INTO exists_check;
        
        -- Exit loop if code is unique
        IF NOT exists_check THEN
            EXIT;
        END IF;
    END LOOP;
    
    RETURN code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-generate referral codes for new users
CREATE OR REPLACE FUNCTION public.handle_new_user_referral()
RETURNS TRIGGER AS $$
BEGIN
    NEW.referral_code = public.generate_referral_code();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_profile_referral_code
    BEFORE INSERT ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user_referral();

-- Function to handle referral rewards
CREATE OR REPLACE FUNCTION public.handle_referral_reward(referrer_code TEXT, new_user_id UUID)
RETURNS VOID AS $$
DECLARE
    referrer_id UUID;
BEGIN
    -- Find referrer by code
    SELECT id INTO referrer_id FROM public.profiles WHERE referral_code = referrer_code;
    
    IF referrer_id IS NOT NULL AND referrer_id != new_user_id THEN
        -- Update referred_by for new user
        UPDATE public.profiles SET referred_by = referrer_id WHERE id = new_user_id;
        
        -- Give 25 points to both users
        INSERT INTO public.loyalty_programs (user_id, points) 
        VALUES (referrer_id, 25), (new_user_id, 25)
        ON CONFLICT (user_id) 
        DO UPDATE SET points = loyalty_programs.points + 25;
        
        -- Create notifications
        INSERT INTO public.user_notifications (user_id, type, title, message, data)
        VALUES 
        (referrer_id, 'referral', 'Referral Bonus!', 'You earned 25 points for referring a friend!', '{"points": 25}'::jsonb),
        (new_user_id, 'welcome', 'Welcome Bonus!', 'You received 25 points for joining through a referral!', '{"points": 25}'::jsonb);
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;