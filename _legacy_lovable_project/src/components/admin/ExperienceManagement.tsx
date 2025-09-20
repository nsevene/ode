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
  Star,
  Plus,
  Edit,
  Trash2,
  MapPin,
  Users,
  DollarSign,
  Clock,
  Calendar,
  Image as ImageIcon,
} from 'lucide-react';

interface Experience {
  id: string;
  name: string;
  slug: string;
  description: string;
  long_description: string;
  image_url: string;
  gallery_urls: string[];
  location: string;
  capacity: number;
  experience_type: string;
  duration_minutes: number;
  price_usd: number;
  is_available: boolean;
  is_featured: boolean;
  display_order: number;
  instructor_name: string;
  instructor_bio: string;
  instructor_photo: string;
  requirements: string[];
  what_to_expect: string[];
  what_to_bring: string[];
  created_at: string;
  updated_at: string;
}

const ExperienceManagement = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(
    null
  );
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    long_description: '',
    image_url: '',
    location: 'ODE Food Hall',
    capacity: 0,
    experience_type: '',
    duration_minutes: 0,
    price_usd: 0,
    is_available: true,
    is_featured: false,
    display_order: 0,
    instructor_name: '',
    instructor_bio: '',
    instructor_photo: '',
    requirements: [] as string[],
    what_to_expect: [] as string[],
    what_to_bring: [] as string[],
  });

  useEffect(() => {
    loadExperiences();
  }, []);

  const loadExperiences = async () => {
    try {
      const { data, error } = await supabase
        .from('experiences')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setExperiences(data || []);
    } catch (error) {
      console.error('Error loading experiences:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить опыт',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingExperience) {
        // Update existing experience
        const { error } = await supabase
          .from('experiences')
          .update(formData)
          .eq('id', editingExperience.id);

        if (error) throw error;

        toast({
          title: 'Успешно',
          description: 'Опыт обновлен',
        });
      } else {
        // Create new experience
        const { error } = await supabase.from('experiences').insert([formData]);

        if (error) throw error;

        toast({
          title: 'Успешно',
          description: 'Опыт создан',
        });
      }

      setIsCreateOpen(false);
      setEditingExperience(null);
      resetForm();
      loadExperiences();
    } catch (error) {
      console.error('Error saving experience:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить опыт',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (experience: Experience) => {
    if (!confirm(`Удалить опыт "${experience.name}"?`)) return;

    try {
      const { error } = await supabase
        .from('experiences')
        .delete()
        .eq('id', experience.id);

      if (error) throw error;

      toast({
        title: 'Успешно',
        description: 'Опыт удален',
      });

      loadExperiences();
    } catch (error) {
      console.error('Error deleting experience:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить опыт',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      long_description: '',
      image_url: '',
      location: 'ODE Food Hall',
      capacity: 0,
      experience_type: '',
      duration_minutes: 0,
      price_usd: 0,
      is_available: true,
      is_featured: false,
      display_order: 0,
      instructor_name: '',
      instructor_bio: '',
      instructor_photo: '',
      requirements: [],
      what_to_expect: [],
      what_to_bring: [],
    });
  };

  const openEdit = (experience: Experience) => {
    setEditingExperience(experience);
    setFormData({
      name: experience.name,
      slug: experience.slug,
      description: experience.description,
      long_description: experience.long_description,
      image_url: experience.image_url,
      location: experience.location,
      capacity: experience.capacity,
      experience_type: experience.experience_type,
      duration_minutes: experience.duration_minutes,
      price_usd: experience.price_usd,
      is_available: experience.is_available,
      is_featured: experience.is_featured,
      display_order: experience.display_order,
      instructor_name: experience.instructor_name,
      instructor_bio: experience.instructor_bio,
      instructor_photo: experience.instructor_photo,
      requirements: experience.requirements || [],
      what_to_expect: experience.what_to_expect || [],
      what_to_bring: experience.what_to_bring || [],
    });
    setIsCreateOpen(true);
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
          <h2 className="text-2xl font-bold">Управление опытом</h2>
          <p className="text-muted-foreground">
            Управляйте кулинарными мастер-классами и опытом
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                resetForm();
                setEditingExperience(null);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Добавить опыт
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingExperience ? 'Редактировать опыт' : 'Создать опыт'}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basic">Основное</TabsTrigger>
                  <TabsTrigger value="details">Детали</TabsTrigger>
                  <TabsTrigger value="instructor">Инструктор</TabsTrigger>
                  <TabsTrigger value="settings">Настройки</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Название</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
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

                  <div className="space-y-2">
                    <Label htmlFor="description">Краткое описание</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="long_description">Полное описание</Label>
                    <Textarea
                      id="long_description"
                      value={formData.long_description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          long_description: e.target.value,
                        })
                      }
                      rows={5}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image_url">URL изображения</Label>
                    <Input
                      id="image_url"
                      type="url"
                      value={formData.image_url}
                      onChange={(e) =>
                        setFormData({ ...formData, image_url: e.target.value })
                      }
                    />
                  </div>
                </TabsContent>

                <TabsContent value="details" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">Местоположение</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) =>
                          setFormData({ ...formData, location: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="experience_type">Тип опыта</Label>
                      <Select
                        value={formData.experience_type}
                        onValueChange={(value) =>
                          setFormData({ ...formData, experience_type: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Cooking Class">
                            Кулинарный мастер-класс
                          </SelectItem>
                          <SelectItem value="Wine Tasting">
                            Дегустация вин
                          </SelectItem>
                          <SelectItem value="Food Tour">
                            Гастрономический тур
                          </SelectItem>
                          <SelectItem value="Workshop">Семинар</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="capacity">Вместимость (человек)</Label>
                      <Input
                        id="capacity"
                        type="number"
                        value={formData.capacity}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            capacity: parseInt(e.target.value) || 0,
                          })
                        }
                        min="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="duration_minutes">
                        Длительность (минуты)
                      </Label>
                      <Input
                        id="duration_minutes"
                        type="number"
                        value={formData.duration_minutes}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            duration_minutes: parseInt(e.target.value) || 0,
                          })
                        }
                        min="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price_usd">Цена (центы USD)</Label>
                      <Input
                        id="price_usd"
                        type="number"
                        value={formData.price_usd}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            price_usd: parseInt(e.target.value) || 0,
                          })
                        }
                        min="0"
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="instructor" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="instructor_name">Имя инструктора</Label>
                      <Input
                        id="instructor_name"
                        value={formData.instructor_name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            instructor_name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="instructor_photo">
                        Фото инструктора (URL)
                      </Label>
                      <Input
                        id="instructor_photo"
                        type="url"
                        value={formData.instructor_photo}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            instructor_photo: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="instructor_bio">
                      Биография инструктора
                    </Label>
                    <Textarea
                      id="instructor_bio"
                      value={formData.instructor_bio}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          instructor_bio: e.target.value,
                        })
                      }
                      rows={4}
                    />
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
                          id="is_available"
                          checked={formData.is_available}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              is_available: e.target.checked,
                            })
                          }
                        />
                        <Label htmlFor="is_available">
                          Доступен для бронирования
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="is_featured"
                          checked={formData.is_featured}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              is_featured: e.target.checked,
                            })
                          }
                        />
                        <Label htmlFor="is_featured">Рекомендуемый</Label>
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
                  {editingExperience ? 'Обновить' : 'Создать'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {experiences.map((experience) => (
          <Card
            key={experience.id}
            className="hover:shadow-lg transition-shadow"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{experience.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {experience.experience_type}
                  </p>
                </div>
                <div className="flex space-x-1">
                  {experience.is_featured && (
                    <Badge variant="secondary">Рекомендуемый</Badge>
                  )}
                  <Badge
                    variant={
                      experience.is_available ? 'default' : 'destructive'
                    }
                  >
                    {experience.is_available ? 'Доступен' : 'Недоступен'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {experience.image_url && (
                  <img
                    src={experience.image_url}
                    alt={experience.name}
                    className="w-full h-32 object-cover rounded-md"
                  />
                )}

                <p className="text-sm text-muted-foreground line-clamp-2">
                  {experience.description}
                </p>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{experience.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{experience.capacity} чел.</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{experience.duration_minutes} мин.</span>
                  </div>
                  {experience.price_usd > 0 && (
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      <span>${(experience.price_usd / 100).toFixed(2)}</span>
                    </div>
                  )}
                </div>

                {experience.instructor_name && (
                  <div className="text-sm text-muted-foreground">
                    Инструктор: {experience.instructor_name}
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEdit(experience)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(experience)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Порядок: {experience.display_order}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {experiences.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Star className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Опыт не найден</h3>
            <p className="text-muted-foreground mb-4">
              Создайте первый опыт для начала работы
            </p>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Добавить опыт
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ExperienceManagement;
