import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  Eye,
  Image as ImageIcon,
  Link,
  Code,
  Type,
} from 'lucide-react';

interface ContentBlock {
  id: string;
  title: string;
  slug: string;
  content: string;
  content_type: string;
  page_section: string;
  display_order: number;
  is_active: boolean;
  metadata: any;
  created_at: string;
  updated_at: string;
}

const ContentManagement = () => {
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<ContentBlock | null>(
    null
  );
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    content_type: 'text',
    page_section: 'home',
    display_order: 0,
    is_active: true,
    metadata: {},
  });

  useEffect(() => {
    loadContentBlocks();
  }, []);

  const loadContentBlocks = async () => {
    try {
      const { data, error } = await supabase
        .from('content_blocks')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setContentBlocks(data || []);
    } catch (error) {
      console.error('Error loading content blocks:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить контент',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingContent) {
        // Update existing content block
        const { error } = await supabase
          .from('content_blocks')
          .update(formData)
          .eq('id', editingContent.id);

        if (error) throw error;

        toast({
          title: 'Успешно',
          description: 'Контент обновлен',
        });
      } else {
        // Create new content block
        const { error } = await supabase
          .from('content_blocks')
          .insert([formData]);

        if (error) throw error;

        toast({
          title: 'Успешно',
          description: 'Контент создан',
        });
      }

      setIsCreateOpen(false);
      setEditingContent(null);
      resetForm();
      loadContentBlocks();
    } catch (error) {
      console.error('Error saving content:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить контент',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (contentBlock: ContentBlock) => {
    if (!confirm(`Удалить контент "${contentBlock.title}"?`)) return;

    try {
      const { error } = await supabase
        .from('content_blocks')
        .delete()
        .eq('id', contentBlock.id);

      if (error) throw error;

      toast({
        title: 'Успешно',
        description: 'Контент удален',
      });

      loadContentBlocks();
    } catch (error) {
      console.error('Error deleting content:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить контент',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      content: '',
      content_type: 'text',
      page_section: 'home',
      display_order: 0,
      is_active: true,
      metadata: {},
    });
  };

  const openEdit = (contentBlock: ContentBlock) => {
    setEditingContent(contentBlock);
    setFormData({
      title: contentBlock.title,
      slug: contentBlock.slug,
      content: contentBlock.content,
      content_type: contentBlock.content_type,
      page_section: contentBlock.page_section,
      display_order: contentBlock.display_order,
      is_active: contentBlock.is_active,
      metadata: contentBlock.metadata || {},
    });
    setIsCreateOpen(true);
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'text':
        return <Type className="h-4 w-4" />;
      case 'image':
        return <ImageIcon className="h-4 w-4" />;
      case 'html':
        return <Code className="h-4 w-4" />;
      case 'link':
        return <Link className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Управление контентом</h2>
          <p className="text-muted-foreground">
            Управляйте контентными блоками сайта
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                resetForm();
                setEditingContent(null);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Добавить контент
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingContent ? 'Редактировать контент' : 'Создать контент'}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Основное</TabsTrigger>
                  <TabsTrigger value="content">Контент</TabsTrigger>
                  <TabsTrigger value="settings">Настройки</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Заголовок</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="slug">Slug (URL)</Label>
                      <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) =>
                          setFormData({ ...formData, slug: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="content_type">Тип контента</Label>
                      <Select
                        value={formData.content_type}
                        onValueChange={(value) =>
                          setFormData({ ...formData, content_type: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Текст</SelectItem>
                          <SelectItem value="html">HTML</SelectItem>
                          <SelectItem value="image">Изображение</SelectItem>
                          <SelectItem value="link">Ссылка</SelectItem>
                          <SelectItem value="video">Видео</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="page_section">Раздел страницы</Label>
                      <Select
                        value={formData.page_section}
                        onValueChange={(value) =>
                          setFormData({ ...formData, page_section: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="home">Главная</SelectItem>
                          <SelectItem value="about">О нас</SelectItem>
                          <SelectItem value="kitchens">Кухни</SelectItem>
                          <SelectItem value="spaces">Пространства</SelectItem>
                          <SelectItem value="experiences">Опыт</SelectItem>
                          <SelectItem value="events">События</SelectItem>
                          <SelectItem value="footer">Подвал</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="content" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="content">Содержимое</Label>
                    {formData.content_type === 'text' && (
                      <Textarea
                        id="content"
                        value={formData.content}
                        onChange={(e) =>
                          setFormData({ ...formData, content: e.target.value })
                        }
                        rows={10}
                        placeholder="Введите текст..."
                      />
                    )}
                    {formData.content_type === 'html' && (
                      <Textarea
                        id="content"
                        value={formData.content}
                        onChange={(e) =>
                          setFormData({ ...formData, content: e.target.value })
                        }
                        rows={10}
                        placeholder="<div>HTML код...</div>"
                      />
                    )}
                    {formData.content_type === 'image' && (
                      <div className="space-y-2">
                        <Input
                          id="content"
                          value={formData.content}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              content: e.target.value,
                            })
                          }
                          placeholder="URL изображения"
                        />
                        {formData.content && (
                          <img
                            src={formData.content}
                            alt="Preview"
                            className="w-full h-48 object-cover rounded-md"
                          />
                        )}
                      </div>
                    )}
                    {formData.content_type === 'link' && (
                      <div className="space-y-2">
                        <Input
                          id="content"
                          value={formData.content}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              content: e.target.value,
                            })
                          }
                          placeholder="https://example.com"
                        />
                        <Input
                          placeholder="Текст ссылки"
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              metadata: {
                                ...formData.metadata,
                                linkText: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                    )}
                    {formData.content_type === 'video' && (
                      <div className="space-y-2">
                        <Input
                          id="content"
                          value={formData.content}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              content: e.target.value,
                            })
                          }
                          placeholder="URL видео (YouTube, Vimeo, etc.)"
                        />
                        <Input
                          placeholder="Заголовок видео"
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              metadata: {
                                ...formData.metadata,
                                videoTitle: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="settings" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="display_order">Порядок отображения</Label>
                      <Input
                        id="display_order"
                        type="number"
                        value={formData.display_order}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            display_order: parseInt(e.target.value) || 0,
                          })
                        }
                        min="0"
                      />
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="is_active"
                          checked={formData.is_active}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              is_active: e.target.checked,
                            })
                          }
                        />
                        <Label htmlFor="is_active">Активен</Label>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateOpen(false)}
                >
                  Отмена
                </Button>
                <Button type="submit">
                  {editingContent ? 'Обновить' : 'Создать'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contentBlocks.map((contentBlock) => (
          <Card
            key={contentBlock.id}
            className="hover:shadow-lg transition-shadow"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">
                    {contentBlock.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {contentBlock.page_section}
                  </p>
                </div>
                <div className="flex space-x-1">
                  <Badge
                    variant={contentBlock.is_active ? 'default' : 'destructive'}
                  >
                    {contentBlock.is_active ? 'Активен' : 'Неактивен'}
                  </Badge>
                  <Badge variant="outline">{contentBlock.content_type}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {getContentTypeIcon(contentBlock.content_type)}
                  <span>{contentBlock.content_type}</span>
                </div>

                <div className="text-sm text-muted-foreground line-clamp-3">
                  {contentBlock.content_type === 'image' ? (
                    <div className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" />
                      <span>Изображение</span>
                    </div>
                  ) : contentBlock.content_type === 'link' ? (
                    <div className="flex items-center gap-2">
                      <Link className="h-4 w-4" />
                      <span>{contentBlock.content}</span>
                    </div>
                  ) : (
                    contentBlock.content.substring(0, 100) +
                    (contentBlock.content.length > 100 ? '...' : '')
                  )}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEdit(contentBlock)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(contentBlock)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Порядок: {contentBlock.display_order}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {contentBlocks.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Контент не найден</h3>
            <p className="text-muted-foreground mb-4">
              Создайте первый контентный блок для начала работы
            </p>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Добавить контент
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ContentManagement;
