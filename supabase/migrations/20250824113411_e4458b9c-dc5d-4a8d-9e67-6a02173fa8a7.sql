-- Update Storage RLS policies for vendor-documents bucket to restrict access
-- Remove overly permissive policy and create secure one

-- Drop the overly permissive policy for vendor-documents if it exists
DROP POLICY IF EXISTS "Allow authenticated users to read vendor documents" ON storage.objects;

-- Create secure policy for vendor-documents bucket
-- Only allow access to users who own the file or have admin role
CREATE POLICY "Secure vendor documents access" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'vendor-documents' AND (
    -- File owner can access their own files
    auth.uid()::text = (storage.foldername(name))[1] OR
    -- Admin users can access all vendor documents
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  )
);

-- Create secure policy for vendor-documents uploads
CREATE POLICY "Users can upload to their own vendor folder" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'vendor-documents' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Create secure policy for vendor-documents updates
CREATE POLICY "Users can update their own vendor documents" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'vendor-documents' AND (
    auth.uid()::text = (storage.foldername(name))[1] OR
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  )
);

-- Create secure policy for vendor-documents deletion
CREATE POLICY "Users can delete their own vendor documents" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'vendor-documents' AND (
    auth.uid()::text = (storage.foldername(name))[1] OR
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  )
);