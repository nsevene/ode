
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { Bell, Trophy, Star, Gift } from 'lucide-react';

interface RealtimeNotification {
  id: string;
  type: 'achievement' | 'reward' | 'level_up' | 'leaderboard';
  title: string;
  message: string;
  data?: any;
  timestamp: string;
}

const RealtimeNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<RealtimeNotification[]>([]);

  useEffect(() => {
    if (!user) return;

    // Listen to real-time notifications
    const channel = supabase
      .channel('user-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'user_notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          const notification = payload.new as any;
          handleNewNotification(notification);
        }
      )
      .subscribe();

    // Listen to achievements
    const achievementChannel = supabase
      .channel('taste-alley-achievements')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'taste_alley_achievements',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          const achievement = payload.new as any;
          handleAchievementUnlock(achievement);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(achievementChannel);
    };
  }, [user]);

  const handleNewNotification = (notification: any) => {
    const newNotification: RealtimeNotification = {
      id: notification.id,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      data: notification.data,
      timestamp: notification.created_at
    };

    setNotifications(prev => [newNotification, ...prev.slice(0, 4)]);
    showToastNotification(newNotification);
  };

  const handleAchievementUnlock = (achievement: any) => {
    const notification: RealtimeNotification = {
      id: achievement.id,
      type: 'achievement',
      title: 'Achievement Unlocked!',
      message: `${achievement.achievement_title} - ${achievement.achievement_description}`,
      data: achievement,
      timestamp: achievement.unlocked_at
    };

    setNotifications(prev => [notification, ...prev.slice(0, 4)]);
    showToastNotification(notification);
  };

  const showToastNotification = (notification: RealtimeNotification) => {
    const getIcon = () => {
      switch (notification.type) {
        case 'achievement': return <Trophy className="h-4 w-4" />;
        case 'reward': return <Gift className="h-4 w-4" />;
        case 'level_up': return <Star className="h-4 w-4" />;
        default: return <Bell className="h-4 w-4" />;
      }
    };

    toast({
      title: notification.title,
      description: (
        <div className="flex items-center gap-2">
          {getIcon()}
          {notification.message}
        </div>
      ),
      duration: 5000,
    });
  };

  return (
    <div className="fixed top-4 right-4 z-50 pointer-events-none">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="mb-2 p-3 bg-white rounded-lg shadow-lg border border-emerald-200 animate-slide-in-right pointer-events-auto max-w-sm"
        >
          <div className="flex items-start gap-2">
            <div className="flex-shrink-0 mt-1">
              {notification.type === 'achievement' && <Trophy className="h-4 w-4 text-gold-accent" />}
              {notification.type === 'reward' && <Gift className="h-4 w-4 text-emerald-600" />}
              {notification.type === 'level_up' && <Star className="h-4 w-4 text-purple-600" />}
              {notification.type === 'leaderboard' && <Bell className="h-4 w-4 text-blue-600" />}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-sm text-foreground">{notification.title}</h4>
              <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RealtimeNotifications;
