-- Create storage policies for vendor documents bucket
CREATE POLICY "Allow authenticated users to upload vendor documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'vendor-documents' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Allow authenticated users to view their vendor documents" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'vendor-documents' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Allow authenticated users to update their vendor documents" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'vendor-documents' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Allow authenticated users to delete their vendor documents" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'vendor-documents' 
  AND auth.role() = 'authenticated'
);