import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Check, Calendar, Clock, Users, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import ImprovedNavigation from "@/components/ImprovedNavigation";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const bookingId = searchParams.get('booking_id');
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId || !bookingId) return;

      try {
        // Verify payment with Stripe
        const { data, error } = await supabase.functions.invoke('verify-payment', {
          body: { sessionId, bookingId }
        });

        if (error) throw error;

        // Fetch booking details
        const { data: booking, error: bookingError } = await supabase
          .from('bookings')
          .select(`
            *,
            events!inner(title, price_usd)
          `)
          .eq('id', bookingId)
          .single();

        if (bookingError) throw bookingError;
        
        setBookingDetails(booking);
      } catch (error) {
        console.error('Error verifying payment:', error);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [sessionId, bookingId]);

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-background">
        <ImprovedNavigation />
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-accent mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold mb-2">Verifying Payment...</h2>
            <p className="text-muted-foreground">Please wait while we confirm your booking.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ImprovedNavigation />
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
            <p className="text-lg text-muted-foreground">
              Your booking has been confirmed. We can't wait to welcome you!
            </p>
          </div>

          {bookingDetails && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Booking Confirmation
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    Confirmed
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
                        {new Date(bookingDetails.booking_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-gold-accent" />
                    <div>
                      <p className="text-sm text-muted-foreground">Time</p>
                      <p className="font-medium">{bookingDetails.time_slot}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-gold-accent" />
                    <div>
                      <p className="text-sm text-muted-foreground">Guests</p>
                      <p className="font-medium">{bookingDetails.guest_count}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-gold-accent rounded-full flex items-center justify-center">
                      <span className="text-xs text-background font-bold">$</span>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Paid</p>
                      <p className="font-medium">
                        ${(bookingDetails.payment_amount / 100).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground mb-1">Experience</p>
                  <p className="font-medium text-lg">{bookingDetails.events.title}</p>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground mb-1">Guest Details</p>
                  <p className="font-medium">{bookingDetails.guest_name}</p>
                  <p className="text-sm text-muted-foreground">{bookingDetails.guest_email}</p>
                  {bookingDetails.guest_phone && (
                    <p className="text-sm text-muted-foreground">{bookingDetails.guest_phone}</p>
                  )}
                </div>

                {bookingDetails.special_requests && (
                  <div className="border-t pt-4">
                    <p className="text-sm text-muted-foreground mb-1">Special Requests</p>
                    <p className="text-sm">{bookingDetails.special_requests}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <div className="bg-gold-accent/10 rounded-lg p-6 mb-6">
            <h3 className="font-semibold mb-2">What's Next?</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• You'll receive a confirmation email shortly</li>
              <li>• Please arrive 15 minutes before your scheduled time</li>
              <li>• Bring a valid ID for verification</li>
              <li>• Contact us if you need to make any changes</li>
            </ul>
          </div>

          <div className="flex gap-4">
            <Button asChild variant="outline" className="flex-1">
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
            <Button asChild variant="hero" className="flex-1">
              <Link to="/dashboard">
                View My Bookings
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;