import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  Plus,
  Edit,
  Trash2,
  Store,
  Utensils,
  DollarSign,
  Clock,
  Star,
  Filter,
  Search,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { menuApi, vendorApi } from '@/lib/api-client';
import { menuItemSchema } from '@/lib/validation';
import { z } from 'zod';

interface Vendor {
  id: string;
  name: string;
  cuisine_type: string;
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  vendor_id: string;
  vendor_name?: string;
  is_available: boolean;
  preparation_time: number;
  spice_level: 'mild' | 'medium' | 'hot' | 'extra-hot';
  is_vegetarian: boolean;
  is_vegan: boolean;
  is_gluten_free: boolean;
  allergens: string[];
  created_at: string;
  updated_at: string;
}

interface MenuFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  vendor_id: string;
  is_available: boolean;
  preparation_time: number;
  spice_level: 'mild' | 'medium' | 'hot' | 'extra-hot';
  is_vegetarian: boolean;
  is_vegan: boolean;
  is_gluten_free: boolean;
  allergens: string[];
}

const MenuManagement: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [selectedVendor, setSelectedVendor] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<MenuFormData>({
    name: '',
    description: '',
    price: 0,
    category: '',
    vendor_id: '',
    is_available: true,
    preparation_time: 15,
    spice_level: 'mild',
    is_vegetarian: false,
    is_vegan: false,
    is_gluten_free: false,
    allergens: [],
  });
  const [formErrors, setFormErrors] = useState<z.ZodError | null>(null);

  const { toast } = useToast();

  const categories = [
    'Appetizers',
    'Main Course',
    'Desserts',
    'Beverages',
    'Salads',
    'Soups',
    'Pasta',
    'Pizza',
    'Sandwiches',
    'Other',
  ];

  const spiceLevels = [
    { value: 'mild', label: 'Мягкий' },
    { value: 'medium', label: 'Средний' },
    { value: 'hot', label: 'Острый' },
    { value: 'extra-hot', label: 'Очень острый' },
  ];

  const commonAllergens = [
    'Nuts',
    'Dairy',
    'Gluten',
    'Soy',
    'Eggs',
    'Fish',
    'Shellfish',
    'Sesame',
  ];

  useEffect(() => {
    loadVendors();
    loadMenuItems();
  }, []);

  useEffect(() => {
    if (selectedVendor) {
      loadMenuItems(selectedVendor);
    } else {
      loadMenuItems();
    }
  }, [selectedVendor]);

  const loadVendors = async () => {
    try {
      const { data, error } = await vendorApi.getAll();
      if (error) throw error;
      setVendors(
        data
          ?.filter((v) => v.is_active)
          .sort((a, b) => a.name.localeCompare(b.name)) || []
      );
    } catch (error) {
      console.error('Error loading vendors:', error);
    }
  };

  const loadMenuItems = async (vendorId?: string) => {
    try {
      setLoading(true);
      const { data, error } = vendorId
        ? await menuApi.getByVendor(vendorId)
        : await supabase.from('menu_items').select('*, vendors(name)'); // Keep initial load broad

      if (error) throw error;
      // Remap data to add vendor_name for display
      const mappedData = data?.map((item) => ({
        ...item,
        vendor_name: (item as any).vendors?.name || 'N/A',
      }));
      setMenuItems(mappedData || []);
    } catch (error) {
      console.error('Error loading menu items:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить меню',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors(null);

    // Convert price to number before validation
    const dataToValidate = { ...formData, price: Number(formData.price) };
    const result = menuItemSchema.safeParse(dataToValidate);

    if (!result.success) {
      setFormErrors(result.error);
      return;
    }

    try {
      if (editingItem) {
        const { error } = await menuApi.update(editingItem.id, result.data);
        if (error) throw error;
        toast({ title: 'Блюдо обновлено' });
      } else {
        const { error } = await menuApi.create(result.data);
        if (error) throw error;
        toast({ title: 'Блюдо создано' });
      }

      setIsDialogOpen(false);
      setEditingItem(null);
      resetForm();
      loadMenuItems(selectedVendor);
    } catch (error) {
      console.error('Error saving menu item:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить блюдо',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      vendor_id: item.vendor_id,
      is_available: item.is_available,
      preparation_time: item.preparation_time,
      spice_level: item.spice_level,
      is_vegetarian: item.is_vegetarian,
      is_vegan: item.is_vegan,
      is_gluten_free: item.is_gluten_free,
      allergens: item.allergens,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (itemId: string) => {
    if (!confirm('Вы уверены, что хотите удалить это блюдо?')) return;

    try {
      const { error } = await menuApi.delete(itemId);
      if (error) throw error;

      toast({
        title: 'Блюдо удалено',
        description: 'Блюдо успешно удалено из меню',
      });

      loadMenuItems(selectedVendor);
    } catch (error) {
      console.error('Error deleting menu item:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить блюдо',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      category: '',
      vendor_id: '',
      is_available: true,
      preparation_time: 15,
      spice_level: 'mild',
      is_vegetarian: false,
      is_vegan: false,
      is_gluten_free: false,
      allergens: [],
    });
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingItem(null);
    resetForm();
  };

  const filteredItems = menuItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Загрузка меню...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Управление меню</h2>
          <p className="text-muted-foreground">
            Управляйте блюдами и их категориями
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingItem(null);
                resetForm();
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Добавить блюдо
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Редактировать блюдо' : 'Добавить блюдо'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Название блюда *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                  {formErrors?.formErrors.fieldErrors.name && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.formErrors.fieldErrors.name}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="vendor_id">Вендор *</Label>
                  <Select
                    value={formData.vendor_id}
                    onValueChange={(value) =>
                      setFormData({ ...formData, vendor_id: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите вендора" />
                    </SelectTrigger>
                    <SelectContent>
                      {vendors.map((vendor) => (
                        <SelectItem key={vendor.id} value={vendor.id}>
                          {vendor.name} ({vendor.cuisine_type})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors?.formErrors.fieldErrors.vendor_id && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.formErrors.fieldErrors.vendor_id}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                />
                {formErrors?.formErrors.fieldErrors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.formErrors.fieldErrors.description}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="price">Цена *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: parseFloat(e.target.value),
                      })
                    }
                    required
                  />
                  {formErrors?.formErrors.fieldErrors.price && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.formErrors.fieldErrors.price}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="category">Категория *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите категорию" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors?.formErrors.fieldErrors.category && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.formErrors.fieldErrors.category}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="preparation_time">
                    Время приготовления (мин)
                  </Label>
                  <Input
                    id="preparation_time"
                    type="number"
                    value={formData.preparation_time}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        preparation_time: parseInt(e.target.value),
                      })
                    }
                  />
                  {formErrors?.formErrors.fieldErrors.preparation_time && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.formErrors.fieldErrors.preparation_time}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="spice_level">Уровень остроты</Label>
                <Select
                  value={formData.spice_level}
                  onValueChange={(value: any) =>
                    setFormData({ ...formData, spice_level: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {spiceLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors?.formErrors.fieldErrors.spice_level && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.formErrors.fieldErrors.spice_level}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Особенности</Label>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_vegetarian"
                      checked={formData.is_vegetarian}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, is_vegetarian: checked })
                      }
                    />
                    <Label htmlFor="is_vegetarian">Вегетарианское</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_vegan"
                      checked={formData.is_vegan}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, is_vegan: checked })
                      }
                    />
                    <Label htmlFor="is_vegan">Веганское</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_gluten_free"
                      checked={formData.is_gluten_free}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, is_gluten_free: checked })
                      }
                    />
                    <Label htmlFor="is_gluten_free">Без глютена</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_available"
                      checked={formData.is_available}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, is_available: checked })
                      }
                    />
                    <Label htmlFor="is_available">Доступно</Label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDialogClose}
                >
                  Отмена
                </Button>
                <Button type="submit">
                  {editingItem ? 'Обновить' : 'Создать'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Поиск по названию, описанию или категории..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="w-full sm:w-64">
          <Select value={selectedVendor} onValueChange={setSelectedVendor}>
            <SelectTrigger>
              <SelectValue placeholder="Фильтр по вендору" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Все вендоры</SelectItem>
              {vendors.map((vendor) => (
                <SelectItem key={vendor.id} value={vendor.id}>
                  {vendor.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Menu Items Table */}
      <Card>
        <CardHeader>
          <CardTitle>Блюда в меню</CardTitle>
          <CardDescription>
            {selectedVendor
              ? `Меню вендора: ${vendors.find((v) => v.id === selectedVendor)?.name}`
              : 'Все блюда в системе'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Название</TableHead>
                <TableHead>Вендор</TableHead>
                <TableHead>Категория</TableHead>
                <TableHead>Цена</TableHead>
                <TableHead>Время</TableHead>
                <TableHead>Особенности</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Store className="h-4 w-4 text-muted-foreground" />
                      <span>{item.vendor_name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <DollarSign className="h-4 w-4 text-green-500" />
                      <span>${item.price.toFixed(2)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{item.preparation_time} мин</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {item.is_vegetarian && (
                        <Badge variant="secondary" className="text-xs">
                          Veg
                        </Badge>
                      )}
                      {item.is_vegan && (
                        <Badge variant="secondary" className="text-xs">
                          Vegan
                        </Badge>
                      )}
                      {item.is_gluten_free && (
                        <Badge variant="secondary" className="text-xs">
                          GF
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs">
                        {item.spice_level}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={item.is_available ? 'default' : 'secondary'}
                    >
                      {item.is_available ? 'Доступно' : 'Недоступно'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
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

export default MenuManagement;
