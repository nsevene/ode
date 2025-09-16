-- Add some sample daily quests for testing
INSERT INTO public.daily_quests (title, description, quest_type, target_value, reward_points, reward_description, quest_date, is_active) VALUES
('Попробуйте новый сектор', 'Посетите любой сектор вкуса в ODE', 'visit_sector', 1, 50, 'Получите 50 очков опыта', CURRENT_DATE, true),
('Проведите время в ресторане', 'Проведите минимум 30 минут в ODE', 'spend_time', 30, 75, 'Получите 75 очков опыта', CURRENT_DATE, true),
('Сыграйте в мини-игру', 'Завершите любую мини-игру', 'complete_mini_game', 1, 100, 'Получите 100 очков опыта', CURRENT_DATE, true),
('Поделитесь достижением', 'Поделитесь своим прогрессом в социальных сетях', 'share_achievement', 1, 60, 'Получите 60 очков опыта', CURRENT_DATE, true),
('Пригласите друга', 'Пригласите друга в ODE через реферальную программу', 'invite_friend', 1, 150, 'Получите 150 очков опыта + бонус', CURRENT_DATE, true);

-- Create a test booking for validation
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM bookings LIMIT 1) THEN
    INSERT INTO public.bookings (
      experience_type, booking_date, time_slot, guest_count, 
      guest_name, guest_email, guest_phone, status
    ) VALUES (
      'taste-compass', CURRENT_DATE + 1, '18:00:00'::time, 2,
      'Test User', 'test@example.com', '+1234567890', 'confirmed'
    );
  END IF;
END $$;