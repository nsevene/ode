import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLoyalty } from '@/hooks/useLoyalty';
import { useSocialFeatures } from '@/hooks/useSocialFeatures';
import { useNotifications } from '@/hooks/useNotifications';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Badge, Trophy, Star, Gift, Users } from 'lucide-react';

interface CrossSystemEvent {
  type:
    | 'loyalty_upgrade'
    | 'achievement_unlocked'
    | 'social_milestone'
    | 'special_offer'
    | 'quest_completed';
  title: string;
  message: string;
  data?: any;
  priority: 'low' | 'medium' | 'high';
}

export const CrossSystemNotifications = () => {
  const { user } = useAuth();
  const { loyaltyData } = useLoyalty();
  const { posts } = useSocialFeatures();
  const { notifications, markAsRead } = useNotifications();
  const { toast } = useToast();
  const [processedEvents, setProcessedEvents] = useState<Set<string>>(
    new Set()
  );

  // Отслеживание повышения уровня лояльности
  useEffect(() => {
    if (loyaltyData && user) {
      const eventKey = `loyalty_${loyaltyData.tier}_${loyaltyData.points}`;

      if (!processedEvents.has(eventKey) && loyaltyData.tier !== 'bronze') {
        const event: CrossSystemEvent = {
          type: 'loyalty_upgrade',
          title: '🎉 Новый уровень лояльности!',
          message: `Поздравляем! Вы достигли уровня ${getTierName(loyaltyData.tier)}`,
          data: { tier: loyaltyData.tier, points: loyaltyData.points },
          priority: 'high',
        };

        handleCrossSystemEvent(event);
        setProcessedEvents((prev) => new Set([...prev, eventKey]));
      }
    }
  }, [loyaltyData, user, processedEvents]);

  // Отслеживание социальных достижений
  useEffect(() => {
    if (posts && user && posts.length > 0) {
      const eventKey = `social_posts_${posts.length}`;

      if (!processedEvents.has(eventKey) && posts.length >= 5) {
        const event: CrossSystemEvent = {
          type: 'social_milestone',
          title: '⭐ Социальное достижение!',
          message: `Вы создали ${posts.length} постов в сообществе!`,
          data: { posts_count: posts.length },
          priority: 'medium',
        };

        handleCrossSystemEvent(event);
        setProcessedEvents((prev) => new Set([...prev, eventKey]));
      }
    }
  }, [posts, user, processedEvents]);

  // Комбинированные события (лояльность + социальные функции)
  useEffect(() => {
    if (loyaltyData && posts && user) {
      // VIP + Социальный активист = Специальное предложение
      if (loyaltyData.tier === 'platinum' && posts.length >= 5) {
        const eventKey = `vip_social_leader`;

        if (!processedEvents.has(eventKey)) {
          const event: CrossSystemEvent = {
            type: 'special_offer',
            title: '👑 Эксклюзивное предложение!',
            message:
              "Как VIP-гость и активный участник сообщества, вы получили доступ к приватному Chef's Table!",
            data: {
              offer_type: 'private_chefs_table',
              valid_until: new Date(
                Date.now() + 7 * 24 * 60 * 60 * 1000
              ).toISOString(),
            },
            priority: 'high',
          };

          handleCrossSystemEvent(event);
          setProcessedEvents((prev) => new Set([...prev, eventKey]));
        }
      }

      // Много посещений + активность в соцсетях = Reward
      if (loyaltyData.visits >= 10 && posts.length >= 5) {
        const eventKey = `frequent_social_visitor`;

        if (!processedEvents.has(eventKey)) {
          const event: CrossSystemEvent = {
            type: 'achievement_unlocked',
            title: '🏆 Достижение разблокировано!',
            message: 'Вы получили статус "Амбассадор ODE" за активность!',
            data: {
              achievement: 'ode_ambassador',
              rewards: ['free_wine_tasting', 'priority_booking'],
            },
            priority: 'medium',
          };

          handleCrossSystemEvent(event);
          setProcessedEvents((prev) => new Set([...prev, eventKey]));
        }
      }
    }
  }, [loyaltyData, posts, user, processedEvents]);

  // Realtime уведомления из базы данных
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('cross-system-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'user_notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const notification = payload.new;
          if (notification.type === 'cross_system') {
            handleRealtimeNotification(notification);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleCrossSystemEvent = async (event: CrossSystemEvent) => {
    // Показываем toast уведомление
    const icon = getEventIcon(event.type);

    toast({
      title: event.title,
      description: event.message,
      duration: event.priority === 'high' ? 8000 : 5000,
    });

    // Сохраняем в базу данных для истории
    if (user) {
      try {
        await supabase.from('user_notifications').insert({
          user_id: user.id,
          type: 'cross_system',
          title: event.title,
          message: event.message,
          data: event.data,
        });
      } catch (error) {
        console.error('Error saving cross-system notification:', error);
      }
    }

    // Запускаем дополнительные действия
    triggerEventActions(event);
  };

  const handleRealtimeNotification = (notification: any) => {
    const icon = getEventIcon(
      notification.data?.type || 'achievement_unlocked'
    );

    toast({
      title: notification.title,
      description: notification.message,
      duration: 6000,
    });
  };

  const triggerEventActions = (event: CrossSystemEvent) => {
    // Обновляем состояние других систем на основе события
    switch (event.type) {
      case 'loyalty_upgrade':
        // Может разблокировать новые социальные функции
        window.dispatchEvent(
          new CustomEvent('loyaltyUpgrade', {
            detail: event.data,
          })
        );
        break;

      case 'social_milestone':
        // Может давать бонусные очки лояльности
        window.dispatchEvent(
          new CustomEvent('socialMilestone', {
            detail: event.data,
          })
        );
        break;

      case 'special_offer':
        // Может активировать специальные A/B тесты
        window.dispatchEvent(
          new CustomEvent('specialOffer', {
            detail: event.data,
          })
        );
        break;
    }
  };

  return null;
};

const getEventIcon = (type: string) => {
  switch (type) {
    case 'loyalty_upgrade':
      return Trophy;
    case 'achievement_unlocked':
      return Badge;
    case 'social_milestone':
      return Users;
    case 'special_offer':
      return Gift;
    case 'quest_completed':
      return Star;
    default:
      return Badge;
  }
};

const getTierName = (tier: string): string => {
  const names: Record<string, string> = {
    bronze: 'Бронзовый',
    silver: 'Серебряный',
    gold: 'Золотой',
    platinum: 'Платиновый',
  };
  return names[tier] || tier;
};
