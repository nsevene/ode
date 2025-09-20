import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  FileText,
  Upload,
  Download,
  Trash2,
  Edit,
  Eye,
  Search,
  Filter,
  FileCheck,
  Calendar,
  User,
  Tag,
  FolderOpen,
  Plus,
} from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface Document {
  id: string;
  file_path: string;
  bucket_name: string;
  original_name: string;
  file_size: number;
  mime_type: string;
  uploaded_by: string;
  document_type: string;
  description?: string;
  tags: string[];
  version: number;
  is_signed: boolean;
  signed_at?: string;
  signed_by?: string;
  created_at: string;
  updated_at: string;
}

const DOCUMENT_TYPES = [
  { value: 'contract', label: 'Договор', color: 'bg-blue-100 text-blue-800' },
  {
    value: 'invoice',
    label: 'Счет-фактура',
    color: 'bg-green-100 text-green-800',
  },
  { value: 'report', label: 'Отчет', color: 'bg-purple-100 text-purple-800' },
  { value: 'legal', label: 'Юридический', color: 'bg-red-100 text-red-800' },
  {
    value: 'financial',
    label: 'Финансовый',
    color: 'bg-yellow-100 text-yellow-800',
  },
  {
    value: 'administrative',
    label: 'Административный',
    color: 'bg-gray-100 text-gray-800',
  },
  { value: 'other', label: 'Прочее', color: 'bg-slate-100 text-slate-800' },
];

const STORAGE_BUCKETS = [
  { id: 'contracts', name: 'Договоры', icon: FileCheck },
  { id: 'admin-documents', name: 'Админ. документы', icon: FolderOpen },
  { id: 'vendor-documents', name: 'Документы поставщиков', icon: FileText },
];

