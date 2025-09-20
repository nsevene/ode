import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Trophy,
  Users,
  Share2,
  Gift,
  Smartphone,
  Bell,
  Star,
  Target,
  Zap,
  Calendar,
  Gamepad2,
} from 'lucide-react';
import DatabaseAchievements from './DatabaseAchievements';
import DatabaseLeaderboard from './DatabaseLeaderboard';
import EnhancedSocialSharing from './EnhancedSocialSharing';
import EnhancedRewardSystem from './EnhancedRewardSystem';
import NFCIntegration from './NFCIntegration';
import RealtimeNotifications from './RealtimeNotifications';
import DailyQuests from './DailyQuests';
import MiniGameCard from './MiniGameCard';
import { useTasteAlleyData } from '@/hooks/useTasteAlleyData';
import { useDailyQuests } from '@/hooks/useDailyQuests';
import { useMiniGames } from '@/hooks/useMiniGames';

const GamifiedQuestProgress = () => {
  const { progress, achievements, loading } = useTasteAlleyData();
  const { quests, getQuestProgress } = useDailyQuests();
  const { games, getBestResult } = useMiniGames();
  const [activeTab, setActiveTab] = useState('progress');

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-16 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const userStats = progress
    ? {
        name: 'You',
        level: progress.user_level,
        score: progress.total_score,
        completedSectors: progress.completed_sectors,
        rank: 1,
        fastestTime: progress.fastest_time,
      }
    : null;

  const questProgress = progress
    ? {
        completedSteps: progress.completed_sectors,
        totalSteps: 4,
        currentSector: `Sector ${progress.current_sector + 1}`,
      }
    : null;

  const latestAchievement = achievements.length > 0 ? achievements[0] : null;

  const completedQuests = quests.filter(
    (q) => getQuestProgress(q.id)?.completed
  ).length;

  const handlePlayGame = (gameId: string) => {
    // Здесь будет логика запуска игры
    console.log('Playing game:', gameId);
  };

  return (
    <div className="space-y-6">
      <RealtimeNotifications />

      {/* Enhanced Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
          <CardContent className="p-6 text-center">
            <Star className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-emerald-600">
              {progress?.user_level || 1}
            </div>
            <div className="text-sm text-muted-foreground">Level</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6 text-center">
            <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">
              {progress?.total_score || 0}
            </div>
            <div className="text-sm text-muted-foreground">Points</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="p-6 text-center">
            <Trophy className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600">
              {achievements.length}
            </div>
            <div className="text-sm text-muted-foreground">Achievements</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
          <CardContent className="p-6 text-center">
            <Calendar className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-600">
              {completedQuests}/{quests.length}
            </div>
            <div className="text-sm text-muted-foreground">Daily Quests</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-teal-50 border-green-200">
          <CardContent className="p-6 text-center">
            <Gamepad2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">
              {games.length}
            </div>
            <div className="text-sm text-muted-foreground">Mini Games</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2">
        <EnhancedSocialSharing
          achievement={latestAchievement}
          userStats={userStats}
          questProgress={questProgress}
          trigger={
            <Button variant="outline" className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              Share Progress
            </Button>
          }
        />

        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => setActiveTab('rewards')}
        >
          <Gift className="h-4 w-4" />
          View Rewards
        </Button>

        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => setActiveTab('daily-quests')}
        >
          <Calendar className="h-4 w-4" />
          Daily Quests
        </Button>

        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => setActiveTab('mini-games')}
        >
          <Gamepad2 className="h-4 w-4" />
          Mini Games
        </Button>
      </div>

      {/* Enhanced Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="progress" className="flex items-center gap-1">
            <Target className="h-4 w-4" />
            Progress
          </TabsTrigger>
          <TabsTrigger value="achievements" className="flex items-center gap-1">
            <Trophy className="h-4 w-4" />
            Achievements
          </TabsTrigger>
          <TabsTrigger value="daily-quests" className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            Daily Quests
          </TabsTrigger>
          <TabsTrigger value="mini-games" className="flex items-center gap-1">
            <Gamepad2 className="h-4 w-4" />
            Mini Games
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            Leaderboard
          </TabsTrigger>
          <TabsTrigger value="rewards" className="flex items-center gap-1">
            <Gift className="h-4 w-4" />
            Rewards
          </TabsTrigger>
          <TabsTrigger value="nfc" className="flex items-center gap-1">
            <Smartphone className="h-4 w-4" />
            NFC
          </TabsTrigger>
        </TabsList>

        <TabsContent value="progress" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Your Quest Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Current Status</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Level</span>
                        <Badge variant="outline">
                          {progress?.user_level || 1}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Current Sector</span>
                        <Badge variant="outline">
                          {progress?.current_sector || 0}/4
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Score</span>
                        <Badge variant="outline">
                          {progress?.total_score || 0}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Recent Activity</h4>
                    <div className="space-y-2">
                      {progress?.last_activity_date ? (
                        <div className="text-sm text-muted-foreground">
                          Last activity:{' '}
                          {new Date(
                            progress.last_activity_date
                          ).toLocaleDateString()}
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground">
                          No recent activity
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements">
          <DatabaseAchievements
            onShare={(achievement) => {
              // Handle sharing logic
            }}
          />
        </TabsContent>

        <TabsContent value="daily-quests">
          <DailyQuests />
        </TabsContent>

        <TabsContent value="mini-games">
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">Мини-игры</h3>
              <p className="text-muted-foreground">
                Играйте в мини-игры для получения дополнительных очков и опыта
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {games.map((game) => (
                <MiniGameCard
                  key={game.id}
                  game={game}
                  bestScore={getBestResult(game.id)}
                  onPlay={handlePlayGame}
                />
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="leaderboard">
          <DatabaseLeaderboard />
        </TabsContent>

        <TabsContent value="rewards">
          <EnhancedRewardSystem />
        </TabsContent>

        <TabsContent value="nfc">
          <NFCIntegration />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GamifiedQuestProgress;
