import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Gift, Star, Trophy, Crown } from 'lucide-react';
import { useLoyalty } from '@/hooks/useLoyalty';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const LoyaltyCard = () => {
  const {
    loyaltyData,
    rewards,
    loading,
    redeemReward,
    getTierColor,
    getTierName,
  } = useLoyalty();

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/3"></div>
            <div className="h-8 bg-muted rounded w-1/2"></div>
            <div className="h-2 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!loyaltyData) return null;

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'platinum':
        return <Crown className="h-5 w-5" />;
      case 'gold':
        return <Trophy className="h-5 w-5" />;
      case 'silver':
        return <Star className="h-5 w-5" />;
      default:
        return <Gift className="h-5 w-5" />;
    }
  };

  const getNextTierPoints = (currentTier: string) => {
    switch (currentTier) {
      case 'bronze':
        return 2000;
      case 'silver':
        return 5000;
      case 'gold':
        return 10000;
      default:
        return 10000;
    }
  };

  const nextTierPoints = getNextTierPoints(loyaltyData.tier);
  const progressPercent = (loyaltyData.points / nextTierPoints) * 100;

  return (
    <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className={getTierColor(loyaltyData.tier)}>
            {getTierIcon(loyaltyData.tier)}
          </div>
          Loyalty Program
          <Badge variant="secondary" className={getTierColor(loyaltyData.tier)}>
            {getTierName(loyaltyData.tier)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary">
              {loyaltyData.points}
            </div>
            <div className="text-sm text-muted-foreground">Points</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">
              {loyaltyData.visits}
            </div>
            <div className="text-sm text-muted-foreground">Visits</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">
              ${Math.round(loyaltyData.total_spent / 100).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Spent</div>
          </div>
        </div>

        {loyaltyData.tier !== 'platinum' && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>To next level</span>
              <span>{nextTierPoints - loyaltyData.points} points</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
        )}

        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full" variant="outline">
              <Gift className="h-4 w-4 mr-2" />
              Available Rewards ({rewards.length})
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Available Rewards</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {rewards.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Gift className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No available rewards</p>
                </div>
              ) : (
                rewards.map((reward) => (
                  <Card key={reward.id} className="p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{reward.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {reward.description}
                          </p>
                        </div>
                        <Badge variant="secondary">
                          {reward.points_required} points
                        </Badge>
                      </div>
                      <Button
                        size="sm"
                        className="w-full"
                        disabled={loyaltyData.points < reward.points_required}
                        onClick={() => redeemReward(reward.id)}
                      >
                        {loyaltyData.points < reward.points_required
                          ? 'Insufficient Points'
                          : 'Get Reward'}
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default LoyaltyCard;
