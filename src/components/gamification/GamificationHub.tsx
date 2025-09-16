import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Star, Target, Gift, Users, Zap, Crown, Medal } from 'lucide-react';
import { useTasteAlleyData } from '@/hooks/useTasteAlleyData';
import { useLoyalty } from '@/hooks/useLoyalty';
import { useDailyQuests } from '@/hooks/useDailyQuests';
import AnimatedCounter from '@/components/taste-alley/AnimatedCounter';

export const GamificationHub = () => {
  const { progress, achievements, leaderboard } = useTasteAlleyData();
  const { loyaltyData, getTierColor } = useLoyalty();
  const { quests, userProgress } = useDailyQuests();

  const getXPToNextLevel = () => {
    if (!progress) return 0;
    const baseXP = 100;
    const nextLevelXP = baseXP * Math.pow(1.5, progress.user_level);
    return Math.ceil(nextLevelXP);
  };

  const getCurrentLevelProgress = () => {
    if (!progress) return 0;
    const baseXP = 100;
    const currentLevelMinXP = progress.user_level === 1 ? 0 : baseXP * Math.pow(1.5, progress.user_level - 1);
    const nextLevelXP = baseXP * Math.pow(1.5, progress.user_level);
    const currentXP = progress.total_score - currentLevelMinXP;
    const levelXPRange = nextLevelXP - currentLevelMinXP;
    return Math.min((currentXP / levelXPRange) * 100, 100);
  };

  const completedQuests = quests.filter(quest => {
    const questProgress = userProgress.find(p => p.quest_id === quest.id);
    return questProgress?.completed || false;
  });

  return (
    <div className="space-y-6">
      {/* Player Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-200/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Уровень</p>
                <div className="flex items-center space-x-2">
                  <Crown className="w-5 h-5 text-purple-500" />
                  <span className="text-2xl font-bold">
                    {progress?.user_level || 1}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">XP</p>
                <p className="font-semibold">
                  {progress?.total_score || 0} / {getXPToNextLevel()}
                </p>
                <Progress value={getCurrentLevelProgress()} className="w-16 h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-200/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Достижения</p>
                <div className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-blue-500" />
                  <AnimatedCounter value={achievements?.length || 0} />
                </div>
              </div>
              <Medal className="w-8 h-8 text-blue-500/30" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-200/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Квесты</p>
                <div className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-green-500" />
                  <span className="text-xl font-bold">
                    {completedQuests.length}/{quests.length}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <Progress 
                  value={quests.length ? (completedQuests.length / quests.length) * 100 : 0} 
                  className="w-16 h-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`bg-gradient-to-br border-opacity-20 ${getTierColor(loyaltyData?.tier || 'bronze')}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Лояльность</p>
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <AnimatedCounter value={loyaltyData?.points || 0} />
                </div>
              </div>
              <Badge variant="secondary">
                {loyaltyData?.tier || 'Bronze'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Tabs */}
      <Tabs defaultValue="achievements" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="achievements">Достижения</TabsTrigger>
          <TabsTrigger value="quests">Квесты</TabsTrigger>
          <TabsTrigger value="leaderboard">Рейтинг</TabsTrigger>
          <TabsTrigger value="rewards">Награды</TabsTrigger>
        </TabsList>

        <TabsContent value="achievements" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements?.map((achievement) => (
              <Card key={achievement.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Trophy className="w-6 h-6 text-yellow-500" />
                    <Badge variant="secondary">
                      +{achievement.reward_points} XP
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <h3 className="font-semibold mb-1">{achievement.achievement_title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {achievement.achievement_description}
                  </p>
                  <Badge variant="outline">
                    {achievement.achievement_type}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="quests" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quests.map((quest) => {
              const questProgress = userProgress.find(p => p.quest_id === quest.id);
              const isCompleted = questProgress?.completed || false;
              const currentProgress = questProgress?.current_progress || 0;
              const progressPercentage = (currentProgress / quest.target_value) * 100;

              return (
                <Card key={quest.id} className={isCompleted ? 'bg-green-50 border-green-200' : ''}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Target className={`w-5 h-5 ${isCompleted ? 'text-green-500' : 'text-blue-500'}`} />
                      <Badge variant={isCompleted ? 'default' : 'secondary'}>
                        {isCompleted ? 'Выполнен' : 'В процессе'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h3 className="font-semibold mb-1">{quest.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {quest.description}
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Прогресс</span>
                        <span>{currentProgress} / {quest.target_value}</span>
                      </div>
                      <Progress value={Math.min(progressPercentage, 100)} />
                      {quest.reward_points && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Награда:</span>
                          <Badge variant="outline">+{quest.reward_points} XP</Badge>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Топ игроков
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaderboard?.slice(0, 10).map((entry, index) => (
                  <div key={entry.user_id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                        ${index === 0 ? 'bg-yellow-500 text-white' : 
                          index === 1 ? 'bg-gray-400 text-white' : 
                          index === 2 ? 'bg-amber-600 text-white' : 'bg-muted'}`}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold">{entry.display_name}</p>
                        <p className="text-sm text-muted-foreground">
                          Уровень {entry.user_level}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{entry.total_score} XP</p>
                      <p className="text-sm text-muted-foreground">
                        {entry.completed_sectors}/8 секторов
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rewards" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Mock rewards - in real app these would come from database */}
            {[
              { id: 1, title: 'Скидка 10%', points: 100, type: 'discount', available: true },
              { id: 2, title: 'Бесплатный десерт', points: 150, type: 'food', available: true },
              { id: 3, title: 'VIP столик', points: 300, type: 'experience', available: false },
              { id: 4, title: 'Дегустация шеф-повара', points: 500, type: 'experience', available: false }
            ].map((reward) => (
              <Card key={reward.id} className={`${!reward.available ? 'opacity-60' : ''}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Gift className="w-6 h-6 text-purple-500" />
                    <Badge variant="secondary">
                      {reward.points} очков
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <h3 className="font-semibold mb-2">{reward.title}</h3>
                  <Button 
                    variant={reward.available ? "default" : "secondary"} 
                    size="sm" 
                    disabled={!reward.available}
                    className="w-full"
                  >
                    {reward.available ? 'Получить' : 'Недостаточно очков'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};