import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CalendarIcon, Clock, Users, Loader2, MapPin, CreditCard } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const quickBookingSchema = z.object({
  date: z.date({
    required_error: 'Выберите дату',
  }),
  timeSlot: z.string().min(1, 'Выберите время'),
  guestCount: z.number().min(1, 'Минимум 1 гость').max(8, 'Максимум 8 гостей'),
  experienceType: z.string().min(1, 'Выберите тип опыта'),
  guestName: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
  guestEmail: z.string().email('Введите корректный email'),
  guestPhone: z.string().optional(),
});

type QuickBookingFormData = z.infer<typeof quickBookingSchema>;

const EXPERIENCE_OPTIONS = [
  { 
    id: "taste-alley", 
    name: "Taste Alley Quest", 
    price: 1500,
    duration: "2 часа",
    description: "Интерактивный кулинарный квест"
  },
  { 
    id: "chefs-table", 
    name: "Chef's Table", 
    price: 3500,
    duration: "2.5 часа",
    description: "Эксклюзивное место у кухни"
  },
  { 
    id: "wine-tasting", 
    name: "Винная дегустация", 
    price: 2500,
    duration: "1.5 часа",
    description: "Дегустация с сомелье"
  }
];

const TIME_SLOTS = [
  "12:00", "13:00", "14:00", "15:00", "16:00", 
  "17:00", "18:00", "19:00", "20:00", "21:00"
];

interface QuickBookingProps {
  onBookingComplete?: (data: QuickBookingFormData) => void;
  onClose?: () => void;
}

export const QuickBooking = ({ onBookingComplete, onClose }: QuickBookingProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<QuickBookingFormData>({
    resolver: zodResolver(quickBookingSchema),
    defaultValues: {
      guestCount: 2,
    },
  });

  const selectedExperience = EXPERIENCE_OPTIONS.find(
    exp => exp.id === form.watch('experienceType')
  );

  const onSubmit = async (data: QuickBookingFormData) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Бронирование успешно создано!",
        description: `Ваше бронирование на ${data.guestCount} гостей подтверждено`,
      });

      onBookingComplete?.(data);
      onClose?.();
    } catch (error) {
      toast({
        title: "Ошибка бронирования",
        description: "Попробуйте снова или свяжитесь с нами",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalPrice = selectedExperience ? selectedExperience.price * form.watch('guestCount') : 0;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5" />
          Quick Booking
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Experience Selection */}
          <div className="space-y-3">
            <Label>Выберите опыт</Label>
            <div className="grid gap-3">
              {EXPERIENCE_OPTIONS.map((experience) => (
                <Card 
                  key={experience.id}
                  className={cn(
                    "cursor-pointer transition-all hover:ring-2 hover:ring-primary/50",
                    form.watch('experienceType') === experience.id && "ring-2 ring-primary"
                  )}
                  onClick={() => form.setValue('experienceType', experience.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{experience.name}</h4>
                        <p className="text-sm text-muted-foreground">{experience.description}</p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="secondary">{experience.duration}</Badge>
                          <Badge>{experience.price}₽/чел</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {form.formState.errors.experienceType && (
              <p className="text-sm text-destructive">{form.formState.errors.experienceType.message}</p>
            )}
          </div>

          {/* Date & Time Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date Selection */}
            <div className="space-y-2">
              <Label>Дата</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !form.watch('date') && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {form.watch('date') ? (
                      format(form.watch('date'), "dd MMMM yyyy", { locale: ru })
                    ) : (
                      <span>Выберите дату</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={form.watch('date')}
                    onSelect={(date) => form.setValue('date', date!)}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              {form.formState.errors.date && (
                <p className="text-sm text-destructive">{form.formState.errors.date.message}</p>
              )}
            </div>

            {/* Time Selection */}
            <div className="space-y-2">
              <Label>Время</Label>
              <Select value={form.watch('timeSlot')} onValueChange={(value) => form.setValue('timeSlot', value)}>
                <SelectTrigger>
                  <Clock className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Выберите время" />
                </SelectTrigger>
                <SelectContent>
                  {TIME_SLOTS.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.timeSlot && (
                <p className="text-sm text-destructive">{form.formState.errors.timeSlot.message}</p>
              )}
            </div>
          </div>

          {/* Guest Count */}
          <div className="space-y-2">
            <Label>Количество гостей</Label>
            <Select 
              value={form.watch('guestCount')?.toString()} 
              onValueChange={(value) => form.setValue('guestCount', parseInt(value))}
            >
              <SelectTrigger>
                <Users className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((count) => (
                  <SelectItem key={count} value={count.toString()}>
                    {count} {count === 1 ? 'гость' : count < 5 ? 'гостя' : 'гостей'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.guestCount && (
              <p className="text-sm text-destructive">{form.formState.errors.guestCount.message}</p>
            )}
          </div>

          {/* Contact Info Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="guestName">Имя *</Label>
              <Input
                id="guestName"
                {...form.register('guestName')}
                placeholder="Ваше имя"
              />
              {form.formState.errors.guestName && (
                <p className="text-sm text-destructive">{form.formState.errors.guestName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="guestEmail">Email *</Label>
              <Input
                id="guestEmail"
                type="email"
                {...form.register('guestEmail')}
                placeholder="your@email.com"
              />
              {form.formState.errors.guestEmail && (
                <p className="text-sm text-destructive">{form.formState.errors.guestEmail.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="guestPhone">Телефон</Label>
            <Input
              id="guestPhone"
              {...form.register('guestPhone')}
              placeholder="+62 (___) ___-___-__"
            />
          </div>

          {/* Price Summary */}
          {selectedExperience && (
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{selectedExperience.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {form.watch('guestCount')} гостей × {selectedExperience.price}₽
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{totalPrice.toLocaleString()}₽</p>
                  <p className="text-sm text-muted-foreground">Общая стоимость</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            {onClose && (
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Отмена
              </Button>
            )}
            <Button 
              type="submit" 
              disabled={isSubmitting || !form.formState.isValid}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Бронирование...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Забронировать за {totalPrice.toLocaleString()}₽
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};