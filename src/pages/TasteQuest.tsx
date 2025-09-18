import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowRight, 
  Star, 
  Trophy, 
  Target, 
  MapPin, 
  Clock, 
  Users, 
  Award, 
  Zap, 
  Heart, 
  Share2, 
  Camera, 
  CheckCircle, 
  Lock, 
  Unlock,
  Compass,
  Flame,
  Leaf,
  Coffee,
  Wine,
  ChefHat,
  Sparkles,
  Crown,
  Medal,
  Gift,
  BookOpen,
  Play,
  Pause,
  RotateCcw
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ImprovedNavigation from '@/components/ImprovedNavigation';

interface Quest {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  category: string;
  points: number;
  duration: number; // in minutes
  requirements: string[];
  rewards: string[];
  isCompleted: boolean;
  isLocked: boolean;
  progress: number; // 0-100
  icon: any;
  color: string;
  location: string;
  participants: number;
  rating: number;
  tags: string[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  points: number;
  isUnlocked: boolean;
  unlockedAt?: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface UserProgress {
  level: number;
  experience: number;
  experienceToNext: number;
  totalPoints: number;
  questsCompleted: number;
  achievementsUnlocked: number;
  streak: number;
  lastActive: Date;
}

const TasteQuest = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState('quests');
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [showQuestModal, setShowQuestModal] = useState(false);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    level: 1,
    experience: 0,
    experienceToNext: 100,
    totalPoints: 0,
    questsCompleted: 0,
    achievementsUnlocked: 0,
    streak: 0,
    lastActive: new Date()
  });

  const [quests, setQuests] = useState<Quest[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  const getMockQuests = (): Quest[] => [
    {
      id: 'spice-explorer',
      title: 'Spice Explorer',
      description: 'Попробуйте 5 разных острых блюд из разных кухонь',
      difficulty: 'easy',
      category: 'taste',
      points: 100,
      duration: 60,
      requirements: ['Попробовать Pad Thai', 'Попробовать Nasi Goreng', 'Попробовать Curry', 'Попробовать Sate', 'Попробовать Tom Yum'],
      rewards: ['50 бонусных очков', 'Скидка 10% на острые блюда', 'Значок "Spice Master"'],
      isCompleted: false,
      isLocked: false,
      progress: 40,
      icon: Flame,
      color: 'text-red-500',
      location: 'Spicy Asia Kitchen',
      participants: 24,
      rating: 4.8,
      tags: ['spicy', 'asian', 'exploration']
    },
    {
      id: 'local-heritage',
      title: 'Local Heritage',
      description: 'Изучите традиционные балийские блюда и их историю',
      difficulty: 'medium',
      category: 'culture',
      points: 200,
      duration: 90,
      requirements: ['Попробовать Babi Guling', 'Попробовать Lawar', 'Попробовать Gado-gado', 'Узнать историю блюд', 'Сфотографироваться с шеф-поваром'],
      rewards: ['100 бонусных очков', 'Эксклюзивный рецепт', 'Значок "Heritage Keeper"'],
      isCompleted: false,
      isLocked: false,
      progress: 20,
      icon: Leaf,
      color: 'text-green-500',
      location: 'Wild Bali Kitchen',
      participants: 18,
      rating: 4.9,
      tags: ['local', 'traditional', 'culture']
    },
    {
      id: 'wine-connoisseur',
      title: 'Wine Connoisseur',
      description: 'Проведите дегустацию 3 разных вин с сомелье',
      difficulty: 'hard',
      category: 'beverage',
      points: 300,
      duration: 120,
      requirements: ['Попробовать красное вино', 'Попробовать белое вино', 'Попробовать розовое вино', 'Узнать о регионах', 'Сделать заметки о вкусах'],
      rewards: ['150 бонусных очков', 'Сертификат дегустатора', 'Значок "Wine Expert"'],
      isCompleted: false,
      isLocked: false,
      progress: 0,
      icon: Wine,
      color: 'text-purple-500',
      location: 'Wine & Bottle Bar',
      participants: 8,
      rating: 4.7,
      tags: ['wine', 'tasting', 'expert']
    },
    {
      id: 'dessert-master',
      title: 'Dessert Master',
      description: 'Создайте свой идеальный десерт с шеф-кондитером',
      difficulty: 'expert',
      category: 'cooking',
      points: 500,
      duration: 180,
      requirements: ['Выбрать базовый десерт', 'Добавить 3 начинки', 'Создать уникальное сочетание', 'Украсить десерт', 'Поделиться рецептом'],
      rewards: ['250 бонусных очков', 'Персональный рецепт', 'Значок "Dessert Creator"'],
      isCompleted: false,
      isLocked: true,
      progress: 0,
      icon: ChefHat,
      color: 'text-pink-500',
      location: 'Sweet Dreams Kitchen',
      participants: 4,
      rating: 4.9,
      tags: ['dessert', 'cooking', 'creative']
    },
    {
      id: 'coffee-journey',
      title: 'Coffee Journey',
      description: 'Изучите весь путь кофе от зерна до чашки',
      difficulty: 'medium',
      category: 'beverage',
      points: 150,
      duration: 75,
      requirements: ['Попробовать эспрессо', 'Попробовать капучино', 'Попробовать латте', 'Узнать о сортах', 'Сфотографировать процесс'],
      rewards: ['75 бонусных очков', 'Кофейный набор', 'Значок "Coffee Lover"'],
      isCompleted: true,
      isLocked: false,
      progress: 100,
      icon: Coffee,
      color: 'text-amber-500',
      location: 'Beverage Bar',
      participants: 32,
      rating: 4.6,
      tags: ['coffee', 'beverage', 'education']
    }
  ];

  const getMockAchievements = (): Achievement[] => [
    {
      id: 'first-quest',
      title: 'First Steps',
      description: 'Завершите свой первый квест',
      icon: Star,
      points: 50,
      isUnlocked: true,
      unlockedAt: new Date('2024-01-15'),
      rarity: 'common'
    },
    {
      id: 'spice-master',
      title: 'Spice Master',
      description: 'Завершите 5 острых квестов',
      icon: Flame,
      points: 200,
      isUnlocked: false,
      rarity: 'rare'
    },
    {
      id: 'culture-keeper',
      title: 'Culture Keeper',
      description: 'Изучите все традиционные блюда',
      icon: Leaf,
      points: 300,
      isUnlocked: false,
      rarity: 'epic'
    },
    {
      id: 'taste-legend',
      title: 'Taste Legend',
      description: 'Завершите все квесты в системе',
      icon: Crown,
      points: 1000,
      isUnlocked: false,
      rarity: 'legendary'
    }
  ];

  useEffect(() => {
    setQuests(getMockQuests());
    setAchievements(getMockAchievements());
  }, []);

  const handleStartQuest = (quest: Quest) => {
    if (quest.isLocked) {
      toast({
        title: "Квест заблокирован",
        description: "Завершите предыдущие квесты для разблокировки",
        variant: "destructive"
      });
      return;
    }

    setSelectedQuest(quest);
    setShowQuestModal(true);
  };

  const handleCompleteQuest = (questId: string) => {
    setQuests(prev => prev.map(quest => 
      quest.id === questId 
        ? { ...quest, isCompleted: true, progress: 100 }
        : quest
    ));

    const quest = quests.find(q => q.id === questId);
    if (quest) {
      setUserProgress(prev => ({
        ...prev,
        experience: prev.experience + quest.points,
        totalPoints: prev.totalPoints + quest.points,
        questsCompleted: prev.questsCompleted + 1
      }));

      toast({
        title: "Квест завершен!",
        description: `Вы получили ${quest.points} очков опыта`,
      });
    }

    setShowQuestModal(false);
  };

  const handleToggleFavorite = (questId: string) => {
    setFavorites(prev => 
      prev.includes(questId) 
        ? prev.filter(id => id !== questId)
        : [...prev, questId]
    );
  };

  const handleShareQuest = (quest: Quest) => {
    if (navigator.share) {
      navigator.share({
        title: quest.title,
        text: quest.description,
        url: window.location.origin + `/taste-quest/${quest.id}`
      });
    } else {
      navigator.clipboard.writeText(window.location.origin + `/taste-quest/${quest.id}`);
      toast({
        title: "Ссылка скопирована",
        description: "Ссылка на квест скопирована в буфер обмена",
      });
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'hard': return 'text-orange-500';
      case 'expert': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Легкий';
      case 'medium': return 'Средний';
      case 'hard': return 'Сложный';
      case 'expert': return 'Эксперт';
      default: return 'Неизвестно';
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-500';
      case 'rare': return 'text-blue-500';
      case 'epic': return 'text-purple-500';
      case 'legendary': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  const compassSegments = [
    { label: "Erqi", color: "#F4B942", icon: Flame },
    { label: "Serv", color: "#D97B3A", icon: Coffee },
    { label: "Spice", color: "#C85A5A", icon: Zap },
    { label: "Umami", color: "#B83D5E", icon: Heart },
    { label: "Sour-Herb", color: "#8B5A8C", icon: Leaf },
    { label: "Local", color: "#4A90B8", icon: MapPin },
    { label: "Suren-Sult", color: "#2E8B57", icon: Wine },
    { label: "Vegan", color: "#6B8E23", icon: Leaf }
  ];

  return (
    <div className="min-h-screen bg-background">
      <ImprovedNavigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-burgundy-primary to-gold-accent bg-clip-text text-transparent mb-4">
              Taste Quest
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Отправьтесь в уникальное гастрономическое путешествие через 8 вкусовых секторов
            </p>
            
            {/* Interactive Compass */}
            <div className="relative w-80 h-80 mx-auto mb-8">
              <div className="absolute inset-0 rounded-full bg-white shadow-lg">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  {compassSegments.map((segment, index) => {
                    const angle = (360 / compassSegments.length) * index;
                    const nextAngle = (360 / compassSegments.length) * (index + 1);
                    const x1 = 100 + 80 * Math.cos((angle - 90) * Math.PI / 180);
                    const y1 = 100 + 80 * Math.sin((angle - 90) * Math.PI / 180);
                    const x2 = 100 + 80 * Math.cos((nextAngle - 90) * Math.PI / 180);
                    const y2 = 100 + 80 * Math.sin((nextAngle - 90) * Math.PI / 180);
                    
                    const largeArcFlag = nextAngle - angle <= 180 ? "0" : "1";
                    
                    return (
                      <g key={index}>
                        <path
                          d={`M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                          fill={segment.color}
                          stroke="white"
                          strokeWidth="2"
                          className="hover:opacity-80 transition-opacity cursor-pointer"
                        />
                        <text
                          x={100 + 60 * Math.cos((angle + 22.5 - 90) * Math.PI / 180)}
                          y={100 + 60 * Math.sin((angle + 22.5 - 90) * Math.PI / 180)}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="fill-white text-xs font-medium"
                        >
                          {segment.label}
                        </text>
                      </g>
                    );
                  })}
                  {/* Center Circle */}
                  <circle
                    cx="100"
                    cy="100"
                    r="35"
                    fill="white"
                    stroke="#ddd"
                    strokeWidth="2"
                  />
                  <text
                    x="100"
                    y="95"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-charcoal text-sm font-bold"
                  >
                    Taste
                  </text>
                  <text
                    x="100"
                    y="108"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-charcoal text-sm font-bold"
                  >
                    Compass
                  </text>
                </svg>
              </div>
            </div>

            <Button 
              className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-3 rounded-lg"
              onClick={() => navigate('/taste-compass')}
            >
              <Compass className="mr-2 h-5 w-5" />
              НАЧАТЬ TASTE QUEST
            </Button>
          </div>

          {/* User Progress */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Ваш прогресс
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{userProgress.level}</div>
                  <div className="text-sm text-muted-foreground">Уровень</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{userProgress.totalPoints}</div>
                  <div className="text-sm text-muted-foreground">Очки</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{userProgress.questsCompleted}</div>
                  <div className="text-sm text-muted-foreground">Квесты</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{userProgress.streak}</div>
                  <div className="text-sm text-muted-foreground">Серия</div>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Опыт до следующего уровня</span>
                  <span>{userProgress.experience}/{userProgress.experienceToNext}</span>
                </div>
                <Progress value={(userProgress.experience / userProgress.experienceToNext) * 100} />
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="quests">Квесты</TabsTrigger>
              <TabsTrigger value="achievements">Достижения</TabsTrigger>
              <TabsTrigger value="leaderboard">Рейтинг</TabsTrigger>
            </TabsList>

            {/* Quests Tab */}
            <TabsContent value="quests" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quests.map((quest) => {
                  const IconComponent = quest.icon;
                  const isFavorite = favorites.includes(quest.id);
                  
                  return (
                    <Card key={quest.id} className="hover:shadow-lg transition-shadow duration-300">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <IconComponent className={`h-5 w-5 ${quest.color}`} />
                              <CardTitle className="text-lg">{quest.title}</CardTitle>
                              {quest.isCompleted && (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              )}
                              {quest.isLocked && (
                                <Lock className="h-5 w-5 text-gray-400" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{quest.description}</p>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className={`text-xs ${getDifficultyColor(quest.difficulty)}`}>
                                {getDifficultyLabel(quest.difficulty)}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {quest.points} очков
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {quest.duration} мин
                              </Badge>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleFavorite(quest.id)}
                            className="p-1"
                          >
                            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
                          </Button>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          {/* Progress */}
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Прогресс</span>
                              <span>{quest.progress}%</span>
                            </div>
                            <Progress value={quest.progress} />
                          </div>

                          {/* Location and Rating */}
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span>{quest.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span>{quest.rating}</span>
                            </div>
                          </div>

                          {/* Participants */}
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span>{quest.participants} участников</span>
                          </div>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-1">
                            {quest.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleStartQuest(quest)}
                              disabled={quest.isLocked || quest.isCompleted}
                              className="flex-1"
                            >
                              {quest.isCompleted ? (
                                <>
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Завершен
                                </>
                              ) : quest.isLocked ? (
                                <>
                                  <Lock className="h-4 w-4 mr-1" />
                                  Заблокирован
                                </>
                              ) : (
                                <>
                                  <Play className="h-4 w-4 mr-1" />
                                  Начать
                                </>
                              )}
                            </Button>
                            <Button
                              onClick={() => handleShareQuest(quest)}
                              variant="outline"
                              size="sm"
                            >
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            {/* Achievements Tab */}
            <TabsContent value="achievements" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {achievements.map((achievement) => {
                  const IconComponent = achievement.icon;
                  
                  return (
                    <Card key={achievement.id} className={`${achievement.isUnlocked ? 'ring-2 ring-yellow-500' : 'opacity-60'}`}>
                      <CardContent className="p-6 text-center">
                        <div className="mb-4">
                          <IconComponent className={`h-12 w-12 mx-auto ${achievement.isUnlocked ? 'text-yellow-500' : 'text-gray-400'}`} />
                        </div>
                        <h3 className="font-semibold mb-2">{achievement.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{achievement.description}</p>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className={`text-xs ${getRarityColor(achievement.rarity)}`}>
                            {achievement.rarity}
                          </Badge>
                          <span className="text-sm font-medium">{achievement.points} очков</span>
                        </div>
                        {achievement.isUnlocked && achievement.unlockedAt && (
                          <div className="mt-2 text-xs text-muted-foreground">
                            Разблокировано: {achievement.unlockedAt.toLocaleDateString()}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            {/* Leaderboard Tab */}
            <TabsContent value="leaderboard" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Топ игроков</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { rank: 1, name: 'Анна Петрова', points: 2500, level: 15 },
                      { rank: 2, name: 'Марко Росси', points: 2300, level: 14 },
                      { rank: 3, name: 'Сара Грин', points: 2100, level: 13 },
                      { rank: 4, name: 'Джон Смит', points: 1900, level: 12 },
                      { rank: 5, name: 'Мария Сантос', points: 1700, level: 11 }
                    ].map((player) => (
                      <div key={player.rank} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-2">
                          {player.rank <= 3 ? (
                            <Trophy className={`h-5 w-5 ${player.rank === 1 ? 'text-yellow-500' : player.rank === 2 ? 'text-gray-400' : 'text-orange-500'}`} />
                          ) : (
                            <span className="w-5 h-5 text-center text-sm font-bold">{player.rank}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{player.name}</div>
                          <div className="text-sm text-muted-foreground">Уровень {player.level}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{player.points}</div>
                          <div className="text-sm text-muted-foreground">очков</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Quest Modal */}
      <Dialog open={showQuestModal} onOpenChange={setShowQuestModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Детали квеста</DialogTitle>
          </DialogHeader>
          {selectedQuest && (
            <div className="space-y-6">
              <div className="text-center">
                <selectedQuest.icon className={`h-12 w-12 mx-auto ${selectedQuest.color} mb-4`} />
                <h3 className="font-semibold text-xl">{selectedQuest.title}</h3>
                <p className="text-muted-foreground">{selectedQuest.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{selectedQuest.points}</div>
                  <div className="text-sm text-muted-foreground">Очков</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{selectedQuest.duration}</div>
                  <div className="text-sm text-muted-foreground">Минут</div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Требования:</h4>
                <ul className="space-y-1">
                  {selectedQuest.requirements.map((req, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Награды:</h4>
                <ul className="space-y-1">
                  {selectedQuest.rewards.map((reward, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <Gift className="h-4 w-4 text-yellow-500" />
                      {reward}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={() => setShowQuestModal(false)}
                  variant="outline" 
                  className="flex-1"
                >
                  Отмена
                </Button>
                <Button 
                  onClick={() => handleCompleteQuest(selectedQuest.id)}
                  className="flex-1"
                >
                  <Play className="h-4 w-4 mr-1" />
                  Начать квест
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TasteQuest;