-- Create reviews table for food hall vendor reviews
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  guest_name TEXT,
  guest_email TEXT,
  vendor_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'approved',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT reviews_user_or_guest_check CHECK (
    (user_id IS NOT NULL) OR 
    (user_id IS NULL AND guest_name IS NOT NULL AND guest_email IS NOT NULL)
  )
);

-- Enable Row Level Security
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Create policies for reviews access
CREATE POLICY "Anyone can view approved reviews" 
ON public.reviews 
FOR SELECT 
USING (status = 'approved');

CREATE POLICY "Authenticated users can create their own reviews" 
ON public.reviews 
FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL AND 
  user_id = auth.uid() AND 
  guest_name IS NULL AND 
  guest_email IS NULL
);

CREATE POLICY "Guests can create anonymous reviews" 
ON public.reviews 
FOR INSERT 
WITH CHECK (
  user_id IS NULL AND 
  guest_name IS NOT NULL AND 
  guest_email IS NOT NULL
);

CREATE POLICY "Users can update their own reviews" 
ON public.reviews 
FOR UPDATE 
USING (user_id = auth.uid()) 
WITH CHECK (user_id = auth.uid());

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_reviews_updated_at
BEFORE UPDATE ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_reviews_vendor_name ON public.reviews(vendor_name);
CREATE INDEX idx_reviews_status ON public.reviews(status);
CREATE INDEX idx_reviews_created_at ON public.reviews(created_at DESC);