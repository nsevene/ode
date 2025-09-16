import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Bell, BellOff, Smartphone, Calendar, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NotificationPreferences {
  bookingReminders: boolean;
  promotions: boolean;
  events: boolean;
  questUpdates: boolean;
  achievements: boolean;
}

interface PushNotification {
  id: string;
  title: string;
  body: string;
  type: 'booking' | 'promotion' | 'event' | 'quest' | 'achievement';
  timestamp: Date;
  read: boolean;
}

export const PushNotifications: React.FC = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    bookingReminders: true,
    promotions: false,
    events: true,
    questUpdates: true,
    achievements: true
  });
  const [notifications, setNotifications] = useState<PushNotification[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    checkNotificationSupport();
    loadPreferences();
    loadNotifications();
  }, []);

  const checkNotificationSupport = () => {
    const supported = 'Notification' in window && 'serviceWorker' in navigator;
    setIsSupported(supported);
    
    if (supported) {
      setIsEnabled(Notification.permission === 'granted');
      setIsSubscribed(localStorage.getItem('push_subscribed') === 'true');
    }
  };

  const loadPreferences = () => {
    const saved = localStorage.getItem('notification_preferences');
    if (saved) {
      setPreferences(JSON.parse(saved));
    }
  };

  const loadNotifications = () => {
    const saved = localStorage.getItem('push_notifications');
    if (saved) {
      setNotifications(JSON.parse(saved).map((n: any) => ({
        ...n,
        timestamp: new Date(n.timestamp)
      })));
    }
  };

  const requestPermission = async () => {
    if (!isSupported) {
      toast({
        title: "Не поддерживается",
        description: "Ваш браузер не поддерживает push-уведомления",
        variant: "destructive"
      });
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        setIsEnabled(true);
        await subscribeToPush();
        
        toast({
          title: "Уведомления включены!",
          description: "Теперь вы будете получать важные обновления"
        });

        // Тестовое уведомление
        showTestNotification();
      } else {
        toast({
          title: "Доступ запрещен",
          description: "Пожалуйста, разрешите уведомления в настройках браузера",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Ошибка при запросе разрешений:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось настроить уведомления",
        variant: "destructive"
      });
    }
  };

  const subscribeToPush = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      
      // In a real application this would be VAPID key
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: null // Здесь должен быть ваш VAPID ключ
      });

      // Отправляем подписку на сервер
      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription)
      });

      setIsSubscribed(true);
      localStorage.setItem('push_subscribed', 'true');
    } catch (error) {
      console.error('Ошибка подписки на push:', error);
    }
  };

  const showTestNotification = () => {
    if (isEnabled) {
      new Notification('Добро пожаловать в ODE Ubud Bazaar!', {
        body: 'Уведомления успешно настроены. Вы будете получать важные обновления.',
        icon: '/favicon.png',
        badge: '/favicon.png',
        tag: 'welcome'
      });

      // Добавляем в локальный список
      const newNotification: PushNotification = {
        id: Date.now().toString(),
        title: 'Добро пожаловать!',
        body: 'Уведомления успешно настроены',
        type: 'achievement',
        timestamp: new Date(),
        read: false
      };

      setNotifications(prev => [newNotification, ...prev]);
      saveNotifications([newNotification, ...notifications]);
    }
  };

  const updatePreferences = (key: keyof NotificationPreferences, value: boolean) => {
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);
    localStorage.setItem('notification_preferences', JSON.stringify(newPreferences));
    
    toast({
      title: "Настройки сохранены",
      description: `Уведомления ${value ? 'включены' : 'отключены'}`
    });
  };

  const saveNotifications = (notifs: PushNotification[]) => {
    localStorage.setItem('push_notifications', JSON.stringify(notifs));
  };

  const markAsRead = (id: string) => {
    const updated = notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    setNotifications(updated);
    saveNotifications(updated);
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    localStorage.removeItem('push_notifications');
    toast({
      title: "Уведомления очищены",
      description: "Все уведомления удалены"
    });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'booking': return <Calendar className="h-4 w-4" />;
      case 'event': return <Calendar className="h-4 w-4" />;
      case 'quest': return <MessageSquare className="h-4 w-4" />;
      case 'achievement': return <Bell className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const sendBookingReminder = (bookingId: string, time: string) => {
    if (!isEnabled || !preferences.bookingReminders) return;

    const notification: PushNotification = {
      id: Date.now().toString(),
      title: 'Напоминание о бронировании',
      body: `Ваше бронирование сегодня в ${time}. Не забудьте прийти!`,
      type: 'booking',
      timestamp: new Date(),
      read: false
    };

    // In a real application this would be sent through service worker
    if (isEnabled) {
      new Notification(notification.title, {
        body: notification.body,
        icon: '/favicon.png',
        tag: `booking-${bookingId}`
      });
    }

    setNotifications(prev => [notification, ...prev]);
    saveNotifications([notification, ...notifications]);
  };

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            <CardTitle>Push-уведомления</CardTitle>
          </div>
          <Badge variant={isEnabled ? "default" : "secondary"}>
            {isEnabled ? "Включены" : "Отключены"}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {!isSupported && (
              <div className="p-4 border rounded-lg bg-muted">
                <p className="text-sm text-muted-foreground">
                  Ваш браузер не поддерживает push-уведомления
                </p>
              </div>
            )}

            {isSupported && !isEnabled && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Разрешите уведомления, чтобы получать важные обновления о ваших бронированиях и новых предложениях.
                </p>
                <Button onClick={requestPermission} className="w-full">
                  <Bell className="h-4 w-4 mr-2" />
                  Разрешить уведомления
                </Button>
              </div>
            )}

            {isEnabled && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Тестовое уведомление</span>
                  <Button variant="outline" size="sm" onClick={showTestNotification}>
                    Отправить тест
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Preferences Card */}
      {isEnabled && (
        <Card>
          <CardHeader>
            <CardTitle>Настройки уведомлений</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Напоминания о бронированиях</p>
                  <p className="text-sm text-muted-foreground">
                    Уведомления перед вашими визитами
                  </p>
                </div>
                <Switch
                  checked={preferences.bookingReminders}
                  onCheckedChange={(checked) => updatePreferences('bookingReminders', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Специальные предложения</p>
                  <p className="text-sm text-muted-foreground">
                    Акции и скидки
                  </p>
                </div>
                <Switch
                  checked={preferences.promotions}
                  onCheckedChange={(checked) => updatePreferences('promotions', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">События и мероприятия</p>
                  <p className="text-sm text-muted-foreground">
                    Новые события в ODE
                  </p>
                </div>
                <Switch
                  checked={preferences.events}
                  onCheckedChange={(checked) => updatePreferences('events', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Обновления квестов</p>
                  <p className="text-sm text-muted-foreground">
                    Новые задания в Taste Alley
                  </p>
                </div>
                <Switch
                  checked={preferences.questUpdates}
                  onCheckedChange={(checked) => updatePreferences('questUpdates', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Достижения</p>
                  <p className="text-sm text-muted-foreground">
                    Когда получаете награды
                  </p>
                </div>
                <Switch
                  checked={preferences.achievements}
                  onCheckedChange={(checked) => updatePreferences('achievements', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notifications History */}
      {notifications.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>История уведомлений</CardTitle>
            <Button variant="outline" size="sm" onClick={clearAllNotifications}>
              Очистить все
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {notifications.slice(0, 10).map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    notification.read ? 'bg-background' : 'bg-accent/50'
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{notification.title}</p>
                      <p className="text-sm text-muted-foreground">{notification.body}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {notification.timestamp.toLocaleString()}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};