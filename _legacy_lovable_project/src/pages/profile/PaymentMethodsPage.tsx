import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  CreditCard,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  Shield,
  Calendar,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/LoadingStates';

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_account' | 'digital_wallet';
  name: string;
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  isActive: boolean;
  created_at: string;
}

const PaymentMethodsPage: React.FC = () => {
  const { toast } = useToast();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(
    null
  );
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    type: 'card' as 'card' | 'bank_account' | 'digital_wallet',
    name: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    isDefault: false,
  });

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      setLoading(true);
      // Здесь будет реальный API вызов
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockMethods: PaymentMethod[] = [
        {
          id: '1',
          type: 'card',
          name: 'Основная карта',
          last4: '4242',
          brand: 'visa',
          expiryMonth: 12,
          expiryYear: 2025,
          isDefault: true,
          isActive: true,
          created_at: '2024-01-10T10:30:00Z',
        },
        {
          id: '2',
          type: 'card',
          name: 'Резервная карта',
          last4: '5555',
          brand: 'mastercard',
          expiryMonth: 8,
          expiryYear: 2026,
          isDefault: false,
          isActive: true,
          created_at: '2024-01-12T14:20:00Z',
        },
      ];

      setPaymentMethods(mockMethods);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingMethod) {
        // Update existing payment method
        const updatedMethod = { ...editingMethod, ...formData };
        setPaymentMethods((prev) =>
          prev.map((method) =>
            method.id === editingMethod.id ? updatedMethod : method
          )
        );
        toast({
          title: 'Способ оплаты обновлен',
          description: 'Способ оплаты успешно обновлен',
        });
      } else {
        // Create new payment method
        const newMethod: PaymentMethod = {
          id: Date.now().toString(),
          type: formData.type,
          name: formData.name,
          last4: formData.cardNumber.slice(-4),
          brand: 'visa', // Определяется по номеру карты
          expiryMonth: parseInt(formData.expiryMonth),
          expiryYear: parseInt(formData.expiryYear),
          isDefault: formData.isDefault,
          isActive: true,
          created_at: new Date().toISOString(),
        };
        setPaymentMethods((prev) => [...prev, newMethod]);
        toast({
          title: 'Способ оплаты добавлен',
          description: 'Новый способ оплаты успешно добавлен',
        });
      }

      resetForm();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить способ оплаты',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (method: PaymentMethod) => {
    setEditingMethod(method);
    setFormData({
      type: method.type,
      name: method.name,
      cardNumber: `**** **** **** ${method.last4}`,
      expiryMonth: method.expiryMonth?.toString() || '',
      expiryYear: method.expiryYear?.toString() || '',
      cvv: '',
      isDefault: method.isDefault,
    });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      setPaymentMethods((prev) => prev.filter((method) => method.id !== id));
      toast({
        title: 'Способ оплаты удален',
        description: 'Способ оплаты успешно удален',
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить способ оплаты',
        variant: 'destructive',
      });
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      setPaymentMethods((prev) =>
        prev.map((method) => ({
          ...method,
          isDefault: method.id === id,
        }))
      );
      toast({
        title: 'Способ оплаты по умолчанию',
        description: 'Способ оплаты установлен как основной',
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось установить способ оплаты по умолчанию',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      type: 'card',
      name: '',
      cardNumber: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
      isDefault: false,
    });
    setEditingMethod(null);
    setIsEditing(false);
    setShowForm(false);
  };

  const getCardBrandIcon = (brand: string) => {
    switch (brand) {
      case 'visa':
        return '💳';
      case 'mastercard':
        return '💳';
      case 'amex':
        return '💳';
      default:
        return '💳';
    }
  };

  const getCardBrandName = (brand: string) => {
    switch (brand) {
      case 'visa':
        return 'Visa';
      case 'mastercard':
        return 'Mastercard';
      case 'amex':
        return 'American Express';
      default:
        return 'Карта';
    }
  };

  const formatExpiryDate = (month: number, year: number) => {
    return `${month.toString().padStart(2, '0')}/${year}`;
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
                <CreditCard className="h-5 w-5 mr-2" />
                Способы оплаты
              </CardTitle>
              <p className="text-gray-600 mt-1">
                Управление способами оплаты для заказов
              </p>
            </div>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-orange-600 hover:bg-orange-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Добавить карту
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Payment Method Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {isEditing
                ? 'Редактировать способ оплаты'
                : 'Добавить новую карту'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Название карты</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Например: Основная карта"
                  required
                />
              </div>

              <div>
                <Label htmlFor="cardNumber">Номер карты</Label>
                <Input
                  id="cardNumber"
                  value={formData.cardNumber}
                  onChange={(e) =>
                    handleInputChange('cardNumber', e.target.value)
                  }
                  placeholder="1234 5678 9012 3456"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiryMonth">Месяц</Label>
                  <select
                    id="expiryMonth"
                    value={formData.expiryMonth}
                    onChange={(e) =>
                      handleInputChange('expiryMonth', e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  >
                    <option value="">Месяц</option>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(
                      (month) => (
                        <option key={month} value={month}>
                          {month.toString().padStart(2, '0')}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <Label htmlFor="expiryYear">Год</Label>
                  <select
                    id="expiryYear"
                    value={formData.expiryYear}
                    onChange={(e) =>
                      handleInputChange('expiryYear', e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  >
                    <option value="">Год</option>
                    {Array.from(
                      { length: 10 },
                      (_, i) => new Date().getFullYear() + i
                    ).map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  value={formData.cvv}
                  onChange={(e) => handleInputChange('cvv', e.target.value)}
                  placeholder="123"
                  maxLength={4}
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={formData.isDefault}
                  onChange={(e) =>
                    handleInputChange('isDefault', e.target.checked)
                  }
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <Label htmlFor="isDefault">
                  Сделать способом оплаты по умолчанию
                </Label>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="submit"
                  className="bg-orange-600 hover:bg-orange-700"
                >
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

      {/* Payment Methods List */}
      {paymentMethods.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Способов оплаты пока нет
            </h3>
            <p className="text-gray-600 mb-4">
              Добавьте способ оплаты для удобных покупок
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Добавить первый способ оплаты
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {paymentMethods.map((method) => (
            <Card key={method.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="text-2xl">
                      {getCardBrandIcon(method.brand || 'card')}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{method.name}</CardTitle>
                      {method.isDefault && (
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-800"
                        >
                          По умолчанию
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(method)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(method.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-mono">
                      **** **** **** {method.last4}
                    </span>
                    <Badge variant="outline">
                      {getCardBrandName(method.brand || 'card')}
                    </Badge>
                  </div>

                  {method.expiryMonth && method.expiryYear && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        Действует до:{' '}
                        {formatExpiryDate(
                          method.expiryMonth,
                          method.expiryYear
                        )}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-600">
                      Защищено SSL-шифрованием
                    </span>
                  </div>

                  {!method.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetDefault(method.id)}
                      className="w-full"
                    >
                      Сделать основным
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentMethodsPage;
