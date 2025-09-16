-- Create bookings table for timeslot reservations
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  experience_type TEXT NOT NULL, -- 'taste_compass', 'wine_staircase', 'lounge'
  booking_date DATE NOT NULL,
  time_slot TIME NOT NULL, -- 30-minute slots: 11:00, 11:30, 12:00, etc.
  guest_count INTEGER NOT NULL DEFAULT 1 CHECK (guest_count > 0 AND guest_count <= 8),
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT,
  special_requests TEXT,
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'completed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Prevent double booking of same slot
  UNIQUE(experience_type, booking_date, time_slot)
);

-- Enable Row Level Security
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Create policies for bookings
CREATE POLICY "Users can view their own bookings" 
ON public.bookings 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can create bookings" 
ON public.bookings 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own bookings" 
ON public.bookings 
FOR UPDATE 
USING (user_id = auth.uid());

-- Public policy to check availability (without personal data)
CREATE POLICY "Public can check slot availability" 
ON public.bookings 
FOR SELECT 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_bookings_updated_at
BEFORE UPDATE ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_bookings_date_time ON public.bookings(experience_type, booking_date, time_slot);
CREATE INDEX idx_bookings_user ON public.bookings(user_id);