import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Plus, 
  Edit, 
  Trash2, 
  Check,
  X,
  Home,
  Building,
  Navigation
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/LoadingStates';

interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  name: string;
  address: string;
  city: string;
  zipCode: string;
  instructions?: string;
  isDefault: boolean;
  created_at: string;
}

const AddressesPage: React.FC = () => {
  const { toast } = useToast();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    type: 'home' as 'home' | 'work' | 'other',
    name: '',
    address: '',
    city: '',
    zipCode: '',
    instructions: '',
    isDefault: false
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      // Здесь будет реальный API вызов
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockAddresses: Address[] = [
        {
          id: '1',
          type: 'home',
          name: 'Дом',
          address: 'ул. Тверская, 15, кв. 42',
          city: 'Москва',
          zipCode: '125009',
          instructions: 'Код домофона: 42#',
          isDefault: true,
          created_at: '2024-01-10T10:30:00Z'
        },
        {
          id: '2',
          type: 'work',
          name: 'Офис',
          address: 'ул. Арбат, 8, офис 12',
          city: 'Москва',
          zipCode: '119002',
          instructions: 'Вход со двора',
          isDefault: false,
          created_at: '2024-01-12T14:20:00Z'
        }
      ];
      
      setAddresses(mockAddresses);
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingAddress) {
        // Update existing address
        const updatedAddress = { ...editingAddress, ...formData };
        setAddresses(prev => 
          prev.map(addr => addr.id === editingAddress.id ? updatedAddress : addr)
        );
        toast({
          title: "Адрес обновлен",
          description: "Адрес успешно обновлен",
        });
      } else {
        // Create new address
        const newAddress: Address = {
          id: Date.now().toString(),
          ...formData,
          created_at: new Date().toISOString()
        };
        setAddresses(prev => [...prev, newAddress]);
        toast({
          title: "Адрес добавлен",
          description: "Новый адрес успешно добавлен",
        });
      }
      
      resetForm();
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить адрес",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      type: address.type,
      name: address.name,
      address: address.address,
      city: address.city,
      zipCode: address.zipCode,
      instructions: address.instructions || '',
      isDefault: address.isDefault
    });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      setAddresses(prev => prev.filter(addr => addr.id !== id));
      toast({
        title: "Адрес удален",
        description: "Адрес успешно удален",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить адрес",
        variant: "destructive",
      });
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      setAddresses(prev => 
        prev.map(addr => ({
          ...addr,
          isDefault: addr.id === id
        }))
      );
      toast({
        title: "Адрес по умолчанию",
        description: "Адрес установлен как основной",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось установить адрес по умолчанию",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      type: 'home',
      name: '',
      address: '',
      city: '',
      zipCode: '',
      instructions: '',
      isDefault: false
    });
    setEditingAddress(null);
    setIsEditing(false);
    setShowForm(false);
  };

  const getAddressTypeIcon = (type: string) => {
    switch (type) {
      case 'home':
        return <Home className="h-4 w-4" />;
      case 'work':
        return <Building className="h-4 w-4" />;
      default:
        return <Navigation className="h-4 w-4" />;
    }
  };

  const getAddressTypeLabel = (type: string) => {
    switch (type) {
      case 'home':
        return 'Дом';
      case 'work':
        return 'Работа';
      default:
        return 'Другое';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Адреса доставки
              </CardTitle>
              <p className="text-gray-600 mt-1">
                Управление адресами для доставки заказов
              </p>
            </div>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-orange-600 hover:bg-orange-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Добавить адрес
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Address Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {isEditing ? 'Редактировать адрес' : 'Добавить новый адрес'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Тип адреса</Label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="home">Дом</option>
                    <option value="work">Работа</option>
                    <option value="other">Другое</option>
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="name">Название адреса</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Например: Дом, Офис"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">Адрес</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Улица, дом, квартира"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">Город</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="Москва"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="zipCode">Индекс</Label>
                  <Input
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    placeholder="123456"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="instructions">Дополнительные инструкции</Label>
                <textarea
                  id="instructions"
                  value={formData.instructions}
                  onChange={(e) => handleInputChange('instructions', e.target.value)}
                  placeholder="Код домофона, этаж, подъезд и т.д."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={formData.isDefault}
                  onChange={(e) => handleInputChange('isDefault', e.target.checked)}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <Label htmlFor="isDefault">Сделать адресом по умолчанию</Label>
              </div>

              <div className="flex items-center gap-2">
                <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
                  <Check className="h-4 w-4 mr-2" />
                  {isEditing ? 'Сохранить' : 'Добавить'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  <X className="h-4 w-4 mr-2" />
                  Отмена
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Addresses List */}
      {addresses.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Адресов пока нет
            </h3>
            <p className="text-gray-600 mb-4">
              Добавьте адрес для удобной доставки заказов
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Добавить первый адрес
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((address) => (
            <Card key={address.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getAddressTypeIcon(address.type)}
                    <div>
                      <CardTitle className="text-lg">{address.name}</CardTitle>
                      {address.isDefault && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          По умолчанию
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(address)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(address.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-2">
                  <p className="text-gray-900 font-medium">{address.address}</p>
                  <p className="text-gray-600">{address.city}, {address.zipCode}</p>
                  
                  {address.instructions && (
                    <p className="text-sm text-gray-500">
                      <strong>Инструкции:</strong> {address.instructions}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {getAddressTypeLabel(address.type)}
                    </Badge>
                    {!address.isDefault && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetDefault(address.id)}
                      >
                        Сделать основным
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressesPage;
