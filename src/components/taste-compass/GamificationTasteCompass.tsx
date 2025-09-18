import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  Gift, 
  Star, 
  Zap, 
  Crown, 
  Target,
  Clock,
  Flame,
  Snowflake,
  Sun,
  Leaf,
  Sparkles,
  Trophy,
  Medal,
  Award,
  Diamond
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SeasonalEvent {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  icon: string;
  color: string;
  rewards: string[];
  progress: number;
  maxProgress: number;
}

interface DailyQuest {
  id: string;
  title: string;
  description: string;
  type: 'visit' | 'scan' | 'social' | 'special';
  target: number;
  current: number;
  reward: number;
  isCompleted: boolean;
  expiresAt: string;
}

interface SpecialReward {
  id: string;
  name: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  icon: string;
  points: number;
  isUnlocked: boolean;
  unlockCondition: string;
}

interface Multiplier {
  type: string;
  value: number;
  duration: number;
  isActive: boolean;
  description: string;
}

const GamificationTasteCompass = () => {
  const [seasonalEvents, setSeasonalEvents] = useState<SeasonalEvent[]>([]);
  const [dailyQuests, setDailyQuests] = useState<DailyQuest[]>([]);
  const [specialRewards, setSpecialRewards] = useState<SpecialReward[]>([]);
  const [multipliers, setMultipliers] = useState<Multiplier[]>([]);
  const [selectedTab, setSelectedTab] = useState('events');
  
  const { toast } = useToast();

  // Загрузка сезонных событий
  useEffect(() => {
    const mockEvents: SeasonalEvent[] = [
      {
        id: '1',
        name: 'Зимний фестиваль вкусов',
        description: 'Специальные зимние блюда и горячие напитки',
        startDate: '2024-12-01',
        endDate: '2024-12-31',
        isActive: true,
        icon: '❄️',
        color: 'bg-blue-100 text-blue-800',
        rewards: ['Эксклюзивный зимний значок', 'Скидка 20% на горячие напитки', 'Доступ к VIP зоне'],
        progress: 75,
        maxProgress: 100
      },
      {
        id: '2',
        name: 'Весеннее обновление',
        description: 'Свежие весенние ингредиенты и новые секторы',
        startDate: '2024-03-01',
        endDate: '2024-05-31',
        isActive: false,
        icon: '🌸',
        color: 'bg-pink-100 text-pink-800',
        rewards: ['Весенний аватар', 'Бонусные очки', 'Ранний доступ к новым секторам'],
        progress: 0,
        maxProgress: 100
      }
    ];
    
    setSeasonalEvents(mockEvents);
  }, []);

  // Загрузка ежедневных квестов
  useEffect(() => {
    const mockQuests: DailyQuest[] = [
      {
        id: '1',
        title: 'Посетите 3 сектора',
        description: 'Исследуйте разные вкусовые зоны',
        type: 'visit',
        target: 3,
        current: 2,
        reward: 100,
        isCompleted: false,
        expiresAt: '2024-01-26T23:59:59Z'
      },
      {
        id: '2',
        title: 'Сканируйте NFC метку',
        description: 'Используйте NFC для отметки посещения',
        type: 'scan',
        target: 1,
        current: 1,
        reward: 50,
        isCompleted: true,
        expiresAt: '2024-01-26T23:59:59Z'
      },
      {
        id: '3',
        title: 'Поделитесь достижением',
        description: 'Опубликуйте свой прогресс в соцсетях',
        type: 'social',
        target: 1,
        current: 0,
        reward: 75,
        isCompleted: false,
        expiresAt: '2024-01-26T23:59:59Z'
      }
    ];
    
    setDailyQuests(mockQuests);
  }, []);

  // Загрузка специальных наград
  useEffect(() => {
    const mockRewards: SpecialReward[] = [
      {
        id: '1',
        name: 'Мастер специй',
        description: 'Завершите все секторы со специями',
        rarity: 'rare',
        icon: '🌶️',
        points: 200,
        isUnlocked: true,
        unlockCondition: 'Завершить 3 сектора со специями'
      },
      {
        id: '2',
        name: 'Легенда Taste Compass',
        description: 'Завершите все секторы за один день',
        rarity: 'legendary',
        icon: '👑',
        points: 1000,
        isUnlocked: false,
        unlockCondition: 'Завершить все 8 секторов за 24 часа'
      },
      {
        id: '3',
        name: 'Социальный бабочка',
        description: 'Поделитесь 10 достижениями',
        rarity: 'epic',
        icon: '🦋',
        points: 500,
        isUnlocked: false,
        unlockCondition: 'Поделиться 10 достижениями в соцсетях'
      }
    ];
    
    setSpecialRewards(mockRewards);
  }, []);

  // Загрузка множителей
  useEffect(() => {
    const mockMultipliers: Multiplier[] = [
      {
        type: 'weekend',
        value: 2,
        duration: 48,
        isActive: true,
        description: 'Выходные бонус x2'
      },
      {
        type: 'streak',
        value: 1.5,
        duration: 24,
        isActive: true,
        description: 'Серия посещений x1.5'
      },
      {
        type: 'first_visit',
        value: 3,
        duration: 1,
        isActive: false,
        description: 'Первый визит x3'
      }
    ];
    
    setMultipliers(mockMultipliers);
  }, []);

  // Получение иконки типа квеста
  const getQuestIcon = (type: string) => {
    switch (type) {
      case 'visit': return <Target className="h-4 w-4" />;
      case 'scan': return <Zap className="h-4 w-4" />;
      case 'social': return <Star className="h-4 w-4" />;
      case 'special': return <Crown className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  // Получение цвета редкости
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800';
      case 'rare': return 'bg-blue-100 text-blue-800';
      case 'epic': return 'bg-purple-100 text-purple-800';
      case 'legendary': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Получение иконки редкости
  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'common': return <Star className="h-4 w-4" />;
      case 'rare': return <Zap className="h-4 w-4" />;
      case 'epic': return <Crown className="h-4 w-4" />;
      case 'legendary': return <Diamond className="h-4 w-4" />;
      default: return <Star className="h-4 w-4" />;
    }
  };

  // Завершение квеста
  const completeQuest = (questId: string) => {
    setDailyQuests(prev => 
      prev.map(quest => 
        quest.id === questId 
          ? { ...quest, isCompleted: true, current: quest.target }
          : quest
      )
    );
    
    toast({
      title: "🎉 Квест завершен!",
      description: "Вы получили бонусные очки",
    });
  };

  // Активация множителя
  const activateMultiplier = (multiplierId: string) => {
    setMultipliers(prev => 
      prev.map(mult => 
        mult.type === multiplierId 
          ? { ...mult, isActive: true }
          : mult
      )
    );
    
    toast({
      title: "⚡ Множитель активирован!",
      description: "Ваши очки будут умножены",
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4">
      {/* Заголовок */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          🎮 Gamification Taste Compass
        </h1>
        <p className="text-muted-foreground">
          Сезонные события, ежедневные квесты и специальные награды
        </p>
      </div>

      {/* Табы */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="events">События</TabsTrigger>
          <TabsTrigger value="quests">Квесты</TabsTrigger>
          <TabsTrigger value="rewards">Награды</TabsTrigger>
          <TabsTrigger value="multipliers">Множители</TabsTrigger>
        </TabsList>

        {/* Вкладка сезонных событий */}
        <TabsContent value="events" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {seasonalEvents.map(event => (
              <Card key={event.id} className={event.isActive ? 'ring-2 ring-primary' : ''}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">{event.icon}</span>
                    {event.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{event.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Прогресс</span>
                      <span>{event.progress}/{event.maxProgress}</span>
                    </div>
                    <Progress value={(event.progress / event.maxProgress) * 100} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Награды:</h4>
                    {event.rewards.map((reward, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <Gift className="h-4 w-4 text-primary" />
                        <span>{reward}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Badge className={event.color}>
                      {event.isActive ? 'Активно' : 'Неактивно'}
                    </Badge>
                    <Button size="sm" disabled={!event.isActive}>
                      Участвовать
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Вкладка ежедневных квестов */}
        <TabsContent value="quests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Ежедневные квесты
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {dailyQuests.map(quest => (
                <div key={quest.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">
                      {getQuestIcon(quest.type)}
                    </div>
                    <div>
                      <p className="font-medium">{quest.title}</p>
                      <p className="text-sm text-muted-foreground">{quest.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress 
                          value={(quest.current / quest.target) * 100} 
                          className="h-1 w-20" 
                        />
                        <span className="text-xs text-muted-foreground">
                          {quest.current}/{quest.target}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        +{quest.reward} очков
                      </Badge>
                      {quest.isCompleted ? (
                        <Badge className="bg-green-100 text-green-800">
                          Завершен
                        </Badge>
                      ) : (
                        <Button 
                          size="sm"
                          onClick={() => completeQuest(quest.id)}
                          disabled={quest.current < quest.target}
                        >
                          Завершить
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      До {new Date(quest.expiresAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Вкладка специальных наград */}
        <TabsContent value="rewards" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Специальные награды
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {specialRewards.map(reward => (
                <div key={reward.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{reward.icon}</div>
                    <div>
                      <p className="font-medium">{reward.name}</p>
                      <p className="text-sm text-muted-foreground">{reward.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Условие: {reward.unlockCondition}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getRarityColor(reward.rarity)}>
                      {getRarityIcon(reward.rarity)}
                      <span className="ml-1 capitalize">{reward.rarity}</span>
                    </Badge>
                    <Badge variant="outline">
                      +{reward.points} очков
                    </Badge>
                    {reward.isUnlocked ? (
                      <Badge className="bg-green-100 text-green-800">
                        Разблокировано
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        Заблокировано
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Вкладка множителей */}
        <TabsContent value="multipliers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Бонусные множители
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {multipliers.map(multiplier => (
                <div key={multiplier.type} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">⚡</div>
                    <div>
                      <p className="font-medium">x{multiplier.value} {multiplier.description}</p>
                      <p className="text-sm text-muted-foreground">
                        Длительность: {multiplier.duration} часов
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={multiplier.isActive ? "default" : "outline"}>
                      {multiplier.isActive ? 'Активен' : 'Неактивен'}
                    </Badge>
                    {!multiplier.isActive && (
                      <Button 
                        size="sm"
                        onClick={() => activateMultiplier(multiplier.type)}
                      >
                        Активировать
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Статистика */}
      <Card>
        <CardHeader>
          <CardTitle>Ваша статистика</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">12</p>
              <p className="text-sm text-muted-foreground">Завершенных квестов</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-secondary">3</p>
              <p className="text-sm text-muted-foreground">Активных событий</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-accent">8</p>
              <p className="text-sm text-muted-foreground">Полученных наград</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-500">2.5x</p>
              <p className="text-sm text-muted-foreground">Текущий множитель</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GamificationTasteCompass;
