import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Clock, Users, CreditCard, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface SimpleBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QUICK_EXPERIENCES = [
  { id: 'dinner', name: 'Ужин', price: 2500, icon: '🍽️' },
  { id: 'taste-quest', name: 'Taste Quest', price: 1500, icon: '🗺️' },
  { id: 'wine-tasting', name: 'Вино', price: 2000, icon: '🍷' },
];

const QUICK_TIMES = ['18:00', '19:00', '20:00', '21:00'];
const QUICK_GUESTS = [1, 2, 3, 4, 5, 6];

export const SimpleBookingModal = ({
  isOpen,
  onClose,
}: SimpleBookingModalProps) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    experience: '',
    date: null as Date | null,
    time: '',
    guests: 2,
    name: '',
    email: '',
    phone: '',
  });
  const { toast } = useToast();

  const selectedExperience = QUICK_EXPERIENCES.find(
    (e) => e.id === formData.experience
  );
  const totalPrice = selectedExperience
    ? selectedExperience.price * formData.guests
    : 0;

  const handleNext = () => {
    if (step === 1 && formData.experience && formData.date && formData.time) {
      setStep(2);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email) return;

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast({
        title: 'Бронирование создано!',
        description: `${selectedExperience?.name} на ${formData.guests} гостей`,
      });

      onClose();
      setStep(1);
      setFormData({
        experience: '',
        date: null,
        time: '',
        guests: 2,
        name: '',
        email: '',
        phone: '',
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Попробуйте снова',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {step === 1 ? 'Quick Booking' : 'Your Details'}
          </DialogTitle>
        </DialogHeader>

        {step === 1 ? (
          <div className="space-y-6">
            {/* Experience Selection */}
            <div className="space-y-3">
              <Label>Что хотите попробовать?</Label>
              <div className="grid gap-2">
                {QUICK_EXPERIENCES.map((exp) => (
                  <button
                    key={exp.id}
                    onClick={() =>
                      setFormData({ ...formData, experience: exp.id })
                    }
                    className={cn(
                      'flex items-center justify-between p-3 rounded-lg border transition-all',
                      formData.experience === exp.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{exp.icon}</span>
                      <span className="font-medium">{exp.name}</span>
                    </div>
                    <Badge variant="secondary">{exp.price}₽</Badge>
                  </button>
                ))}
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Дата</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !formData.date && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.date ? (
                        format(formData.date, 'dd MMM', { locale: ru })
                      ) : (
                        <span>Дата</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.date}
                      onSelect={(date) => setFormData({ ...formData, date })}
                      disabled={(date) => date < new Date()}
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Время</Label>
                <Select
                  value={formData.time}
                  onValueChange={(time) => setFormData({ ...formData, time })}
                >
                  <SelectTrigger>
                    <Clock className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Время" />
                  </SelectTrigger>
                  <SelectContent>
                    {QUICK_TIMES.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Guests */}
            <div className="space-y-2">
              <Label>Гостей</Label>
              <div className="flex gap-2">
                {QUICK_GUESTS.map((count) => (
                  <button
                    key={count}
                    onClick={() => setFormData({ ...formData, guests: count })}
                    className={cn(
                      'flex-1 p-2 rounded-lg border text-center transition-all',
                      formData.guests === count
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={handleNext}
              disabled={
                !formData.experience || !formData.date || !formData.time
              }
              className="w-full"
            >
              Далее
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Booking Summary */}
            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>{selectedExperience?.name}</span>
                <span>{selectedExperience?.price}₽</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>
                  {formData.guests} гостей •{' '}
                  {formData.date &&
                    format(formData.date, 'dd MMM', { locale: ru })}{' '}
                  • {formData.time}
                </span>
              </div>
              <div className="flex justify-between font-bold border-t pt-2">
                <span>Итого</span>
                <span>{totalPrice.toLocaleString()}₽</span>
              </div>
            </div>

            {/* Contact Form */}
            <div className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="name">Имя *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Ваше имя"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="your@email.com"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="phone">Телефон</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="+62 (819) 432-863-95"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="flex-1"
              >
                Назад
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !formData.name || !formData.email}
                className="flex-1"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Бронирую...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Забронировать
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
