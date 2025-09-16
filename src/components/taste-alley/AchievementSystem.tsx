
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star, Crown, Gift, Share2, Users, Target, Zap } from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  requirement: number;
  current: number;
  reward: string;
  isUnlocked: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface AchievementSystemProps {
  completedSectors: number;
  totalTimeSpent: number;
  questsCompleted: number;
  onShare: (achievement: Achievement) => void;
}

const AchievementSystem = ({ 
  completedSectors, 
  totalTimeSpent, 
  questsCompleted, 
  onShare 
}: AchievementSystemProps) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [totalScore, setTotalScore] = useState(0);
  const [userLevel, setUserLevel] = useState(1);

  const allAchievements: Achievement[] = [
    {
      id: 'first_taste',
      title: 'First Taste',
      description: 'Complete your first sector',
      icon: <Star className="h-5 w-5" />,
      requirement: 1,
      current: completedSectors,
      reward: '50 points',
      isUnlocked: completedSectors >= 1,
      rarity: 'common'
    },
    {
      id: 'taste_explorer',
      title: 'Taste Explorer',
      description: 'Complete 2 sectors',
      icon: <Target className="h-5 w-5" />,
      requirement: 2,
      current: completedSectors,
      reward: '100 points',
      isUnlocked: completedSectors >= 2,
      rarity: 'common'
    },
    {
      id: 'flavor_master',
      title: 'Flavor Master',
      description: 'Complete all 4 sectors',
      icon: <Trophy className="h-5 w-5" />,
      requirement: 4,
      current: completedSectors,
      reward: '300 points + Chef\'s Table discount',
      isUnlocked: completedSectors >= 4,
      rarity: 'epic'
    },
    {
      id: 'speed_runner',
      title: 'Speed Runner',
      description: 'Complete quest in under 30 minutes',
      icon: <Zap className="h-5 w-5" />,
      requirement: 30,
      current: totalTimeSpent,
      reward: '150 points',
      isUnlocked: totalTimeSpent <= 30 && completedSectors >= 4,
      rarity: 'rare'
    },
    {
      id: 'quest_legend',
      title: 'Quest Legend',
      description: 'Complete 10 different quests',
      icon: <Crown className="h-5 w-5" />,
      requirement: 10,
      current: questsCompleted,
      reward: '500 points + VIP access',
      isUnlocked: questsCompleted >= 10,
      rarity: 'legendary'
    }
  ];

  useEffect(() => {
    setAchievements(allAchievements);
    
    // Calculate total score
    const score = allAchievements
      .filter(a => a.isUnlocked)
      .reduce((sum, a) => sum + (a.rarity === 'legendary' ? 500 : 
                                 a.rarity === 'epic' ? 300 : 
                                 a.rarity === 'rare' ? 150 : 50), 0);
    setTotalScore(score);
    
    // Calculate level
    setUserLevel(Math.floor(score / 200) + 1);
  }, [completedSectors, totalTimeSpent, questsCompleted]);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'from-purple-600 to-pink-600';
      case 'epic': return 'from-orange-600 to-red-600';
      case 'rare': return 'from-blue-600 to-indigo-600';
      default: return 'from-gray-600 to-gray-700';
    }
  };

  const getRarityBadge = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'epic': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'rare': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const unlockedAchievements = achievements.filter(a => a.isUnlocked);
  const progressAchievements = achievements.filter(a => !a.isUnlocked && a.current > 0);

  return (
    <div className="space-y-6">
      {/* User Progress Header */}
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
              <div className="text-2xl font-bold text-emerald-600">{totalScore}</div>
              <div className="text-sm text-muted-foreground">Total Score</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-600">{userLevel}</div>
              <div className="text-sm text-muted-foreground">Level</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-600">{unlockedAchievements.length}</div>
              <div className="text-sm text-muted-foreground">Achievements</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress to Level {userLevel + 1}</span>
              <span>{totalScore % 200}/200</span>
            </div>
            <Progress value={(totalScore % 200) / 200 * 100} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Unlocked Achievements */}
      {unlockedAchievements.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Unlocked Achievements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {unlockedAchievements.map((achievement) => (
              <Card 
                key={achievement.id} 
                className={`relative overflow-hidden bg-gradient-to-br ${getRarityColor(achievement.rarity)}`}
              >
                <div className="absolute inset-0 bg-white/90" />
                <CardContent className="relative p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-emerald-100 rounded-full">
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{achievement.title}</h4>
                        <Badge variant="outline" className={getRarityBadge(achievement.rarity)}>
                          {achievement.rarity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {achievement.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-emerald-600">
                          {achievement.reward}
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
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Progress Achievements */}
      {progressAchievements.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">In Progress</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {progressAchievements.map((achievement) => (
              <Card key={achievement.id} className="opacity-75">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gray-100 rounded-full">
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{achievement.title}</h4>
                        <Badge variant="outline" className={getRarityBadge(achievement.rarity)}>
                          {achievement.rarity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {achievement.description}
                      </p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{achievement.current}/{achievement.requirement}</span>
                        </div>
                        <Progress 
                          value={(achievement.current / achievement.requirement) * 100} 
                          className="h-2" 
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Locked Achievements */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Locked Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.filter(a => !a.isUnlocked && a.current === 0).map((achievement) => (
            <Card key={achievement.id} className="opacity-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-100 rounded-full">
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{achievement.title}</h4>
                      <Badge variant="outline" className={getRarityBadge(achievement.rarity)}>
                        {achievement.rarity}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {achievement.description}
                    </p>
                    <div className="text-sm font-medium text-gray-600">
                      🔒 {achievement.reward}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AchievementSystem;
