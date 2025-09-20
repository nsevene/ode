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
  ChefHat,
  Plus,
  Edit,
  Trash2,
  Eye,
  MapPin,
  Users,
  DollarSign,
  Clock,
  Settings,
  Upload,
  Image as ImageIcon,
} from 'lucide-react';

interface Kitchen {
  id: string;
  name: string;
  slug: string;
  description: string;
  long_description: string;
  image_url: string;
  gallery_urls: string[];
  location: string;
  capacity: number;
  equipment: string[];
  amenities: string[];
  cuisine_type: string;
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

const KitchenManagement = () => {
  const [kitchens, setKitchens] = useState<Kitchen[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingKitchen, setEditingKitchen] = useState<Kitchen | null>(null);
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
    cuisine_type: '',
    price_per_hour_usd: 0,
    is_available: true,
    is_featured: false,
    display_order: 0,
    contact_person: '',
    contact_phone: '',
    contact_email: '',
    equipment: [] as string[],
    amenities: [] as string[],
    special_requirements: [] as string[],
  });

  useEffect(() => {
    loadKitchens();
  }, []);

  const loadKitchens = async () => {
    try {
      const { data, error } = await supabase
        .from('kitchens')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setKitchens(data || []);
    } catch (error) {
      console.error('Error loading kitchens:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить кухни',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingKitchen) {
        // Update existing kitchen
        const { error } = await supabase
          .from('kitchens')
          .update(formData)
          .eq('id', editingKitchen.id);

        if (error) throw error;

        toast({
          title: 'Успешно',
          description: 'Кухня обновлена',
        });
      } else {
        // Create new kitchen
        const { error } = await supabase.from('kitchens').insert([formData]);

        if (error) throw error;

        toast({
          title: 'Успешно',
          description: 'Кухня создана',
        });
      }

      setIsCreateOpen(false);
      setEditingKitchen(null);
      resetForm();
      loadKitchens();
    } catch (error) {
      console.error('Error saving kitchen:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить кухню',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (kitchen: Kitchen) => {
    if (!confirm(`Удалить кухню "${kitchen.name}"?`)) return;

    try {
      const { error } = await supabase
        .from('kitchens')
        .delete()
        .eq('id', kitchen.id);

      if (error) throw error;

      toast({
        title: 'Успешно',
        description: 'Кухня удалена',
      });

      loadKitchens();
    } catch (error) {
      console.error('Error deleting kitchen:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить кухню',
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
      cuisine_type: '',
      price_per_hour_usd: 0,
      is_available: true,
      is_featured: false,
      display_order: 0,
      contact_person: '',
      contact_phone: '',
      contact_email: '',
      equipment: [],
      amenities: [],
      special_requirements: [],
    });
  };

  const openEdit = (kitchen: Kitchen) => {
    setEditingKitchen(kitchen);
    setFormData({
      name: kitchen.name,
      slug: kitchen.slug,
      description: kitchen.description,
      long_description: kitchen.long_description,
      image_url: kitchen.image_url,
      location: kitchen.location,
      capacity: kitchen.capacity,
      cuisine_type: kitchen.cuisine_type,
      price_per_hour_usd: kitchen.price_per_hour_usd,
      is_available: kitchen.is_available,
      is_featured: kitchen.is_featured,
      display_order: kitchen.display_order,
      contact_person: kitchen.contact_person,
      contact_phone: kitchen.contact_phone,
      contact_email: kitchen.contact_email,
      equipment: kitchen.equipment || [],
      amenities: kitchen.amenities || [],
      special_requirements: kitchen.special_requirements || [],
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
          <h2 className="text-2xl font-bold">Управление кухнями</h2>
          <p className="text-muted-foreground">
            Управляйте 12 кухонными корнерами ODE Food Hall
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                resetForm();
                setEditingKitchen(null);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Добавить кухню
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingKitchen ? 'Редактировать кухню' : 'Создать кухню'}
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
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cuisine_type">Тип кухни</Label>
                      <Input
                        id="cuisine_type"
                        value={formData.cuisine_type}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            cuisine_type: e.target.value,
                          })
                        }
                        placeholder="Asian, Italian, Fusion..."
                        required
                      />
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
                          Доступна для аренды
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
                        <Label htmlFor="is_featured">Рекомендуемая</Label>
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
                  {editingKitchen ? 'Обновить' : 'Создать'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kitchens.map((kitchen) => (
          <Card key={kitchen.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{kitchen.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {kitchen.cuisine_type}
                  </p>
                </div>
                <div className="flex space-x-1">
                  {kitchen.is_featured && (
                    <Badge variant="secondary">Рекомендуемая</Badge>
                  )}
                  <Badge
                    variant={kitchen.is_available ? 'default' : 'destructive'}
                  >
                    {kitchen.is_available ? 'Доступна' : 'Недоступна'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {kitchen.image_url && (
                  <img
                    src={kitchen.image_url}
                    alt={kitchen.name}
                    className="w-full h-32 object-cover rounded-md"
                  />
                )}

                <p className="text-sm text-muted-foreground line-clamp-2">
                  {kitchen.description}
                </p>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{kitchen.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{kitchen.capacity} чел.</span>
                  </div>
                </div>

                {kitchen.price_per_hour_usd > 0 && (
                  <div className="flex items-center gap-1 text-sm">
                    <DollarSign className="h-4 w-4" />
                    <span>/час</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEdit(kitchen)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(kitchen)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Порядок: {kitchen.display_order}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {kitchens.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <ChefHat className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Кухни не найдены</h3>
            <p className="text-muted-foreground mb-4">
              Создайте первую кухню для начала работы
            </p>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Добавить кухню
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default KitchenManagement;
