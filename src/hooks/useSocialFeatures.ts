import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';

export interface SocialPost {
  id: string;
  user_id: string;
  content: string;
  image_url?: string;
  likes_count: number;
  comments_count: number;
  achievement_id?: string;
  created_at: string;
  user_profile?: {
    display_name: string;
    avatar_url?: string;
  };
}

export interface SocialComment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  user_profile?: {
    display_name: string;
    avatar_url?: string;
  };
}

export const useSocialFeatures = () => {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadSocialFeed();
  }, []);

  const loadSocialFeed = async () => {
    try {
      // Social posts feature is disabled
      setPosts([]);
      setLoading(false);
      return;
    } catch (err) {
      console.error('Error in loadSocialFeed:', err);
      setLoading(false);
    }
  };

  const createPost = async (content: string, imageUrl?: string, achievementId?: string) => {
    if (!user) return;

    try {
      // Social posts creation is disabled
      return;
    } catch (err) {
      console.error('Error in createPost:', err);
    }
  };

  const likePost = async (postId: string) => {
    if (!user) return;

    try {
      // Временно отключаем лайки постов
      console.log('Social post likes disabled - table does not exist');
      return;
    } catch (err) {
      console.error('Error in likePost:', err);
    }
  };

  const shareAchievement = async (achievementId: string, message: string) => {
    return createPost(message, undefined, achievementId);
  };

  const generateShareableContent = (type: 'achievement' | 'progress' | 'booking') => {
    const baseUrl = window.location.origin;
    
    switch (type) {
      case 'achievement':
        return {
          text: '🎉 Новое достижение в ODE Food Hall! Присоединяйтесь к кулинарному путешествию!',
          url: `${baseUrl}/taste-alley`,
          hashtags: ['ODEFoodHall', 'TasteAlley', 'Achievement']
        };
      case 'progress':
        return {
          text: '🍽️ Прогресс в Taste Alley - исследую новые вкусы каждый день!',
          url: `${baseUrl}/taste-alley`,
          hashtags: ['ODEFoodHall', 'Progress', 'Foodie']
        };
      case 'booking':
        return {
          text: '📅 Забронировал место в ODE Food Hall! Не могу дождаться кулинарного опыта!',
          url: baseUrl,
          hashtags: ['ODEFoodHall', 'Booking', 'Dining']
        };
      default:
        return {
          text: '🍽️ Отличный опыт в ODE Food Hall!',
          url: baseUrl,
          hashtags: ['ODEFoodHall']
        };
    }
  };

  return {
    posts,
    loading,
    createPost,
    likePost,
    shareAchievement,
    generateShareableContent,
    refreshFeed: loadSocialFeed
  };
};