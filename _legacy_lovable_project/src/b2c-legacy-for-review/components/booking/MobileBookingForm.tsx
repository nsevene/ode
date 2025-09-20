import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Phone, Mail, User, MessageSquare } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileBookingFormProps {
  guestCount: number;
  setGuestCount: (count: number) => void;
  maxGuests: number;
  guestName: string;
  setGuestName: (name: string) => void;
  guestEmail: string;
  setGuestEmail: (email: string) => void;
  guestPhone: string;
  setGuestPhone: (phone: string) => void;
  specialRequests: string;
  setSpecialRequests: (requests: string) => void;
}

export const MobileBookingForm = ({
  guestCount,
  setGuestCount,
  maxGuests,
  guestName,
  setGuestName,
  guestEmail,
  setGuestEmail,
  guestPhone,
  setGuestPhone,
  specialRequests,
  setSpecialRequests,
}: MobileBookingFormProps) => {
  const isMobile = useIsMobile();
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Enhanced mobile experience with larger touch targets
  const inputClasses = isMobile ? 'h-14 text-lg px-4' : 'h-10';

  const labelClasses = isMobile ? 'text-base font-medium mb-3' : 'text-sm mb-2';

  return (
    <Card className={`w-full ${isMobile ? 'shadow-lg' : ''}`}>
      <CardHeader className={isMobile ? 'pb-4' : 'pb-6'}>
        <CardTitle
          className={`flex items-center gap-2 ${isMobile ? 'text-xl' : 'text-lg'}`}
        >
          <Users className={`${isMobile ? 'w-6 h-6' : 'w-5 h-5'}`} />
          Информация о гостях
        </CardTitle>
      </CardHeader>

      <CardContent className={`space-y-${isMobile ? '6' : '4'}`}>
        {/* Guest Count - Larger buttons on mobile */}
        <div className="space-y-3">
          <Label className={labelClasses}>Количество гостей</Label>
          <div
            className={`grid grid-cols-${Math.min(maxGuests, isMobile ? 4 : 6)} gap-2`}
          >
            {Array.from({ length: maxGuests }, (_, i) => i + 1).map((num) => (
              <Button
                key={num}
                variant={guestCount === num ? 'default' : 'outline'}
                onClick={() => setGuestCount(num)}
                className={isMobile ? 'h-12 text-lg' : 'h-10'}
              >
                {num}
              </Button>
            ))}
          </div>
        </div>

        {/* Contact Information - Enhanced for mobile */}
        <div className="space-y-4">
          <div className="space-y-3">
            <Label
              htmlFor="guest-name"
              className={`${labelClasses} flex items-center gap-2`}
            >
              <User className="w-4 h-4" />
              Имя и фамилия *
            </Label>
            <Input
              id="guest-name"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="Ваше полное имя"
              className={`${inputClasses} ${focusedField === 'name' ? 'ring-2 ring-primary' : ''}`}
              onFocus={() => setFocusedField('name')}
              onBlur={() => setFocusedField(null)}
              autoComplete="name"
              required
            />
          </div>

          <div className="space-y-3">
            <Label
              htmlFor="guest-email"
              className={`${labelClasses} flex items-center gap-2`}
            >
              <Mail className="w-4 h-4" />
              Email *
            </Label>
            <Input
              id="guest-email"
              type="email"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              placeholder="your@email.com"
              className={`${inputClasses} ${focusedField === 'email' ? 'ring-2 ring-primary' : ''}`}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              autoComplete="email"
              required
            />
          </div>

          <div className="space-y-3">
            <Label
              htmlFor="guest-phone"
              className={`${labelClasses} flex items-center gap-2`}
            >
              <Phone className="w-4 h-4" />
              Телефон
            </Label>
            <Input
              id="guest-phone"
              type="tel"
              value={guestPhone}
              onChange={(e) => setGuestPhone(e.target.value)}
              placeholder="+62 (819) 432-863-95"
              className={`${inputClasses} ${focusedField === 'phone' ? 'ring-2 ring-primary' : ''}`}
              onFocus={() => setFocusedField('phone')}
              onBlur={() => setFocusedField(null)}
              autoComplete="tel"
            />
          </div>

          <div className="space-y-3">
            <Label
              htmlFor="special-requests"
              className={`${labelClasses} flex items-center gap-2`}
            >
              <MessageSquare className="w-4 h-4" />
              Особые пожелания
            </Label>
            <Textarea
              id="special-requests"
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              placeholder="Диетические ограничения, аллергии, особые пожелания..."
              className={`${isMobile ? 'min-h-[120px] text-lg p-4' : 'min-h-[80px]'} ${focusedField === 'requests' ? 'ring-2 ring-primary' : ''}`}
              onFocus={() => setFocusedField('requests')}
              onBlur={() => setFocusedField(null)}
              rows={isMobile ? 4 : 3}
            />
          </div>
        </div>

        {/* Mobile-specific improvements */}
        {isMobile && (
          <div className="pt-4 bg-muted/30 rounded-lg p-4 mt-6">
            <div className="text-sm text-muted-foreground space-y-2">
              <p className="flex items-center gap-2">
                ℹ️ Совет: используйте автозаполнение браузера для быстрого ввода
              </p>
              <p className="flex items-center gap-2">
                📱 Все поля адаптированы для мобильных устройств
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
