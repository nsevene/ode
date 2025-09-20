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
  Building2,
  Plus,
  Edit,
  Trash2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Palette,
  Settings,
  User,
} from 'lucide-react';

interface Tenant {
  id: string;
  name: string;
  slug: string;
  description: string;
  long_description: string;
  logo_url: string;
  website_url: string;
  contact_person: string;
  contact_phone: string;
  contact_email: string;
  business_type: string;
  cuisine_type: string;
  opening_hours: any;
  is_active: boolean;
  is_featured: boolean;
  display_order: number;
  brand_primary_color: string;
  brand_secondary_color: string;
  brand_font_family: string;
  social_media: any;
  created_at: string;
  updated_at: string;
}

const TenantManagement = () => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    long_description: '',
    logo_url: '',
    website_url: '',
    contact_person: '',
    contact_phone: '',
    contact_email: '',
    business_type: '',
    cuisine_type: '',
    is_active: true,
    is_featured: false,
    display_order: 0,
    brand_primary_color: '#000000',
    brand_secondary_color: '#ffffff',
    brand_font_family: 'Inter',
    social_media: {},
  });

  useEffect(() => {
    loadTenants();
  }, []);

  const loadTenants = async () => {
    try {
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setTenants(data || []);
    } catch (error) {
      console.error('Error loading tenants:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить арендаторов',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingTenant) {
        // Update existing tenant
        const { error } = await supabase
          .from('tenants')
          .update(formData)
          .eq('id', editingTenant.id);

        if (error) throw error;

        toast({
          title: 'Успешно',
          description: 'Арендатор обновлен',
        });
      } else {
        // Create new tenant
        const { error } = await supabase.from('tenants').insert([formData]);

        if (error) throw error;

        toast({
          title: 'Успешно',
          description: 'Арендатор создан',
        });
      }

      setIsCreateOpen(false);
      setEditingTenant(null);
      resetForm();
      loadTenants();
    } catch (error) {
      console.error('Error saving tenant:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить арендатора',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (tenant: Tenant) => {
    if (!confirm(`Удалить арендатора "${tenant.name}"?`)) return;

    try {
      const { error } = await supabase
        .from('tenants')
        .delete()
        .eq('id', tenant.id);

      if (error) throw error;

      toast({
        title: 'Успешно',
        description: 'Арендатор удален',
      });

      loadTenants();
    } catch (error) {
      console.error('Error deleting tenant:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить арендатора',
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
      logo_url: '',
      website_url: '',
      contact_person: '',
      contact_phone: '',
      contact_email: '',
      business_type: '',
      cuisine_type: '',
      is_active: true,
      is_featured: false,
      display_order: 0,
      brand_primary_color: '#000000',
      brand_secondary_color: '#ffffff',
      brand_font_family: 'Inter',
      social_media: {},
    });
  };

  const openEdit = (tenant: Tenant) => {
    setEditingTenant(tenant);
    setFormData({
      name: tenant.name,
      slug: tenant.slug,
      description: tenant.description,
      long_description: tenant.long_description,
      logo_url: tenant.logo_url,
      website_url: tenant.website_url,
      contact_person: tenant.contact_person,
      contact_phone: tenant.contact_phone,
      contact_email: tenant.contact_email,
      business_type: tenant.business_type,
      cuisine_type: tenant.cuisine_type,
      is_active: tenant.is_active,
      is_featured: tenant.is_featured,
      display_order: tenant.display_order,
      brand_primary_color: tenant.brand_primary_color,
      brand_secondary_color: tenant.brand_secondary_color,
      brand_font_family: tenant.brand_font_family,
      social_media: tenant.social_media || {},
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
          <h2 className="text-2xl font-bold">Управление арендаторами</h2>
          <p className="text-muted-foreground">
            Управляйте арендаторами ODE Food Hall
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                resetForm();
                setEditingTenant(null);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Добавить арендатора
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingTenant
                  ? 'Редактировать арендатора'
                  : 'Создать арендатора'}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basic">Основное</TabsTrigger>
                  <TabsTrigger value="contact">Контакты</TabsTrigger>
                  <TabsTrigger value="branding">Брендинг</TabsTrigger>
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

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="logo_url">URL логотипа</Label>
                      <Input
                        id="logo_url"
                        type="url"
                        value={formData.logo_url}
                        onChange={(e) =>
                          setFormData({ ...formData, logo_url: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website_url">Веб-сайт</Label>
                      <Input
                        id="website_url"
                        type="url"
                        value={formData.website_url}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            website_url: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="contact" className="space-y-4">
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

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="business_type">Тип бизнеса</Label>
                      <Select
                        value={formData.business_type}
                        onValueChange={(value) =>
                          setFormData({ ...formData, business_type: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Restaurant">Ресторан</SelectItem>
                          <SelectItem value="Food Truck">Фудтрак</SelectItem>
                          <SelectItem value="Cafe">Кафе</SelectItem>
                          <SelectItem value="Bar">Бар</SelectItem>
                          <SelectItem value="Bakery">Пекарня</SelectItem>
                          <SelectItem value="Other">Другое</SelectItem>
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
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="branding" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="brand_primary_color">Основной цвет</Label>
                      <div className="flex gap-2">
                        <Input
                          id="brand_primary_color"
                          type="color"
                          value={formData.brand_primary_color}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              brand_primary_color: e.target.value,
                            })
                          }
                          className="w-16 h-10"
                        />
                        <Input
                          value={formData.brand_primary_color}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              brand_primary_color: e.target.value,
                            })
                          }
                          placeholder="#000000"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="brand_secondary_color">
                        Дополнительный цвет
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id="brand_secondary_color"
                          type="color"
                          value={formData.brand_secondary_color}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              brand_secondary_color: e.target.value,
                            })
                          }
                          className="w-16 h-10"
                        />
                        <Input
                          value={formData.brand_secondary_color}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              brand_secondary_color: e.target.value,
                            })
                          }
                          placeholder="#ffffff"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="brand_font_family">Шрифт</Label>
                    <Select
                      value={formData.brand_font_family}
                      onValueChange={(value) =>
                        setFormData({ ...formData, brand_font_family: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Inter">Inter</SelectItem>
                        <SelectItem value="Roboto">Roboto</SelectItem>
                        <SelectItem value="Open Sans">Open Sans</SelectItem>
                        <SelectItem value="Montserrat">Montserrat</SelectItem>
                        <SelectItem value="Poppins">Poppins</SelectItem>
                      </SelectContent>
                    </Select>
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
                  {editingTenant ? 'Обновить' : 'Создать'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tenants.map((tenant) => (
          <Card key={tenant.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{tenant.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {tenant.business_type}
                  </p>
                </div>
                <div className="flex space-x-1">
                  {tenant.is_featured && (
                    <Badge variant="secondary">Рекомендуемый</Badge>
                  )}
                  <Badge variant={tenant.is_active ? 'default' : 'destructive'}>
                    {tenant.is_active ? 'Активен' : 'Неактивен'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tenant.logo_url && (
                  <img
                    src={tenant.logo_url}
                    alt={tenant.name}
                    className="w-full h-20 object-contain rounded-md"
                  />
                )}

                <p className="text-sm text-muted-foreground line-clamp-2">
                  {tenant.description}
                </p>

                <div className="space-y-2 text-sm">
                  {tenant.contact_person && (
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{tenant.contact_person}</span>
                    </div>
                  )}
                  {tenant.contact_phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      <span>{tenant.contact_phone}</span>
                    </div>
                  )}
                  {tenant.contact_email && (
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      <span>{tenant.contact_email}</span>
                    </div>
                  )}
                  {tenant.website_url && (
                    <div className="flex items-center gap-1">
                      <Globe className="h-4 w-4" />
                      <a
                        href={tenant.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Веб-сайт
                      </a>
                    </div>
                  )}
                </div>

                {tenant.cuisine_type && (
                  <div className="text-sm">
                    <span className="font-medium">Кухня:</span>{' '}
                    {tenant.cuisine_type}
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEdit(tenant)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(tenant)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Порядок: {tenant.display_order}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {tenants.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Building2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Арендаторы не найдены
            </h3>
            <p className="text-muted-foreground mb-4">
              Создайте первого арендатора для начала работы
            </p>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Добавить арендатора
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TenantManagement;
