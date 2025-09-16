-- Create events table for pricing and experiences
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL, -- 'wine_tasting', 'chef_table', 'lounge_vip'
  title TEXT NOT NULL,
  description TEXT,
  price_usd INTEGER NOT NULL, -- price in cents
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  max_guests INTEGER NOT NULL DEFAULT 6,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'sold_out')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (for pricing)
CREATE POLICY "Events are publicly readable" 
ON public.events 
FOR SELECT 
USING (status = 'active');

-- Insert default events with pricing
INSERT INTO public.events (event_type, title, description, price_usd, duration_minutes, max_guests) VALUES
('wine_tasting', 'Wine Staircase Terroir Tasting', 'Compare two terroirs with sommelier guidance', 4500, 90, 6),
('wine_tasting', 'Private Flight Tasting', 'Book entire staircase flight for vertical tasting', 12000, 120, 8),
('chef_table', 'Chef''s Table Experience', 'Exclusive 6-course tasting menu with wine pairing', 15000, 180, 6),
('chef_table', 'Taste Passport Reward', 'Complimentary Chef''s Table for completing all 6 stamps', 0, 180, 6),
('lounge_vip', 'Premium VIP Package', 'Private booth with bottle service and appetizers', 40000, 240, 8),
('lounge_vip', 'Group Package', 'Reserved table with welcome cocktails', 20000, 180, 6);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_events_updated_at
BEFORE UPDATE ON public.events
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();