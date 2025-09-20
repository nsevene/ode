import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { X, Calendar, ArrowLeft, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import ImprovedNavigation from '@/components/ImprovedNavigation';

const PaymentCancelled = () => {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('booking_id');
  const [bookingDetails, setBookingDetails] = useState<any>(null);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!bookingId) return;

      try {
        const { data: booking, error } = await supabase
          .from('bookings')
          .select(
            `
            *,
            events!inner(title, price_usd)
          `
          )
          .eq('id', bookingId)
          .single();

        if (error) throw error;
        setBookingDetails(booking);
      } catch (error) {
        console.error('Error fetching booking:', error);
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  const handleRetryPayment = async () => {
    if (!bookingDetails) return;

    try {
      const { data, error } = await supabase.functions.invoke(
        'create-payment',
        {
          body: {
            experienceType: bookingDetails.experience_type,
            bookingDate: bookingDetails.booking_date,
            timeSlot: bookingDetails.time_slot,
            guestCount: bookingDetails.guest_count,
            guestName: bookingDetails.guest_name,
            guestEmail: bookingDetails.guest_email,
            guestPhone: bookingDetails.guest_phone,
            specialRequests: bookingDetails.special_requests,
          },
        }
      );

      if (error) throw error;

      if (data.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error retrying payment:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <ImprovedNavigation />
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Payment Cancelled</h1>
            <p className="text-lg text-muted-foreground">
              Your payment was cancelled. Your booking is still pending payment.
            </p>
          </div>

          {bookingDetails && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Pending Booking
                  <Badge
                    variant="secondary"
                    className="bg-yellow-100 text-yellow-800"
                  >
                    Payment Pending
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-gold-accent" />
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="font-medium">
                        {new Date(
                          bookingDetails.booking_date
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-gold-accent rounded-full flex items-center justify-center">
                      <span className="text-xs text-background font-bold">
                        $
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Amount
                      </p>
                      <p className="font-medium">
                        ${(bookingDetails.payment_amount / 100).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground mb-1">
                    Experience
                  </p>
                  <p className="font-medium text-lg">
                    {bookingDetails.events.title}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
            <h3 className="font-semibold mb-2 text-yellow-800">
              Important Notice
            </h3>
            <p className="text-sm text-yellow-700 mb-3">
              Your booking slot is temporarily reserved, but payment is required
              to confirm your reservation. Please complete payment within 24
              hours or your slot may be released.
            </p>
          </div>

          <div className="flex gap-4">
            <Button asChild variant="outline" className="flex-1">
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
            <Button
              onClick={handleRetryPayment}
              variant="hero"
              className="flex-1"
              disabled={!bookingDetails}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Complete Payment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancelled;
