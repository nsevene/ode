import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';

export interface MiniGame {
  id: string;
  name: string;
  description: string;
  sector_id: string;
  game_type: 'memory' | 'quiz' | 'timing' | 'puzzle';
  difficulty: 'easy' | 'medium' | 'hard';
  base_points: number;
  time_limit: number | null;
  is_active: boolean;
}

export interface GameResult {
  id: string;
  score: number;
  time_taken: number | null;
  points_earned: number;
  completed_at: string;
}

export const useMiniGames = () => {
  const [games, setGames] = useState<MiniGame[]>([]);
  const [userResults, setUserResults] = useState<GameResult[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadGames();
    if (user) {
      loadUserResults();
    }
  }, [user]);

  const loadGames = async () => {
    try {
      const { data, error } = await supabase
        .from('mini_games' as any)
        .select('*')
        .eq('is_active', true);

      if (error) {
        console.error('Error loading mini games:', error);
        return;
      }

      if (data && Array.isArray(data)) {
        setGames(data as unknown as MiniGame[]);
      }
    } catch (err) {
      console.error('Error in loadGames:', err);
    }
  };

  const loadUserResults = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_mini_game_results' as any)
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false });

      if (error) {
        console.error('Error loading user results:', error);
        return;
      }

      if (data && Array.isArray(data)) {
        setUserResults(data as unknown as GameResult[]);
      }
    } catch (err) {
      console.error('Error in loadUserResults:', err);
    } finally {
      setLoading(false);
    }
  };

  const submitGameResult = async (
    gameId: string,
    score: number,
    timeTaken?: number
  ) => {
    if (!user) return;

    const game = games.find((g) => g.id === gameId);
    if (!game) return;

    // Рассчитываем очки на основе сложности и времени
    let pointsEarned = game.base_points;
    if (game.difficulty === 'medium') pointsEarned *= 1.5;
    if (game.difficulty === 'hard') pointsEarned *= 2;

    // Бонус за быстрое время
    if (timeTaken && game.time_limit) {
      const timeBonus = Math.max(
        0,
        ((game.time_limit - timeTaken) / game.time_limit) * 0.5
      );
      pointsEarned *= 1 + timeBonus;
    }

    pointsEarned = Math.floor(pointsEarned);

    try {
      const { error } = await supabase
        .from('user_mini_game_results' as any)
        .insert({
          user_id: user.id,
          game_id: gameId,
          score,
          time_taken: timeTaken || null,
          points_earned: pointsEarned,
        });

      if (error) {
        console.error('Error submitting game result:', error);
        return;
      }

      toast({
        title: 'Игра завершена!',
        description: `Результат: ${score}. Получено ${pointsEarned} очков!`,
      });

      loadUserResults();
      return pointsEarned;
    } catch (err) {
      console.error('Error in submitGameResult:', err);
    }
  };

  const getGamesBySection = (sectorId: string) => {
    return games.filter((g) => g.sector_id === sectorId);
  };

  const getBestResult = (gameId: string) => {
    const results = userResults.filter((r) => r.id === gameId);
    return results.length > 0 ? Math.max(...results.map((r) => r.score)) : 0;
  };

  return {
    games,
    userResults,
    loading,
    submitGameResult,
    getGamesBySection,
    getBestResult,
    refreshGames: loadGames,
    refreshResults: loadUserResults,
  };
};
