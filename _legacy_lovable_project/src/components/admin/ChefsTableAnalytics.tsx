import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  DollarSign,
  Star,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format, subDays, startOfDay } from 'date-fns';
import { ru } from 'date-fns/locale';

const ChefsTableAnalytics = () => {
  const [revenueData, setRevenueData] = useState([]);
  const [bookingTrends, setBookingTrends] = useState([]);
  const [guestCountData, setGuestCountData] = useState([]);
  const [topMetrics, setTopMetrics] = useState({
    totalRevenue: 0,
    totalBookings: 0,
    averageRating: 0,
    occupancyRate: 0,
    revenueGrowth: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setIsLoading(true);

      // Fetch bookings data for the last 30 days
      const thirtyDaysAgo = startOfDay(subDays(new Date(), 30));

      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('experience_type', 'chefs-table')
        .gte('booking_date', thirtyDaysAgo.toISOString().split('T')[0])
        .order('booking_date', { ascending: true });

      if (error) throw error;

      // Process revenue data
      const revenueByDay = {};
      const bookingsByDay = {};
      const guestsByDay = {};

      bookings?.forEach((booking) => {
        const date = booking.booking_date;
        if (!revenueByDay[date]) {
          revenueByDay[date] = 0;
          bookingsByDay[date] = 0;
          guestsByDay[date] = 0;
        }
        revenueByDay[date] += Number(booking.payment_amount) || 0;
        bookingsByDay[date] += 1;
        guestsByDay[date] += Number(booking.guest_count) || 0;
      });

      // Convert to chart data
      const revenueChartData = Object.entries(revenueByDay).map(
        ([date, revenue]) => ({
          date: format(new Date(date), 'dd MMM', { locale: ru }),
          revenue: Number(revenue) / 100, // Convert from cents
        })
      );

      const bookingChartData = Object.entries(bookingsByDay).map(
        ([date, count]) => ({
          date: format(new Date(date), 'dd MMM', { locale: ru }),
          bookings: Number(count),
        })
      );

      const guestChartData = Object.entries(guestsByDay).map(
        ([date, count]) => ({
          date: format(new Date(date), 'dd MMM', { locale: ru }),
          guests: Number(count),
        })
      );

      // Calculate metrics
      const totalRevenue =
        bookings?.reduce(
          (sum, booking) => sum + (Number(booking.payment_amount) || 0),
          0
        ) || 0;
      const totalBookings = bookings?.length || 0;
      const totalGuests =
        bookings?.reduce(
          (sum, booking) => sum + Number(booking.guest_count),
          0
        ) || 0;
      const occupancyRate =
        totalGuests > 0 ? (totalGuests / (totalBookings * 30)) * 100 : 0;

      setRevenueData(revenueChartData);
      setBookingTrends(bookingChartData);
      setGuestCountData(guestChartData);
      setTopMetrics({
        totalRevenue: totalRevenue / 100,
        totalBookings,
        averageRating: 4.8, // Mock data
        occupancyRate: Math.round(occupancyRate),
        revenueGrowth: 12.5, // Mock data
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe'];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p>Загрузка аналитики...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Аналитика Chef's Table</h2>
        <Badge variant="outline">Последние 30 дней</Badge>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Доход</p>
                <p className="text-2xl font-bold">
                  ${topMetrics.totalRevenue.toFixed(2)}
                </p>
                <div className="flex items-center text-sm text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" />+
                  {topMetrics.revenueGrowth}%
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Бронирования</p>
                <p className="text-2xl font-bold">{topMetrics.totalBookings}</p>
                <div className="flex items-center text-sm text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +8.3%
                </div>
              </div>
              <Calendar className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Заполняемость</p>
                <p className="text-2xl font-bold">
                  {topMetrics.occupancyRate}%
                </p>
                <div className="flex items-center text-sm text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +5.2%
                </div>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Рейтинг</p>
                <p className="text-2xl font-bold">{topMetrics.averageRating}</p>
                <div className="flex items-center text-sm text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +0.2
                </div>
              </div>
              <Star className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Средний чек</p>
                <p className="text-2xl font-bold">
                  $
                  {topMetrics.totalBookings > 0
                    ? (
                        topMetrics.totalRevenue / topMetrics.totalBookings
                      ).toFixed(2)
                    : '0'}
                </p>
                <div className="flex items-center text-sm text-red-600">
                  <TrendingDown className="h-4 w-4 mr-1" />
                  -2.1%
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Доходы по дням</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Доход']} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8884d8"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Количество бронирований</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={bookingTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="bookings" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Количество гостей по дням</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={guestCountData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="guests" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Популярные дни недели</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Пятница', value: 30 },
                    { name: 'Суббота', value: 25 },
                    { name: 'Четверг', value: 20 },
                    { name: 'Среда', value: 15 },
                    { name: 'Вторник', value: 10 },
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {[
                    { name: 'Пятница', value: 30 },
                    { name: 'Суббота', value: 25 },
                    { name: 'Четверг', value: 20 },
                    { name: 'Среда', value: 15 },
                    { name: 'Вторник', value: 10 },
                  ].map((entry, index) => (
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

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Инсайты производительности</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-800">
                Хорошие показатели
              </h4>
              <ul className="text-sm text-green-700 mt-2 space-y-1">
                <li>• Высокий рейтинг гостей (4.8/5)</li>
                <li>• Стабильный рост доходов</li>
                <li>• Хорошая заполняемость</li>
              </ul>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-semibold text-yellow-800">
                Требует внимания
              </h4>
              <ul className="text-sm text-yellow-700 mt-2 space-y-1">
                <li>• Снижение среднего чека</li>
                <li>• Неравномерная загрузка по дням</li>
                <li>• Мало повторных бронирований</li>
              </ul>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800">Рекомендации</h4>
              <ul className="text-sm text-blue-700 mt-2 space-y-1">
                <li>• Создать программу лояльности</li>
                <li>• Добавить тематические вечера</li>
                <li>• Оптимизировать ценообразование</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChefsTableAnalytics;
