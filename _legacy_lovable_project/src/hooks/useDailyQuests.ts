import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';

export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  quest_type:
    | 'visit_sector'
    | 'spend_time'
    | 'complete_mini_game'
    | 'share_achievement'
    | 'invite_friend';
  target_value: number;
  reward_points: number;
  reward_description: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

export interface UserQuestProgress {
  id: string;
  quest_id: string;
  current_progress: number;
  completed: boolean;
  completed_at: string | null;
}

export const useDailyQuests = () => {
  const [quests, setQuests] = useState<DailyQuest[]>([]);
  const [userProgress, setUserProgress] = useState<UserQuestProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadQuests();
      loadUserProgress();
    }
  }, [user]);

  const loadQuests = async () => {
    try {
      const { data, error } = await supabase
        .from('daily_quests')
        .select('*')
        .eq('is_active', true)
        .eq('quest_date', new Date().toISOString().split('T')[0]);

      if (error) {
        console.error('Error loading quests:', error);
        return;
      }

      if (data && Array.isArray(data)) {
        setQuests(data as unknown as DailyQuest[]);
      }
    } catch (err) {
      console.error('Error in loadQuests:', err);
    }
  };

  const loadUserProgress = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_daily_quest_progress')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error loading user progress:', error);
        return;
      }

      if (data && Array.isArray(data)) {
        setUserProgress(data as unknown as UserQuestProgress[]);
      }
    } catch (err) {
      console.error('Error in loadUserProgress:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuestProgress = async (
    questId: string,
    increment: number = 1
  ) => {
    if (!user) return;

    const quest = quests.find((q) => q.id === questId);
    if (!quest) return;

    const existingProgress = userProgress.find((p) => p.quest_id === questId);
    const newProgress = (existingProgress?.current_progress || 0) + increment;
    const isCompleted = newProgress >= quest.target_value;

    try {
      if (existingProgress) {
        const { error } = await supabase
          .from('user_daily_quest_progress')
          .update({
            current_progress: newProgress,
            completed: isCompleted,
            completed_at: isCompleted ? new Date().toISOString() : null,
          })
          .eq('id', existingProgress.id);

        if (error) {
          console.error('Error updating quest progress:', error);
          return;
        }
      } else {
        const { error } = await supabase
          .from('user_daily_quest_progress')
          .insert({
            user_id: user.id,
            quest_id: questId,
            current_progress: newProgress,
            completed: isCompleted,
            completed_at: isCompleted ? new Date().toISOString() : null,
          });

        if (error) {
          console.error('Error creating quest progress:', error);
          return;
        }
      }

      if (isCompleted && !existingProgress?.completed) {
        toast({
          title: 'Квест завершен!',
          description: `+${quest.reward_points} очков за "${quest.title}"`,
        });
      }

      loadUserProgress();
    } catch (err) {
      console.error('Error in updateQuestProgress:', err);
    }
  };

  const getQuestProgress = (questId: string) => {
    return userProgress.find((p) => p.quest_id === questId);
  };

  return {
    quests,
    userProgress,
    loading,
    updateQuestProgress,
    getQuestProgress,
    refreshQuests: loadQuests,
    refreshProgress: loadUserProgress,
  };
};
