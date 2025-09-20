import { useState, useEffect, Suspense, lazy } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from 'recharts';
import {
  CalendarDays,
  Users,
  TrendingUp,
  DollarSign,
  Star,
  Wine,
  Mail,
  Target,
  Search,
  Filter,
  Download,
  RefreshCw,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Settings,
  Bell,
  Shield,
  Database,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  PieChart as PieChartIcon,
} from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from '@/hooks/use-toast';

// Lazy loading для тяжелых компонентов
const EventsManagement = lazy(
  () => import('@/components/admin/EventsManagement')
);
const NotificationSystem = lazy(
  () => import('@/components/admin/NotificationSystem')
);
const ExportData = lazy(() => import('@/components/admin/ExportData'));
const VendorManagement = lazy(
  () => import('@/components/admin/VendorManagement')
);
const MenuManagement = lazy(() => import('@/components/admin/MenuManagement'));
const ApplicationsManagement = lazy(
  () => import('@/components/admin/ApplicationsManagement')
);
const SpaceBookingManagement = lazy(
  () => import('@/components/admin/SpaceBookingManagement')
);
const TenantAnalytics = lazy(
  () => import('@/components/admin/TenantAnalytics')
);
const ContractsModule = lazy(
  () => import('@/components/admin/ContractsModule')
);
const DocumentsManagement = lazy(
  () => import('@/components/admin/DocumentsManagement')
);

// Mock data с реалистичными значениями
const mockAnalyticsData = {
  overview: {
    totalBookings: 1247,
    totalRevenue: 18650000,
    conversionRate: 34.7,
    avgRating: 4.8,
    activeUsers: 890,
    newUsersToday: 23,
  },
  bookings: [
    { month: 'Июл', count: 89, revenue: 4450000, growth: 12 },
    { month: 'Авг', count: 134, revenue: 6700000, growth: 25 },
    { month: 'Сен', count: 178, revenue: 8900000, growth: 18 },
    { month: 'Окт', count: 203, revenue: 10150000, growth: 22 },
    { month: 'Ноя', count: 267, revenue: 13350000, growth: 31 },
    { month: 'Дек', count: 289, revenue: 14450000, growth: 15 },
  ],
  experiences: [
    { name: 'Wine Staircase', bookings: 234, percentage: 38, revenue: 7020000 },
    { name: 'Taste Compass', bookings: 189, percentage: 31, revenue: 4725000 },
    { name: "Chef's Table", bookings: 124, percentage: 20, revenue: 6200000 },
    {
      name: 'Lounge Experience',
      bookings: 67,
      percentage: 11,
      revenue: 2010000,
    },
  ],
  dailyActivity: [
    { time: '09:00', bookings: 12, visitors: 45 },
    { time: '10:00', bookings: 18, visitors: 67 },
    { time: '11:00', bookings: 24, visitors: 89 },
    { time: '12:00', bookings: 35, visitors: 134 },
    { time: '13:00', bookings: 42, visitors: 178 },
    { time: '14:00', bookings: 38, visitors: 156 },
    { time: '15:00', bookings: 29, visitors: 123 },
    { time: '16:00', bookings: 33, visitors: 145 },
    { time: '17:00', bookings: 46, visitors: 189 },
    { time: '18:00', bookings: 52, visitors: 234 },
    { time: '19:00', bookings: 49, visitors: 201 },
    { time: '20:00', bookings: 41, visitors: 167 },
    { time: '21:00', bookings: 28, visitors: 98 },
    { time: '22:00', bookings: 15, visitors: 56 },
  ],
};

const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

interface QuickAction {
  title: string;
  description: string;
  icon: any;
  action: () => void;
  variant: 'default' | 'destructive' | 'outline';
}

