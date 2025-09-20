import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useABTesting } from '@/hooks/useABTesting';
import { useLoyalty } from '@/hooks/useLoyalty';
import { useSocialFeatures } from '@/hooks/useSocialFeatures';
import { usePerformance } from '@/hooks/usePerformance';
import { trackEvent } from '@/components/analytics/GoogleAnalytics';
import { trackMetaEvent } from '@/components/analytics/MetaPixel';

export const SystemIntegration = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { trackPageView, track } = useAnalytics();
  const { getVariant, trackTestEvent } = useABTesting();
  const { loyaltyData } = useLoyalty();
  const { posts } = useSocialFeatures();
  const { performanceData } = usePerformance();

  // Интеграция отслеживания страниц - оптимизированная версия
  useEffect(() => {
    // Дебаунс для предотвращения избыточных событий
    const timeoutId = setTimeout(() => {
      const pageName = getPageName(location.pathname);

      // Отслеживание во всех системах аналитики - только основные события
      trackPageView(pageName);

      // A/B тест отслеживание
      trackTestEvent('page_view', 'view', {
        page: location.pathname,
        user_segment: getUserSegment(user, loyaltyData),
      });
    }, 500); // 500ms дебаунс

    return () => clearTimeout(timeoutId);
  }, [location.pathname]);

  // Интеграция пользовательских действий
  useEffect(() => {
    const handleUserAction = (action: string, data?: any) => {
      // Централизованное отслеживание действий
      track(action, {
        ...data,
        timestamp: Date.now(),
        user_id: user?.id,
        page: location.pathname,
      });

      // Специфичные интеграции для разных действий
      if (action.includes('booking')) {
        trackMetaEvent('InitiateCheckout', {
          content_ids: [data?.experience_type],
          content_type: 'experience',
          value: data?.price || 0,
          currency: 'USD',
        });
      }

      if (action.includes('social_share')) {
        trackEvent('share', {
          method: data?.platform,
          content_type: data?.content_type,
          item_id: data?.content_id,
        });
      }
    };

    // Добавляем глобальный слушатель событий
    window.addEventListener('userAction', handleUserAction as any);

    return () => {
      window.removeEventListener('userAction', handleUserAction as any);
    };
  }, [user?.id, location.pathname, track]);

  // Геймификация отключена до создания необходимых таблиц

  // Интеграция лояльности с персонализацией
  useEffect(() => {
    if (loyaltyData && user) {
      // Персонализация на основе уровня лояльности
      document.body.setAttribute('data-loyalty-tier', loyaltyData.tier);

      // Специальные A/B тесты для VIP пользователей
      if (loyaltyData.tier === 'gold' || loyaltyData.tier === 'platinum') {
        trackTestEvent('vip_experience', 'view', {
          tier: loyaltyData.tier,
          points: loyaltyData.points,
        });
      }
    }
  }, [loyaltyData?.tier, loyaltyData?.points, user?.id, trackTestEvent]);

  return null;
};

// Вспомогательные функции
const getPageName = (pathname: string): string => {
  const pageMap: Record<string, string> = {
    '/': 'Home',
    '/chefs-table': 'ChefTable',
    '/taste-compass': 'TasteCompass',
    '/wine-staircase': 'WineStaircase',
    '/events': 'Events',
    '/lounge': 'VIPLounge',
    '/community': 'Community',
    '/photos': 'Gallery',
  };
  return pageMap[pathname] || 'Unknown';
};

const getPageCategory = (pathname: string): string => {
  if (
    pathname.includes('chef') ||
    pathname.includes('wine') ||
    pathname.includes('taste')
  ) {
    return 'experience';
  }
  if (pathname.includes('event')) return 'events';
  if (pathname.includes('community') || pathname.includes('social'))
    return 'social';
  return 'general';
};

const getUserSegment = (user: any, loyalty: any): string => {
  if (!user) return 'guest';
  if (loyalty?.tier === 'platinum') return 'vip';
  if (loyalty?.tier === 'gold') return 'premium';
  if (loyalty?.visits && loyalty.visits > 5) return 'regular';
  return 'new_user';
};

// Глобальная функция для отслеживания действий пользователя
declare global {
  interface Window {
    triggerUserAction: (action: string, data?: any) => void;
  }
}

// Экспортируем функцию для использования в других компонентах
export const triggerUserAction = (action: string, data?: any) => {
  const event = new CustomEvent('userAction', {
    detail: { action, data },
  });
  window.dispatchEvent(event);
};
