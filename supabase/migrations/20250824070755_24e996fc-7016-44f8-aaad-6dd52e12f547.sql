-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'tenant', 'investor', 'internal', 'guest');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'guest',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create storage buckets for data room
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('data-room-contracts', 'data-room-contracts', false, 52428800, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']),
  ('data-room-financials', 'data-room-financials', false, 52428800, ARRAY['application/pdf', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']),
  ('data-room-decks', 'data-room-decks', false, 52428800, ARRAY['application/pdf', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation']),
  ('data-room-policies', 'data-room-policies', false, 52428800, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']),
  ('data-room-press', 'data-room-press', false, 52428800, ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/webp']);

-- Storage policies for data room
CREATE POLICY "Investors can view contracts, financials, decks, press"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id IN ('data-room-contracts', 'data-room-financials', 'data-room-decks', 'data-room-press')
  AND (
    public.has_role(auth.uid(), 'investor') OR 
    public.has_role(auth.uid(), 'internal') OR
    public.has_role(auth.uid(), 'admin')
  )
);

CREATE POLICY "Only internal can view policies"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'data-room-policies'
  AND (
    public.has_role(auth.uid(), 'internal') OR
    public.has_role(auth.uid(), 'admin')
  )
);

CREATE POLICY "Internal users can upload to data room"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id IN ('data-room-contracts', 'data-room-financials', 'data-room-decks', 'data-room-policies', 'data-room-press')
  AND (
    public.has_role(auth.uid(), 'internal') OR
    public.has_role(auth.uid(), 'admin')
  )
);

CREATE POLICY "Internal users can update data room files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id IN ('data-room-contracts', 'data-room-financials', 'data-room-decks', 'data-room-policies', 'data-room-press')
  AND (
    public.has_role(auth.uid(), 'internal') OR
    public.has_role(auth.uid(), 'admin')
  )
);

CREATE POLICY "Internal users can delete data room files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id IN ('data-room-contracts', 'data-room-financials', 'data-room-decks', 'data-room-policies', 'data-room-press')
  AND (
    public.has_role(auth.uid(), 'internal') OR
    public.has_role(auth.uid(), 'admin')
  )
);