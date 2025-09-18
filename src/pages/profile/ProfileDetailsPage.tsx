import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Save,
  Edit,
  Check,
  X
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/LoadingStates';

const ProfileDetailsPage: React.FC = () => {
  const { user, updateUser } = useAuthStore();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: user?.user_metadata?.full_name || '',
    phone: user?.user_metadata?.phone || '',
    address: user?.user_metadata?.address || '',
    city: user?.user_metadata?.city || '',
    date_of_birth: user?.user_metadata?.date_of_birth || '',
    preferences: {
      newsletter: user?.user_metadata?.preferences?.newsletter || false,
      sms_notifications: user?.user_metadata?.preferences?.sms_notifications || false,
      email_notifications: user?.user_metadata?.preferences?.email_notifications || true,
    }
  });

  const [originalData, setOriginalData] = useState(formData);

  useEffect(() => {
    if (user) {
      const userData = {
        full_name: user.user_metadata?.full_name || '',
        phone: user.user_metadata?.phone || '',
        address: user.user_metadata?.address || '',
        city: user.user_metadata?.city || '',
        date_of_birth: user.user_metadata?.date_of_birth || '',
        preferences: {
          newsletter: user.user_metadata?.preferences?.newsletter || false,
          sms_notifications: user.user_metadata?.preferences?.sms_notifications || false,
          email_notifications: user.user_metadata?.preferences?.email_notifications || true,
        }
      };
      setFormData(userData);
      setOriginalData(userData);
    }
  }, [user]);

  const handleInputChange = (field: string, value: string | boolean) => {
    if (field.startsWith('preferences.')) {
      const prefKey = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [prefKey]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      await updateUser({
        data: {
          full_name: formData.full_name,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          date_of_birth: formData.date_of_birth,
          preferences: formData.preferences
        }
      });

      setOriginalData(formData);
      setIsEditing(false);
      
      toast({
        title: "Профиль обновлен",
        description: "Ваши данные успешно сохранены",
      });
    } catch (error) {
      console.error('Ошибка обновления профиля:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить профиль. Попробуйте снова.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(originalData);
    setIsEditing(false);
  };

  const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Личные данные
              </CardTitle>
              <p className="text-gray-600 mt-1">
                Управление информацией вашего профиля
              </p>
            </div>
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Отмена
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSave}
                    disabled={loading || !hasChanges}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    {loading ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-1" />
                        Сохранить
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Редактировать
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Основная информация
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="full_name">Полное имя *</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => handleInputChange('full_name', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Введите ваше полное имя"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={user.email}
                  disabled
                  className="bg-gray-50"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Email нельзя изменить
                </p>
              </div>
              <div>
                <Label htmlFor="phone">Телефон</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  disabled={!isEditing}
                  placeholder="+7 (999) 123-45-67"
                />
              </div>
              <div>
                <Label htmlFor="date_of_birth">Дата рождения</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Address Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Адресная информация
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="address">Адрес</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Улица, дом, квартира"
                />
              </div>
              <div>
                <Label htmlFor="city">Город</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Москва"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Preferences */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Настройки уведомлений
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email_notifications">Email уведомления</Label>
                  <p className="text-sm text-gray-600">
                    Получать уведомления о заказах и событиях на email
                  </p>
                </div>
                <input
                  type="checkbox"
                  id="email_notifications"
                  checked={formData.preferences.email_notifications}
                  onChange={(e) => handleInputChange('preferences.email_notifications', e.target.checked)}
                  disabled={!isEditing}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="sms_notifications">SMS уведомления</Label>
                  <p className="text-sm text-gray-600">
                    Получать SMS о статусе заказов
                  </p>
                </div>
                <input
                  type="checkbox"
                  id="sms_notifications"
                  checked={formData.preferences.sms_notifications}
                  onChange={(e) => handleInputChange('preferences.sms_notifications', e.target.checked)}
                  disabled={!isEditing}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="newsletter">Рассылка</Label>
                  <p className="text-sm text-gray-600">
                    Получать новости и специальные предложения
                  </p>
                </div>
                <input
                  type="checkbox"
                  id="newsletter"
                  checked={formData.preferences.newsletter}
                  onChange={(e) => handleInputChange('preferences.newsletter', e.target.checked)}
                  disabled={!isEditing}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Info */}
      <Card>
        <CardHeader>
          <CardTitle>Информация об аккаунте</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-2 text-gray-500" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-gray-500" />
              <div>
                <p className="text-sm font-medium">Дата регистрации</p>
                <p className="text-sm text-gray-600">
                  {new Date(user.created_at).toLocaleDateString('ru-RU')}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="h-4 w-4 mr-2 flex items-center justify-center">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
              <div>
                <p className="text-sm font-medium">Статус</p>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Активен
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileDetailsPage;
