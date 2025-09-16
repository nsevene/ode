import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import ImprovedNavigation from "@/components/ImprovedNavigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, Users, Mail, Phone, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface Booking {
  id: string;
  booking_date: string;
  time_slot: string;
  guest_count: number;
  guest_name: string;
  guest_email: string;
  guest_phone?: string;
  special_requests?: string;
  status: string;
  payment_status: string;
  payment_amount?: number;
  created_at: string;
  events: {
    title: string;
    price_usd: number;
  };
}

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      window.location.href = "/auth";
      return;
    }

    if (user) {
      fetchBookings();
    }
  }, [user, authLoading]);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          events!inner(title, price_usd)
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings((data as any) || []);
    } catch (error: any) {
      toast({
        title: "Ошибка загрузки",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'default';
      case 'pending': return 'secondary';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'default';
      case 'pending': return 'secondary';
      case 'failed': return 'destructive';
      default: return 'secondary';
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <ImprovedNavigation />
        <div className="container mx-auto px-4 pt-24 pb-12">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-muted-foreground">Загрузка...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <ImprovedNavigation />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Личный кабинет
            </h1>
            <p className="text-muted-foreground">
              Управляйте своими бронированиями в ODE Food Hall
            </p>
          </div>

          {bookings.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <div className="text-muted-foreground mb-4">
                  У вас пока нет бронирований
                </div>
                <Button onClick={() => window.location.href = "/"}>
                  Забронировать опыт
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {bookings.map((booking) => (
                <Card key={booking.id} className="overflow-hidden">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl mb-2">
                          {booking.events.title}
                        </CardTitle>
                        <CardDescription>
                          Booking #{booking.id.slice(0, 8)}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant={getStatusColor(booking.status)}>
                          {booking.status === 'confirmed' ? 'Подтверждено' : 
                           booking.status === 'pending' ? 'Ожидает' : 'Отменено'}
                        </Badge>
                        <Badge variant={getPaymentStatusColor(booking.payment_status)}>
                          {booking.payment_status === 'paid' ? 'Оплачено' : 
                           booking.payment_status === 'pending' ? 'Ожидает оплаты' : 'Не оплачено'}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span className="font-medium">Дата:</span>
                          <span>
                            {format(new Date(booking.booking_date), 'EEEE, d MMMM yyyy', { locale: ru })}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-primary" />
                          <span className="font-medium">Время:</span>
                          <span>{booking.time_slot}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="w-4 h-4 text-primary" />
                          <span className="font-medium">Guests:</span>
                          <span>{booking.guest_count}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-primary" />
                          <span className="font-medium">Email:</span>
                          <span>{booking.guest_email}</span>
                        </div>
                        
                        {booking.guest_phone && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-4 h-4 text-primary" />
                            <span className="font-medium">Телефон:</span>
                            <span>{booking.guest_phone}</span>
                          </div>
                        )}
                        
                        {booking.payment_amount && (
                          <div className="flex items-center gap-2 text-sm font-semibold">
                            <span className="font-medium">Сумма:</span>
                            <span className="text-primary">
                              ${(booking.payment_amount / 100).toFixed(2)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {booking.special_requests && (
                      <div className="border-t pt-4">
                        <div className="flex items-start gap-2 text-sm">
                          <MessageSquare className="w-4 h-4 text-primary mt-0.5" />
                          <div>
                            <span className="font-medium">Особые пожелания:</span>
                            <p className="text-muted-foreground mt-1">
                              {booking.special_requests}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="border-t pt-4">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>Создано:</span>
                        <span>
                          {format(new Date(booking.created_at), 'dd.MM.yyyy в HH:mm', { locale: ru })}
                        </span>
                      </div>
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

export default Dashboard;