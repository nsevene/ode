import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Gift,
  Star,
  Trophy,
  Crown,
  Zap,
  Target,
  Calendar,
  Users,
  Coins,
  TrendingUp,
  Clock,
  Award,
  Flame,
  MapPin,
  CheckCircle,
  Lock,
} from 'lucide-react';
import { useLoyalty } from '@/hooks/useLoyalty';
import { toast } from '@/hooks/use-toast';
import AnimatedCounter from '@/components/taste-alley/AnimatedCounter';

interface Challenge {
  id: string;
  title: string;
  description: string;
  requirement: number;
  progress: number;
  reward: number;
  type: 'daily' | 'weekly' | 'achievement';
  category: 'visits' | 'spending' | 'social' | 'special';
  completed: boolean;
  icon: any;
  expiry?: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  unlocked: boolean;
  unlockedAt?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
}

const EnhancedLoyaltySystem = () => {
  const {
    loyaltyData,
    rewards,
    loading,
    redeemReward,
    getTierColor,
    getTierName,
    addPoints,
  } = useLoyalty();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [streakCount, setStreakCount] = useState(7);
  const [multiplier, setMultiplier] = useState(1.5);

  useEffect(() => {
    loadChallenges();
    loadAchievements();
  }, []);

  const loadChallenges = () => {
    // Mock data - in a real application this would be from API
    setChallenges([
      {
        id: '1',
        title: 'Любитель завтраков',
        description: 'Посетите нас до 12:00 три дня подряд',
        requirement: 3,
        progress: 1,
        reward: 100,
        type: 'weekly',
        category: 'visits',
        completed: false,
        icon: Clock,
        expiry: '2024-12-31',
      },
      {
        id: '2',
        title: 'Исследователь вкусов',
        description: 'Попробуйте блюда из 5 разных секторов',
        requirement: 5,
        progress: 3,
        reward: 250,
        type: 'achievement',
        category: 'special',
        completed: false,
        icon: MapPin,
      },
      {
        id: '3',
        title: 'Социальный гурман',
        description: 'Поделитесь фото в соцсетях 3 раза',
        requirement: 3,
        progress: 0,
        reward: 150,
        type: 'weekly',
        category: 'social',
        completed: false,
        icon: Users,
        expiry: '2024-12-31',
      },
      {
        id: '4',
        title: 'Большой чек',
        description: 'Потратьте 50,000 рублей за визит',
        requirement: 50000,
        progress: 32000,
        reward: 500,
        type: 'achievement',
        category: 'spending',
        completed: false,
        icon: Coins,
      },
    ]);
  };

  const loadAchievements = () => {
    setAchievements([
      {
        id: '1',
        title: 'Первый визит',
        description: 'Добро пожаловать в ODE Food Hall!',
        icon: Star,
        unlocked: true,
        unlockedAt: '2024-01-15',
        rarity: 'common',
        points: 50,
      },
      {
        id: '2',
        title: 'Постоянный клиент',
        description: 'Посетите нас 10 раз',
        icon: Trophy,
        unlocked: true,
        unlockedAt: '2024-02-20',
        rarity: 'rare',
        points: 200,
      },
      {
        id: '3',
        title: 'Винный знаток',
        description: 'Пройдите винную дегустацию 5 раз',
        icon: Crown,
        unlocked: false,
        rarity: 'epic',
        points: 500,
      },
      {
        id: '4',
        title: 'Легенда ODE',
        description: 'Достигните платинового статуса',
        icon: Award,
        unlocked: false,
        rarity: 'legendary',
        points: 1000,
      },
    ]);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return 'text-purple-600 border-purple-200 bg-purple-50';
      case 'epic':
        return 'text-orange-600 border-orange-200 bg-orange-50';
      case 'rare':
        return 'text-blue-600 border-blue-200 bg-blue-50';
      default:
        return 'text-gray-600 border-gray-200 bg-gray-50';
    }
  };

  const completeChallenge = (challengeId: string) => {
    const challenge = challenges.find((c) => c.id === challengeId);
    if (!challenge) return;

    setChallenges((prev) =>
      prev.map((c) =>
        c.id === challengeId
          ? { ...c, completed: true, progress: c.requirement }
          : c
      )
    );

    addPoints(challenge.reward, `выполнение задания "${challenge.title}"`);

    toast({
      title: '🎉 Задание выполнено!',
      description: `+${challenge.reward} баллов за "${challenge.title}"`,
    });
  };

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
    <div className="space-y-6">
      {/* Основная карта лояльности */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={getTierColor(loyaltyData.tier)}>
                {getTierIcon(loyaltyData.tier)}
              </div>
              Программа лояльности
              <Badge
                variant="secondary"
                className={getTierColor(loyaltyData.tier)}
              >
                {getTierName(loyaltyData.tier)}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium">
                {streakCount} дней подряд
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Основная статистика */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="relative">
              <AnimatedCounter
                value={loyaltyData.points}
                className="text-2xl font-bold text-primary"
              />
              <div className="text-sm text-muted-foreground">Баллов</div>
              {multiplier > 1 && (
                <Badge
                  variant="secondary"
                  className="absolute -top-2 -right-2 text-xs"
                >
                  x{multiplier}
                </Badge>
              )}
            </div>
            <div>
              <AnimatedCounter
                value={loyaltyData.visits}
                className="text-2xl font-bold text-primary"
              />
              <div className="text-sm text-muted-foreground">Посещений</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">
                <AnimatedCounter
                  value={Math.round(loyaltyData.total_spent / 100)}
                />
                ₽
              </div>
              <div className="text-sm text-muted-foreground">Потрачено</div>
            </div>
          </div>

          {/* Прогресс до следующего уровня */}
          {loyaltyData.tier !== 'platinum' && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>До следующего уровня</span>
                <span>{nextTierPoints - loyaltyData.points} баллов</span>
              </div>
              <Progress value={progressPercent} className="h-3" />
            </div>
          )}

          {/* Мультипликатор и бонусы */}
          <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">
                Активный мультипликатор
              </span>
            </div>
            <Badge variant="default">x{multiplier} баллов</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Вкладки с контентом */}
      <Tabs defaultValue="challenges" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="challenges">Задания</TabsTrigger>
          <TabsTrigger value="achievements">Достижения</TabsTrigger>
          <TabsTrigger value="rewards">Награды</TabsTrigger>
          <TabsTrigger value="leaderboard">Рейтинг</TabsTrigger>
        </TabsList>

        {/* Задания */}
        <TabsContent value="challenges" className="space-y-4">
          <div className="grid gap-4">
            {challenges.map((challenge) => (
              <Card
                key={challenge.id}
                className={`${challenge.completed ? 'bg-green-50 border-green-200' : ''}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-lg ${challenge.completed ? 'bg-green-100 text-green-600' : 'bg-primary/10 text-primary'}`}
                      >
                        <challenge.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold flex items-center gap-2">
                          {challenge.title}
                          {challenge.completed && (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          )}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {challenge.description}
                        </p>

                        <div className="mt-2 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span>
                              Прогресс: {challenge.progress}/
                              {challenge.requirement}
                            </span>
                            <span>+{challenge.reward} баллов</span>
                          </div>
                          <Progress
                            value={
                              (challenge.progress / challenge.requirement) * 100
                            }
                            className="h-2"
                          />
                        </div>

                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {challenge.type === 'daily'
                              ? 'Ежедневное'
                              : challenge.type === 'weekly'
                                ? 'Еженедельное'
                                : 'Достижение'}
                          </Badge>
                          {challenge.expiry && (
                            <Badge variant="secondary" className="text-xs">
                              <Clock className="w-3 h-3 mr-1" />
                              До{' '}
                              {new Date(challenge.expiry).toLocaleDateString(
                                'ru-RU'
                              )}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {challenge.progress >= challenge.requirement &&
                      !challenge.completed && (
                        <Button
                          size="sm"
                          onClick={() => completeChallenge(challenge.id)}
                        >
                          Получить
                        </Button>
                      )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Достижения */}
        <TabsContent value="achievements" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement) => (
              <Card
                key={achievement.id}
                className={`${achievement.unlocked ? getRarityColor(achievement.rarity) : 'opacity-60'}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-3 rounded-lg ${achievement.unlocked ? 'bg-white shadow-sm' : 'bg-muted'}`}
                    >
                      {achievement.unlocked ? (
                        <achievement.icon className="w-6 h-6 text-primary" />
                      ) : (
                        <Lock className="w-6 h-6 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{achievement.title}</h4>
                        <Badge variant="outline" className="text-xs capitalize">
                          {achievement.rarity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {achievement.description}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs font-medium">
                          +{achievement.points} баллов
                        </span>
                        {achievement.unlockedAt && (
                          <span className="text-xs text-muted-foreground">
                            {new Date(
                              achievement.unlockedAt
                            ).toLocaleDateString('ru-RU')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Награды */}
        <TabsContent value="rewards" className="space-y-4">
          <div className="space-y-3">
            {rewards.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Gift className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Нет доступных наград</p>
              </div>
            ) : (
              rewards.map((reward) => (
                <Card key={reward.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Gift className="w-8 h-8 text-primary" />
                      <div>
                        <h4 className="font-medium">{reward.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {reward.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">
                        {reward.points_required} баллов
                      </Badge>
                      <Button
                        size="sm"
                        disabled={loyaltyData.points < reward.points_required}
                        onClick={() => redeemReward(reward.id)}
                      >
                        {loyaltyData.points < reward.points_required
                          ? 'Недостаточно баллов'
                          : 'Получить'}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Рейтинг */}
        <TabsContent value="leaderboard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Топ гурманов этого месяца
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    name: 'Анна К.',
                    points: 15420,
                    tier: 'platinum',
                    position: 1,
                  },
                  {
                    name: 'Михаил В.',
                    points: 12680,
                    tier: 'gold',
                    position: 2,
                  },
                  {
                    name: 'Вы',
                    points: loyaltyData.points,
                    tier: loyaltyData.tier,
                    position: 5,
                  },
                  {
                    name: 'Елена С.',
                    points: 8930,
                    tier: 'silver',
                    position: 6,
                  },
                  {
                    name: 'Дмитрий Р.',
                    points: 7450,
                    tier: 'silver',
                    position: 7,
                  },
                ].map((user, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      user.name === 'Вы'
                        ? 'bg-primary/10 border border-primary/20'
                        : 'bg-muted/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          user.position === 1
                            ? 'bg-yellow-100 text-yellow-700'
                            : user.position === 2
                              ? 'bg-gray-100 text-gray-700'
                              : user.position === 3
                                ? 'bg-orange-100 text-orange-700'
                                : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {user.position}
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <Badge variant="outline" className="text-xs">
                          {getTierName(user.tier)}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">
                        {user.points.toLocaleString()} баллов
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedLoyaltySystem;
