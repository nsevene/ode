import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface PackageInfo {
  id: string;
  name: string;
  price: number;
  duration: string;
  maxGuests: number;
}

interface BookingSummaryProps {
  selectedDate: Date | undefined;
  selectedTime: string;
  guestCount: number;
  experienceTitle: string;
  packageInfo: PackageInfo | null;
  eventPrice: number;
  passportEnabled: boolean;
}

export const BookingSummary = ({
  selectedDate,
  selectedTime,
  guestCount,
  experienceTitle,
  packageInfo,
  eventPrice,
  passportEnabled
}: BookingSummaryProps) => {
  const calculateTotal = () => {
    const basePrice = packageInfo?.price || eventPrice;
    let total = basePrice * guestCount;
    
    if (passportEnabled) {
      total += 500; // NFC passport fee
    }
    
    return total;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Детали бронирования</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <div className="font-medium">{experienceTitle}</div>
          {packageInfo && (
            <div className="text-sm text-muted-foreground">
              Пакет: {packageInfo.name}
            </div>
          )}
        </div>
        
        {selectedDate && (
          <div className="flex justify-between">
            <span>Дата:</span>
            <span>{format(selectedDate, "d MMMM, EEEE", { locale: ru })}</span>
          </div>
        )}
        
        {selectedTime && (
          <div className="flex justify-between">
            <span>Время:</span>
            <span>{selectedTime.slice(0, 5)}</span>
          </div>
        )}
        
        <div className="flex justify-between">
          <span>Гостей:</span>
          <span>{guestCount}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Цена за человека:</span>
          <span>{packageInfo?.price || eventPrice} ₽</span>
        </div>
        
        {passportEnabled && (
          <div className="flex justify-between items-center">
            <span>NFC Паспорт:</span>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Включён</Badge>
              <span>500 ₽</span>
            </div>
          </div>
        )}
        
        <hr />
        
        <div className="flex justify-between font-bold text-lg">
          <span>Итого:</span>
          <span>{calculateTotal()} ₽</span>
        </div>
      </CardContent>
    </Card>
  );
};