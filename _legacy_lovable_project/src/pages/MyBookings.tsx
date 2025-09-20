import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Mail,
  Phone,
  MessageSquare,
  ArrowLeft,
  CalendarCheck,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ImprovedNavigation from '@/components/ImprovedNavigation';

interface Booking {
  id: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string | null;
  guest_count: number;
  special_requests: string | null;
  experience_type: string;
  booking_date: string;
  time_slot: string;
  payment_amount: number | null;
  payment_status: string;
  status: string;
  created_at: string;
}

const MyBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user.id)
        .order('booking_date', { ascending: false })
        .order('time_slot', { ascending: true });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить бронирования',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Подтверждено';
      case 'pending':
        return 'Ожидает';
      case 'cancelled':
        return 'Отменено';
      default:
        return status;
    }
  };

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Оплачено';
      case 'pending':
        return 'Ожидает оплаты';
      case 'failed':
        return 'Ошибка оплаты';
      default:
        return status;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <ImprovedNavigation />
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center">
            <CalendarCheck className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-4">Войдите в аккаунт</h2>
            <p className="text-muted-foreground mb-6">
              Sign in to view your bookings
            </p>
            <Link to="/auth">
              <Button>Sign In</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <ImprovedNavigation />
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Загрузка бронирований...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Мои бронирования - ODE Food Hall</title>
        <meta
          name="description"
          content="Просмотр ваших бронирований событий в ODE Food Hall"
        />
      </Helmet>

      <ImprovedNavigation />

      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <Link to="/events">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />К событиям
              </Button>
            </Link>

            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-burgundy-primary to-gold-accent bg-clip-text text-transparent">
                Мои бронирования
              </h1>
              <p className="text-xl text-muted-foreground">
                Управляйте своими бронированиями событий
              </p>
            </div>
          </div>

          {/* Bookings */}
          {bookings.length === 0 ? (
            <div className="text-center py-12">
              <CalendarCheck className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Нет бронирований</h3>
              <p className="text-muted-foreground mb-6">
                У вас пока нет забронированных событий
              </p>
              <Link to="/events">
                <Button>Просмотреть события</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {bookings.map((booking) => (
                <Card key={booking.id} className="overflow-hidden">
                  <CardHeader className="bg-muted/30">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">
                        {booking.experience_type}
                      </CardTitle>
                      <div className="flex gap-2">
                        <Badge className={getStatusColor(booking.status)}>
                          {getStatusText(booking.status)}
                        </Badge>
                        <Badge
                          className={getPaymentStatusColor(
                            booking.payment_status
                          )}
                        >
                          {getPaymentStatusText(booking.payment_status)}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      {/* Event Details */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                          Детали события
                        </h4>

                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span>
                            {format(
                              new Date(booking.booking_date),
                              'dd MMMM yyyy',
                              { locale: ru }
                            )}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span>{booking.time_slot}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span>
                            {booking.guest_count}{' '}
                            {booking.guest_count === 1 ? 'гость' : 'гостей'}
                          </span>
                        </div>

                        {booking.payment_amount && (
                          <div className="text-sm">
                            <span className="font-medium">Сумма:</span> $
                            {(booking.payment_amount / 100).toFixed(2)}
                          </div>
                        )}
                      </div>

                      {/* Contact Details */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                          Контактные данные
                        </h4>

                        <div className="flex items-center gap-2 text-sm">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span>{booking.guest_name}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <span>{booking.guest_email}</span>
                        </div>

                        {booking.guest_phone && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            <span>{booking.guest_phone}</span>
                          </div>
                        )}

                        {booking.special_requests && (
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <MessageSquare className="w-4 h-4 text-muted-foreground" />
                              <span className="font-medium">
                                Особые пожелания:
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground ml-6">
                              {booking.special_requests}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Booking Date */}
                    <div className="mt-4 pt-4 border-t text-xs text-muted-foreground">
                      Забронировано:{' '}
                      {format(
                        new Date(booking.created_at),
                        'dd.MM.yyyy HH:mm',
                        { locale: ru }
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBookings;
