import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { addDays, isAfter, startOfDay } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useAnalytics } from '@/hooks/useAnalytics';

import NFCPassportTracker from './NFCPassportTracker';
import { BookingForm } from './booking/BookingForm';
import { DateSelector } from './booking/DateSelector';
import { TimeSlotSelector } from './booking/TimeSlotSelector';
import { BookingSummary } from './booking/BookingSummary';

interface PackageInfo {
  id: string;
  name: string;
  price: number;
  duration: string;
  maxGuests: number;
}

interface TimeslotBookingProps {
  eventType?:
    | 'taste-compass'
    | 'wine-staircase'
    | 'vip-lounge'
    | 'chefs-table'
    | 'taste-alley';
  experienceType?:
    | 'taste-compass'
    | 'wine-staircase'
    | 'vip-lounge'
    | 'chefs-table'
    | 'taste-alley';
  experienceTitle?: string;
  packageInfo?: PackageInfo;
  maxGuests?: number;
  onBookingComplete?: (bookingData?: any) => void;
}

const TimeslotBooking = ({
  eventType,
  experienceType,
  experienceTitle,
  packageInfo,
  maxGuests = 8,
  onBookingComplete,
}: TimeslotBookingProps) => {
  const activeEventType = eventType || experienceType || 'taste-compass';
  const analytics = useAnalytics();

  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [guestCount, setGuestCount] = useState(2);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [selectedTasteSectors, setSelectedTasteSectors] = useState<string[]>(
    []
  );
  const [nfcPassportEnabled, setNfcPassportEnabled] = useState(false);
  const [generatedPassportId, setGeneratedPassportId] = useState<string | null>(
    null
  );

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [eventPrice, setEventPrice] = useState(0);

  const { user } = useAuth();
  const { toast } = useToast();

  const displayTitle = experienceTitle || packageInfo?.name || 'Experience';

  // Auto-fill user data if logged in
  useEffect(() => {
    if (user) {
      setGuestName(
        user.user_metadata?.display_name || user.email?.split('@')[0] || ''
      );
      setGuestEmail(user.email || '');
    }
  }, [user]);

  // Load available dates when dialog opens
  useEffect(() => {
    if (isOpen) {
      loadAvailableDates();
      fetchEventPrice();
    }
  }, [isOpen, activeEventType]);

  // Check availability when date changes
  useEffect(() => {
    if (selectedDate) {
      checkAvailability();
    }
  }, [selectedDate, activeEventType]);

  const fetchEventPrice = async () => {
    if (packageInfo?.price) {
      setEventPrice(packageInfo.price);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('events')
        .select('price_usd')
        .eq('event_type', activeEventType)
        .single();

      if (error) {
        console.error('Error fetching event price:', error?.message || error);
        setEventPrice(5000); // Default price in cents
      } else {
        setEventPrice(data.price_usd * 100); // Convert to cents
      }
    } catch (err) {
      console.error('Error in fetchEventPrice:', err);
      setEventPrice(5000);
    }
  };

  const loadAvailableDates = async () => {
    try {
      const dates: Date[] = [];
      const today = new Date();

      for (let i = 0; i < 30; i++) {
        const checkDate = addDays(today, i);
        if (
          isAfter(checkDate, startOfDay(today)) ||
          checkDate.toDateString() === today.toDateString()
        ) {
          const { data } = await supabase.rpc('get_availability', {
            p_experience_type: activeEventType,
            p_booking_date: checkDate.toISOString().split('T')[0],
          });

          if (
            data &&
            data.length > 0 &&
            data.some((slot: any) => slot.is_available)
          ) {
            dates.push(checkDate);
          }
        }
      }

      setAvailableDates(dates);
    } catch (error) {
      console.error('Error loading available dates:', error);
    }
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 11; hour <= 22; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    return slots;
  };

  const checkAvailability = async () => {
    if (!selectedDate) return;

    try {
      const dateString = selectedDate.toISOString().split('T')[0];
      const { data, error } = await supabase.rpc('get_availability', {
        p_experience_type: activeEventType,
        p_booking_date: dateString,
      });

      if (error) {
        console.error('Error checking availability:', error);
        return;
      }

      const availableTimeSlots =
        data
          ?.filter((slot: any) => slot.is_available)
          ?.map((slot: any) => slot.time_slot) || [];

      setAvailableSlots(availableTimeSlots);
    } catch (error) {
      console.error('Error in checkAvailability:', error);
    }
  };

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime || !guestName || !guestEmail) {
      // Track booking error
      analytics.trackBooking('error', {
        error_type: 'missing_fields',
        experience_type: activeEventType,
      });

      toast({
        title: 'Заполните все обязательные поля',
        description: 'Пожалуйста, укажите дату, время, имя и email',
        variant: 'destructive',
      });
      return;
    }

    // Track booking attempt
    const bookingData = {
      experience_type: activeEventType,
      guest_count: guestCount,
      booking_date: selectedDate,
      time_slot: selectedTime,
      guest_name: guestName,
      guest_email: guestEmail,
      guest_phone: guestPhone,
      special_requests: specialRequests,
    };

    analytics.trackBooking('started', bookingData);

    if ((window as any).odeTrack) {
      (window as any).odeTrack.bookingStep('started', bookingData);
    }

    setLoading(true);

    try {
      console.log('Starting booking process...', {
        selectedDate,
        selectedTime,
        guestName,
        guestEmail,
      });

      let passportId = null;
      if (nfcPassportEnabled) {
        console.log('Generating NFC passport ID...');
        const { data: passportData, error: passportError } = await supabase.rpc(
          'generate_nfc_passport_id'
        );
        if (passportError) {
          console.error('Passport generation error:', passportError);
          throw passportError;
        }
        passportId = passportData;
        setGeneratedPassportId(passportId);
        console.log('Generated passport ID:', passportId);
      }

      const basePrice = packageInfo?.price || eventPrice;
      const totalAmount =
        basePrice * guestCount + (nfcPassportEnabled ? 500 : 0);

      const bookingData = {
        user_id: user?.id || null,
        experience_type: activeEventType,
        booking_date: selectedDate.toISOString().split('T')[0],
        time_slot: selectedTime,
        guest_count: guestCount,
        guest_name: guestName,
        guest_email: guestEmail,
        guest_phone: guestPhone || null,
        special_requests: specialRequests || null,
        taste_sectors: selectedTasteSectors,
        passport_enabled: nfcPassportEnabled,
        nfc_passport_id: passportId,
        payment_amount: totalAmount,
        payment_status: 'pending',
        status: 'pending',
      };

      console.log('Submitting booking data:', bookingData);

      const { data: paymentData, error: paymentError } =
        await supabase.functions.invoke('create-payment', {
          body: {
            // Convert to camelCase for edge function
            experienceType: activeEventType,
            bookingDate: selectedDate.toISOString().split('T')[0],
            timeSlot: selectedTime,
            guestCount: guestCount,
            guestName: guestName,
            guestEmail: guestEmail,
            guestPhone: guestPhone || null,
            specialRequests: specialRequests || null,
            tasteSectors: selectedTasteSectors,
            passportEnabled: nfcPassportEnabled,
            nfcPassportId: passportId,
            experienceTitle: displayTitle,
            amount: totalAmount,
          },
        });

      console.log('Payment response:', { paymentData, paymentError });

      if (paymentError) {
        console.error('Payment error details:', paymentError);
        throw paymentError;
      }

      if (paymentData?.url) {
        // Отправляем email уведомление после создания бронирования
        try {
          await supabase.functions.invoke('send-booking-notification', {
            body: {
              bookingId: paymentData.bookingId,
              type: 'confirmation',
              recipientEmail: guestEmail,
              recipientName: guestName,
            },
          });
        } catch (emailError) {
          console.warn('Failed to send booking email:', emailError);
          // Не блокируем процесс бронирования из-за проблем с email
        }

        window.location.href = paymentData.url;
      } else {
        console.error('No payment URL received:', paymentData);
        throw new Error('Ошибка при создании платежа. Попробуйте позже.');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: 'Ошибка бронирования',
        description: 'Не удалось создать бронирование. Попробуйте снова.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return (
      selectedDate && selectedTime && guestName && guestEmail && guestCount > 0
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="hero" size="lg" className="w-full">
          <CalendarIcon className="h-5 w-5 mr-2" />
          Забронировать опыт
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Забронировать {displayTitle}
          </DialogTitle>
        </DialogHeader>

        {/* NFC Passport Tracker */}
        {user && (generatedPassportId || nfcPassportEnabled) && (
          <div className="mb-6">
            <NFCPassportTracker passportId={generatedPassportId} />
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {/* Date and Time Selection */}
          <div className="space-y-4">
            <DateSelector
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              availableDates={availableDates}
            />

            <TimeSlotSelector
              availableSlots={availableSlots.map((slot) => ({
                time_slot: slot,
                is_available: true,
                booked_count: 0,
              }))}
              selectedTime={selectedTime}
              setSelectedTime={setSelectedTime}
              selectedDate={selectedDate}
            />
          </div>

          {/* Contact Information and Summary */}
          <div className="space-y-4">
            <BookingForm
              guestCount={guestCount}
              setGuestCount={setGuestCount}
              maxGuests={packageInfo?.maxGuests || maxGuests}
              guestName={guestName}
              setGuestName={setGuestName}
              guestEmail={guestEmail}
              setGuestEmail={setGuestEmail}
              guestPhone={guestPhone}
              setGuestPhone={setGuestPhone}
              specialRequests={specialRequests}
              setSpecialRequests={setSpecialRequests}
            />

            {selectedDate && selectedTime && (
              <BookingSummary
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                guestCount={guestCount}
                experienceTitle={displayTitle}
                packageInfo={packageInfo}
                eventPrice={eventPrice}
                passportEnabled={nfcPassportEnabled}
              />
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-6">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            className="flex-1"
          >
            Отмена
          </Button>
          <Button
            onClick={handleBooking}
            disabled={!isFormValid() || loading}
            className="flex-1"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Создание бронирования...
              </>
            ) : (
              `Забронировать за ${(((packageInfo?.price || eventPrice) * guestCount) / 100).toFixed(0)} ₽`
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TimeslotBooking;