export default function EnhancedAdminDashboard() {
  const { trackPageView } = useAnalytics();
  const [realTimeEvents, setRealTimeEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('30');
  const [notifications, setNotifications] = useState(3);
  const isMobile = useIsMobile();

  useEffect(() => {
    loadRealTimeData();
    const interval = setInterval(loadRealTimeData, 30000); // Обновление каждые 30 секунд
    return () => clearInterval(interval);
  }, []);

  const loadRealTimeData = async () => {
    setLoading(true);
    try {
      // Симуляция загрузки данных
      await new Promise((resolve) => setTimeout(resolve, 500));
      const events = getAnalyticsData();
      setRealTimeEvents(events.slice(-25)); // Последние 25 событий
    } catch (error) {
      console.error('Error loading real-time data:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions: QuickAction[] = [
    {
      title: 'Создать событие',
      description: 'Добавить новое мероприятие',
      icon: CalendarDays,
      action: () =>
        toast({
          title: 'Перенаправление...',
          description: 'Переход к созданию события',
        }),
      variant: 'default',
    },
    {
      title: 'Отправить уведомление',
      description: 'Массовая рассылка пользователям',
      icon: Bell,
      action: () =>
        toast({
          title: 'Отправлено',
          description: 'Уведомление отправлено пользователям',
        }),
      variant: 'outline',
    },
    {
      title: 'Экспорт данных',
      description: 'Выгрузить аналитику за период',
      icon: Download,
      action: () =>
        toast({ title: 'Экспорт', description: 'Начата выгрузка данных' }),
      variant: 'outline',
    },
    {
      title: 'Очистить кэш',
      description: 'Принудительная очистка кэша',
      icon: RefreshCw,
      action: () =>
        toast({ title: 'Очищено', description: 'Кэш системы очищен' }),
      variant: 'destructive',
    },
  ];

  const systemAlerts = [
    {
      type: 'warning',
      message: 'Высокая нагрузка на сервер (89% CPU)',
      time: '2 мин назад',
    },
    {
      type: 'info',
      message: 'Планируется обновление в 02:00',
      time: '1 час назад',
    },
    {
      type: 'success',
      message: 'Резервное копирование завершено',
      time: '3 часа назад',
    },
  ];

  const formatCurrency = (amount: number) => {
    return `${(amount / 1000000).toFixed(1)}M ₽`;
  };

  const StatCard = ({
    title,
    value,
    change,
    icon: Icon,
    format = 'number',
  }: any) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {format === 'currency'
            ? formatCurrency(value)
            : format === 'percentage'
              ? `${value}%`
              : value.toLocaleString()}
        </div>
        {change && (
          <p className="text-xs text-muted-foreground">
            <span className={change > 0 ? 'text-green-600' : 'text-red-600'}>
              {change > 0 ? '+' : ''}
              {change}%
            </span>{' '}
            от прошлого месяца
          </p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div
      className={`container mx-auto py-8 px-4 ${isMobile ? 'space-y-4' : 'space-y-6'}`}
    >
      {/* Заголовок с действиями */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Административная панель</h1>
          <p className="text-muted-foreground">
            Управление и аналитика ODE Food Hall
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Bell className="w-5 h-5" />
            {notifications > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                {notifications}
              </Badge>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={loadRealTimeData}
            disabled={loading}
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`}
            />
            Обновить
          </Button>
        </div>
      </div>

      {/* Системные уведомления */}
      {systemAlerts.length > 0 && (
        <div className="space-y-2">
          {systemAlerts.slice(0, 3).map((alert, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 p-3 rounded-lg border ${
                alert.type === 'warning'
                  ? 'bg-yellow-50 border-yellow-200'
                  : alert.type === 'info'
                    ? 'bg-blue-50 border-blue-200'
                    : 'bg-green-50 border-green-200'
              }`}
            >
              {alert.type === 'warning' && (
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
              )}
              {alert.type === 'info' && (
                <Clock className="w-4 h-4 text-blue-600" />
              )}
              {alert.type === 'success' && (
                <CheckCircle className="w-4 h-4 text-green-600" />
              )}
              <span className="text-sm font-medium flex-1">
                {alert.message}
              </span>
              <span className="text-xs text-muted-foreground">
                {alert.time}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Быстрые действия */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map((action, index) => (
          <Button
            key={index}
            variant={action.variant}
            className="h-auto p-4 flex flex-col items-center gap-2"
            onClick={action.action}
          >
            <action.icon className="w-6 h-6" />
            <div className="text-center">
              <div className="font-medium text-sm">{action.title}</div>
              <div className="text-xs opacity-70">{action.description}</div>
            </div>
          </Button>
        ))}
      </div>

      <Tabs defaultValue="analytics" className="space-y-6">
        <TabsList
          className={`grid w-full ${isMobile ? 'grid-cols-4' : 'grid-cols-12'}`}
        >
          <TabsTrigger value="analytics">Аналитика</TabsTrigger>
          <TabsTrigger value="vendors">Вендоры</TabsTrigger>
          <TabsTrigger value="menu">Меню</TabsTrigger>
          <TabsTrigger value="events">События</TabsTrigger>
          <TabsTrigger value="applications">Заявки</TabsTrigger>
          <TabsTrigger value="tenant-applications">Арендаторы</TabsTrigger>
          <TabsTrigger value="contracts">Контракты</TabsTrigger>
          <TabsTrigger value="documents">Документы</TabsTrigger>
          <TabsTrigger value="users">Пользователи</TabsTrigger>
          {!isMobile && (
            <TabsTrigger value="notifications">Уведомления</TabsTrigger>
          )}
          {!isMobile && <TabsTrigger value="data">Данные</TabsTrigger>}
          {!isMobile && <TabsTrigger value="realtime">Real-time</TabsTrigger>}
        </TabsList>

        <TabsContent value="analytics" className="space-y-6">
          {/* Фильтры */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Поиск по аналитике..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-[250px]"
                />
              </div>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 дней</SelectItem>
                  <SelectItem value="30">30 дней</SelectItem>
                  <SelectItem value="90">90 дней</SelectItem>
                  <SelectItem value="365">1 год</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Фильтры
            </Button>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <StatCard
              title="Всего бронирований"
              value={mockAnalyticsData.overview.totalBookings}
              change={15}
              icon={CalendarDays}
            />
            <StatCard
              title="Выручка"
              value={mockAnalyticsData.overview.totalRevenue}
              change={23}
              icon={DollarSign}
              format="currency"
            />
            <StatCard
              title="Конверсия"
              value={mockAnalyticsData.overview.conversionRate}
              change={8}
              icon={Target}
              format="percentage"
            />
            <StatCard
              title="Рейтинг"
              value={mockAnalyticsData.overview.avgRating}
              change={0.3}
              icon={Star}
            />
            <StatCard
              title="Активные пользователи"
              value={mockAnalyticsData.overview.activeUsers}
              change={12}
              icon={Users}
            />
            <StatCard
              title="Новые пользователи"
              value={mockAnalyticsData.overview.newUsersToday}
              change={-5}
              icon={TrendingUp}
            />
          </div>

          {/* Графики */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Динамика бронирований</CardTitle>
                <CardDescription>
                  Бронирования и выручка по месяцам
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={mockAnalyticsData.bookings}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip
                      formatter={(value, name) => [
                        name === 'count'
                          ? value
                          : formatCurrency(value as number),
                        name === 'count' ? 'Бронирований' : 'Выручка',
                      ]}
                    />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="count"
                      stackId="1"
                      stroke="#8b5cf6"
                      fill="#8b5cf6"
                      fillOpacity={0.6}
                    />
                    <Area
                      yAxisId="right"
                      type="monotone"
                      dataKey="revenue"
                      stackId="2"
                      stroke="#06b6d4"
                      fill="#06b6d4"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Популярность опций</CardTitle>
                <CardDescription>
                  Распределение бронирований по типам
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={mockAnalyticsData.experiences}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="bookings"
                      label={({ name, percentage }) => `${name} ${percentage}%`}
                    >
                      {mockAnalyticsData.experiences.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Активность по времени */}
          <Card>
            <CardHeader>
              <CardTitle>Активность в течение дня</CardTitle>
              <CardDescription>
                Распределение бронирований и посетителей по часам
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={mockAnalyticsData.dailyActivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="bookings"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                  />
                  <Line
                    type="monotone"
                    dataKey="visitors"
                    stroke="#06b6d4"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Детальная таблица */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Топ-опции по выручке
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAnalyticsData.experiences.map((exp, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full`}
                        style={{ backgroundColor: COLORS[index] }}
                      />
                      <div>
                        <p className="font-medium">{exp.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {exp.bookings} бронирований
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatCurrency(exp.revenue)}</p>
                      <Badge variant="secondary">{exp.percentage}%</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events">
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-64">
                Загрузка...
              </div>
            }
          >
            <EventsManagement />
          </Suspense>
        </TabsContent>

        <TabsContent value="vendors">
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-64">
                Загрузка...
              </div>
            }
          >
            <VendorManagement />
          </Suspense>
        </TabsContent>

        <TabsContent value="menu">
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-64">
                Загрузка...
              </div>
            }
          >
            <MenuManagement />
          </Suspense>
        </TabsContent>

        <TabsContent value="applications">
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-64">
                Загрузка...
              </div>
            }
          >
            <ApplicationsManagement />
          </Suspense>
        </TabsContent>

        <TabsContent value="tenant-applications">
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-64">
                Загрузка...
              </div>
            }
          >
            <SpaceBookingManagement />
          </Suspense>
        </TabsContent>

        <TabsContent value="contracts">
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-64">
                Загрузка...
              </div>
            }
          >
            <ContractsModule />
          </Suspense>
        </TabsContent>

        <TabsContent value="documents">
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-64">
                Загрузка...
              </div>
            }
          >
            <DocumentsManagement />
          </Suspense>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Управление пользователями</CardTitle>
              <CardDescription>
                Просмотр и управление аккаунтами пользователей
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Модуль управления пользователями
                </h3>
                <p className="text-muted-foreground">
                  Этот модуль находится в разработке
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-64">
                Загрузка...
              </div>
            }
          >
            <NotificationSystem />
          </Suspense>
        </TabsContent>

        <TabsContent value="data">
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-64">
                Загрузка...
              </div>
            }
          >
            <ExportData />
          </Suspense>
        </TabsContent>

        <TabsContent value="realtime" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Real-time Events
                {loading && (
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                )}
              </CardTitle>
              <CardDescription>User activity monitoring</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {realTimeEvents.map((event, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <div>
                        <p className="font-medium">{event.event_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(event.timestamp).toLocaleTimeString(
                            'ru-RU'
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">
                        {event.properties?.page || 'Неизвестно'}
                      </Badge>
                      {event.user_id && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Пользователь: {event.user_id.slice(0, 8)}...
                        </p>
                      )}
                    </div>
                  </div>
                ))}
                {realTimeEvents.length === 0 && (
                  <div className="text-center py-8">
                    <Activity className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Нет недавних событий
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
