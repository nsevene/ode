import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Store, 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  Star,
  Users,
  TrendingUp,
  CheckCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { vendorApi } from '@/lib/api-client';
import { vendorSchema } from '@/lib/validation';
import { z } from 'zod';

interface Vendor {
  id: string;
  name: string;
  description: string;
  cuisine_type: string;
  location: string;
  phone: string;
  email: string;
  website?: string;
  is_active: boolean;
  rating: number;
  created_at: string;
  updated_at: string;
}

interface VendorFormData {
  name: string;
  description: string;
  cuisine_type: string;
  location: string;
  phone: string;
  email: string;
  website: string;
  is_active: boolean;
}

const VendorManagement: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [formData, setFormData] = useState<VendorFormData>({
    name: '',
    description: '',
    cuisine_type: '',
    location: '',
    phone: '',
    email: '',
    website: '',
    is_active: true
  });
  const [formErrors, setFormErrors] = useState<z.ZodError | null>(null);

  const { user } = useAuth();
  const { toast } = useToast();

  const cuisineTypes = [
    'Asian', 'European', 'Mediterranean', 'American', 'Mexican', 
    'Indian', 'Thai', 'Japanese', 'Chinese', 'Italian', 'French', 'Other'
  ];

  useEffect(() => {
    loadVendors();
  }, []);

  const loadVendors = async () => {
    try {
      setLoading(true);
      const { data, error } = await vendorApi.getAll();
      if (error) throw error;
      setVendors(data || []);
    } catch (error) {
      console.error('Error loading vendors:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить список вендоров",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors(null);

    const result = vendorSchema.safeParse(formData);
    if (!result.success) {
      setFormErrors(result.error);
      return;
    }
    
    try {
      if (editingVendor) {
        // Update existing vendor
        const { error } = await vendorApi.update(editingVendor.id, result.data);

        if (error) throw error;

        toast({
          title: "Вендор обновлен",
          description: "Данные вендора успешно обновлены"
        });
      } else {
        // Create new vendor
        const { error } = await vendorApi.create(result.data);

        if (error) throw error;

        toast({
          title: "Вендор создан",
          description: "Новый вендор успешно добавлен"
        });
      }

      setIsDialogOpen(false);
      setEditingVendor(null);
      resetForm();
      loadVendors();
    } catch (error) {
      console.error('Error saving vendor:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить вендора",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (vendor: Vendor) => {
    setEditingVendor(vendor);
    setFormData({
      name: vendor.name,
      description: vendor.description,
      cuisine_type: vendor.cuisine_type,
      location: vendor.location,
      phone: vendor.phone,
      email: vendor.email,
      website: vendor.website || '',
      is_active: vendor.is_active
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (vendorId: string) => {
    if (!confirm('Вы уверены, что хотите удалить этого вендора?')) return;

    try {
      const { error } = await vendorApi.delete(vendorId);

      if (error) throw error;

      toast({
        title: "Вендор удален",
        description: "Вендор успешно удален из системы"
      });

      loadVendors();
    } catch (error) {
      console.error('Error deleting vendor:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить вендора",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      cuisine_type: '',
      location: '',
      phone: '',
      email: '',
      website: '',
      is_active: true
    });
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingVendor(null);
    resetForm();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Загрузка вендоров...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Управление вендорами</h2>
          <p className="text-muted-foreground">
            Управляйте вендорами и их информацией
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingVendor(null); resetForm(); }}>
              <Plus className="h-4 w-4 mr-2" />
              Добавить вендора
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingVendor ? 'Редактировать вендора' : 'Добавить вендора'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Название *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                  {formErrors?.formErrors.fieldErrors.name && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.formErrors.fieldErrors.name[0]}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="cuisine_type">Тип кухни *</Label>
                  <Select
                    value={formData.cuisine_type}
                    onValueChange={(value) => setFormData({ ...formData, cuisine_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите тип кухни" />
                    </SelectTrigger>
                    <SelectContent>
                      {cuisineTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors?.formErrors.fieldErrors.cuisine_type && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.formErrors.fieldErrors.cuisine_type[0]}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
                {formErrors?.formErrors.fieldErrors.description && (
                  <p className="text-xs text-red-500 mt-1">{formErrors.formErrors.fieldErrors.description[0]}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Местоположение *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                  />
                  {formErrors?.formErrors.fieldErrors.location && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.formErrors.fieldErrors.location[0]}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="phone">Телефон *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                  {formErrors?.formErrors.fieldErrors.phone && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.formErrors.fieldErrors.phone[0]}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                  {formErrors?.formErrors.fieldErrors.email && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.formErrors.fieldErrors.email[0]}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="website">Веб-сайт</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  />
                  {formErrors?.formErrors.fieldErrors.website && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.formErrors.fieldErrors.website[0]}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active">Активный вендор</Label>
              </div>
              {formErrors?.formErrors.fieldErrors.is_active && (
                <p className="text-xs text-red-500 mt-1">{formErrors.formErrors.fieldErrors.is_active[0]}</p>
              )}

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={handleDialogClose}>
                  Отмена
                </Button>
                <Button type="submit">
                  {editingVendor ? 'Обновить' : 'Создать'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Store className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm font-medium">Всего вендоров</p>
                <p className="text-2xl font-bold">{vendors.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm font-medium">Активных</p>
                <p className="text-2xl font-bold">
                  {vendors.filter(v => v.is_active).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <div>
                <p className="text-sm font-medium">Средний рейтинг</p>
                <p className="text-2xl font-bold">
                  {vendors.length > 0 
                    ? (vendors.reduce((sum, v) => sum + v.rating, 0) / vendors.length).toFixed(1)
                    : '0.0'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Типов кухни</p>
                <p className="text-2xl font-bold">
                  {new Set(vendors.map(v => v.cuisine_type)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vendors Table */}
      <Card>
        <CardHeader>
          <CardTitle>Список вендоров</CardTitle>
          <CardDescription>
            Управляйте всеми вендорами в системе
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Название</TableHead>
                <TableHead>Тип кухни</TableHead>
                <TableHead>Местоположение</TableHead>
                <TableHead>Контакты</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Рейтинг</TableHead>
                <TableHead>Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vendors.map((vendor) => (
                <TableRow key={vendor.id}>
                  <TableCell className="font-medium">{vendor.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{vendor.cuisine_type}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{vendor.location}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{vendor.phone}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{vendor.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={vendor.is_active ? "default" : "secondary"}>
                      {vendor.is_active ? "Активный" : "Неактивный"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>{vendor.rating.toFixed(1)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(vendor)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(vendor.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorManagement;