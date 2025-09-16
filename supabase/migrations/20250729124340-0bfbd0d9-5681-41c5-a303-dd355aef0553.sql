-- Check if vendor-documents bucket exists and create storage policies if missing

-- Create storage policies for vendor-documents bucket (if not exists)
DO $$
BEGIN
    -- Check if policies exist for vendor-documents bucket
    IF NOT EXISTS (
        SELECT 1 FROM storage.objects WHERE bucket_id = 'vendor-documents' LIMIT 1
    ) THEN
        -- Insert the bucket first if it doesn't exist
        INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
        VALUES (
            'vendor-documents', 
            'vendor-documents', 
            false, 
            10485760, -- 10MB limit
            ARRAY['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
        )
        ON CONFLICT (id) DO NOTHING;
    END IF;
END $$;

-- Create storage policies for vendor-documents bucket
CREATE POLICY "Anyone can upload vendor documents" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'vendor-documents');

CREATE POLICY "Admins can view vendor documents" ON storage.objects
FOR SELECT USING (
    bucket_id = 'vendor-documents' AND 
    EXISTS (
        SELECT 1 FROM user_roles 
        WHERE user_id = auth.uid() AND role = 'admin'::app_role
    )
);

CREATE POLICY "Anyone can update their vendor documents" ON storage.objects
FOR UPDATE USING (bucket_id = 'vendor-documents');

CREATE POLICY "Admins can delete vendor documents" ON storage.objects
FOR DELETE USING (
    bucket_id = 'vendor-documents' AND 
    EXISTS (
        SELECT 1 FROM user_roles 
        WHERE user_id = auth.uid() AND role = 'admin'::app_role
    )
);