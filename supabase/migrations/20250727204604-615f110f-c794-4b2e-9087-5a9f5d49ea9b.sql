
-- Создаем bucket для фотографий
INSERT INTO storage.buckets (id, name, public)
VALUES ('photos', 'photos', true);

-- Создаем политики для bucket photos
CREATE POLICY "Allow public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'photos');

CREATE POLICY "Allow authenticated users to upload" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'photos' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Allow users to update their own photos" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Allow users to delete their own photos" ON storage.objects
FOR DELETE USING (
  bucket_id = 'photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
