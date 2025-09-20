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
  Building,
  Plus,
  Edit,
  Trash2,
  MapPin,
  Users,
  DollarSign,
  Clock,
  Settings,
  Upload,
  Image as ImageIcon,
} from 'lucide-react';

interface Space {
  id: string;
  name: string;
  slug: string;
  description: string;
  long_description: string;
  image_url: string;
  gallery_urls: string[];
  location: string;
  capacity: number;
  space_type: string;
  amenities: string[];
  price_per_hour_usd: number;
  is_available: boolean;
  is_featured: boolean;
  display_order: number;
  contact_person: string;
  contact_phone: string;
  contact_email: string;
  opening_hours: any;
  special_requirements: string[];
  created_at: string;
  updated_at: string;
}

const SpaceManagement = () => {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingSpace, setEditingSpace] = useState<Space | null>(null);
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    long_description: '',
    image_url: '',
    location: 'Ground Floor',
    capacity: 0,
    space_type: '',
    price_per_hour_usd: 0,
    is_available: true,
    is_featured: false,
    display_order: 0,
    contact_person: '',
    contact_phone: '',
    contact_email: '',
    amenities: [] as string[],
    special_requirements: [] as string[],
  });

  useEffect(() => {
    loadSpaces();
  }, []);

  const loadSpaces = async () => {
    try {
      const { data, error } = await supabase
        .from('spaces')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setSpaces(data || []);
    } catch (error) {
      console.error('Error loading spaces:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить пространства',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingSpace) {
        // Update existing space
        const { error } = await supabase
          .from('spaces')
          .update(formData)
          .eq('id', editingSpace.id);

        if (error) throw error;

        toast({
          title: 'Успешно',
          description: 'Пространство обновлено',
        });
      } else {
        // Create new space
        const { error } = await supabase.from('spaces').insert([formData]);

        if (error) throw error;

        toast({
          title: 'Успешно',
          description: 'Пространство создано',
        });
      }

      setIsCreateOpen(false);
      setEditingSpace(null);
      resetForm();
      loadSpaces();
    } catch (error) {
      console.error('Error saving space:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить пространство',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (space: Space) => {
    if (!confirm(`Удалить пространство "${space.name}"?`)) return;

    try {
      const { error } = await supabase
        .from('spaces')
        .delete()
        .eq('id', space.id);

      if (error) throw error;

      toast({
        title: 'Успешно',
        description: 'Пространство удалено',
      });

      loadSpaces();
    } catch (error) {
      console.error('Error deleting space:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить пространство',
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
      location: 'Ground Floor',
      capacity: 0,
      space_type: '',
      price_per_hour_usd: 0,
      is_available: true,
      is_featured: false,
      display_order: 0,
      contact_person: '',
      contact_phone: '',
      contact_email: '',
      amenities: [],
      special_requirements: [],
    });
  };

  const openEdit = (space: Space) => {
    setEditingSpace(space);
    setFormData({
      name: space.name,
      slug: space.slug,
      description: space.description,
      long_description: space.long_description,
      image_url: space.image_url,
      location: space.location,
      capacity: space.capacity,
      space_type: space.space_type,
      price_per_hour_usd: space.price_per_hour_usd,
      is_available: space.is_available,
      is_featured: space.is_featured,
      display_order: space.display_order,
      contact_person: space.contact_person,
      contact_phone: space.contact_phone,
      contact_email: space.contact_email,
      amenities: space.amenities || [],
      special_requirements: space.special_requirements || [],
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
          <h2 className="text-2xl font-bold">Управление пространствами</h2>
          <p className="text-muted-foreground">
            Управляйте пространствами ODE Food Hall
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                resetForm();
                setEditingSpace(null);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Добавить пространство
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingSpace
                  ? 'Редактировать пространство'
                  : 'Создать пространство'}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basic">Основное</TabsTrigger>
                  <TabsTrigger value="details">Детали</TabsTrigger>
                  <TabsTrigger value="contact">Контакты</TabsTrigger>
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
                      <Label htmlFor="location">Расположение</Label>
                      <Select
                        value={formData.location}
                        onValueChange={(value) =>
                          setFormData({ ...formData, location: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Ground Floor">
                            Первый этаж
                          </SelectItem>
                          <SelectItem value="Second Floor">
                            Второй этаж
                          </SelectItem>
                          <SelectItem value="Rooftop">Крыша</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="space_type">Тип пространства</Label>
                      <Select
                        value={formData.space_type}
                        onValueChange={(value) =>
                          setFormData({ ...formData, space_type: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Event Space">
                            Пространство для мероприятий
                          </SelectItem>
                          <SelectItem value="Meeting Room">
                            Переговорная
                          </SelectItem>
                          <SelectItem value="Private Dining">
                            Приватная столовая
                          </SelectItem>
                          <SelectItem value="Workshop Space">
                            Пространство для мастер-классов
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
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
                      <Label htmlFor="price_per_hour_usd">
                        Цена за час (центы USD)
                      </Label>
                      <Input
                        id="price_per_hour_usd"
                        type="number"
                        value={formData.price_per_hour_usd}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            price_per_hour_usd: parseInt(e.target.value) || 0,
                          })
                        }
                        min="0"
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="contact" className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contact_person">Контактное лицо</Label>
                      <Input
                        id="contact_person"
                        value={formData.contact_person}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            contact_person: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="contact_phone">Телефон</Label>
                        <Input
                          id="contact_phone"
                          type="tel"
                          value={formData.contact_phone}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              contact_phone: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contact_email">Email</Label>
                        <Input
                          id="contact_email"
                          type="email"
                          value={formData.contact_email}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              contact_email: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
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
                          Доступно для аренды
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
                        <Label htmlFor="is_featured">Рекомендуемое</Label>
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
                  {editingSpace ? 'Обновить' : 'Создать'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {spaces.map((space) => (
          <Card key={space.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{space.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {space.space_type}
                  </p>
                </div>
                <div className="flex space-x-1">
                  {space.is_featured && (
                    <Badge variant="secondary">Рекомендуемое</Badge>
                  )}
                  <Badge
                    variant={space.is_available ? 'default' : 'destructive'}
                  >
                    {space.is_available ? 'Доступно' : 'Недоступно'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {space.image_url && (
                  <img
                    src={space.image_url}
                    alt={space.name}
                    className="w-full h-32 object-cover rounded-md"
                  />
                )}

                <p className="text-sm text-muted-foreground line-clamp-2">
                  {space.description}
                </p>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{space.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{space.capacity} чел.</span>
                  </div>
                </div>

                {space.price_per_hour_usd > 0 && (
                  <div className="flex items-center gap-1 text-sm">
                    <DollarSign className="h-4 w-4" />
                    <span>
                      ${(space.price_per_hour_usd / 100).toFixed(2)}/час
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEdit(space)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(space)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Порядок: {space.display_order}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {spaces.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Building className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Пространства не найдены
            </h3>
            <p className="text-muted-foreground mb-4">
              Создайте первое пространство для начала работы
            </p>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Добавить пространство
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SpaceManagement;
