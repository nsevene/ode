import { useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface SyncEvent {
  table: string;
  operation: 'INSERT' | 'UPDATE' | 'DELETE';
  record: any;
  timestamp: number;
}

export const DataSynchronization = () => {
  const { user } = useAuth();
  const syncQueueRef = useRef<SyncEvent[]>([]);
  const isProcessingRef = useRef(false);

  // Синхронизация между таблицами при изменениях
  useEffect(() => {
    if (!user) return;

    // Настройка слушателей для ключевых таблиц
    const channels = [
      // Бронирования -> Лояльность
      setupSyncChannel('bookings', handleBookingSync),
      // Прогресс Taste Compass -> Достижения
      setupSyncChannel('taste_compass_progress', handleTasteCompassSync),
      // Результаты мини-игр -> Лидерборд
      setupSyncChannel('user_mini_game_results', handleMiniGameSync),
      // Лояльность -> Уведомления
      setupSyncChannel('loyalty_programs', handleLoyaltySync),
    ];

    return () => {
      channels.forEach((channel) => supabase.removeChannel(channel));
    };
  }, [user]);

  // Периодическая синхронизация данных
  useEffect(() => {
    const syncInterval = setInterval(() => {
      processSyncQueue();
      performPeriodicSync();
    }, 30000); // Каждые 30 секунд

    return () => clearInterval(syncInterval);
  }, []);

  const setupSyncChannel = (
    tableName: string,
    handler: (payload: any) => void
  ) => {
    return supabase
      .channel(`sync-${tableName}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: tableName,
          filter: user ? `user_id=eq.${user.id}` : undefined,
        },
        handler
      )
      .subscribe();
  };

  const handleBookingSync = async (payload: any) => {
    const { eventType, new: newRecord, old: oldRecord } = payload;

    if (eventType === 'INSERT' && newRecord.payment_status === 'completed') {
      // Новое бронирование -> обновляем лояльность
      addToSyncQueue({
        table: 'loyalty_programs',
        operation: 'UPDATE',
        record: {
          user_id: newRecord.user_id,
          visits: 'increment',
          total_spent: newRecord.payment_amount,
          points: Math.floor(newRecord.payment_amount * 0.1), // 10% в поинтах
        },
        timestamp: Date.now(),
      });

      // Проверяем достижения
      checkBookingAchievements(newRecord);
    }
  };

  const handleTasteCompassSync = async (payload: any) => {
    const { eventType, new: newRecord } = payload;

    if (eventType === 'UPDATE' && newRecord.completed) {
      // Завершен сектор Taste Compass -> обновляем прогресс
      addToSyncQueue({
        table: 'taste_alley_progress',
        operation: 'UPDATE',
        record: {
          user_id: newRecord.user_id,
          completed_sectors: 'increment',
          total_score: 50, // Базовые очки за сектор
        },
        timestamp: Date.now(),
      });

      // Проверяем полное завершение
      await checkTasteCompassCompletion(newRecord.user_id);
    }
  };

  const handleMiniGameSync = async (payload: any) => {
    const { eventType, new: newRecord } = payload;

    if (eventType === 'INSERT') {
      // Новый результат мини-игры -> обновляем лидерборд
      addToSyncQueue({
        table: 'taste_alley_leaderboard',
        operation: 'UPDATE',
        record: {
          user_id: newRecord.user_id,
          total_score: newRecord.points_earned,
          achievements_count: 'increment',
        },
        timestamp: Date.now(),
      });
    }
  };

  const handleLoyaltySync = async (payload: any) => {
    const { eventType, new: newRecord, old: oldRecord } = payload;

    if (
      eventType === 'UPDATE' &&
      oldRecord &&
      newRecord.tier !== oldRecord.tier
    ) {
      // Изменился уровень лояльности -> создаем уведомление
      addToSyncQueue({
        table: 'user_notifications',
        operation: 'INSERT',
        record: {
          user_id: newRecord.user_id,
          type: 'loyalty_upgrade',
          title: `Новый уровень лояльности: ${newRecord.tier}!`,
          message: `Поздравляем с достижением уровня ${newRecord.tier}!`,
          data: { old_tier: oldRecord.tier, new_tier: newRecord.tier },
        },
        timestamp: Date.now(),
      });
    }
  };

  const addToSyncQueue = (event: SyncEvent) => {
    syncQueueRef.current.push(event);
  };

  const processSyncQueue = async () => {
    if (isProcessingRef.current || syncQueueRef.current.length === 0) return;

    isProcessingRef.current = true;
    const queue = [...syncQueueRef.current];
    syncQueueRef.current = [];

    try {
      // Группируем события по таблицам для батчевой обработки
      const groupedEvents = queue.reduce(
        (groups, event) => {
          if (!groups[event.table]) groups[event.table] = [];
          groups[event.table].push(event);
          return groups;
        },
        {} as Record<string, SyncEvent[]>
      );

      // Обрабатываем каждую таблицу
      for (const [table, events] of Object.entries(groupedEvents)) {
        await processBatchSync(table, events);
      }
    } catch (error) {
      console.error('Error processing sync queue:', error);
      // Возвращаем события в очередь при ошибке
      syncQueueRef.current.unshift(...queue);
    } finally {
      isProcessingRef.current = false;
    }
  };

  const processBatchSync = async (table: string, events: SyncEvent[]) => {
    for (const event of events) {
      try {
        switch (event.operation) {
          case 'INSERT':
            if (table === 'user_notifications') {
              const { user_id, ...data } = event.record;
              await supabase.from('user_notifications').insert({
                user_id,
                ...data,
              });
            } else {
              await supabase.from(table as any).insert(event.record);
            }
            break;

          case 'UPDATE':
            const updateData = { ...event.record };
            const userId = updateData.user_id;
            delete updateData.user_id;

            // Простое обновление без increment
            if (Object.keys(updateData).length > 0) {
              await supabase
                .from(table as any)
                .update(updateData)
                .eq('user_id', userId);
            }
            break;
        }
      } catch (error) {
        console.error(`Error syncing ${table}:`, error);
      }
    }
  };

  const checkBookingAchievements = async (booking: any) => {
    if (!booking.user_id) return;

    // Получаем количество бронирований пользователя
    const { count } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', booking.user_id)
      .eq('payment_status', 'completed');

    // Достижения за количество бронирований
    const achievements = [
      { count: 1, id: 'first_booking', title: 'Первое бронирование' },
      { count: 5, id: 'regular_guest', title: 'Постоянный гость' },
      { count: 10, id: 'vip_guest', title: 'VIP гость' },
    ];

    const achievement = achievements.find((a) => a.count === count);
    if (achievement) {
      await supabase.from('taste_alley_achievements').insert({
        user_id: booking.user_id,
        achievement_id: achievement.id,
        achievement_title: achievement.title,
        achievement_description: `Совершено ${achievement.count} бронирований`,
        achievement_type: 'booking',
        reward_points: achievement.count * 10,
      });
    }
  };

  const checkTasteCompassCompletion = async (userId: string) => {
    // Проверяем все ли сектора пройдены
    const { count } = await supabase
      .from('taste_compass_progress')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('completed', true);

    if (count && count >= 6) {
      // Все 6 секторов
      // Награждаем за полное прохождение
      await supabase.from('taste_alley_achievements').insert({
        user_id: userId,
        achievement_id: 'taste_compass_master',
        achievement_title: 'Мастер Taste Compass',
        achievement_description: 'Пройдены все секторы Taste Compass',
        achievement_type: 'completion',
        reward_points: 500,
      });

      // Даем доступ к Chef's Table
      await supabase.from('user_notifications').insert({
        user_id: userId,
        type: 'special_offer',
        title: "Разблокирован Chef's Table!",
        message:
          "За прохождение всех секторов Taste Compass вы получили доступ к эксклюзивному Chef's Table!",
        data: {
          offer: 'free_chefs_table',
          expires: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
          ).toISOString(),
        },
      });
    }
  };

  const performPeriodicSync = async () => {
    if (!user) return;

    try {
      // Простая периодическая синхронизация без RPC
      console.log('Performing periodic data sync...');

      // Можно добавить простые операции синхронизации
      // например, очистку старых уведомлений
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      await supabase
        .from('user_notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .lt('created_at', thirtyDaysAgo.toISOString());
    } catch (error) {
      console.error('Error in periodic sync:', error);
    }
  };

  return null;
};
