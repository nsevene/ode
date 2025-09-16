-- Create space_bookings table for area rental applications
CREATE TABLE public.space_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  space_id INTEGER NOT NULL,
  space_name TEXT NOT NULL,
  space_area NUMERIC(5,1) NOT NULL,
  floor_number INTEGER NOT NULL,
  
  -- Company information
  company_name TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  
  -- Business details
  business_type TEXT NOT NULL,
  cuisine_type TEXT,
  description TEXT NOT NULL,
  expected_revenue TEXT,
  investment_budget TEXT,
  lease_start_date DATE,
  lease_duration TEXT NOT NULL, -- "6 months", "1 year", etc.
  
  -- Application status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'approved', 'rejected', 'contract_signed')),
  admin_notes TEXT,
  
  -- Contact preferences
  preferred_contact_method TEXT DEFAULT 'email' CHECK (preferred_contact_method IN ('email', 'phone', 'both')),
  best_contact_time TEXT,
  
  -- Documents and additional info
  has_food_license BOOLEAN DEFAULT false,
  previous_experience TEXT,
  special_requirements TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.space_bookings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can submit space booking applications" 
ON public.space_bookings 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view all space bookings" 
ON public.space_bookings 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE user_id = auth.uid() AND role = 'admin'::app_role
));

CREATE POLICY "Admins can update space bookings" 
ON public.space_bookings 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE user_id = auth.uid() AND role = 'admin'::app_role
));

-- Create trigger for updating updated_at
CREATE TRIGGER update_space_bookings_updated_at
  BEFORE UPDATE ON public.space_bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_space_bookings_status ON public.space_bookings(status);
CREATE INDEX idx_space_bookings_space_id ON public.space_bookings(space_id);
CREATE INDEX idx_space_bookings_created_at ON public.space_bookings(created_at);