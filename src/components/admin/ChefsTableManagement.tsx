
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Users, DollarSign, Clock, ChefHat, Edit, Eye, Filter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const ChefsTableManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    averageGuests: 0,
    upcomingEvents: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchBookings();
    fetchStats();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('experience_type', 'chefs-table')
        .order('booking_date', { ascending: false })
        .order('time_slot', { ascending: true });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить бронирования",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('guest_count, payment_amount, booking_date')
        .eq('experience_type', 'chefs-table')
        .eq('status', 'confirmed');

      if (error) throw error;

      const totalBookings = data?.length || 0;
      const totalRevenue = data?.reduce((sum, booking) => sum + (booking.payment_amount || 0), 0) || 0;
      const averageGuests = totalBookings > 0 ? data.reduce((sum, booking) => sum + booking.guest_count, 0) / totalBookings : 0;
      const upcomingEvents = data?.filter(booking => new Date(booking.booking_date) >= new Date()).length || 0;

      setStats({
        totalBookings,
        totalRevenue: totalRevenue / 100, // Convert from cents
        averageGuests: Math.round(averageGuests * 10) / 10,
        upcomingEvents
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId);

      if (error) throw error;

      toast({
        title: "Успешно",
        description: "Статус бронирования обновлен"
      });

      fetchBookings();
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить статус",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesDate = !selectedDate || booking.booking_date === selectedDate;
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
    return matchesDate && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p>Загрузка данных...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <ChefHat className="h-6 w-6" />
          Управление Chef's Table
        </h2>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Всего бронирований</p>
                <p className="text-2xl font-bold">{stats.totalBookings}</p>
              </div>
              <Calendar className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Общий доход</p>
                <p className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Средний размер группы</p>
                <p className="text-2xl font-bold">{stats.averageGuests}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Предстоящие события</p>
                <p className="text-2xl font-bold">{stats.upcomingEvents}</p>
              </div>
              <Clock className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="bookings" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="bookings">Бронирования</TabsTrigger>
          <TabsTrigger value="schedule">Расписание</TabsTrigger>
          <TabsTrigger value="settings">Настройки</TabsTrigger>
        </TabsList>

        <TabsContent value="bookings" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Фильтры
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="date-filter">Дата</Label>
                  <Input
                    id="date-filter"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="status-filter">Статус</Label>
                  <select
                    id="status-filter"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md"
                  >
                    <option value="all">Все</option>
                    <option value="confirmed">Подтверждено</option>
                    <option value="pending">Ожидание</option>
                    <option value="cancelled">Отменено</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedDate('');
                      setFilterStatus('all');
                    }}
                  >
                    Очистить фильтры
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bookings Table */}
          <Card>
            <CardHeader>
              <CardTitle>Список бронирований ({filteredBookings.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredBookings.map((booking) => (
                  <Card key={booking.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{booking.guest_name}</h4>
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{booking.guest_email}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span>📅 {format(new Date(booking.booking_date), 'd MMMM yyyy', { locale: ru })}</span>
                          <span>⏰ {booking.time_slot}</span>
                          <span>👥 {booking.guest_count} гостей</span>
                          <span>💰 ${(booking.payment_amount / 100).toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Детали бронирования</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label>Имя гостя</Label>
                                <p className="text-sm">{booking.guest_name}</p>
                              </div>
                              <div>
                                <Label>Email</Label>
                                <p className="text-sm">{booking.guest_email}</p>
                              </div>
                              <div>
                                <Label>Телефон</Label>
                                <p className="text-sm">{booking.guest_phone || 'Не указан'}</p>
                              </div>
                              <div>
                                <Label>Особые пожелания</Label>
                                <p className="text-sm">{booking.special_requests || 'Нет'}</p>
                              </div>
                              <div>
                                <Label>NFC Passport</Label>
                                <p className="text-sm">{booking.nfc_passport_id || 'Не активирован'}</p>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        
                        {booking.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                          >
                            Подтвердить
                          </Button>
                        )}
                        
                        {booking.status === 'confirmed' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                          >
                            Отменить
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Управление расписанием</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Рабочие дни</Label>
                  <p className="text-sm text-muted-foreground">
                    В настоящее время Chef's Table работает 5 дней в неделю (вторник-суббота)
                  </p>
                </div>
                <div>
                  <Label>Время проведения</Label>
                  <p className="text-sm text-muted-foreground">19:00 - 22:00</p>
                </div>
                <div>
                  <Label>Максимальное количество гостей</Label>
                  <p className="text-sm text-muted-foreground">30 человек за столом</p>
                </div>
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Изменить расписание
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Настройки Chef's Table</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="price">Цена за человека (USD)</Label>
                <Input id="price" type="number" defaultValue="55" />
              </div>
              <div>
                <Label htmlFor="wine-pairing">Доплата за винное сопровождение (USD)</Label>
                <Input id="wine-pairing" type="number" defaultValue="15" />
              </div>
              <div>
                <Label htmlFor="kombucha-pairing">Доплата за комбуча-пару (USD)</Label>
                <Input id="kombucha-pairing" type="number" defaultValue="8" />
              </div>
              <div>
                <Label htmlFor="description">Описание опыта</Label>
                <Textarea 
                  id="description"
                  defaultValue="Эксклюзивный гастрономический опыт в самом сердце ODE Food Hall"
                  rows={3}
                />
              </div>
              <Button>
                <Edit className="h-4 w-4 mr-2" />
                Сохранить изменения
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ChefsTableManagement;
