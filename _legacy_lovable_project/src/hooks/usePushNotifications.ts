import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PushNotificationHook {
  isSupported: boolean;
  permission: NotificationPermission;
  subscription: PushSubscription | null;
  requestPermission: () => Promise<boolean>;
  subscribe: () => Promise<boolean>;
  unsubscribe: () => Promise<boolean>;
  sendNotification: (title: string, options?: NotificationOptions) => void;
}

export const usePushNotifications = (): PushNotificationHook => {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] =
    useState<NotificationPermission>('default');
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  );
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Check if push notifications are supported
    if (
      'Notification' in window &&
      'serviceWorker' in navigator &&
      'PushManager' in window
    ) {
      setIsSupported(true);
      setPermission(Notification.permission);
    }
  }, []);

  useEffect(() => {
    // Get existing subscription
    if (isSupported && 'serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.pushManager.getSubscription().then((sub) => {
          setSubscription(sub);
        });
      });
    }
  }, [isSupported]);

  const requestPermission = async (): Promise<boolean> => {
    if (!isSupported) return false;

    try {
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result === 'granted') {
        toast({
          title: 'Уведомления включены',
          description: 'Вы будете получать уведомления о важных событиях.',
        });
        return true;
      } else {
        toast({
          title: 'Уведомления отключены',
          description: 'Вы можете включить их в настройках браузера.',
          variant: 'destructive',
        });
        return false;
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
      return false;
    }
  };

  const subscribe = async (): Promise<boolean> => {
    if (!isSupported || permission !== 'granted') return false;

    try {
      const registration = await navigator.serviceWorker.ready;

      // VAPID public key (should be stored in environment variables in production)
      const vapidKey =
        'BEl62iUYgUivxIkv69yViEuiBIa40HI8YMfHkgNkN2Pf8B8XItJlOHY7AhMCRPLm_QeHdbtVm7nYz3ljEL7c-B0';

      const pushSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidKey,
      });

      setSubscription(pushSubscription);

      // Save subscription to local storage for now
      if (user) {
        localStorage.setItem(
          'push_subscription',
          JSON.stringify({
            user_id: user.id,
            subscription: pushSubscription,
            endpoint: pushSubscription.endpoint,
          })
        );
      }

      toast({
        title: 'Подписка оформлена',
        description: 'Вы будете получать push-уведомления.',
      });

      return true;
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
      toast({
        title: 'Ошибка подписки',
        description: 'Не удалось оформить подписку на уведомления.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const unsubscribe = async (): Promise<boolean> => {
    if (!subscription) return false;

    try {
      await subscription.unsubscribe();
      setSubscription(null);

      // Remove subscription from local storage
      if (user) {
        localStorage.removeItem('push_subscription');
      }

      toast({
        title: 'Подписка отменена',
        description: 'Вы больше не будете получать push-уведомления.',
      });

      return true;
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error);
      return false;
    }
  };

  const sendNotification = (
    title: string,
    options: NotificationOptions = {}
  ) => {
    if (!isSupported || permission !== 'granted') return;

    new Notification(title, {
      icon: '/ode-logo.png',
      badge: '/ode-logo.png',
      ...options,
    });
  };

  return {
    isSupported,
    permission,
    subscription,
    requestPermission,
    subscribe,
    unsubscribe,
    sendNotification,
  };
};
