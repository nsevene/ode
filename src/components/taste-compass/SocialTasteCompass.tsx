import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Share2, 
  Users, 
  Trophy, 
  Star, 
  Heart,
  MessageCircle,
  Instagram,
  Facebook,
  Twitter,
  Copy,
  CheckCircle,
  Crown,
  Zap,
  Target
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Friend {
  id: string;
  name: string;
  avatar: string;
  level: number;
  points: number;
  completedSectors: number;
  achievements: number;
  isOnline: boolean;
  lastActivity: string;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  unlockedAt: string;
}

interface LeaderboardEntry {
  rank: number;
  user: Friend;
  score: number;
  badge: string;
}

const SocialTasteCompass = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [selectedTab, setSelectedTab] = useState('friends');
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);
  
  const { toast } = useToast();

  // Загрузка данных друзей
  useEffect(() => {
    const mockFriends: Friend[] = [
      {
        id: '1',
        name: 'Анна Петрова',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
        level: 5,
        points: 1250,
        completedSectors: 6,
        achievements: 12,
        isOnline: true,
        lastActivity: '2 минуты назад'
      },
      {
        id: '2',
        name: 'Михаил Иванов',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        level: 4,
        points: 980,
        completedSectors: 5,
        achievements: 8,
        isOnline: false,
        lastActivity: '1 час назад'
      },
      {
        id: '3',
        name: 'Елена Смирнова',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
        level: 6,
        points: 1580,
        completedSectors: 7,
        achievements: 15,
        isOnline: true,
        lastActivity: '5 минут назад'
      }
    ];
    
    setFriends(mockFriends);
  }, []);

  // Загрузка достижений
  useEffect(() => {
    const mockAchievements: Achievement[] = [
      {
        id: '1',
        name: 'Первый шаг',
        description: 'Посетили первый сектор Taste Compass',
        icon: '👣',
        rarity: 'common',
        points: 50,
        unlockedAt: '2024-01-15T10:30:00Z'
      },
      {
        id: '2',
        name: 'Мастер специй',
        description: 'Завершили сектор Spicy Asia',
        icon: '🌶️',
        rarity: 'rare',
        points: 100,
        unlockedAt: '2024-01-20T14:15:00Z'
      },
      {
        id: '3',
        name: 'Компас Мастер',
        description: 'Завершили все секторы Taste Compass',
        icon: '🧭',
        rarity: 'legendary',
        points: 500,
        unlockedAt: '2024-01-25T18:45:00Z'
      }
    ];
    
    setAchievements(mockAchievements);
  }, []);

  // Загрузка лидерборда
  useEffect(() => {
    const mockLeaderboard: LeaderboardEntry[] = [
      {
        rank: 1,
        user: {
          id: '1',
          name: 'Анна Петрова',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
          level: 5,
          points: 1250,
          completedSectors: 6,
          achievements: 12,
          isOnline: true,
          lastActivity: '2 минуты назад'
        },
        score: 1250,
        badge: '🥇'
      },
      {
        rank: 2,
        user: {
          id: '2',
          name: 'Михаил Иванов',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
          level: 4,
          points: 980,
          completedSectors: 5,
          achievements: 8,
          isOnline: false,
          lastActivity: '1 час назад'
        },
        score: 980,
        badge: '🥈'
      },
      {
        rank: 3,
        user: {
          id: '3',
          name: 'Елена Смирнова',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
          level: 6,
          points: 1580,
          completedSectors: 7,
          achievements: 15,
          isOnline: true,
          lastActivity: '5 минут назад'
        },
        score: 1580,
        badge: '🥉'
      }
    ];
    
    setLeaderboard(mockLeaderboard);
  }, []);

  // Генерация ссылки для шаринга
  const generateShareUrl = () => {
    const baseUrl = window.location.origin;
    const shareUrl = `${baseUrl}/taste-compass/share?user=${encodeURIComponent('Ваш профиль')}`;
    setShareUrl(shareUrl);
    return shareUrl;
  };

  // Копирование ссылки
  const copyShareUrl = async () => {
    const url = generateShareUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast({
        title: "Ссылка скопирована!",
        description: "Поделитесь своим прогрессом с друзьями",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Ошибка копирования",
        description: "Не удалось скопировать ссылку",
        variant: "destructive"
      });
    }
  };

  // Шаринг в социальных сетях
  const shareToSocial = (platform: string) => {
    const url = generateShareUrl();
    const text = "Посмотрите мой прогресс в Taste Compass ODE Food Hall!";
    
    let shareUrl = '';
    
    switch (platform) {
      case 'instagram':
        // Instagram не поддерживает прямые ссылки, используем копирование
        copyShareUrl();
        return;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  // Получение цвета редкости достижения
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
      case 'legendary': return <Trophy className="h-4 w-4" />;
      default: return <Star className="h-4 w-4" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4">
      {/* Заголовок */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          👥 Social Taste Compass
        </h1>
        <p className="text-muted-foreground">
          Сравните свой прогресс с друзьями и поделитесь достижениями
        </p>
      </div>

      {/* Табы */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="friends">Друзья</TabsTrigger>
          <TabsTrigger value="achievements">Достижения</TabsTrigger>
          <TabsTrigger value="leaderboard">Лидерборд</TabsTrigger>
        </TabsList>

        {/* Вкладка друзей */}
        <TabsContent value="friends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Ваши друзья
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {friends.map(friend => (
                <div key={friend.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={friend.avatar} alt={friend.name} />
                        <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {friend.isOnline && (
                        <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{friend.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Уровень {friend.level} • {friend.points} очков
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {friend.completedSectors} секторов
                      </Badge>
                      <Badge variant="secondary">
                        {friend.achievements} достижений
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {friend.lastActivity}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Вкладка достижений */}
        <TabsContent value="achievements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Ваши достижения
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {achievements.map(achievement => (
                <div key={achievement.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div>
                      <p className="font-medium">{achievement.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getRarityColor(achievement.rarity)}>
                      {getRarityIcon(achievement.rarity)}
                      <span className="ml-1 capitalize">{achievement.rarity}</span>
                    </Badge>
                    <Badge variant="outline">
                      +{achievement.points} очков
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Вкладка лидерборда */}
        <TabsContent value="leaderboard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5" />
                Таблица лидеров
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {leaderboard.map(entry => (
                <div key={entry.rank} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{entry.badge}</div>
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={entry.user.avatar} alt={entry.user.name} />
                      <AvatarFallback>{entry.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{entry.user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Уровень {entry.user.level}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{entry.score}</p>
                    <p className="text-sm text-muted-foreground">очков</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Шаринг достижений */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Поделиться прогрессом
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Button
              onClick={copyShareUrl}
              variant={copied ? "outline" : "default"}
              className="flex-1"
            >
              {copied ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Скопировано!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Копировать ссылку
                </>
              )}
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={() => shareToSocial('instagram')}
              variant="outline"
              className="flex-1"
            >
              <Instagram className="h-4 w-4 mr-2" />
              Instagram
            </Button>
            <Button
              onClick={() => shareToSocial('facebook')}
              variant="outline"
              className="flex-1"
            >
              <Facebook className="h-4 w-4 mr-2" />
              Facebook
            </Button>
            <Button
              onClick={() => shareToSocial('twitter')}
              variant="outline"
              className="flex-1"
            >
              <Twitter className="h-4 w-4 mr-2" />
              Twitter
            </Button>
          </div>
          
          {shareUrl && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Ссылка для шаринга:</p>
              <p className="font-mono text-xs break-all">{shareUrl}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Командные квесты */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Командные квесты
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Семейный квест</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Посетите все секторы вместе с семьей
              </p>
              <div className="flex items-center justify-between">
                <Badge variant="outline">4 участника</Badge>
                <Button size="sm">Присоединиться</Button>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Корпоративный вызов</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Командное соревнование между отделами
              </p>
              <div className="flex items-center justify-between">
                <Badge variant="outline">12 участников</Badge>
                <Button size="sm">Создать команду</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SocialTasteCompass;
