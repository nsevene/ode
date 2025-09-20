import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { EventInfo } from './EventInfo';
import { EventForm } from './EventForm';

interface Event {
  id: string;
  title: string;
  description?: string;
  event_type: string;
  event_date: string;
  start_time: string;
  end_time: string;
  price_usd: number;
  max_guests: number;
  available_spots: number;
  venue?: string;
  instructor?: string;
  category: string;
  image_url?: string;
}

interface SimpleEventBookingModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
  onBookingSuccess: () => void;
}

const bookingSchema = z.object({
  guest_name: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
  guest_email: z.string().email('Введите корректный email'),
  guest_phone: z.string().optional(),
  guest_count: z
    .number()
    .min(1, 'Минимум 1 гость')
    .max(20, 'Максимум 20 гостей'),
  special_requests: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

const SimpleEventBookingModal = ({
  event,
  isOpen,
  onClose,
  onBookingSuccess,
}: SimpleEventBookingModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [guestCount, setGuestCount] = useState(1);
  const { user } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    guestName: user?.user_metadata?.display_name || '',
    guestEmail: user?.email || '',
    guestPhone: '',
    specialRequests: '',
  });

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      guest_name: formData.guestName,
      guest_email: formData.guestEmail,
      guest_phone: formData.guestPhone,
      guest_count: guestCount,
      special_requests: formData.specialRequests,
    },
  });

  const onSubmit = async () => {
    if (!event) return;

    setIsSubmitting(true);
    try {
      // Проверяем доступность мест
      if (guestCount > event.available_spots) {
        toast({
          title: 'Недостаточно мест',
          description: `Доступно только ${event.available_spots} мест`,
          variant: 'destructive',
        });
        return;
      }

      // Создаем бронирование
      const bookingData = {
        user_id: user?.id || null,
        guest_name: formData.guestName,
        guest_email: formData.guestEmail,
        guest_phone: formData.guestPhone || null,
        guest_count: guestCount,
        special_requests: formData.specialRequests || null,
        experience_type: event.event_type,
        booking_date: event.event_date,
        time_slot: event.start_time,
        payment_amount: event.price_usd * guestCount * 100, // в центах
        status: 'confirmed',
        payment_status: 'pending',
      };

      const { data: booking, error } = await supabase
        .from('bookings')
        .insert([bookingData])
        .select()
        .single();

      if (error) throw error;

      // Уменьшаем количество доступных мест
      const { error: updateError } = await supabase
        .from('events')
        .update({ available_spots: event.available_spots - guestCount })
        .eq('id', event.id);

      if (updateError) throw updateError;

      toast({
        title: 'Бронирование успешно создано!',
        description: `Ваше бронирование на ${guestCount} гостей подтверждено`,
      });

      onBookingSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: 'Ошибка бронирования',
        description: 'Не удалось создать бронирование. Попробуйте снова.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!event) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            Бронирование события
          </DialogTitle>
          <DialogDescription>
            Заполните форму для бронирования "{event.title}"
          </DialogDescription>
        </DialogHeader>

        <EventInfo event={event} guestCount={guestCount} />

        <EventForm
          guestCount={guestCount}
          setGuestCount={setGuestCount}
          maxGuests={event.max_guests}
          formData={formData}
          updateFormData={updateFormData}
        />

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Отмена
          </Button>
          <Button
            onClick={onSubmit}
            disabled={
              isSubmitting ||
              event.available_spots === 0 ||
              !formData.guestName ||
              !formData.guestEmail
            }
            className="flex-1"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Бронирование...
              </>
            ) : (
              'Забронировать'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SimpleEventBookingModal;
