
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Image, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import LazyImage from '@/components/performance/LazyImage';

interface Photo {
  id: string;
  url: string;
  name: string;
  created_at: string;
}

export const PhotoGallery: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Загрузка фотографий из хранилища
      
      const { data, error } = await supabase.storage
        .from('photos')
        .list('', {
          limit: 100,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (error) {
        console.error('Storage list error:', error);
        throw error;
      }

      // Фотографии загружены

      if (!data || data.length === 0) {
        setPhotos([]);
        return;
      }

      const photoPromises = data.map(async (file) => {
        const { data: urlData } = supabase.storage
          .from('photos')
          .getPublicUrl(file.name);

        return {
          id: file.id,
          url: urlData.publicUrl,
          name: file.name,
          created_at: file.created_at
        };
      });

      const photoResults = await Promise.all(photoPromises);
      setPhotos(photoResults);
    } catch (error: any) {
      console.error('Ошибка загрузки фотографий:', error);
      
      if (error.message?.includes('Bucket not found')) {
        setError('Хранилище фотографий не настроено');
      } else {
        setError(`Не удалось загрузить фотографии: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2 text-gray-600">Загрузка фотографий...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <Image className="w-16 h-16 mx-auto text-red-400 mb-4" />
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={loadPhotos}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="text-center p-8">
        <Image className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-500">Пока нет загруженных фотографий</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="relative group cursor-pointer"
            onClick={() => setSelectedPhoto(photo.url)}
          >
            <LazyImage
              src={photo.url}
              alt={photo.name}
              className="w-full h-48 object-cover rounded-lg transition-transform group-hover:scale-105"
              onError={() => {
                console.error('Error loading image:', photo.url);
              }}
            />
            <div className="absolute inset-0 bg-charcoal bg-opacity-0 group-hover:bg-opacity-20 transition-opacity rounded-lg" />
          </div>
        ))}
      </div>

      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-charcoal bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <LazyImage
              src={selectedPhoto}
              alt="Enlarged view"
              className="max-w-full max-h-full object-contain"
            />
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 text-cream-light bg-charcoal bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
