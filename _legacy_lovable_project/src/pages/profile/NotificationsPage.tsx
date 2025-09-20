import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Bell,
  Mail,
  Smartphone,
  Settings,
  CheckCircle,
  XCircle,
  Info,
  AlertTriangle,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/LoadingStates';

interface NotificationSettings {
  id: string;
  type: 'email' | 'push' | 'sms';
  category: 'orders' | 'bookings' | 'events' | 'marketing' | 'security';
  title: string;
  description: string;
  enabled: boolean;
  isRequired: boolean;
}

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  action_url?: string;
}

const NotificationsPage: React.FC = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<NotificationSettings[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'settings' | 'history'>(
    'settings'
  );

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Здесь будет реальный API вызов
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockSettings: NotificationSettings[] = [
        {
          id: '1',
          type: 'email',
          category: 'orders',
          title: 'Уведомления о заказах',
          description: 'Получать уведомления о статусе заказов по email',
          enabled: true,
          isRequired: true,
        },
        {
          id: '2',
          type: 'push',
          category: 'orders',
          title: 'Push-уведомления о заказах',
          description: 'Получать push-уведомления о статусе заказов',
          enabled: true,
          isRequired: false,
        },
        {
          id: '3',
          type: 'email',
          category: 'bookings',
          title: 'Уведомления о бронированиях',
          description: 'Получать уведомления о событиях и бронированиях',
          enabled: true,
          isRequired: false,
        },
        {
          id: '4',
          type: 'push',
          category: 'bookings',
          title: 'Push-уведомления о бронированиях',
          description: 'Получать push-уведомления о событиях',
          enabled: false,
          isRequired: false,
        },
        {
          id: '5',
          type: 'email',
          category: 'marketing',
          title: 'Маркетинговые уведомления',
          description: 'Получать информацию о новых блюдах и акциях',
          enabled: false,
          isRequired: false,
        },
        {
          id: '6',
          type: 'sms',
          category: 'security',
          title: 'SMS-уведомления о безопасности',
          description: 'Получать SMS о важных изменениях в аккаунте',
          enabled: true,
          isRequired: true,
        },
      ];

      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'success',
          title: 'Заказ подтвержден',
          message: 'Ваш заказ #ODE-123456 успешно подтвержден и готовится',
          read: false,
          created_at: '2024-01-15T10:30:00Z',
          action_url: '/profile/orders',
        },
        {
          id: '2',
          type: 'info',
          title: 'Новое событие',
          message: 'Доступно новое событие: Мастер-класс по суши',
          read: false,
          created_at: '2024-01-15T09:15:00Z',
          action_url: '/events',
        },
        {
          id: '3',
          type: 'warning',
          title: 'Изменение времени доставки',
          message: 'Время доставки вашего заказа изменено на 15:30',
          read: true,
          created_at: '2024-01-14T16:45:00Z',
        },
        {
          id: '4',
          type: 'error',
          title: 'Ошибка оплаты',
          message: 'Не удалось обработать платеж. Попробуйте снова',
          read: true,
          created_at: '2024-01-14T14:20:00Z',
          action_url: '/checkout',
        },
      ];

      setSettings(mockSettings);
      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = async (id: string, enabled: boolean) => {
    try {
      setSettings((prev) =>
        prev.map((setting) =>
          setting.id === id ? { ...setting, enabled } : setting
        )
      );

      toast({
        title: 'Настройки обновлены',
        description: 'Настройки уведомлений успешно обновлены',
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить настройки',
        variant: 'destructive',
      });
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, read: true }))
      );
      toast({
        title: 'Уведомления прочитаны',
        description: 'Все уведомления отмечены как прочитанные',
      });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getNotificationTypeLabel = (type: string) => {
    switch (type) {
      case 'success':
        return 'Успех';
      case 'error':
        return 'Ошибка';
      case 'warning':
        return 'Предупреждение';
      default:
        return 'Информация';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'orders':
        return 'Заказы';
      case 'bookings':
        return 'Бронирования';
      case 'events':
        return 'События';
      case 'marketing':
        return 'Маркетинг';
      case 'security':
        return 'Безопасность';
      default:
        return 'Общие';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'push':
        return <Smartphone className="h-4 w-4" />;
      case 'sms':
        return <Bell className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Уведомления
          </CardTitle>
          <p className="text-gray-600">
            Управление настройками уведомлений и просмотр истории
          </p>
        </CardHeader>
      </Card>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'settings'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Settings className="h-4 w-4 mr-2 inline" />
          Настройки
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'history'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Bell className="h-4 w-4 mr-2 inline" />
          История
        </button>
      </div>

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          {settings.map((setting) => (
            <Card key={setting.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getTypeIcon(setting.type)}
                      <h3 className="text-lg font-semibold">{setting.title}</h3>
                      <Badge variant="outline">
                        {getCategoryLabel(setting.category)}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-4">{setting.description}</p>
                    {setting.isRequired && (
                      <Badge
                        variant="secondary"
                        className="bg-blue-100 text-blue-800"
                      >
                        Обязательное
                      </Badge>
                    )}
                  </div>
                  <div className="ml-4">
                    <Switch
                      checked={setting.enabled}
                      onCheckedChange={(enabled) =>
                        handleSettingChange(setting.id, enabled)
                      }
                      disabled={setting.isRequired}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">История уведомлений</h3>
            <Button
              variant="outline"
              onClick={handleMarkAllAsRead}
              disabled={notifications.every((n) => n.read)}
            >
              Отметить все как прочитанные
            </Button>
          </div>

          {notifications.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Уведомлений пока нет
                </h3>
                <p className="text-gray-600">
                  Здесь будут отображаться ваши уведомления
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`cursor-pointer hover:shadow-md transition-shadow ${
                    !notification.read ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                  onClick={() => handleMarkAsRead(notification.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <Badge
                              variant="secondary"
                              className="bg-blue-100 text-blue-800"
                            >
                              Новое
                            </Badge>
                          )}
                          <Badge variant="outline">
                            {getNotificationTypeLabel(notification.type)}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">
                            {formatDate(notification.created_at)}
                          </span>
                          {notification.action_url && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.location.href = notification.action_url!;
                              }}
                            >
                              Перейти
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
