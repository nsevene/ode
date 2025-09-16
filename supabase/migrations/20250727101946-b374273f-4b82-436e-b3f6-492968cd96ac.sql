-- Add payment-related columns to bookings table
ALTER TABLE public.bookings 
ADD COLUMN payment_status TEXT DEFAULT 'pending',
ADD COLUMN payment_amount INTEGER,
ADD COLUMN stripe_session_id TEXT,
ADD COLUMN stripe_payment_intent_id TEXT;

-- Add unique constraint to event_type in events table
ALTER TABLE public.events ADD CONSTRAINT events_event_type_unique UNIQUE (event_type);

-- Insert events with pricing information
INSERT INTO public.events (event_type, title, description, price_usd, duration_minutes) VALUES
('taste-compass', 'Taste Compass', 'Interactive culinary adventure through world sectors', 2500, 120),
('wine-staircase', 'Wine Staircase', 'Unique wine tasting experience on our signature staircase', 3500, 90),
('vip-lounge', 'VIP Lounge', 'Premium nightlife experience with exclusive access', 5000, 180)
ON CONFLICT (event_type) DO UPDATE SET
title = EXCLUDED.title,
description = EXCLUDED.description,
price_usd = EXCLUDED.price_usd,
duration_minutes = EXCLUDED.duration_minutes;