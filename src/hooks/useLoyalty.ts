import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';

export interface LoyaltyProgram {
  id: string;
  user_id: string;
  points: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  visits: number;
  total_spent: number;
  created_at: string;
  updated_at: string;
}

export interface LoyaltyReward {
  id: string;
  title: string;
  description: string;
  points_required: number;
  type: 'discount' | 'free_item' | 'experience' | 'upgrade';
  value: number; // процент скидки или фиксированная сумма
  tier_required: 'bronze' | 'silver' | 'gold' | 'platinum';
  active: boolean;
}

export const useLoyalty = () => {
  const [loyaltyData, setLoyaltyData] = useState<LoyaltyProgram | null>(null);
  const [rewards, setRewards] = useState<LoyaltyReward[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadLoyaltyData();
      loadRewards();
    }
  }, [user]);

  const loadLoyaltyData = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('loyalty_programs' as any)
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error loading loyalty data:', error);
      return;
    }

    if (data) {
      setLoyaltyData(data as unknown as LoyaltyProgram);
    } else {
      // Создаем новую запись лояльности для пользователя
      await createLoyaltyProgram();
    }
    setLoading(false);
  };

  const createLoyaltyProgram = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('loyalty_programs' as any)
      .insert({
        user_id: user.id,
        points: 0,
        tier: 'bronze',
        visits: 0,
        total_spent: 0
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating loyalty program:', error);
      return;
    }

    setLoyaltyData(data as unknown as LoyaltyProgram);
  };

  const loadRewards = async () => {
    const { data, error } = await supabase
      .from('loyalty_rewards' as any)
      .select('*')
      .eq('active', true)
      .order('points_required', { ascending: true });

    if (error) {
      console.error('Error loading rewards:', error);
      return;
    }

    setRewards((data as unknown as LoyaltyReward[]) || []);
  };

  const addPoints = async (points: number, reason: string) => {
    if (!user || !loyaltyData) return;

    const newPoints = loyaltyData.points + points;
    const newTier = calculateTier(newPoints);

    const { error } = await supabase
      .from('loyalty_programs' as any)
      .update({ 
        points: newPoints,
        tier: newTier,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id);

    if (error) {
      console.error('Error adding points:', error);
      return;
    }

    // Создаем уведомление о начислении баллов
    await supabase
      .from('user_notifications' as any)
      .insert({
        user_id: user.id,
        type: 'system',
        title: 'Баллы начислены!',
        message: `+${points} баллов за ${reason}`,
        data: { points, reason }
      });

    setLoyaltyData(prev => prev ? {
      ...prev,
      points: newPoints,
      tier: newTier
    } : null);

    toast({
      title: "Баллы начислены!",
      description: `+${points} баллов за ${reason}`
    });
  };

  const recordVisit = async (amountSpent: number) => {
    if (!user || !loyaltyData) return;

    const newVisits = loyaltyData.visits + 1;
    const newTotalSpent = loyaltyData.total_spent + amountSpent;
    const visitPoints = calculateVisitPoints(amountSpent);

    await addPoints(visitPoints, 'посещение');

    const { error } = await supabase
      .from('loyalty_programs' as any)
      .update({ 
        visits: newVisits,
        total_spent: newTotalSpent,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id);

    if (error) {
      console.error('Error recording visit:', error);
      return;
    }

    setLoyaltyData(prev => prev ? {
      ...prev,
      visits: newVisits,
      total_spent: newTotalSpent
    } : null);
  };

  const redeemReward = async (rewardId: string) => {
    if (!user || !loyaltyData) return false;

    const reward = rewards.find(r => r.id === rewardId);
    if (!reward) return false;

    if (loyaltyData.points < reward.points_required) {
      toast({
        title: "Недостаточно баллов",
        description: `Нужно ${reward.points_required} баллов, у вас ${loyaltyData.points}`,
        variant: "destructive"
      });
      return false;
    }

    const newPoints = loyaltyData.points - reward.points_required;

    const { error } = await supabase
      .from('loyalty_programs' as any)
      .update({ 
        points: newPoints,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id);

    if (error) {
      console.error('Error redeeming reward:', error);
      return false;
    }

    // Записываем использование награды
    await supabase
      .from('loyalty_redemptions' as any)
      .insert({
        user_id: user.id,
        reward_id: rewardId,
        points_used: reward.points_required
      });

    setLoyaltyData(prev => prev ? {
      ...prev,
      points: newPoints
    } : null);

    toast({
      title: "Награда получена!",
      description: reward.title
    });

    return true;
  };

  const calculateTier = (points: number): 'bronze' | 'silver' | 'gold' | 'platinum' => {
    if (points >= 10000) return 'platinum';
    if (points >= 5000) return 'gold';
    if (points >= 2000) return 'silver';
    return 'bronze';
  };

  const calculateVisitPoints = (amountSpent: number): number => {
    // 1% от суммы покупки в баллах + бонус за посещение
    return Math.floor(amountSpent * 0.01) + 50;
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'platinum': return 'text-purple-600';
      case 'gold': return 'text-yellow-600';
      case 'silver': return 'text-gray-600';
      default: return 'text-orange-600';
    }
  };

  const getTierName = (tier: string) => {
    switch (tier) {
      case 'platinum': return 'Платиновый';
      case 'gold': return 'Золотой';
      case 'silver': return 'Серебряный';
      default: return 'Бронзовый';
    }
  };

  return {
    loyaltyData,
    rewards: rewards.filter(r => !loyaltyData || loyaltyData.tier >= r.tier_required),
    loading,
    addPoints,
    recordVisit,
    redeemReward,
    getTierColor,
    getTierName,
    loadLoyaltyData
  };
};