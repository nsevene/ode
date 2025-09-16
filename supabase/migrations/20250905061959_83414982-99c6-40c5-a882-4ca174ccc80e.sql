-- Create tenant applications table
CREATE TABLE public.tenant_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand TEXT NOT NULL,
  cuisine TEXT NOT NULL,
  format TEXT NOT NULL CHECK (format IN ('long-term', 'popup')),
  preferred_corner TEXT,
  instagram TEXT,
  expected_revenue TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'approved', 'rejected')),
  contact_email TEXT,
  contact_phone TEXT,
  contact_name TEXT,
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tenant_applications ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can submit tenant applications"
  ON public.tenant_applications
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Only admins can view tenant applications"
  ON public.tenant_applications
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'::app_role
  ));

CREATE POLICY "Only admins can update tenant applications"
  ON public.tenant_applications
  FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'::app_role
  ));

CREATE POLICY "Only admins can delete tenant applications"
  ON public.tenant_applications
  FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'::app_role
  ));

-- Create trigger for updated_at
CREATE TRIGGER update_tenant_applications_updated_at
  BEFORE UPDATE ON public.tenant_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();