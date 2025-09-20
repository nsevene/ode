import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Settings,
  Users,
  BarChart3,
  MapPin,
  Calendar,
  Trophy,
  Star,
  Zap,
  Crown,
  Target,
  Clock,
  Gift,
  AlertCircle,
  CheckCircle,
  Edit,
  Trash2,
  Plus,
  Eye,
  Download,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Sector {
  id: string;
  name: string;
  description: string;
  nfcTag: string;
  isActive: boolean;
  coordinates: {
    lat: number;
    lng: number;
  };
  visitCount: number;
  averageRating: number;
  lastActivity: string;
}

interface UserProgress {
  id: string;
  name: string;
  email: string;
  level: number;
  points: number;
  completedSectors: number;
  achievements: number;
  lastVisit: string;
  totalVisits: number;
}

interface Analytics {
  totalUsers: number;
  activeUsers: number;
  totalSectors: number;
  totalVisits: number;
  averageRating: number;
  popularSectors: Array<{
    name: string;
    visits: number;
    rating: number;
  }>;
  userGrowth: Array<{
    date: string;
    users: number;
  }>;
}

interface Event {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  participants: number;
  rewards: string[];
}

const AdminTasteCompass = () => {
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [users, setUsers] = useState<UserProgress[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedTab, setSelectedTab] = useState('sectors');
  const [editingSector, setEditingSector] = useState<Sector | null>(null);
  const [showAddSector, setShowAddSector] = useState(false);

  const { toast } = useToast();

  // Загрузка секторов
  useEffect(() => {
    const mockSectors: Sector[] = [
      {
        id: '1',
        name: 'Spicy Asia',
        description: 'Thai & Vietnamese flavors',
        nfcTag: 'spicy-asia-001',
        isActive: true,
        coordinates: { lat: 55.7558, lng: 37.6176 },
        visitCount: 245,
        averageRating: 4.5,
        lastActivity: '2024-01-25T14:30:00Z',
      },
      {
        id: '2',
        name: 'Wild Bali',
        description: 'Authentic Balinese cuisine',
        nfcTag: 'wild-bali-002',
        isActive: true,
        coordinates: { lat: 55.7558, lng: 37.6176 },
        visitCount: 189,
        averageRating: 4.3,
        lastActivity: '2024-01-25T12:15:00Z',
      },
      {
        id: '3',
        name: 'Dolce Italia',
        description: 'Sicilian & Tuscan specialties',
        nfcTag: 'dolce-italia-003',
        isActive: false,
        coordinates: { lat: 55.7558, lng: 37.6176 },
        visitCount: 156,
        averageRating: 4.7,
        lastActivity: '2024-01-24T18:45:00Z',
      },
    ];

    setSectors(mockSectors);
  }, []);

  // Загрузка пользователей
  useEffect(() => {
    const mockUsers: UserProgress[] = [
      {
        id: '1',
        name: 'Анна Петрова',
        email: 'anna@example.com',
        level: 5,
        points: 1250,
        completedSectors: 6,
        achievements: 12,
        lastVisit: '2024-01-25T14:30:00Z',
        totalVisits: 23,
      },
      {
        id: '2',
        name: 'Михаил Иванов',
        email: 'mikhail@example.com',
        level: 4,
        points: 980,
        completedSectors: 5,
        achievements: 8,
        lastVisit: '2024-01-25T12:15:00Z',
        totalVisits: 18,
      },
      {
        id: '3',
        name: 'Елена Смирнова',
        email: 'elena@example.com',
        level: 6,
        points: 1580,
        completedSectors: 7,
        achievements: 15,
        lastVisit: '2024-01-25T10:20:00Z',
        totalVisits: 31,
      },
    ];

    setUsers(mockUsers);
  }, []);

  // Загрузка аналитики
  useEffect(() => {
    const mockAnalytics: Analytics = {
      totalUsers: 1250,
      activeUsers: 89,
      totalSectors: 8,
      totalVisits: 3456,
      averageRating: 4.4,
      popularSectors: [
        { name: 'Spicy Asia', visits: 245, rating: 4.5 },
        { name: 'Wild Bali', visits: 189, rating: 4.3 },
        { name: 'Dolce Italia', visits: 156, rating: 4.7 },
      ],
      userGrowth: [
        { date: '2024-01-20', users: 1200 },
        { date: '2024-01-21', users: 1220 },
        { date: '2024-01-22', users: 1235 },
        { date: '2024-01-23', users: 1245 },
        { date: '2024-01-24', users: 1250 },
      ],
    };

    setAnalytics(mockAnalytics);
  }, []);

  // Загрузка событий
  useEffect(() => {
    const mockEvents: Event[] = [
      {
        id: '1',
        name: 'Зимний фестиваль вкусов',
        description: 'Специальные зимние блюда и горячие напитки',
        startDate: '2024-12-01',
        endDate: '2024-12-31',
        isActive: true,
        participants: 156,
        rewards: [
          'Эксклюзивный зимний значок',
          'Скидка 20% на горячие напитки',
        ],
      },
      {
        id: '2',
        name: 'Весеннее обновление',
        description: 'Свежие весенние ингредиенты и новые секторы',
        startDate: '2024-03-01',
        endDate: '2024-05-31',
        isActive: false,
        participants: 0,
        rewards: ['Весенний аватар', 'Бонусные очки'],
      },
    ];

    setEvents(mockEvents);
  }, []);

  // Переключение статуса сектора
  const toggleSectorStatus = (sectorId: string) => {
    setSectors((prev) =>
      prev.map((sector) =>
        sector.id === sectorId
          ? { ...sector, isActive: !sector.isActive }
          : sector
      )
    );

    toast({
      title: 'Статус сектора изменен',
      description: 'Статус сектора успешно обновлен',
    });
  };

  // Удаление сектора
  const deleteSector = (sectorId: string) => {
    setSectors((prev) => prev.filter((sector) => sector.id !== sectorId));

    toast({
      title: 'Сектор удален',
      description: 'Сектор успешно удален из системы',
    });
  };

  // Экспорт данных
  const exportData = (type: string) => {
    let data = '';
    let filename = '';

    switch (type) {
      case 'sectors':
        data = JSON.stringify(sectors, null, 2);
        filename = 'sectors.json';
        break;
      case 'users':
        data = JSON.stringify(users, null, 2);
        filename = 'users.json';
        break;
      case 'analytics':
        data = JSON.stringify(analytics, null, 2);
        filename = 'analytics.json';
        break;
      default:
        return;
    }

    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: 'Данные экспортированы',
      description: `Файл ${filename} загружен`,
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4">
      {/* Заголовок */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          ⚙️ Admin Taste Compass
        </h1>
        <p className="text-muted-foreground">
          Управление секторами, пользователями и аналитикой
        </p>
      </div>

      {/* Табы */}
      <Tabs
        value={selectedTab}
        onValueChange={setSelectedTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sectors">Секторы</TabsTrigger>
          <TabsTrigger value="users">Пользователи</TabsTrigger>
          <TabsTrigger value="analytics">Аналитика</TabsTrigger>
          <TabsTrigger value="events">События</TabsTrigger>
        </TabsList>

        {/* Вкладка секторов */}
        <TabsContent value="sectors" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Управление секторами</h2>
            <div className="flex gap-2">
              <Button onClick={() => setShowAddSector(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Добавить сектор
              </Button>
              <Button onClick={() => exportData('sectors')} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Экспорт
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sectors.map((sector) => (
              <Card key={sector.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {sector.name}
                    <Badge variant={sector.isActive ? 'default' : 'secondary'}>
                      {sector.isActive ? 'Активен' : 'Неактивен'}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {sector.description}
                  </p>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Посещений:</span>
                      <span className="font-medium">{sector.visitCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Рейтинг:</span>
                      <span className="font-medium">
                        {sector.averageRating}/5
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>NFC тег:</span>
                      <span className="font-mono text-xs">{sector.nfcTag}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleSectorStatus(sector.id)}
                    >
                      {sector.isActive ? 'Деактивировать' : 'Активировать'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingSector(sector)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteSector(sector.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Вкладка пользователей */}
        <TabsContent value="users" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Пользователи</h2>
            <Button onClick={() => exportData('users')} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Экспорт
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left p-4">Пользователь</th>
                      <th className="text-left p-4">Уровень</th>
                      <th className="text-left p-4">Очки</th>
                      <th className="text-left p-4">Секторы</th>
                      <th className="text-left p-4">Достижения</th>
                      <th className="text-left p-4">Последний визит</th>
                      <th className="text-left p-4">Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b">
                        <td className="p-4">
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {user.email}
                            </p>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline">Уровень {user.level}</Badge>
                        </td>
                        <td className="p-4 font-medium">{user.points}</td>
                        <td className="p-4">{user.completedSectors}/8</td>
                        <td className="p-4">{user.achievements}</td>
                        <td className="p-4 text-sm text-muted-foreground">
                          {new Date(user.lastVisit).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Вкладка аналитики */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Аналитика</h2>
            <Button onClick={() => exportData('analytics')} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Экспорт
            </Button>
          </div>

          {analytics && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">
                      {analytics.totalUsers}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Всего пользователей
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-secondary">
                      {analytics.activeUsers}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Активных сегодня
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-accent">
                      {analytics.totalVisits}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Всего посещений
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-500">
                      {analytics.averageRating}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Средний рейтинг
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {analytics && (
            <Card>
              <CardHeader>
                <CardTitle>Популярные секторы</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.popularSectors.map((sector, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{sector.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {sector.visits} посещений • Рейтинг: {sector.rating}/5
                        </p>
                      </div>
                      <Badge variant="outline">#{index + 1}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Вкладка событий */}
        <TabsContent value="events" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">События</h2>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Создать событие
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.map((event) => (
              <Card key={event.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {event.name}
                    <Badge variant={event.isActive ? 'default' : 'secondary'}>
                      {event.isActive ? 'Активно' : 'Неактивно'}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {event.description}
                  </p>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Период:</span>
                      <span>
                        {event.startDate} - {event.endDate}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Участников:</span>
                      <span className="font-medium">{event.participants}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Награды:</h4>
                    {event.rewards.map((reward, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-sm"
                      >
                        <Gift className="h-4 w-4 text-primary" />
                        <span>{reward}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4 mr-2" />
                      Редактировать
                    </Button>
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      Просмотр
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminTasteCompass;
