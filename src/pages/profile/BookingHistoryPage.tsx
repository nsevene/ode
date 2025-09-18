import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users,
  CheckCircle,
  XCircle,
  Clock3,
  Eye,
  RefreshCw,
  Star
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { LoadingSpinner } from '@/components/LoadingStates';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface Booking {
  id: string;
  booking_number: string;
  status: 'confirmed' | 'cancelled' | 'completed' | 'no_show';
  event: {
    id: string;
    title: string;
    description: string;
    event_date: string;
    start_time: string;
    end_time: string;
    location: string;
    price: number;
    max_attendees: number;
    event_type: string;
    image_url?: string;
  };
  created_at: string;
  notes?: string;
  payment_status: 'paid' | 'pending' | 'refunded';
}

const BookingHistoryPage: React.FC = () => {
  const { user } = useAuthStore();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      // Здесь будет реальный API вызов
      // Пока что используем моковые данные
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockBookings: Booking[] = [
        {
          id: '1',
          booking_number: 'BK-2024-001',
          status: 'completed',
          event: {
            id: '1',
            title: 'Мастер-класс по итальянской пасте',
            description: 'Научитесь готовить настоящую итальянскую пасту от шеф-повара',
            event_date: '2024-01-10',
            start_time: '18:00',
            end_time: '21:00',
            location: 'ODE Food Hall, зона Dolce Italia',
            price: 2500,
            max_attendees: 12,
            event_type: 'cooking',
            image_url: 'https://example.com/pasta-class.jpg'
          },
          created_at: '2024-01-05T10:30:00Z',
          notes: 'Вегетарианские блюда',
          payment_status: 'paid'
        },
        {
          id: '2',
          booking_number: 'BK-2024-002',
          status: 'confirmed',
          event: {
            id: '2',
            title: 'Дегустация вин',
            description: 'Попробуйте лучшие вина Италии с сомелье',
            event_date: '2024-01-20',
            start_time: '19:00',
            end_time: '22:00',
            location: 'ODE Food Hall, винная лестница',
            price: 1800,
            max_attendees: 20,
            event_type: 'tasting',
            image_url: 'https://example.com/wine-tasting.jpg'
          },
          created_at: '2024-01-15T14:20:00Z',
          payment_status: 'paid'
        },
        {
          id: '3',
          booking_number: 'BK-2024-003',
          status: 'cancelled',
          event: {
            id: '3',
            title: 'Воркшоп по суши',
            description: 'Мастер-класс по приготовлению суши и роллов',
            event_date: '2024-01-12',
            start_time: '17:00',
            end_time: '20:00',
            location: 'ODE Food Hall, зона Spicy Asia',
            price: 3200,
            max_attendees: 8,
            event_type: 'workshop',
            image_url: 'https://example.com/sushi-workshop.jpg'
          },
          created_at: '2024-01-08T16:45:00Z',
          notes: 'Отмена по личным обстоятельствам',
          payment_status: 'refunded'
        }
      ];
      
      setBookings(mockBookings);
    } catch (err) {
      setError('Ошибка загрузки бронирований');
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status: string) => {
    const statusMap = {
      confirmed: { label: 'Подтверждено', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      cancelled: { label: 'Отменено', color: 'bg-red-100 text-red-800', icon: XCircle },
      completed: { label: 'Завершено', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
      no_show: { label: 'Не явился', color: 'bg-gray-100 text-gray-800', icon: XCircle }
    };
    
    return statusMap[status as keyof typeof statusMap] || statusMap.confirmed;
  };

  const getEventTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'tasting': 'Дегустация',
      'cooking': 'Мастер-класс',
      'workshop': 'Воркшоп',
      'seminar': 'Семинар',
      'presentation': 'Презентация',
      'meetup': 'Встреча',
      'celebration': 'Празднование'
    };
    return labels[type] || type;
  };

  const getFilteredBookings = () => {
    if (selectedStatus === 'all') {
      return bookings;
    }
    return bookings.filter(booking => booking.status === selectedStatus);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMMM yyyy', { locale: ru });
  };

  const formatTime = (timeString: string) => {
    return timeString.substring(0, 5);
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const isEventPast = (eventDate: string, eventTime: string) => {
    const eventDateTime = new Date(`${eventDate}T${eventTime}`);
    return eventDateTime < new Date();
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
          <Button onClick={fetchBookings}>
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
                <Calendar className="h-5 w-5 mr-2" />
                История бронирований
              </CardTitle>
              <p className="text-gray-600 mt-1">
                Все ваши бронирования событий в ODE Food Hall
              </p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">Все бронирования</option>
                <option value="confirmed">Подтверждены</option>
                <option value="completed">Завершены</option>
                <option value="cancelled">Отменены</option>
                <option value="no_show">Не явился</option>
              </select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Bookings List */}
      {getFilteredBookings().length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Бронирований пока нет
            </h3>
            <p className="text-gray-600 mb-4">
              {selectedStatus === 'all' 
                ? 'Вы еще не бронировали события в ODE Food Hall'
                : 'Нет бронирований с выбранным статусом'
              }
            </p>
            <Button onClick={() => window.location.href = '/events'}>
              Посмотреть события
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {getFilteredBookings().map((booking) => {
            const statusInfo = getStatusInfo(booking.status);
            const StatusIcon = statusInfo.icon;
            const isPast = isEventPast(booking.event.event_date, booking.event.start_time);
            
            return (
              <Card key={booking.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          Бронирование #{booking.booking_number}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Создано: {formatDate(booking.created_at)}
                        </p>
                      </div>
                      <Badge className={statusInfo.color}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusInfo.label}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        {formatPrice(booking.event.price)}
                      </p>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Подробнее
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Event Info */}
                    <div className="lg:col-span-2">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {booking.event.title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">
                        {booking.event.description}
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-center text-sm">
                          <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{formatDate(booking.event.event_date)}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Clock className="h-4 w-4 mr-2 text-gray-500" />
                          <span>
                            {formatTime(booking.event.start_time)} - {formatTime(booking.event.end_time)}
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{booking.event.location}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Users className="h-4 w-4 mr-2 text-gray-500" />
                          <span>До {booking.event.max_attendees} участников</span>
                        </div>
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div className="space-y-3">
                      <div>
                        <Badge variant="outline" className="mb-2">
                          {getEventTypeLabel(booking.event.event_type)}
                        </Badge>
                        <p className="text-sm text-gray-600">
                          Статус оплаты: {booking.payment_status === 'paid' ? 'Оплачено' : 
                                        booking.payment_status === 'pending' ? 'Ожидает оплаты' : 'Возвращено'}
                        </p>
                      </div>
                      
                      {booking.notes && (
                        <div>
                          <p className="text-sm font-medium text-gray-900">Заметки:</p>
                          <p className="text-sm text-gray-600">{booking.notes}</p>
                        </div>
                      )}

                      {booking.status === 'completed' && isPast && (
                        <div className="pt-3 border-t">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                              Оцените событие
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
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BookingHistoryPage;
