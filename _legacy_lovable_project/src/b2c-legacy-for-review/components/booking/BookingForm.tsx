import { useState } from 'react';
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
import { useIsMobile } from '@/hooks/use-mobile';
import { MobileBookingForm } from './MobileBookingForm';
import { PromoCodeWidget } from '@/components/marketing/PromoCodeWidget';

interface BookingFormProps {
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
  orderAmount?: number;
  onPromoCodeApplied?: (discount: number, code: string) => void;
}

export const BookingForm = ({
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
  orderAmount,
  onPromoCodeApplied,
}: BookingFormProps) => {
  const isMobile = useIsMobile();

  // Use mobile version for mobile devices
  if (isMobile) {
    return (
      <MobileBookingForm
        guestCount={guestCount}
        setGuestCount={setGuestCount}
        maxGuests={maxGuests}
        guestName={guestName}
        setGuestName={setGuestName}
        guestEmail={guestEmail}
        setGuestEmail={setGuestEmail}
        guestPhone={guestPhone}
        setGuestPhone={setGuestPhone}
        specialRequests={specialRequests}
        setSpecialRequests={setSpecialRequests}
      />
    );
  }

  // Desktop version
  return (
    <div className="space-y-4">
      {/* Guest Count Selection */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          Number of guests
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
                {num} {num === 1 ? 'guest' : 'guests'}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Contact Information */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="guest-name">Full Name *</Label>
          <Input
            id="guest-name"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            placeholder="Your full name"
            required
            pattern="[A-Za-z\s]+"
            title="Please enter a valid name (letters and spaces only)"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="guest-email">Email *</Label>
          <Input
            id="guest-email"
            type="email"
            value={guestEmail}
            onChange={(e) => setGuestEmail(e.target.value)}
            placeholder="your@email.com"
            required
            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
            title="Please enter a valid email address"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="guest-phone">Phone Number</Label>
          <Input
            id="guest-phone"
            type="tel"
            value={guestPhone}
            onChange={(e) => setGuestPhone(e.target.value)}
            placeholder="+62 (819) 432-863-95"
            pattern="[\+]?[0-9\s\(\)\-]+"
            title="Please enter a valid phone number"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="special-requests">Special Requests</Label>
          <Textarea
            id="special-requests"
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
            placeholder="Dietary restrictions, allergies, special requests..."
            rows={3}
            maxLength={500}
          />
        </div>

        {/* Promo Code Widget */}
        <PromoCodeWidget
          orderAmount={orderAmount}
          onCodeApplied={onPromoCodeApplied}
        />
      </div>
    </div>
  );
};
