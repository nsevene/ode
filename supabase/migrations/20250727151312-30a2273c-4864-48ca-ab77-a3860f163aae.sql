-- Update the referral reward function to trigger email notifications
CREATE OR REPLACE FUNCTION public.handle_referral_reward(referrer_code text, new_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
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
        (referrer_id, 'referral', 'Referral Bonus!', 'You earned 25 points for referring a friend!', jsonb_build_object('points', 25, 'trigger_email', true, 'email_type', 'referral_bonus')),
        (new_user_id, 'welcome', 'Welcome Bonus!', 'You received 25 points for joining through a referral!', jsonb_build_object('points', 25, 'trigger_email', true, 'email_type', 'welcome_bonus'));
    END IF;
END;
$function$;