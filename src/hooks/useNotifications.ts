import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "@/hooks/use-toast";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'booking' | 'payment' | 'system';
  read: boolean;
  created_at: string;
  data?: any;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [pushEnabled, setPushEnabled] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadNotifications();
      
      // Подписка на real-time уведомления
      const subscription = supabase
        .channel('user_notifications')
        .on('postgres_changes', 
            { event: 'INSERT', schema: 'public', table: 'user_notifications',
              filter: `user_id=eq.${user.id}` }, 
            handleNewNotification
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user]);

  const handleNewNotification = (payload: any) => {
    const newNotification: Notification = {
      id: payload.new.id,
      title: payload.new.title,
      message: payload.new.message,
      type: payload.new.type,
      read: false,
      created_at: payload.new.created_at,
      data: payload.new.data
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);
    
    toast({
      title: newNotification.title,
      description: newNotification.message
    });
    
    sendPushNotification(newNotification.title, newNotification.message);
  };

  const loadNotifications = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('user_notifications' as any)
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading notifications:', error);
      return;
    }

    const formattedNotifications: Notification[] = (data as any[]).map(item => ({
      id: item.id,
      title: item.title,
      message: item.message,
      type: item.type,
      read: item.read,
      created_at: item.created_at,
      data: item.data
    }));
    
    setNotifications(formattedNotifications);
    setUnreadCount(formattedNotifications.filter(n => !n.read).length);
  };

  const markAsRead = async (notificationId: string) => {
    if (user) {
      await supabase
        .from('user_notifications' as any)
        .update({ read: true })
        .eq('id', notificationId)
        .eq('user_id', user.id);
    }
    
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = async () => {
    if (user) {
      await supabase
        .from('user_notifications' as any)
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);
    }
    
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    const notification = notifications.find(n => n.id === notificationId);
    if (notification && !notification.read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const requestPushPermission = async () => {
    if (!('Notification' in window)) {
      toast({
        title: "Ошибка",
        description: "Ваш браузер не поддерживает push-уведомления",
        variant: "destructive"
      });
      return false;
    }

    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      setPushEnabled(true);
      toast({
        title: "Уведомления включены",
        description: "Теперь вы будете получать push-уведомления о ваших бронированиях"
      });
      return true;
    } else {
      setPushEnabled(false);
      toast({
        title: "Уведомления отклонены", 
        description: "Вы можете включить их позже в настройках браузера",
        variant: "destructive"
      });
      return false;
    }
  };

  const sendPushNotification = (title: string, body: string) => {
    if (pushEnabled && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/favicon.ico',
        badge: '/favicon.ico'
      });
    }
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'created_at' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      read: false
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);
    
    // Показать toast
    toast({
      title: newNotification.title,
      description: newNotification.message
    });
    
    // Отправить push-уведомление
    sendPushNotification(newNotification.title, newNotification.message);
  };

  return {
    notifications,
    unreadCount,
    pushEnabled,
    markAsRead,
    markAllAsRead, 
    deleteNotification,
    requestPushPermission,
    addNotification,
    loadNotifications
  };
};