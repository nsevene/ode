
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface TasteAlleyProgress {
  id: string;
  current_sector: number;
  completed_sectors: number;
  total_score: number;
  user_level: number;
  streak_count: number;
  fastest_time: number | null;
  total_quest_time: number;
  quests_completed: number;
  achievements_count: number;
  current_multiplier: number;
  last_activity_date: string | null;
}

interface TasteAlleyAchievement {
  id: string;
  achievement_id: string;
  achievement_title: string;
  achievement_description: string;
  achievement_type: string;
  reward_points: number;
  unlocked_at: string;
}

interface LeaderboardEntry {
  id: string;
  user_id: string;
  display_name: string;
  total_score: number;
  user_level: number;
  completed_sectors: number;
  fastest_time: number | null;
  achievements_count: number;
  current_rank: number;
}

export const useTasteAlleyData = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [progress, setProgress] = useState<TasteAlleyProgress | null>(null);
  const [achievements, setAchievements] = useState<TasteAlleyAchievement[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user progress
  const fetchProgress = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('taste_alley_progress')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching progress:', error);
        setError('Failed to fetch progress');
        return;
      }

      if (data) {
        setProgress(data);
      } else {
        // Create initial progress record using upsert
        const { data: newProgress, error: insertError } = await supabase
          .from('taste_alley_progress')
          .upsert({
            user_id: user.id,
            current_sector: 0,
            completed_sectors: 0,
            total_score: 0,
            user_level: 1,
            streak_count: 0,
            total_quest_time: 0,
            quests_completed: 0,
            achievements_count: 0,
            current_multiplier: 1.00
          })
          .select()
          .single();

        if (insertError) {
          console.error('Error creating progress:', insertError);
          setError('Failed to create progress');
          return;
        }

        setProgress(newProgress);
      }
    } catch (err) {
      console.error('Error in fetchProgress:', err);
      setError('Failed to fetch progress');
    }
  };

  // Fetch user achievements
  const fetchAchievements = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('taste_alley_achievements')
        .select('*')
        .eq('user_id', user.id)
        .order('unlocked_at', { ascending: false });

      if (error) {
        console.error('Error fetching achievements:', error);
        return;
      }

      setAchievements(data || []);
    } catch (err) {
      console.error('Error in fetchAchievements:', err);
    }
  };

  // Fetch leaderboard
  const fetchLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from('taste_alley_leaderboard')
        .select('*')
        .order('current_rank', { ascending: true })
        .limit(50);

      if (error) {
        console.error('Error fetching leaderboard:', error);
        return;
      }

      setLeaderboard(data || []);
    } catch (err) {
      console.error('Error in fetchLeaderboard:', err);
    }
  };

  // Update progress
  const updateProgress = async (updates: Partial<TasteAlleyProgress>) => {
    if (!user || !progress) return;

    try {
      const { data, error } = await supabase
        .from('taste_alley_progress')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating progress:', error);
        toast({
          title: 'Error',
          description: 'Failed to update progress',
          variant: 'destructive'
        });
        return;
      }

      setProgress(data);
      
      // Refresh leaderboard after progress update
      fetchLeaderboard();
      
      toast({
        title: 'Progress Updated!',
        description: 'Your quest progress has been saved',
      });
    } catch (err) {
      console.error('Error in updateProgress:', err);
      toast({
        title: 'Error',
        description: 'Failed to update progress',
        variant: 'destructive'
      });
    }
  };

  // Complete sector
  const completeSector = async (sectorIndex: number) => {
    if (!progress || !user) return;

    const newCompletedSectors = Math.max(progress.completed_sectors, sectorIndex + 1);
    const newCurrentSector = Math.min(sectorIndex + 1, 3); // Assuming 4 sectors (0-3)
    const newScore = progress.total_score + 100; // 100 points per sector
    const newLevel = Math.floor(newScore / 500) + 1; // Level up every 500 points

    await updateProgress({
      current_sector: newCurrentSector,
      completed_sectors: newCompletedSectors,
      total_score: newScore,
      user_level: newLevel,
      last_activity_date: new Date().toISOString()
    });

    // Check for achievements
    await checkAchievements(newCompletedSectors, newScore, newLevel);
  };

  // Check and award achievements
  const checkAchievements = async (completedSectors: number, score: number, level: number) => {
    if (!user) return;

    const achievementsToCheck = [
      {
        id: 'first_taste',
        title: 'First Taste',
        description: 'Complete your first sector',
        type: 'common',
        points: 50,
        condition: completedSectors >= 1
      },
      {
        id: 'taste_explorer',
        title: 'Taste Explorer',
        description: 'Complete 2 sectors',
        type: 'common',
        points: 100,
        condition: completedSectors >= 2
      },
      {
        id: 'flavor_master',
        title: 'Flavor Master',
        description: 'Complete all 4 sectors',
        type: 'epic',
        points: 300,
        condition: completedSectors >= 4
      },
      {
        id: 'high_scorer',
        title: 'High Scorer',
        description: 'Reach 1000 points',
        type: 'rare',
        points: 150,
        condition: score >= 1000
      },
      {
        id: 'level_master',
        title: 'Level Master',
        description: 'Reach level 5',
        type: 'rare',
        points: 200,
        condition: level >= 5
      }
    ];

    for (const achievement of achievementsToCheck) {
      if (achievement.condition) {
        try {
          const { error } = await supabase.rpc('award_taste_alley_achievement', {
            p_user_id: user.id,
            p_achievement_id: achievement.id,
            p_title: achievement.title,
            p_description: achievement.description,
            p_type: achievement.type,
            p_reward_points: achievement.points
          });

          if (error) {
            console.error('Error awarding achievement:', error);
          } else {
            toast({
              title: 'Achievement Unlocked!',
              description: `${achievement.title} - ${achievement.description}`,
            });
          }
        } catch (err) {
          console.error('Error in checkAchievements:', err);
        }
      }
    }

    // Refresh achievements
    fetchAchievements();
  };

  // Start quest session
  const startQuestSession = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('taste_alley_sessions')
        .insert([{
          user_id: user.id,
          sectors_completed: 0,
          session_duration: 0,
          score_earned: 0
        }]);

      if (error) {
        console.error('Error starting session:', error);
      }
    } catch (err) {
      console.error('Error in startQuestSession:', err);
    }
  };

  // End quest session
  const endQuestSession = async (sectorsCompleted: number, duration: number, scoreEarned: number) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('taste_alley_sessions')
        .update({
          sectors_completed: sectorsCompleted,
          session_duration: duration,
          score_earned: scoreEarned,
          completed_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .eq('completed_at', null);

      if (error) {
        console.error('Error ending session:', error);
      }
    } catch (err) {
      console.error('Error in endQuestSession:', err);
    }
  };

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      await Promise.all([
        fetchProgress(),
        fetchAchievements(),
        fetchLeaderboard()
      ]);

      setLoading(false);
    };

    initializeData();
  }, [user]);

  return {
    progress,
    achievements,
    leaderboard,
    loading,
    error,
    updateProgress,
    completeSector,
    startQuestSession,
    endQuestSession,
    refreshData: () => {
      fetchProgress();
      fetchAchievements();
      fetchLeaderboard();
    }
  };
};
