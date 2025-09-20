import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface UserPreferences {
  dietaryRestrictions: string[];
  favoriteCuisines: string[];
  spiceLevel: 'mild' | 'medium' | 'hot' | 'extreme';
  budgetRange: 'low' | 'medium' | 'high' | 'premium';
  mealTimes: string[];
  allergies: string[];
  healthGoals: string[];
}

interface UserBehavior {
  visitHistory: Array<{
    vendor: string;
    dish: string;
    rating: number;
    timestamp: string;
  }>;
  searchHistory: string[];
  bookingHistory: Array<{
    event: string;
    date: string;
    satisfaction: number;
  }>;
  tasteCompassProgress: {
    completedSectors: string[];
    favoriteSectors: string[];
    achievements: string[];
  };
}

interface Recommendation {
  id: string;
  type: 'dish' | 'vendor' | 'event' | 'experience';
  title: string;
  description: string;
  confidence: number; // 0-1
  reason: string;
  image?: string;
  price?: number;
  rating?: number;
  tags: string[];
  personalized: boolean;
}

interface AIInsights {
  userProfile: {
    foodPersonality: string;
    riskTaker: boolean;
    socialDiner: boolean;
    healthConscious: boolean;
    adventurous: boolean;
  };
  trends: {
    popularNearYou: string[];
    trendingCuisines: string[];
    seasonalRecommendations: string[];
  };
  opportunities: {
    unexploredSectors: string[];
    similarUsers: string[];
    newExperiences: string[];
  };
}