const DocumentsManagement = () => {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBucket, setSelectedBucket] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [uploading, setUploading] = useState(false);
  const [editingDoc, setEditingDoc] = useState<Document | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const [uploadForm, setUploadForm] = useState({
    bucket: 'contracts',
    document_type: 'contract',
    description: '',
    tags: '',
    file: null as File | null,
  });

  // Загрузка документов
  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('document_metadata')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить документы',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // Фильтрация документов
  const filteredDocuments = documents.filter((doc) => {
    const matchesBucket =
      selectedBucket === 'all' || doc.bucket_name === selectedBucket;
    const matchesType =
      selectedType === 'all' || doc.document_type === selectedType;
    const matchesSearch =
      doc.original_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    return matchesBucket && matchesType && matchesSearch;
  });

  // Загрузка файла
  const handleFileUpload = async () => {
    if (!uploadForm.file) {
      toast({
        title: 'Ошибка',
        description: 'Выберите файл для загрузки',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    try {
      const fileName = `${Date.now()}-${uploadForm.file.name}`;
      const filePath = `${uploadForm.bucket}/${fileName}`;

      // Загружаем файл в Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(uploadForm.bucket)
        .upload(filePath, uploadForm.file);

      if (uploadError) throw uploadError;

      // Сохраняем метаданные
      const { error: metadataError } = await supabase
        .from('document_metadata')
        .insert({
          file_path: uploadData.path,
          bucket_name: uploadForm.bucket,
          original_name: uploadForm.file.name,
          file_size: uploadForm.file.size,
          mime_type: uploadForm.file.type,
          document_type: uploadForm.document_type,
          description: uploadForm.description || null,
          tags: uploadForm.tags
            ? uploadForm.tags.split(',').map((t) => t.trim())
            : [],
        });

      if (metadataError) throw metadataError;

      toast({
        title: 'Успешно',
        description: 'Документ загружен',
      });

      setShowUploadModal(false);
      setUploadForm({
        bucket: 'contracts',
        document_type: 'contract',
        description: '',
        tags: '',
        file: null,
      });
      fetchDocuments();
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить документ',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  // Скачивание файла
  const handleDownload = async (doc: Document) => {
    try {
      const { data, error } = await supabase.storage
        .from(doc.bucket_name)
        .download(doc.file_path);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.original_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading document:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось скачать документ',
        variant: 'destructive',
      });
    }
  };

  // Удаление документа
  const handleDelete = async (doc: Document) => {
    if (!confirm('Вы уверены, что хотите удалить этот документ?')) return;

    try {
      // Удаляем файл из Storage
      const { error: storageError } = await supabase.storage
        .from(doc.bucket_name)
        .remove([doc.file_path]);

      if (storageError) throw storageError;

      // Удаляем метаданные
      const { error: metadataError } = await supabase
        .from('document_metadata')
        .delete()
        .eq('id', doc.id);

      if (metadataError) throw metadataError;

      toast({
        title: 'Успешно',
        description: 'Документ удален',
      });

      fetchDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить документ',
        variant: 'destructive',
      });
    }
  };

  // Обновление метаданных
  const handleUpdateMetadata = async (
    doc: Document,
    updates: Partial<Document>
  ) => {
    try {
      const { error } = await supabase
        .from('document_metadata')
        .update(updates)
        .eq('id', doc.id);

      if (error) throw error;

      toast({
        title: 'Успешно',
        description: 'Метаданные обновлены',
      });

      fetchDocuments();
      setEditingDoc(null);
    } catch (error) {
      console.error('Error updating metadata:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить метаданные',
        variant: 'destructive',
      });
    }
  };

  // Получение типа документа
  const getDocumentType = (type: string) => {
    return (
      DOCUMENT_TYPES.find((t) => t.value === type) ||
      DOCUMENT_TYPES[DOCUMENT_TYPES.length - 1]
    );
  };

  // Форматирование размера файла
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Загрузка документов...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Заголовок и кнопка загрузки */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Управление документами</h2>
          <p className="text-muted-foreground">
            Загрузка, просмотр и управление документами и договорами
          </p>
        </div>

        <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Загрузить документ
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Загрузка документа</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="bucket">Storage Bucket</Label>
                <Select
                  value={uploadForm.bucket}
                  onValueChange={(value) =>
                    setUploadForm({ ...uploadForm, bucket: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STORAGE_BUCKETS.map((bucket) => (
                      <SelectItem key={bucket.id} value={bucket.id}>
                        {bucket.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="type">Тип документа</Label>
                <Select
                  value={uploadForm.document_type}
                  onValueChange={(value) =>
                    setUploadForm({ ...uploadForm, document_type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DOCUMENT_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  placeholder="Краткое описание документа"
                  value={uploadForm.description}
                  onChange={(e) =>
                    setUploadForm({
                      ...uploadForm,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <Label htmlFor="tags">Теги (через запятую)</Label>
                <Input
                  placeholder="налоги, 2024, важное"
                  value={uploadForm.tags}
                  onChange={(e) =>
                    setUploadForm({ ...uploadForm, tags: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="file">Файл</Label>
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt,.xls,.xlsx"
                  onChange={(e) =>
                    setUploadForm({
                      ...uploadForm,
                      file: e.target.files?.[0] || null,
                    })
                  }
                />
              </div>

              <Button
                onClick={handleFileUpload}
                disabled={uploading || !uploadForm.file}
                className="w-full"
              >
                {uploading ? 'Загружается...' : 'Загрузить'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Фильтры */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Поиск по названию, описанию или тегам..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={selectedBucket} onValueChange={setSelectedBucket}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Все buckets" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все buckets</SelectItem>
                {STORAGE_BUCKETS.map((bucket) => (
                  <SelectItem key={bucket.id} value={bucket.id}>
                    {bucket.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Все типы" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все типы</SelectItem>
                {DOCUMENT_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">
                  Всего документов
                </p>
                <p className="text-xl font-bold">{documents.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Подписанные</p>
                <p className="text-xl font-bold">
                  {documents.filter((d) => d.is_signed).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Договоры</p>
                <p className="text-xl font-bold">
                  {
                    documents.filter((d) => d.document_type === 'contract')
                      .length
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">За этот месяц</p>
                <p className="text-xl font-bold">
                  {
                    documents.filter(
                      (d) =>
                        new Date(d.created_at).getMonth() ===
                        new Date().getMonth()
                    ).length
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Список документов */}
      <Card>
        <CardHeader>
          <CardTitle>Документы ({filteredDocuments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredDocuments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Документы не найдены
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDocuments.map((doc) => {
                const docType = getDocumentType(doc.document_type);

                return (
                  <div
                    key={doc.id}
                    className="border rounded-lg p-4 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <h3 className="font-medium">{doc.original_name}</h3>
                          <Badge className={docType.color}>
                            {docType.label}
                          </Badge>
                          {doc.is_signed && (
                            <Badge
                              variant="outline"
                              className="text-green-600 border-green-200"
                            >
                              <FileCheck className="h-3 w-3 mr-1" />
                              Подписан
                            </Badge>
                          )}
                        </div>

                        {doc.description && (
                          <p className="text-sm text-muted-foreground mb-2">
                            {doc.description}
                          </p>
                        )}

                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />v{doc.version}
                          </span>
                          <span>{formatFileSize(doc.file_size)}</span>
                          <span>
                            {format(
                              new Date(doc.created_at),
                              'dd.MM.yyyy HH:mm',
                              { locale: ru }
                            )}
                          </span>
                          <span className="flex items-center gap-1">
                            <FolderOpen className="h-3 w-3" />
                            {STORAGE_BUCKETS.find(
                              (b) => b.id === doc.bucket_name
                            )?.name || doc.bucket_name}
                          </span>
                        </div>

                        {doc.tags.length > 0 && (
                          <div className="flex items-center gap-2 mt-2">
                            <Tag className="h-3 w-3 text-muted-foreground" />
                            <div className="flex gap-1">
                              {doc.tags.map((tag, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(doc)}
                          className="gap-2"
                        >
                          <Download className="h-4 w-4" />
                          Скачать
                        </Button>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>
                                Редактировать метаданные
                              </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label>Тип документа</Label>
                                <Select
                                  defaultValue={doc.document_type}
                                  onValueChange={(value) =>
                                    setEditingDoc({
                                      ...doc,
                                      document_type: value,
                                    })
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {DOCUMENT_TYPES.map((type) => (
                                      <SelectItem
                                        key={type.value}
                                        value={type.value}
                                      >
                                        {type.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              <div>
                                <Label>Описание</Label>
                                <Textarea
                                  defaultValue={doc.description || ''}
                                  onChange={(e) =>
                                    setEditingDoc({
                                      ...doc,
                                      description: e.target.value,
                                    })
                                  }
                                />
                              </div>

                              <div>
                                <Label>Теги</Label>
                                <Input
                                  defaultValue={doc.tags.join(', ')}
                                  onChange={(e) =>
                                    setEditingDoc({
                                      ...doc,
                                      tags: e.target.value
                                        .split(',')
                                        .map((t) => t.trim()),
                                    })
                                  }
                                />
                              </div>

                              <Button
                                onClick={() =>
                                  editingDoc &&
                                  handleUpdateMetadata(doc, editingDoc)
                                }
                                className="w-full"
                              >
                                Сохранить изменения
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(doc)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentsManagement;
