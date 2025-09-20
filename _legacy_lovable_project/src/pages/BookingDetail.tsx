import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, Share2 } from 'lucide-react';
import BookingStatusTracker from '@/components/BookingStatusTracker';
import { toast } from '@/hooks/use-toast';

const BookingDetail = () => {
  const { id } = useParams<{ id: string }>();

  const {
    data: booking,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['booking', id],
    queryFn: async () => {
      if (!id) throw new Error('Booking ID is required');

      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Booking at ODE Food Hall',
          text: `Забронировал стол в ODE Food Hall на ${booking?.booking_date} в ${booking?.time_slot}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Sharing failed:', error);
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: 'Ссылка скопирована',
        description: 'Booking link copied to clipboard',
      });
    }
  };

  const downloadBookingPDF = () => {
    // Simulate PDF generation
    toast({
      title: 'Generating PDF...',
      description: 'Your booking confirmation is being prepared for download.',
    });

    // In production, this would generate actual PDF
    setTimeout(() => {
      // Create fake download
      const element = document.createElement('a');
      element.href =
        'data:text/plain;charset=utf-8,Booking Confirmation - ODE Food Hall';
      element.download = 'booking-confirmation.txt';
      element.click();

      toast({
        title: 'PDF Downloaded',
        description: 'Your booking confirmation has been downloaded.',
      });
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center py-8">
            <h2 className="text-xl font-semibold mb-4">
              Бронирование не найдено
            </h2>
            <p className="text-muted-foreground mb-4">
              Возможно, ссылка устарела или бронирование было отменено.
            </p>
            <Button asChild>
              <Link to="/my-bookings">Мои бронирования</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatExperienceType = (type: string) => {
    const types = {
      'chefs-table': "Chef's Table Experience",
      'wine-tasting': 'Wine Tasting Session',
      'private-dining': 'Private Dining Experience',
      'cooking-class': 'Cooking Class',
      regular: 'Обычное посещение',
    };
    return types[type as keyof typeof types] || type;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/my-bookings">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Назад
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Детали бронирования</h1>
              <p className="text-muted-foreground">
                ID: {booking.id.slice(-8).toUpperCase()}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Поделиться
            </Button>
            <Button variant="outline" size="sm" onClick={downloadBookingPDF}>
              <Download className="h-4 w-4 mr-2" />
              PDF
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Status Tracker */}
          <div className="lg:col-span-2">
            <BookingStatusTracker booking={booking} />
          </div>

          {/* Booking Details */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Информация о бронировании
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground">
                    Мероприятие
                  </div>
                  <div className="font-medium">
                    {formatExperienceType(booking.experience_type)}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground">
                    Дата и время
                  </div>
                  <div className="font-medium">
                    {new Date(booking.booking_date).toLocaleDateString(
                      'ru-RU',
                      {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      }
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {booking.time_slot}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground">
                    Number of guests
                  </div>
                  <div className="font-medium">
                    {booking.guest_count} человек
                  </div>
                </div>

                {booking.payment_amount && (
                  <div>
                    <div className="text-sm text-muted-foreground">Сумма</div>
                    <div className="font-medium text-lg text-primary">
                      ${booking.payment_amount}
                    </div>
                  </div>
                )}

                {booking.special_requests && (
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Особые пожелания
                    </div>
                    <div className="text-sm">{booking.special_requests}</div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-sm text-muted-foreground">Телефон</div>
                  <div className="font-medium">+62 361 XXX XXXX</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">WhatsApp</div>
                  <div className="font-medium">+62 812 XXXX XXXX</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Email</div>
                  <div className="font-medium">selena@odefoodhall.com</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Адрес</div>
                  <div className="text-sm">
                    ODE Food Hall
                    <br />
                    Jl. Raya Ubud, Ubud
                    <br />
                    Bali, Indonesia
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetail;