export const useAIRecommendations = () => {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [behavior, setBehavior] = useState<UserBehavior | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [insights, setInsights] = useState<AIInsights | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();

  // Load user preferences
  const loadUserPreferences = useCallback(async () => {
    if (!user) return;

    try {
      // In a real app, this would fetch from API
      const mockPreferences: UserPreferences = {
        dietaryRestrictions: ['vegetarian', 'gluten-free'],
        favoriteCuisines: ['italian', 'asian', 'mediterranean'],
        spiceLevel: 'medium',
        budgetRange: 'medium',
        mealTimes: ['lunch', 'dinner'],
        allergies: ['nuts'],
        healthGoals: ['weight_loss', 'muscle_gain'],
      };

      setPreferences(mockPreferences);
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  }, [user]);

  // Load user behavior data
  const loadUserBehavior = useCallback(async () => {
    if (!user) return;

    try {
      // In a real app, this would fetch from API
      const mockBehavior: UserBehavior = {
        visitHistory: [
          {
            vendor: 'Dolce Italia',
            dish: 'Margherita Pizza',
            rating: 5,
            timestamp: '2024-01-20T12:00:00Z',
          },
          {
            vendor: 'Spicy Asia',
            dish: 'Pad Thai',
            rating: 4,
            timestamp: '2024-01-18T18:30:00Z',
          },
          {
            vendor: 'Wild Bali',
            dish: 'Nasi Goreng',
            rating: 5,
            timestamp: '2024-01-15T19:00:00Z',
          },
        ],
        searchHistory: ['pizza', 'pasta', 'thai food', 'healthy options'],
        bookingHistory: [
          { event: 'Wine Tasting', date: '2024-01-25', satisfaction: 5 },
          { event: 'Cooking Class', date: '2024-01-22', satisfaction: 4 },
        ],
        tasteCompassProgress: {
          completedSectors: ['spice', 'umami', 'sweet'],
          favoriteSectors: ['spice', 'umami'],
          achievements: ['spice_master', 'umami_explorer'],
        },
      };

      setBehavior(mockBehavior);
    } catch (error) {
      console.error('Error loading behavior:', error);
    }
  }, [user]);

  // Generate AI insights
  const generateInsights = useCallback(
    (prefs: UserPreferences, behavior: UserBehavior): AIInsights => {
      // Analyze user profile
      const foodPersonality =
        behavior.tasteCompassProgress.favoriteSectors.includes('spice')
          ? 'Adventurous'
          : 'Traditional';
      const riskTaker =
        behavior.tasteCompassProgress.completedSectors.length > 5;
      const socialDiner = behavior.bookingHistory.length > 0;
      const healthConscious = prefs.healthGoals.length > 0;
      const adventurous =
        prefs.spiceLevel === 'hot' || prefs.spiceLevel === 'extreme';

      // Analyze trends
      const popularNearYou = behavior.visitHistory
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3)
        .map((v) => v.vendor);

      const trendingCuisines = behavior.visitHistory.reduce(
        (acc, visit) => {
          acc[visit.vendor] = (acc[visit.vendor] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

      const seasonalRecommendations = [
        'Winter Comfort Foods',
        'Hot Soups and Stews',
        'Warm Spiced Beverages',
      ];

      // Find opportunities
      const allSectors = [
        'spice',
        'smoke',
        'ferment',
        'umami',
        'sweet',
        'herb',
        'salt',
        'bitter',
      ];
      const unexploredSectors = allSectors.filter(
        (sector) =>
          !behavior.tasteCompassProgress.completedSectors.includes(sector)
      );

      return {
        userProfile: {
          foodPersonality,
          riskTaker,
          socialDiner,
          healthConscious,
          adventurous,
        },
        trends: {
          popularNearYou,
          trendingCuisines: Object.keys(trendingCuisines),
          seasonalRecommendations,
        },
        opportunities: {
          unexploredSectors,
          similarUsers: ['user123', 'user456'], // In real app, would be calculated
          newExperiences: ["Chef's Table", 'Wine Pairing', 'Cooking Workshop'],
        },
      };
    },
    []
  );

  // Generate personalized recommendations
  const generateRecommendations = useCallback(
    (
      prefs: UserPreferences,
      behavior: UserBehavior,
      insights: AIInsights
    ): Recommendation[] => {
      const recommendations: Recommendation[] = [];

      // Dish recommendations based on preferences
      if (prefs.favoriteCuisines.includes('italian')) {
        recommendations.push({
          id: 'rec-1',
          type: 'dish',
          title: 'Truffle Risotto',
          description: 'Creamy risotto with wild mushrooms and truffle oil',
          confidence: 0.9,
          reason:
            'Based on your love for Italian cuisine and high ratings for pasta dishes',
          image: '/images/truffle-risotto.jpg',
          price: 24,
          rating: 4.8,
          tags: ['italian', 'vegetarian', 'premium'],
          personalized: true,
        });
      }

      // Vendor recommendations based on behavior
      if (
        behavior.visitHistory.some(
          (v) => v.vendor === 'Spicy Asia' && v.rating >= 4
        )
      ) {
        recommendations.push({
          id: 'rec-2',
          type: 'vendor',
          title: 'Wild Bali',
          description: 'Authentic Indonesian cuisine with bold flavors',
          confidence: 0.8,
          reason:
            'Similar to your favorite Spicy Asia, but with Indonesian flavors',
          image: '/images/wild-bali.jpg',
          rating: 4.6,
          tags: ['asian', 'spicy', 'authentic'],
          personalized: true,
        });
      }

      // Event recommendations based on booking history
      if (
        behavior.bookingHistory.some(
          (b) => b.event.includes('Wine') && b.satisfaction >= 4
        )
      ) {
        recommendations.push({
          id: 'rec-3',
          type: 'event',
          title: 'Wine & Cheese Pairing',
          description: 'Expert-led wine and cheese tasting experience',
          confidence: 0.85,
          reason:
            'You enjoyed our wine tasting event, this is a natural next step',
          image: '/images/wine-cheese.jpg',
          price: 45,
          rating: 4.9,
          tags: ['wine', 'cheese', 'tasting', 'premium'],
          personalized: true,
        });
      }

      // Experience recommendations based on taste compass
      if (insights.opportunities.unexploredSectors.includes('ferment')) {
        recommendations.push({
          id: 'rec-4',
          type: 'experience',
          title: 'Fermentation Workshop',
          description: 'Learn the art of fermentation with local experts',
          confidence: 0.7,
          reason: 'Complete your Taste Compass by exploring the Ferment sector',
          image: '/images/fermentation.jpg',
          price: 35,
          rating: 4.7,
          tags: ['fermentation', 'workshop', 'educational'],
          personalized: true,
        });
      }

      // Seasonal recommendations
      insights.trends.seasonalRecommendations.forEach((rec, index) => {
        recommendations.push({
          id: `seasonal-${index}`,
          type: 'dish',
          title: rec,
          description: `Perfect for the current season`,
          confidence: 0.6,
          reason: 'Popular seasonal choice',
          tags: ['seasonal', 'trending'],
          personalized: false,
        });
      });

      return recommendations.sort((a, b) => b.confidence - a.confidence);
    },
    []
  );

  // Load all data and generate recommendations
  const loadRecommendations = useCallback(async () => {
    if (!user || !preferences || !behavior) return;

    setIsLoading(true);
    setError(null);

    try {
      // Generate insights
      const generatedInsights = generateInsights(preferences, behavior);
      setInsights(generatedInsights);

      // Generate recommendations
      const generatedRecommendations = generateRecommendations(
        preferences,
        behavior,
        generatedInsights
      );
      setRecommendations(generatedRecommendations);
    } catch (error) {
      setError('Failed to generate recommendations');
      console.error('Error generating recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user, preferences, behavior, generateInsights, generateRecommendations]);

  // Update preferences
  const updatePreferences = useCallback(
    async (newPreferences: Partial<UserPreferences>) => {
      if (!preferences) return;

      const updated = { ...preferences, ...newPreferences };
      setPreferences(updated);

      // Regenerate recommendations with new preferences
      await loadRecommendations();
    },
    [preferences, loadRecommendations]
  );

  // Get recommendations by type
  const getRecommendationsByType = useCallback(
    (type: Recommendation['type']) => {
      return recommendations.filter((rec) => rec.type === type);
    },
    [recommendations]
  );

  // Get personalized recommendations only
  const getPersonalizedRecommendations = useCallback(() => {
    return recommendations.filter((rec) => rec.personalized);
  }, [recommendations]);

  // Get recommendations by confidence threshold
  const getRecommendationsByConfidence = useCallback(
    (minConfidence: number) => {
      return recommendations.filter((rec) => rec.confidence >= minConfidence);
    },
    [recommendations]
  );

  // Rate a recommendation
  const rateRecommendation = useCallback(
    async (recommendationId: string, rating: number) => {
      // In a real app, this would send feedback to the AI system
      console.log(
        `Rated recommendation ${recommendationId} with ${rating} stars`
      );

      // Update local state
      setRecommendations((prev) =>
        prev.map((rec) =>
          rec.id === recommendationId ? { ...rec, userRating: rating } : rec
        )
      );
    },
    []
  );

  // Dismiss a recommendation
  const dismissRecommendation = useCallback(
    async (recommendationId: string) => {
      setRecommendations((prev) =>
        prev.filter((rec) => rec.id !== recommendationId)
      );
    },
    []
  );

  // Load data on mount
  useEffect(() => {
    if (user) {
      loadUserPreferences();
      loadUserBehavior();
    }
  }, [user, loadUserPreferences, loadUserBehavior]);

  // Generate recommendations when data is available
  useEffect(() => {
    if (preferences && behavior) {
      loadRecommendations();
    }
  }, [preferences, behavior, loadRecommendations]);

  return {
    // Data
    preferences,
    behavior,
    recommendations,
    insights,

    // State
    isLoading,
    error,

    // Actions
    updatePreferences,
    loadRecommendations,
    getRecommendationsByType,
    getPersonalizedRecommendations,
    getRecommendationsByConfidence,
    rateRecommendation,
    dismissRecommendation,

    // Utilities
    generateInsights,
    generateRecommendations,
  };
};
