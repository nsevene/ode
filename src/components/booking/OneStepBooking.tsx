import { useState } from 'react';
import { CalendarIcon, Clock, Users, Phone, Mail, CreditCard, Loader2 } from 'lucide-react';
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
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

const EXPERIENCES = [
  { id: "taste-alley", name: "Taste Alley", price: 1500, icon: "🎯" },
  { id: "chefs-table", name: "Chef's Table", price: 3500, icon: "👨‍🍳" },
  { id: "wine-tasting", name: "Винная дегустация", price: 2500, icon: "🍷" }
];

const TIME_SLOTS = ["12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"];

interface BookingFormData {
  experience: string;
  date: Date | null;
  time: string;
  guests: number;
  name: string;
  email: string;
  phone: string;
}

interface OneStepBookingProps {
  onBookingComplete?: (data: BookingFormData) => void;
  onClose?: () => void;
}

export const OneStepBooking = ({ onBookingComplete, onClose }: OneStepBookingProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<BookingFormData>({
    experience: '',
    date: null,
    time: '',
    guests: 2,
    name: '',
    email: '',
    phone: ''
  });
  
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const selectedExperience = EXPERIENCES.find(exp => exp.id === formData.experience);
  const totalPrice = selectedExperience ? selectedExperience.price * formData.guests : 0;

  const updateField = (field: keyof BookingFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = () => {
    return formData.experience && 
           formData.date && 
           formData.time && 
           formData.name.trim().length >= 2 && 
           formData.email.includes('@');
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      toast({
        title: "Заполните все обязательные поля",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate booking API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Бронирование создано!",
        description: `${selectedExperience?.name} на ${formData.guests} гостей`,
      });

      onBookingComplete?.(formData);
    } catch (error) {
      toast({
        title: "Ошибка бронирования",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <CalendarIcon className="w-5 h-5" />
          Quick One-Touch Booking
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Experience Selection */}
        <div className="space-y-3">
          <Label className="text-base font-medium">Выберите опыт</Label>
          <div className={cn("grid gap-3", isMobile ? "grid-cols-1" : "grid-cols-3")}>
            {EXPERIENCES.map((exp) => (
              <Card 
                key={exp.id}
                className={cn(
                  "cursor-pointer transition-all hover:shadow-md",
                  formData.experience === exp.id ? "ring-2 ring-primary shadow-md" : "hover:ring-1 hover:ring-primary/30"
                )}
                onClick={() => updateField('experience', exp.id)}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2">{exp.icon}</div>
                  <h4 className="font-semibold text-sm">{exp.name}</h4>
                  <Badge variant="secondary" className="mt-1">
                    {exp.price}₽/чел
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Separator />

        {/* Date, Time & Guests Row */}
        <div className={cn("grid gap-4", isMobile ? "grid-cols-1" : "grid-cols-3")}>
          {/* Date */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Дата</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.date ? format(formData.date, "dd MMM", { locale: ru }) : "Выберите"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.date || undefined}
                  onSelect={(date) => updateField('date', date)}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Время</Label>
            <Select value={formData.time} onValueChange={(value) => updateField('time', value)}>
              <SelectTrigger>
                <Clock className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Время" />
              </SelectTrigger>
              <SelectContent>
                {TIME_SLOTS.map((time) => (
                  <SelectItem key={time} value={time}>{time}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Guests */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Гости</Label>
            <Select 
              value={formData.guests.toString()} 
              onValueChange={(value) => updateField('guests', parseInt(value))}
            >
              <SelectTrigger>
                <Users className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((count) => (
                  <SelectItem key={count} value={count.toString()}>
                    {count}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        {/* Contact Information */}
        <div className="space-y-4">
          <Label className="text-base font-medium">Контактная информация</Label>
          <div className={cn("grid gap-4", isMobile ? "grid-cols-1" : "grid-cols-2")}>
            <div className="space-y-2">
              <Input
                placeholder="Ваше имя *"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email *"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                className="h-11"
              />
            </div>
          </div>
          <Input
            placeholder="Телефон (опционально)"
            value={formData.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            className="h-11"
          />
        </div>

        {/* Price Summary */}
        {selectedExperience && (
          <>
            <Separator />
            <div className="bg-primary/5 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{selectedExperience.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formData.guests} × {selectedExperience.price}₽
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">
                    {totalPrice.toLocaleString()}₽
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Submit Button */}
        <div className="flex gap-3 pt-2">
          {onClose && (
            <Button variant="outline" onClick={onClose} className="flex-1">
              Отмена
            </Button>
          )}
          <Button 
            onClick={handleSubmit}
            disabled={!isFormValid() || isSubmitting}
            className="flex-1 h-12 text-base"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Бронирование...
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4 mr-2" />
                Забронировать {totalPrice > 0 && `за ${totalPrice.toLocaleString()}₽`}
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};