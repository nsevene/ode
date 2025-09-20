import React, { useState, useCallback } from 'react';
import { Upload, X, Image } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface PhotoUploadProps {
  onUpload?: (url: string) => void;
  maxFiles?: number;
  accept?: string;
  className?: string;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({
  onUpload,
  maxFiles = 5,
  accept = 'image/*',
  className = '',
}) => {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const uploadFile = async (file: File) => {
    if (!user) {
      toast.error('You need to sign in to upload photos');
      return;
    }

    console.log('Starting file upload for:', file.name);
    console.log('User ID:', user.id);

    try {
      setUploading(true);

      // Проверяем размер файла (максимум 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Файл слишком большой. Максимальный размер: 5MB');
        return;
      }

      // Проверяем тип файла
      if (!file.type.startsWith('image/')) {
        toast.error('Пожалуйста, выберите изображение');
        return;
      }

      // Создаем уникальное имя файла
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      console.log('Uploading file to path:', fileName);

      // Загружаем файл в Supabase Storage
      const { data, error } = await supabase.storage
        .from('photos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        console.error('Storage upload error:', error);
        throw error;
      }

      console.log('Upload successful:', data);

      // Получаем публичный URL
      const { data: urlData } = supabase.storage
        .from('photos')
        .getPublicUrl(data.path);

      const publicUrl = urlData.publicUrl;
      console.log('Public URL:', publicUrl);

      setUploadedFiles((prev) => [...prev, publicUrl]);
      onUpload?.(publicUrl);

      toast.success('Фотография успешно загружена!');
    } catch (error: any) {
      console.error('Ошибка загрузки:', error);

      if (error.message?.includes('Bucket not found')) {
        toast.error(
          'Хранилище фотографий не настроено. Обратитесь к администратору.'
        );
      } else if (error.message?.includes('not allowed')) {
        toast.error('У вас нет прав для загрузки фотографий');
      } else {
        toast.error(`Не удалось загрузить фотографию: ${error.message}`);
      }
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const files = Array.from(e.dataTransfer.files);
        files.slice(0, maxFiles).forEach(uploadFile);
      }
    },
    [maxFiles]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      files.slice(0, maxFiles).forEach(uploadFile);
    }
  };

  const removeFile = (urlToRemove: string) => {
    setUploadedFiles((prev) => prev.filter((url) => url !== urlToRemove));
  };

  // Проверяем, авторизован ли пользователь
  if (!user) {
    return (
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <div className="flex flex-col items-center space-y-2">
          <Upload className="w-12 h-12 text-gray-400" />
          <p className="text-gray-500">
            Войдите в систему, чтобы загружать фотографии
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? 'border-primary bg-primary/5'
            : 'border-gray-300 hover:border-primary'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          accept={accept}
          onChange={handleFileInput}
          className="hidden"
          id="file-upload"
          disabled={uploading}
        />

        <div className="flex flex-col items-center space-y-2">
          <Upload className="w-12 h-12 text-gray-400" />
          <div>
            <label
              htmlFor="file-upload"
              className="cursor-pointer text-primary hover:text-primary/80 font-medium"
            >
              Нажмите для выбора файлов
            </label>
            <p className="text-gray-500"> или перетащите файлы сюда</p>
          </div>
          <p className="text-sm text-gray-400">
            Поддерживаются: JPG, PNG, GIF (до {maxFiles} файлов, максимум 5MB
            каждый)
          </p>
        </div>
      </div>

      {uploading && (
        <div className="text-center">
          <div className="inline-flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            <span className="text-sm text-gray-600">Загрузка...</span>
          </div>
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {uploadedFiles.map((url, index) => (
            <div key={index} className="relative group">
              <img
                src={url}
                alt={`Uploaded ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg"
              />
              <button
                onClick={() => removeFile(url)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
