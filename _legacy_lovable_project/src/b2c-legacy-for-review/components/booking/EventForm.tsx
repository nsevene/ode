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
import { Users } from 'lucide-react';

interface EventFormProps {
  guestCount: number;
  setGuestCount: (count: number) => void;
  maxGuests: number;
  formData: {
    guestName: string;
    guestEmail: string;
    guestPhone: string;
    specialRequests: string;
  };
  updateFormData: (field: string, value: string) => void;
}

export const EventForm = ({
  guestCount,
  setGuestCount,
  maxGuests,
  formData,
  updateFormData,
}: EventFormProps) => {
  return (
    <div className="space-y-4">
      {/* Guest Count */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          Количество гостей
        </Label>
        <Select
          value={guestCount.toString()}
          onValueChange={(value) => setGuestCount(Number(value))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: maxGuests }, (_, i) => i + 1).map((num) => (
              <SelectItem key={num} value={num.toString()}>
                {num} {num === 1 ? 'гость' : num < 5 ? 'гостя' : 'гостей'}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Guest Details */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="guest-name">Имя *</Label>
          <Input
            id="guest-name"
            value={formData.guestName}
            onChange={(e) => updateFormData('guestName', e.target.value)}
            placeholder="Ваше имя"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="guest-email">Email *</Label>
          <Input
            id="guest-email"
            type="email"
            value={formData.guestEmail}
            onChange={(e) => updateFormData('guestEmail', e.target.value)}
            placeholder="your@email.com"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="guest-phone">Телефон</Label>
        <Input
          id="guest-phone"
          type="tel"
          value={formData.guestPhone}
          onChange={(e) => updateFormData('guestPhone', e.target.value)}
          placeholder="+62 (819) 432-863-95"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="special-requests">Особые пожелания</Label>
        <Textarea
          id="special-requests"
          value={formData.specialRequests}
          onChange={(e) => updateFormData('specialRequests', e.target.value)}
          placeholder="Диетические ограничения, аллергии, особые пожелания..."
          rows={3}
        />
      </div>
    </div>
  );
};
