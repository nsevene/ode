-- Создаем дополнительные storage buckets для документов и договоров

-- Bucket для договоров (приватный)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('contracts', 'contracts', false, 52428800, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']);

-- Bucket для административных документов (приватный) 
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('admin-documents', 'admin-documents', false, 52428800, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']);

-- Bucket для пользовательских документов (приватный)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('user-documents', 'user-documents', false, 10485760, ARRAY['application/pdf', 'image/jpeg', 'image/png']);

-- Создаем RLS политики для contracts bucket
CREATE POLICY "Admins can upload contracts" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'contracts' AND (EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE user_id = auth.uid() AND role = 'admin'::app_role
)));

CREATE POLICY "Admins can view contracts" ON storage.objects
FOR SELECT TO authenticated
USING (bucket_id = 'contracts' AND (EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE user_id = auth.uid() AND role = 'admin'::app_role
)));

CREATE POLICY "Admins can update contracts" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'contracts' AND (EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE user_id = auth.uid() AND role = 'admin'::app_role
)));

CREATE POLICY "Admins can delete contracts" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'contracts' AND (EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE user_id = auth.uid() AND role = 'admin'::app_role
)));

-- Создаем RLS политики для admin-documents bucket
CREATE POLICY "Admins can upload admin documents" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'admin-documents' AND (EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE user_id = auth.uid() AND role = 'admin'::app_role
)));

CREATE POLICY "Admins can view admin documents" ON storage.objects
FOR SELECT TO authenticated
USING (bucket_id = 'admin-documents' AND (EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE user_id = auth.uid() AND role = 'admin'::app_role
)));

CREATE POLICY "Admins can update admin documents" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'admin-documents' AND (EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE user_id = auth.uid() AND role = 'admin'::app_role
)));

CREATE POLICY "Admins can delete admin documents" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'admin-documents' AND (EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE user_id = auth.uid() AND role = 'admin'::app_role
)));

-- Создаем RLS политики для user-documents bucket
CREATE POLICY "Users can upload their own documents" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'user-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own documents" ON storage.objects
FOR SELECT TO authenticated
USING (bucket_id = 'user-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own documents" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'user-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own documents" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'user-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Admins могут видеть все пользовательские документы
CREATE POLICY "Admins can view all user documents" ON storage.objects
FOR SELECT TO authenticated
USING (bucket_id = 'user-documents' AND (EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE user_id = auth.uid() AND role = 'admin'::app_role
)));

-- Создаем таблицу для метаданных документов
CREATE TABLE public.document_metadata (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  file_path TEXT NOT NULL,
  bucket_name TEXT NOT NULL,
  original_name TEXT NOT NULL,
  file_size BIGINT,
  mime_type TEXT,
  uploaded_by UUID REFERENCES auth.users(id),
  document_type TEXT, -- 'contract', 'invoice', 'report', 'legal', etc.
  description TEXT,
  tags TEXT[],
  version INTEGER DEFAULT 1,
  is_signed BOOLEAN DEFAULT false,
  signed_at TIMESTAMP WITH TIME ZONE,
  signed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS на таблице метаданных
ALTER TABLE public.document_metadata ENABLE ROW LEVEL SECURITY;

-- RLS политики для метаданных документов
CREATE POLICY "Admins can manage all document metadata" ON public.document_metadata
FOR ALL TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE user_id = auth.uid() AND role = 'admin'::app_role
));

CREATE POLICY "Users can view their own document metadata" ON public.document_metadata
FOR SELECT TO authenticated
USING (uploaded_by = auth.uid());

CREATE POLICY "Users can insert their own document metadata" ON public.document_metadata
FOR INSERT TO authenticated
WITH CHECK (uploaded_by = auth.uid());

-- Trigger для обновления updated_at
CREATE TRIGGER update_document_metadata_updated_at
    BEFORE UPDATE ON public.document_metadata
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();