-- Create table for vendor applications
CREATE TABLE public.vendor_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  cuisine_type TEXT NOT NULL,
  preferred_sector TEXT NOT NULL,
  experience_years INTEGER,
  description TEXT NOT NULL,
  expected_revenue TEXT,
  investment_budget TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.vendor_applications ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can submit vendor applications" 
ON public.vendor_applications 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Only admins can view vendor applications" 
ON public.vendor_applications 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Only admins can update vendor applications" 
ON public.vendor_applications 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Create storage bucket for vendor documents
INSERT INTO storage.buckets (id, name, public) VALUES ('vendor-documents', 'vendor-documents', false);

-- Create storage policies for vendor documents
CREATE POLICY "Anyone can upload vendor documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'vendor-documents');

CREATE POLICY "Only admins can view vendor documents" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'vendor-documents' AND 
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Create trigger for automatic timestamp updates
CREATE OR REPLACE FUNCTION public.update_vendor_applications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_vendor_applications_updated_at
BEFORE UPDATE ON public.vendor_applications
FOR EACH ROW
EXECUTE FUNCTION public.update_vendor_applications_updated_at();