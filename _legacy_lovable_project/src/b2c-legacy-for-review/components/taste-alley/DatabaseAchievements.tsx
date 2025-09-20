import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trophy, Star, Crown, Gift, Share2 } from 'lucide-react';
import { useTasteAlleyData } from '@/hooks/useTasteAlleyData';

interface DatabaseAchievementsProps {
  onShare: (achievement: any) => void;
}

const DatabaseAchievements = ({ onShare }: DatabaseAchievementsProps) => {
  const { achievements, progress, loading } = useTasteAlleyData();

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-muted rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

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

  const getAchievementIcon = (type: string) => {
    switch (type) {
      case 'legendary':
        return <Crown className="h-5 w-5" />;
      case 'epic':
        return <Trophy className="h-5 w-5" />;
      case 'rare':
        return <Star className="h-5 w-5" />;
      default:
        return <Gift className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Summary */}
      {progress && (
        <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-6 w-6 text-emerald-600" />
              Your Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-emerald-600">
                  {progress.total_score}
                </div>
                <div className="text-sm text-muted-foreground">Total Score</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-600">
                  {progress.user_level}
                </div>
                <div className="text-sm text-muted-foreground">Level</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-600">
                  {achievements.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Achievements
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Achievements List */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Your Achievements</h3>

        {achievements.length === 0 ? (
          <Card className="bg-gray-50">
            <CardContent className="p-8 text-center">
              <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-600 mb-2">
                No achievements yet
              </h4>
              <p className="text-muted-foreground">
                Complete quest steps to unlock your first achievement!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement) => (
              <Card
                key={achievement.id}
                className={`relative overflow-hidden bg-gradient-to-br ${getRarityColor(achievement.achievement_type)}`}
              >
                <div className="absolute inset-0 bg-white/90" />
                <CardContent className="relative p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-emerald-100 rounded-full">
                      {getAchievementIcon(achievement.achievement_type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">
                          {achievement.achievement_title}
                        </h4>
                        <Badge
                          variant="outline"
                          className={getRarityBadge(
                            achievement.achievement_type
                          )}
                        >
                          {achievement.achievement_type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {achievement.achievement_description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-emerald-600">
                          +{achievement.reward_points} points
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            {new Date(
                              achievement.unlocked_at
                            ).toLocaleDateString()}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onShare(achievement)}
                            className="h-8"
                          >
                            <Share2 className="h-3 w-3 mr-1" />
                            Share
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DatabaseAchievements;
