import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, BellRing, Check, Clock, Mail, User } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  type: 'new_booking' | 'payment_received' | 'booking_cancelled';
  title: string;
  message: string;
  booking_id?: string;
  read: boolean;
  created_at: string;
  booking_details?: {
    guest_name: string;
    experience_type: string;
    booking_date: string;
    payment_amount: number;
  };
}

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();

    // Подписка на новые бронирования для real-time уведомлений
    const subscription = supabase
      .channel('bookings_changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'bookings' },
        handleNewBooking
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'bookings' },
        handleBookingUpdate
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadNotifications = async () => {
    // Mock data for demonstration
    // In a real application, this would be a notifications table
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'new_booking',
        title: 'Новое бронирование',
        message:
          'Получено новое бронирование от Анна Петрова на винную дегустацию',
        read: false,
        created_at: new Date().toISOString(),
        booking_details: {
          guest_name: 'Анна Петрова',
          experience_type: 'wine-tasting',
          booking_date: '2024-12-25',
          payment_amount: 5000,
        },
      },
      {
        id: '2',
        type: 'payment_received',
        title: 'Оплата получена',
        message: 'Получена оплата за бронирование №B-2024-001',
        read: false,
        created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        booking_details: {
          guest_name: 'Михаил Сидоров',
          experience_type: 'chef-table',
          booking_date: '2024-12-26',
          payment_amount: 12000,
        },
      },
      {
        id: '3',
        type: 'booking_cancelled',
        title: 'Бронирование отменено',
        message: 'Бронирование №B-2024-002 было отменено клиентом',
        read: true,
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        booking_details: {
          guest_name: 'Елена Козлова',
          experience_type: 'cooking-class',
          booking_date: '2024-12-24',
          payment_amount: 8000,
        },
      },
    ];

    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter((n) => !n.read).length);
    setLoading(false);
  };

  const handleNewBooking = (payload: any) => {
    const newNotification: Notification = {
      id: `new_${Date.now()}`,
      type: 'new_booking',
      title: 'Новое бронирование',
      message: `Получено новое бронирование от ${payload.new.guest_name}`,
      booking_id: payload.new.id,
      read: false,
      created_at: new Date().toISOString(),
      booking_details: {
        guest_name: payload.new.guest_name,
        experience_type: payload.new.experience_type,
        booking_date: payload.new.booking_date,
        payment_amount: payload.new.payment_amount,
      },
    };

    setNotifications((prev) => [newNotification, ...prev]);
    setUnreadCount((prev) => prev + 1);

    // Показываем уведомление в браузере
    if (Notification.permission === 'granted') {
      new Notification('Новое бронирование', {
        body: `${payload.new.guest_name} забронировал ${payload.new.experience_type}`,
        icon: '/favicon.ico',
      });
    }

    toast({
      title: 'Новое бронирование!',
      description: `${payload.new.guest_name} забронировал ${payload.new.experience_type}`,
    });
  };

  const handleBookingUpdate = (payload: any) => {
    if (
      payload.new.payment_status === 'paid' &&
      payload.old.payment_status !== 'paid'
    ) {
      const paymentNotification: Notification = {
        id: `payment_${Date.now()}`,
        type: 'payment_received',
        title: 'Оплата получена',
        message: `Получена оплата от ${payload.new.guest_name}`,
        booking_id: payload.new.id,
        read: false,
        created_at: new Date().toISOString(),
        booking_details: {
          guest_name: payload.new.guest_name,
          experience_type: payload.new.experience_type,
          booking_date: payload.new.booking_date,
          payment_amount: payload.new.payment_amount,
        },
      };

      setNotifications((prev) => [paymentNotification, ...prev]);
      setUnreadCount((prev) => prev + 1);

      toast({
        title: 'Оплата получена!',
        description: `${payload.new.guest_name} оплатил бронирование`,
      });
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_booking':
        return <User className="h-4 w-4 text-blue-600" />;
      case 'payment_received':
        return <Check className="h-4 w-4 text-green-600" />;
      case 'booking_cancelled':
        return <Clock className="h-4 w-4 text-red-600" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'new_booking':
        return 'border-l-blue-500 bg-blue-50';
      case 'payment_received':
        return 'border-l-green-500 bg-green-50';
      case 'booking_cancelled':
        return 'border-l-red-500 bg-red-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  // Запрос разрешения на уведомления при загрузке компонента
  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
            <span className="ml-2">Загрузка уведомлений...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BellRing className="h-5 w-5" />
            Уведомления
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              Отметить все прочитанными
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Нет уведомлений</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border-l-4 rounded-lg cursor-pointer transition-all hover:shadow-sm ${
                  notification.read
                    ? 'bg-muted/30'
                    : getNotificationColor(notification.type)
                } ${!notification.read ? 'shadow-sm' : ''}`}
                onClick={() =>
                  !notification.read && markAsRead(notification.id)
                }
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4
                        className={`text-sm font-medium ${!notification.read ? 'font-semibold' : ''}`}
                      >
                        {notification.title}
                      </h4>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground mb-2">
                      {notification.message}
                    </p>

                    {notification.booking_details && (
                      <div className="text-xs text-muted-foreground bg-white/50 p-2 rounded border">
                        <div className="grid grid-cols-2 gap-2">
                          <span>
                            <strong>Гость:</strong>{' '}
                            {notification.booking_details.guest_name}
                          </span>
                          <span>
                            <strong>Сумма:</strong>{' '}
                            {(
                              notification.booking_details.payment_amount / 100
                            ).toLocaleString('ru-RU')}
                            ₽
                          </span>
                          <span>
                            <strong>Дата:</strong>{' '}
                            {format(
                              new Date(
                                notification.booking_details.booking_date
                              ),
                              'dd.MM.yyyy',
                              { locale: ru }
                            )}
                          </span>
                          <span>
                            <strong>Опыт:</strong>{' '}
                            {notification.booking_details.experience_type}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {format(
                          new Date(notification.created_at),
                          'dd.MM.yyyy HH:mm',
                          { locale: ru }
                        )}
                      </span>
                      {notification.booking_id && (
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          ID: {notification.booking_id.slice(0, 8)}...
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationSystem;
