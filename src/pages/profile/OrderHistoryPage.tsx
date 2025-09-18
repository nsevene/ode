import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ShoppingBag, 
  Calendar, 
  MapPin, 
  CreditCard,
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Star,
  RefreshCw
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { LoadingSpinner } from '@/components/LoadingStates';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface Order {
  id: string;
  order_number: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  total_amount: number;
  created_at: string;
  delivery_address: string;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
    vendor_name: string;
  }>;
  payment_method: string;
  delivery_time?: string;
}

const OrderHistoryPage: React.FC = () => {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // Здесь будет реальный API вызов
      // Пока что используем моковые данные
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockOrders: Order[] = [
        {
          id: '1',
          order_number: 'ODE-2024-001',
          status: 'delivered',
          total_amount: 1250,
          created_at: '2024-01-15T14:30:00Z',
          delivery_address: 'ул. Тверская, 15, кв. 42',
          items: [
            {
              id: '1',
              name: 'Паста Карбонара',
              quantity: 1,
              price: 450,
              vendor_name: 'Dolce Italia'
            },
            {
              id: '2',
              name: 'Тирамису',
              quantity: 1,
              price: 350,
              vendor_name: 'Dolce Italia'
            },
            {
              id: '3',
              name: 'Лате',
              quantity: 2,
              price: 225,
              vendor_name: 'Coffee Corner'
            }
          ],
          payment_method: 'Банковская карта',
          delivery_time: '2024-01-15T15:45:00Z'
        },
        {
          id: '2',
          order_number: 'ODE-2024-002',
          status: 'preparing',
          total_amount: 890,
          created_at: '2024-01-16T12:15:00Z',
          delivery_address: 'ул. Арбат, 8, кв. 12',
          items: [
            {
              id: '4',
              name: 'Ролл Калифорния',
              quantity: 2,
              price: 320,
              vendor_name: 'Spicy Asia'
            },
            {
              id: '5',
              name: 'Мисо суп',
              quantity: 1,
              price: 250,
              vendor_name: 'Spicy Asia'
            }
          ],
          payment_method: 'Наличные'
        }
      ];
      
      setOrders(mockOrders);
    } catch (err) {
      setError('Ошибка загрузки заказов');
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status: string) => {
    const statusMap = {
      pending: { label: 'Ожидает подтверждения', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      confirmed: { label: 'Подтвержден', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
      preparing: { label: 'Готовится', color: 'bg-orange-100 text-orange-800', icon: Package },
      ready: { label: 'Готов к выдаче', color: 'bg-purple-100 text-purple-800', icon: Truck },
      delivered: { label: 'Доставлен', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      cancelled: { label: 'Отменен', color: 'bg-red-100 text-red-800', icon: XCircle }
    };
    
    return statusMap[status as keyof typeof statusMap] || statusMap.pending;
  };

  const getFilteredOrders = () => {
    if (selectedStatus === 'all') {
      return orders;
    }
    return orders.filter(order => order.status === selectedStatus);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMMM yyyy, HH:mm', { locale: ru });
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <XCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Ошибка загрузки
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={fetchOrders}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Попробовать снова
          </Button>
        </CardContent>
      </Card>
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
                <ShoppingBag className="h-5 w-5 mr-2" />
                История заказов
              </CardTitle>
              <p className="text-gray-600 mt-1">
                Все ваши заказы в ODE Food Hall
              </p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">Все заказы</option>
                <option value="pending">Ожидают подтверждения</option>
                <option value="confirmed">Подтверждены</option>
                <option value="preparing">Готовятся</option>
                <option value="ready">Готовы</option>
                <option value="delivered">Доставлены</option>
                <option value="cancelled">Отменены</option>
              </select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Orders List */}
      {getFilteredOrders().length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Заказов пока нет
            </h3>
            <p className="text-gray-600 mb-4">
              {selectedStatus === 'all' 
                ? 'Вы еще не делали заказы в ODE Food Hall'
                : 'Нет заказов с выбранным статусом'
              }
            </p>
            <Button onClick={() => window.location.href = '/vendors'}>
              Сделать первый заказ
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {getFilteredOrders().map((order) => {
            const statusInfo = getStatusInfo(order.status);
            const StatusIcon = statusInfo.icon;
            
            return (
              <Card key={order.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          Заказ #{order.order_number}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {formatDate(order.created_at)}
                        </p>
                      </div>
                      <Badge className={statusInfo.color}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusInfo.label}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        {formatPrice(order.total_amount)}
                      </p>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Подробнее
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Товары:</h4>
                      <div className="space-y-1">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span>{item.name} x{item.quantity}</span>
                            <span className="font-medium">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{order.delivery_address}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <CreditCard className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{order.payment_method}</span>
                      </div>
                      {order.delivery_time && (
                        <div className="flex items-center text-sm">
                          <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                          <span>Доставлен: {formatDate(order.delivery_time)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {order.status === 'delivered' && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          Оцените ваш заказ
                        </span>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className="h-4 w-4 text-gray-300 hover:text-yellow-400 cursor-pointer"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;
