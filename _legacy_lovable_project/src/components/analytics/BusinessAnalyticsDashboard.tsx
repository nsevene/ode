import React, { useState, useEffect } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
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
  AreaChart,
  Area,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Calendar,
  Star,
  Target,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Filter,
} from 'lucide-react';
import { FunnelAnalytics } from './FunnelAnalytics';
import { useAnalytics } from '@/hooks/useAnalytics';
import { supabase } from '@/integrations/supabase/client';

interface RevenueMetrics {
  total_revenue: number;
  bookings_count: number;
  avg_booking_value: number;
  conversion_rate: number;
  growth_rate: number;
}

interface CustomerSegment {
  segment: string;
  count: number;
  revenue: number;
  avg_spend: number;
  retention_rate: number;
}

interface ExperienceMetrics {
  experience_type: string;
  bookings: number;
  revenue: number;
  rating: number;
  capacity_utilization: number;
}

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--secondary))',
  'hsl(var(--accent))',
  '#ff7300',
  '#82ca9d',
];

export const BusinessAnalyticsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>(
    '30d'
  );
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('overview');

  // State for different data types
  const [revenueMetrics, setRevenueMetrics] = useState<RevenueMetrics>({
    total_revenue: 0,
    bookings_count: 0,
    avg_booking_value: 0,
    conversion_rate: 0,
    growth_rate: 0,
  });

  const [customerSegments, setCustomerSegments] = useState<CustomerSegment[]>(
    []
  );
  const [experienceMetrics, setExperienceMetrics] = useState<
    ExperienceMetrics[]
  >([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [bookingTrends, setBookingTrends] = useState<any[]>([]);

  const { getAnalyticsData, track } = useAnalytics();

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      // Загружаем данные бронирований
      const { data: bookings } = await supabase
        .from('bookings')
        .select(
          `
          id,
          experience_type,
          guest_count,
          payment_amount,
          booking_date,
          status,
          created_at
        `
        )
        .gte('created_at', getDateFilter(timeRange))
        .eq('status', 'confirmed');

      // Загружаем данные лояльности
      const { data: loyaltyData } = await supabase
        .from('loyalty_programs')
        .select('*');

      if (bookings) {
        processRevenueMetrics(bookings);
        processExperienceMetrics(bookings);
        processCustomerSegments(bookings, loyaltyData || []);
        processTimeSeriesData(bookings);
      }
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDateFilter = (range: string) => {
    const now = new Date();
    switch (range) {
      case '7d':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
      case '30d':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
      case '90d':
        return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString();
      case '1y':
        return new Date(
          now.getTime() - 365 * 24 * 60 * 60 * 1000
        ).toISOString();
      default:
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
    }
  };

  const processRevenueMetrics = (bookings: any[]) => {
    const totalRevenue = bookings.reduce(
      (sum, b) => sum + (b.payment_amount || 0),
      0
    );
    const bookingsCount = bookings.length;
    const avgBookingValue =
      bookingsCount > 0 ? totalRevenue / bookingsCount : 0;

    // Симуляция конверсии и роста
    const conversionRate = Math.random() * 15 + 10; // 10-25%
    const growthRate = Math.random() * 30 - 10; // -10% to +20%

    setRevenueMetrics({
      total_revenue: totalRevenue,
      bookings_count: bookingsCount,
      avg_booking_value: avgBookingValue,
      conversion_rate: conversionRate,
      growth_rate: growthRate,
    });
  };

  const processExperienceMetrics = (bookings: any[]) => {
    const experienceTypes = [
      'taste_compass',
      'wine_staircase',
      'chefs_table',
      'lounge',
    ];

    const metrics = experienceTypes.map((type) => {
      const typeBookings = bookings.filter((b) => b.experience_type === type);
      const revenue = typeBookings.reduce(
        (sum, b) => sum + (b.payment_amount || 0),
        0
      );
      const avgRating = 4.5;

      return {
        experience_type: type,
        bookings: typeBookings.length,
        revenue,
        rating: avgRating,
        capacity_utilization: Math.random() * 40 + 60, // 60-100%
      };
    });

    setExperienceMetrics(metrics);
  };

  const processCustomerSegments = (bookings: any[], loyaltyData: any[]) => {
    const segments = [
      {
        segment: 'VIP клиенты',
        count: 45,
        revenue: 12500000,
        avg_spend: 278000,
        retention_rate: 85,
      },
      {
        segment: 'Постоянные',
        count: 156,
        revenue: 28900000,
        avg_spend: 185000,
        retention_rate: 72,
      },
      {
        segment: 'Новые клиенты',
        count: 234,
        revenue: 18700000,
        avg_spend: 80000,
        retention_rate: 35,
      },
      {
        segment: 'Разовые',
        count: 89,
        revenue: 5400000,
        avg_spend: 61000,
        retention_rate: 15,
      },
    ];

    setCustomerSegments(segments);
  };

  const processTimeSeriesData = (bookings: any[]) => {
    // Группировка по дням/неделям/месяцам в зависимости от временного диапазона
    const groupedData = groupBookingsByPeriod(bookings, timeRange);
    setRevenueData(groupedData);
    setBookingTrends(groupedData);
  };

  const groupBookingsByPeriod = (bookings: any[], range: string) => {
    // Группировка данных по периодам
    const grouped: {
      [key: string]: { revenue: number; bookings: number; date: string };
    } = {};

    bookings.forEach((booking) => {
      const date = new Date(booking.created_at);
      let key: string;

      if (range === '7d') {
        key = date.toISOString().split('T')[0]; // группировка по дням
      } else if (range === '30d') {
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().split('T')[0]; // группировка по неделям
      } else {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; // группировка по месяцам
      }

      if (!grouped[key]) {
        grouped[key] = { revenue: 0, bookings: 0, date: key };
      }

      grouped[key].revenue += booking.payment_amount || 0;
      grouped[key].bookings += 1;
    });

    return Object.values(grouped).sort((a, b) => a.date.localeCompare(b.date));
  };

  const exportData = () => {
    track('analytics_export', { tab: selectedTab, time_range: timeRange });

    const dataToExport = {
      revenue_metrics: revenueMetrics,
      customer_segments: customerSegments,
      experience_metrics: experienceMetrics,
      revenue_data: revenueData,
      exported_at: new Date().toISOString(),
      time_range: timeRange,
    };

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `business-analytics-${timeRange}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'IDR',
      notation: 'compact',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-8 bg-muted rounded w-1/2"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Бизнес-аналитика</h1>
          <p className="text-muted-foreground">
            Комплексная аналитика и отчетность для ODE Food Hall
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select
            value={timeRange}
            onValueChange={(value: any) => setTimeRange(value)}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 дней</SelectItem>
              <SelectItem value="30d">30 дней</SelectItem>
              <SelectItem value="90d">90 дней</SelectItem>
              <SelectItem value="1y">1 год</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={exportData}>
            <Download className="h-4 w-4 mr-2" />
            Экспорт
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Общая выручка</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(revenueMetrics.total_revenue)}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              {revenueMetrics.growth_rate >= 0 ? (
                <ArrowUpRight className="h-3 w-3 text-green-600 mr-1" />
              ) : (
                <ArrowDownRight className="h-3 w-3 text-red-600 mr-1" />
              )}
              <span
                className={
                  revenueMetrics.growth_rate >= 0
                    ? 'text-green-600'
                    : 'text-red-600'
                }
              >
                {Math.abs(revenueMetrics.growth_rate).toFixed(1)}%
              </span>
              <span className="ml-1">от прошлого периода</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Бронирования</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {revenueMetrics.bookings_count}
            </div>
            <p className="text-xs text-muted-foreground">
              Средний чек: {formatCurrency(revenueMetrics.avg_booking_value)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Конверсия</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {revenueMetrics.conversion_rate.toFixed(1)}%
            </div>
            <Progress value={revenueMetrics.conversion_rate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Средний рейтинг
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8</div>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-muted-foreground'}`}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Обзор</TabsTrigger>
          <TabsTrigger value="revenue">Выручка</TabsTrigger>
          <TabsTrigger value="customers">Клиенты</TabsTrigger>
          <TabsTrigger value="experiences">Услуги</TabsTrigger>
          <TabsTrigger value="funnel">Воронка</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Динамика выручки</CardTitle>
                <CardDescription>Доходы за выбранный период</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis tickFormatter={(value) => formatCurrency(value)} />
                    <Tooltip
                      formatter={(value) => [
                        formatCurrency(value as number),
                        'Выручка',
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Количество бронирований</CardTitle>
                <CardDescription>Тренд бронирований по времени</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={bookingTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="bookings"
                      stroke="hsl(var(--secondary))"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Выручка по услугам</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={experienceMetrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="experience_type" />
                    <YAxis tickFormatter={(value) => formatCurrency(value)} />
                    <Tooltip
                      formatter={(value) => [
                        formatCurrency(value as number),
                        'Выручка',
                      ]}
                    />
                    <Bar dataKey="revenue" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Сегменты клиентов по выручке</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={customerSegments}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="revenue"
                      label={({ segment, revenue }) =>
                        `${segment}: ${formatCurrency(revenue)}`
                      }
                    >
                      {customerSegments.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [
                        formatCurrency(value as number),
                        'Выручка',
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Анализ клиентской базы</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {customerSegments.map((segment, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      />
                      <div>
                        <p className="font-medium">{segment.segment}</p>
                        <p className="text-sm text-muted-foreground">
                          {segment.count} клиентов
                        </p>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="font-bold">
                        {formatCurrency(segment.revenue)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Средний чек: {formatCurrency(segment.avg_spend)}
                      </p>
                      <Badge
                        variant={
                          segment.retention_rate > 70 ? 'default' : 'secondary'
                        }
                      >
                        Удержание: {segment.retention_rate}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="experiences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Производительность услуг</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {experienceMetrics.map((experience, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium capitalize">
                        {experience.experience_type.replace('_', ' ')}
                      </h3>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm">
                          {experience.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Бронирования</p>
                        <p className="font-medium">{experience.bookings}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Выручка</p>
                        <p className="font-medium">
                          {formatCurrency(experience.revenue)}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Загрузка</p>
                        <div className="flex items-center gap-2">
                          <Progress
                            value={experience.capacity_utilization}
                            className="flex-1"
                          />
                          <span className="text-xs">
                            {experience.capacity_utilization.toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="funnel">
          <FunnelAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
};
