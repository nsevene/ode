-- Fix the status constraint to allow pending, confirmed, and cancelled statuses
ALTER TABLE public.bookings DROP CONSTRAINT IF EXISTS bookings_status_check;

-- Add proper constraint that allows pending status
ALTER TABLE public.bookings ADD CONSTRAINT bookings_status_check 
CHECK (status IN ('pending', 'confirmed', 'cancelled'));