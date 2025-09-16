import React, { useState, useRef } from 'react';
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface FileUploadProps {
  applicationId?: string;
  maxFiles?: number;
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  onUploadComplete?: (urls: string[]) => void;
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  status: 'uploading' | 'uploaded' | 'error';
  progress: number;
  url?: string;
  error?: string;
}

const FileUpload = ({ 
  applicationId, 
  maxFiles = 5, 
  maxSize = 10 * 1024 * 1024, // 10MB
  allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  onUploadComplete 
}: FileUploadProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const newFiles: UploadedFile[] = [];
    const validFiles = Array.from(selectedFiles).slice(0, maxFiles - files.length);

    for (const file of validFiles) {
      // Validate file type
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Неподдерживаемый формат файла",
          description: `Файл ${file.name} имеет неподдерживаемый формат`,
          variant: "destructive"
        });
        continue;
      }

      // Validate file size
      if (file.size > maxSize) {
        toast({
          title: "Файл слишком большой",
          description: `Файл ${file.name} превышает максимальный размер ${Math.round(maxSize / 1024 / 1024)}MB`,
          variant: "destructive"
        });
        continue;
      }

      newFiles.push({
        id: Math.random().toString(36),
        name: file.name,
        size: file.size,
        status: 'uploading',
        progress: 0
      });
    }

    setFiles(prev => [...prev, ...newFiles]);

    // Upload files
    newFiles.forEach((fileInfo, index) => {
      uploadFile(selectedFiles[index], fileInfo.id);
    });
  };

  const uploadFile = async (file: File, fileId: string) => {
    try {
      const fileName = `${applicationId || 'temp'}_${Date.now()}_${file.name}`;
      const filePath = `vendor-applications/${fileName}`;

      console.log('Starting file upload:', { fileName, filePath, fileSize: file.size, fileType: file.type });

      // Simulate progress
      const progressInterval = setInterval(() => {
        setFiles(prev => prev.map(f => 
          f.id === fileId && f.progress < 90 
            ? { ...f, progress: f.progress + 10 }
            : f
        ));
      }, 200);

      const { data, error } = await supabase.storage
        .from('vendor-documents')
        .upload(filePath, file);

      clearInterval(progressInterval);

      console.log('Upload result:', { data, error });

      if (error) {
        console.error('Storage upload error:', error);
        throw error;
      }

      // Get public URL for private bucket
      const { data: urlData } = await supabase.storage
        .from('vendor-documents')
        .createSignedUrl(data.path, 3600); // 1 hour signed URL

      const fileUrl = urlData?.signedUrl || data.path;

      setFiles(prev => prev.map(f => 
        f.id === fileId 
          ? { ...f, status: 'uploaded', progress: 100, url: fileUrl }
          : f
      ));

      toast({
        title: "Файл загружен",
        description: `${file.name} успешно загружен`,
      });

      // Notify parent component about successful upload
      if (onUploadComplete) {
        const uploadedUrls = files
          .filter(f => f.status === 'uploaded')
          .map(f => f.url!)
          .concat([fileUrl]);
        onUploadComplete(uploadedUrls);
      }

    } catch (error) {
      console.error('Upload error:', error);
      setFiles(prev => prev.map(f => 
        f.id === fileId 
          ? { ...f, status: 'error', error: 'Ошибка загрузки' }
          : f
      ));

      toast({
        title: "Ошибка загрузки",
        description: `Не удалось загрузить ${file.name}`,
        variant: "destructive"
      });
    }
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploaded':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <File className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <Card>
        <CardContent className="pt-6">
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              isDragging 
                ? 'border-primary bg-primary/5' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground mb-2">
              Перетащите файлы сюда или нажмите для выбора
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              Максимум {maxFiles} файлов, до {Math.round(maxSize / 1024 / 1024)}MB каждый
            </p>
            <Button 
              variant="outline" 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={files.length >= maxFiles}
            >
              Выбрать файлы
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={allowedTypes.join(',')}
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>

      {/* Files List */}
      {files.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-3">
              {files.map((file) => (
                <div key={file.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  {getStatusIcon(file.status)}
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                    </p>
                    
                    {file.status === 'uploading' && (
                      <Progress value={file.progress} className="mt-2 h-1" />
                    )}
                    
                    {file.status === 'error' && (
                      <p className="text-xs text-red-600 mt-1">{file.error}</p>
                    )}
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(file.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="mt-4 text-xs text-muted-foreground">
              Загружено: {files.filter(f => f.status === 'uploaded').length} из {files.length}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Supported formats */}
      <div className="text-xs text-muted-foreground">
        <p>Поддерживаемые форматы: PDF, JPG, PNG, DOC, DOCX</p>
      </div>
    </div>
  );
};

export default FileUpload;