-- Create storage bucket for photos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'photos', 
    'photos', 
    true, 
    5242880, -- 5MB limit
    ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
);

-- Create storage policies for photos bucket
CREATE POLICY "Photos are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'photos');

CREATE POLICY "Users can upload their own photos" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'photos' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own photos" ON storage.objects
FOR UPDATE USING (
    bucket_id = 'photos' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own photos" ON storage.objects
FOR DELETE USING (
    bucket_id = 'photos' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);