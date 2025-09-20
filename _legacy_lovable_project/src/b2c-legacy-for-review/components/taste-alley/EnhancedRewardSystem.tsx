import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Gift, Star, Crown, Zap, Users, Clock, Target } from 'lucide-react';
import { useTasteAlleyData } from '@/hooks/useTasteAlleyData';

interface Reward {
  id: string;
  title: string;
  description: string;
  type: 'discount' | 'free_item' | 'experience' | 'exclusive_access';
  pointsRequired: number;
  category: 'food' | 'drink' | 'experience' | 'merchandise';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  icon: React.ReactNode;
  expiry?: string;
  limitations?: string;
}

const EnhancedRewardSystem = () => {
  const { progress } = useTasteAlleyData();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    // Mock rewards data - in real app this would come from Supabase
    const mockRewards: Reward[] = [
      {
        id: '1',
        title: 'Free Appetizer',
        description: 'Get any appetizer free with main course',
        type: 'free_item',
        pointsRequired: 100,
        category: 'food',
        rarity: 'common',
        icon: <Gift className="h-4 w-4" />,
        expiry: '30 days',
        limitations: 'One per visit',
      },
      {
        id: '2',
        title: 'Signature Cocktail',
        description: 'Free signature cocktail from any vendor',
        type: 'free_item',
        pointsRequired: 150,
        category: 'drink',
        rarity: 'common',
        icon: <Zap className="h-4 w-4" />,
      },
      {
        id: '3',
        title: "Chef's Table Experience",
        description: 'Exclusive 5-course tasting menu',
        type: 'experience',
        pointsRequired: 500,
        category: 'experience',
        rarity: 'epic',
        icon: <Crown className="h-4 w-4" />,
      },
      {
        id: '4',
        title: 'VIP Lounge Access',
        description: '1 hour access to VIP lounge',
        type: 'exclusive_access',
        pointsRequired: 300,
        category: 'experience',
        rarity: 'rare',
        icon: <Star className="h-4 w-4" />,
      },
      {
        id: '5',
        title: 'Private Cooking Class',
        description: 'Learn from our head chef',
        type: 'experience',
        pointsRequired: 800,
        category: 'experience',
        rarity: 'legendary',
        icon: <Users className="h-4 w-4" />,
      },
    ];

    setRewards(mockRewards);
  }, []);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return 'from-purple-600 to-pink-600';
      case 'epic':
        return 'from-orange-600 to-red-600';
      case 'rare':
        return 'from-blue-600 to-indigo-600';
      default:
        return 'from-gray-600 to-gray-700';
    }
  };

  const getRarityBadge = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'epic':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'rare':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const filteredRewards =
    selectedCategory === 'all'
      ? rewards
      : rewards.filter((r) => r.category === selectedCategory);

  const canAfford = (pointsRequired: number) => {
    return progress ? progress.total_score >= pointsRequired : false;
  };

  const categories = [
    { id: 'all', name: 'All', icon: <Target className="h-4 w-4" /> },
    { id: 'food', name: 'Food', icon: <Gift className="h-4 w-4" /> },
    { id: 'drink', name: 'Drinks', icon: <Zap className="h-4 w-4" /> },
    {
      id: 'experience',
      name: 'Experiences',
      icon: <Star className="h-4 w-4" />,
    },
    { id: 'merchandise', name: 'Merch', icon: <Crown className="h-4 w-4" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Current Points */}
      <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-6 w-6 text-emerald-600" />
            Reward Points
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-600 mb-2">
              {progress?.total_score || 0}
            </div>
            <div className="text-sm text-muted-foreground">
              Available Points
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(category.id)}
            className="flex items-center gap-2"
          >
            {category.icon}
            {category.name}
          </Button>
        ))}
      </div>

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRewards.map((reward) => (
          <Card
            key={reward.id}
            className={`relative overflow-hidden ${
              canAfford(reward.pointsRequired)
                ? 'ring-2 ring-emerald-500'
                : 'opacity-75'
            }`}
          >
            <div
              className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${getRarityColor(reward.rarity)}`}
            />

            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-emerald-100 rounded-full">
                    {reward.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">{reward.title}</h3>
                    <Badge
                      variant="outline"
                      className={`${getRarityBadge(reward.rarity)} text-xs`}
                    >
                      {reward.rarity}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-emerald-600">
                    {reward.pointsRequired}
                  </div>
                  <div className="text-xs text-muted-foreground">points</div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground mb-3">
                {reward.description}
              </p>

              {(reward.expiry || reward.limitations) && (
                <div className="text-xs text-muted-foreground mb-3 space-y-1">
                  {reward.expiry && <div>• Valid for {reward.expiry}</div>}
                  {reward.limitations && <div>• {reward.limitations}</div>}
                </div>
              )}

              {!canAfford(reward.pointsRequired) && (
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Progress</span>
                    <span>
                      {progress?.total_score || 0}/{reward.pointsRequired}
                    </span>
                  </div>
                  <Progress
                    value={
                      ((progress?.total_score || 0) / reward.pointsRequired) *
                      100
                    }
                    className="h-2"
                  />
                </div>
              )}

              <Button
                className="w-full"
                disabled={!canAfford(reward.pointsRequired)}
                variant={
                  canAfford(reward.pointsRequired) ? 'default' : 'outline'
                }
              >
                {canAfford(reward.pointsRequired)
                  ? 'Claim Reward'
                  : 'Not Enough Points'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EnhancedRewardSystem;
