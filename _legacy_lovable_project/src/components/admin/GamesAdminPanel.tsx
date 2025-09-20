import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Plus,
  Edit,
  Trash2,
  GamepadIcon,
  Trophy,
  Clock,
  Star,
  Users,
  TrendingUp,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface MiniGame {
  id: string;
  name: string;
  description: string;
  sector_id: string;
  game_type: 'memory' | 'quiz' | 'timing' | 'puzzle';
  difficulty: 'easy' | 'medium' | 'hard';
  base_points: number;
  time_limit?: number;
  is_active: boolean;
  created_at: string;
}

interface DailyQuest {
  id: string;
  title: string;
  description: string;
  quest_type: string;
  target_value: number;
  reward_points: number;
  reward_description?: string;
  is_active: boolean;
  quest_date: string;
  created_at: string;
}

interface GameStats {
  totalGames: number;
  activeGames: number;
  totalPlays: number;
  averageScore: number;
}

interface QuestStats {
  totalQuests: number;
  activeQuests: number;
  completionRate: number;
  totalRewards: number;
}

export const GamesAdminPanel = () => {
  const [games, setGames] = useState<MiniGame[]>([]);
  const [quests, setQuests] = useState<DailyQuest[]>([]);
  const [gameStats, setGameStats] = useState<GameStats>({
    totalGames: 0,
    activeGames: 0,
    totalPlays: 0,
    averageScore: 0,
  });
  const [questStats, setQuestStats] = useState<QuestStats>({
    totalQuests: 0,
    activeQuests: 0,
    completionRate: 0,
    totalRewards: 0,
  });

  const [loading, setLoading] = useState(true);
  const [isCreateGameOpen, setIsCreateGameOpen] = useState(false);
  const [isCreateQuestOpen, setIsCreateQuestOpen] = useState(false);
  const [editingGame, setEditingGame] = useState<MiniGame | null>(null);
  const [editingQuest, setEditingQuest] = useState<DailyQuest | null>(null);

  const { user } = useAuth();
  const { toast } = useToast();

  // Form states
  const [gameForm, setGameForm] = useState({
    name: '',
    description: '',
    sector_id: '',
    game_type: 'memory' as const,
    difficulty: 'easy' as const,
    base_points: 10,
    time_limit: 60,
    is_active: true,
  });

  const [questForm, setQuestForm] = useState({
    title: '',
    description: '',
    quest_type: '',
    target_value: 1,
    reward_points: 10,
    reward_description: '',
    is_active: true,
    quest_date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([loadGames(), loadQuests(), loadStats()]);
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadGames = async () => {
    const { data, error } = await supabase
      .from('mini_games')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading games:', error);
      return;
    }

    if (data) {
      setGames(data as unknown as MiniGame[]);
    }
  };

  const loadQuests = async () => {
    const { data, error } = await supabase
      .from('daily_quests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading quests:', error);
      return;
    }

    if (data) {
      setQuests(data as unknown as DailyQuest[]);
    }
  };

  const loadStats = async () => {
    // Load game statistics
    const { data: gameResults } = await supabase
      .from('user_mini_game_results')
      .select('score');

    const { data: questProgress } = await supabase
      .from('user_quest_progress')
      .select('completed');

    if (gameResults) {
      const avgScore =
        gameResults.length > 0
          ? gameResults.reduce((sum, result) => sum + (result.score || 0), 0) /
            gameResults.length
          : 0;

      setGameStats({
        totalGames: games.length,
        activeGames: games.filter((g) => g.is_active).length,
        totalPlays: gameResults.length,
        averageScore: Math.round(avgScore),
      });
    }

    if (questProgress) {
      const completedQuests = questProgress.filter((q) => q.completed).length;
      const completionRate =
        questProgress.length > 0
          ? (completedQuests / questProgress.length) * 100
          : 0;

      setQuestStats({
        totalQuests: quests.length,
        activeQuests: quests.filter((q) => q.is_active).length,
        completionRate: Math.round(completionRate),
        totalRewards: quests.reduce(
          (sum, quest) => sum + quest.reward_points,
          0
        ),
      });
    }
  };

  const handleCreateGame = async () => {
    try {
      const { error } = await supabase.from('mini_games').insert([gameForm]);

      if (error) throw error;

      toast({
        title: 'Игра создана!',
        description: 'Новая мини-игра успешно добавлена',
      });

      setIsCreateGameOpen(false);
      resetGameForm();
      loadGames();
    } catch (error) {
      console.error('Error creating game:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось создать игру',
        variant: 'destructive',
      });
    }
  };

  const handleCreateQuest = async () => {
    try {
      const { error } = await supabase.from('daily_quests').insert([questForm]);

      if (error) throw error;

      toast({
        title: 'Квест создан!',
        description: 'Новый ежедневный квест успешно добавлен',
      });

      setIsCreateQuestOpen(false);
      resetQuestForm();
      loadQuests();
    } catch (error) {
      console.error('Error creating quest:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось создать квест',
        variant: 'destructive',
      });
    }
  };

  const handleToggleGameStatus = async (gameId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('mini_games')
        .update({ is_active: isActive })
        .eq('id', gameId);

      if (error) throw error;

      toast({
        title: isActive ? 'Игра активирована' : 'Игра деактивирована',
        description: 'Статус игры успешно изменен',
      });

      loadGames();
    } catch (error) {
      console.error('Error updating game status:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось изменить статус игры',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteGame = async (gameId: string) => {
    if (!confirm('Вы уверены, что хотите удалить эту игру?')) return;

    try {
      const { error } = await supabase
        .from('mini_games')
        .delete()
        .eq('id', gameId);

      if (error) throw error;

      toast({
        title: 'Игра удалена',
        description: 'Игра успешно удалена из системы',
      });

      loadGames();
    } catch (error) {
      console.error('Error deleting game:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить игру',
        variant: 'destructive',
      });
    }
  };

  const resetGameForm = () => {
    setGameForm({
      name: '',
      description: '',
      sector_id: '',
      game_type: 'memory',
      difficulty: 'easy',
      base_points: 10,
      time_limit: 60,
      is_active: true,
    });
  };

  const resetQuestForm = () => {
    setQuestForm({
      title: '',
      description: '',
      quest_type: '',
      target_value: 1,
      reward_points: 10,
      reward_description: '',
      is_active: true,
      quest_date: new Date().toISOString().split('T')[0],
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getGameTypeIcon = (type: string) => {
    switch (type) {
      case 'memory':
        return '🧠';
      case 'quiz':
        return '❓';
      case 'timing':
        return '⏱️';
      case 'puzzle':
        return '🧩';
      default:
        return '🎮';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Загрузка админ-панели...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Управление играми и квестами</h1>
          <p className="text-muted-foreground">
            Создавайте и управляйте мини-играми и ежедневными квестами
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего игр</CardTitle>
            <GamepadIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{gameStats.totalGames}</div>
            <p className="text-xs text-muted-foreground">
              {gameStats.activeGames} активных
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Игровых сессий
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{gameStats.totalPlays}</div>
            <p className="text-xs text-muted-foreground">
              Ср. счет: {gameStats.averageScore}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего квестов</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{questStats.totalQuests}</div>
            <p className="text-xs text-muted-foreground">
              {questStats.activeQuests} активных
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Выполнение квестов
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {questStats.completionRate}%
            </div>
            <p className="text-xs text-muted-foreground">
              {questStats.totalRewards} очков наград
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="games" className="space-y-6">
        <TabsList>
          <TabsTrigger value="games">Мини-игры</TabsTrigger>
          <TabsTrigger value="quests">Ежедневные квесты</TabsTrigger>
        </TabsList>

        <TabsContent value="games" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Мини-игры</h2>
            <Dialog open={isCreateGameOpen} onOpenChange={setIsCreateGameOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Создать игру
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Создать новую мини-игру</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="game-name">Название игры</Label>
                    <Input
                      id="game-name"
                      value={gameForm.name}
                      onChange={(e) =>
                        setGameForm((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      placeholder="Название игры"
                    />
                  </div>

                  <div>
                    <Label htmlFor="game-description">Описание</Label>
                    <Textarea
                      id="game-description"
                      value={gameForm.description}
                      onChange={(e) =>
                        setGameForm((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Описание игры"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="game-type">Тип игры</Label>
                      <Select
                        value={gameForm.game_type}
                        onValueChange={(value: any) =>
                          setGameForm((prev) => ({ ...prev, game_type: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="memory">🧠 Память</SelectItem>
                          <SelectItem value="quiz">❓ Викторина</SelectItem>
                          <SelectItem value="timing">⏱️ На время</SelectItem>
                          <SelectItem value="puzzle">🧩 Головоломка</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="game-difficulty">Сложность</Label>
                      <Select
                        value={gameForm.difficulty}
                        onValueChange={(value: any) =>
                          setGameForm((prev) => ({
                            ...prev,
                            difficulty: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy">Легко</SelectItem>
                          <SelectItem value="medium">Средне</SelectItem>
                          <SelectItem value="hard">Сложно</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="base-points">Базовые очки</Label>
                      <Input
                        id="base-points"
                        type="number"
                        value={gameForm.base_points}
                        onChange={(e) =>
                          setGameForm((prev) => ({
                            ...prev,
                            base_points: Number(e.target.value),
                          }))
                        }
                        min="1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="time-limit">Лимит времени (сек)</Label>
                      <Input
                        id="time-limit"
                        type="number"
                        value={gameForm.time_limit}
                        onChange={(e) =>
                          setGameForm((prev) => ({
                            ...prev,
                            time_limit: Number(e.target.value),
                          }))
                        }
                        min="10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="sector-id">ID сектора</Label>
                    <Input
                      id="sector-id"
                      value={gameForm.sector_id}
                      onChange={(e) =>
                        setGameForm((prev) => ({
                          ...prev,
                          sector_id: e.target.value,
                        }))
                      }
                      placeholder="taste_sector_1"
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsCreateGameOpen(false)}
                    >
                      Отмена
                    </Button>
                    <Button onClick={handleCreateGame} className="flex-1">
                      Создать игру
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Игра</TableHead>
                  <TableHead>Тип</TableHead>
                  <TableHead>Сложность</TableHead>
                  <TableHead>Очки</TableHead>
                  <TableHead>Время</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {games.map((game) => (
                  <TableRow key={game.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{game.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {game.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>{getGameTypeIcon(game.game_type)}</span>
                        <span className="capitalize">{game.game_type}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getDifficultyColor(game.difficulty)}>
                        {game.difficulty}
                      </Badge>
                    </TableCell>
                    <TableCell>{game.base_points}</TableCell>
                    <TableCell>{game.time_limit}s</TableCell>
                    <TableCell>
                      <Switch
                        checked={game.is_active}
                        onCheckedChange={(checked) =>
                          handleToggleGameStatus(game.id, checked)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteGame(game.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="quests" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Ежедневные квесты</h2>
            <Dialog
              open={isCreateQuestOpen}
              onOpenChange={setIsCreateQuestOpen}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Создать квест
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Создать новый квест</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="quest-title">Название квеста</Label>
                    <Input
                      id="quest-title"
                      value={questForm.title}
                      onChange={(e) =>
                        setQuestForm((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      placeholder="Название квеста"
                    />
                  </div>

                  <div>
                    <Label htmlFor="quest-description">Описание</Label>
                    <Textarea
                      id="quest-description"
                      value={questForm.description}
                      onChange={(e) =>
                        setQuestForm((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Описание квеста"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="quest-type">Тип квеста</Label>
                      <Input
                        id="quest-type"
                        value={questForm.quest_type}
                        onChange={(e) =>
                          setQuestForm((prev) => ({
                            ...prev,
                            quest_type: e.target.value,
                          }))
                        }
                        placeholder="vendor_visits"
                      />
                    </div>

                    <div>
                      <Label htmlFor="target-value">Целевое значение</Label>
                      <Input
                        id="target-value"
                        type="number"
                        value={questForm.target_value}
                        onChange={(e) =>
                          setQuestForm((prev) => ({
                            ...prev,
                            target_value: Number(e.target.value),
                          }))
                        }
                        min="1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="reward-points">Очки награды</Label>
                      <Input
                        id="reward-points"
                        type="number"
                        value={questForm.reward_points}
                        onChange={(e) =>
                          setQuestForm((prev) => ({
                            ...prev,
                            reward_points: Number(e.target.value),
                          }))
                        }
                        min="1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="quest-date">Дата квеста</Label>
                      <Input
                        id="quest-date"
                        type="date"
                        value={questForm.quest_date}
                        onChange={(e) =>
                          setQuestForm((prev) => ({
                            ...prev,
                            quest_date: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="reward-description">Описание награды</Label>
                    <Input
                      id="reward-description"
                      value={questForm.reward_description}
                      onChange={(e) =>
                        setQuestForm((prev) => ({
                          ...prev,
                          reward_description: e.target.value,
                        }))
                      }
                      placeholder="Описание награды"
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsCreateQuestOpen(false)}
                    >
                      Отмена
                    </Button>
                    <Button onClick={handleCreateQuest} className="flex-1">
                      Создать квест
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Квест</TableHead>
                  <TableHead>Тип</TableHead>
                  <TableHead>Цель</TableHead>
                  <TableHead>Награда</TableHead>
                  <TableHead>Дата</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quests.map((quest) => (
                  <TableRow key={quest.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{quest.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {quest.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{quest.quest_type}</Badge>
                    </TableCell>
                    <TableCell>{quest.target_value}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {quest.reward_points} очков
                        </div>
                        {quest.reward_description && (
                          <div className="text-sm text-muted-foreground">
                            {quest.reward_description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(quest.quest_date).toLocaleDateString('ru-RU')}
                    </TableCell>
                    <TableCell>
                      <Switch checked={quest.is_active} />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
