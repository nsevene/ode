import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarIcon } from "lucide-react";
import { format, isToday, isTomorrow } from "date-fns";
import { ru } from "date-fns/locale";

interface DateSelectorProps {
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  availableDates: Date[];
}

export const DateSelector = ({
  selectedDate,
  setSelectedDate,
  availableDates
}: DateSelectorProps) => {
  const getDateDisplayText = (date: Date | undefined) => {
    if (!date) return "Выберите дату";
    
    if (isToday(date)) {
      return `Сегодня, ${format(date, "d MMMM", { locale: ru })}`;
    } else if (isTomorrow(date)) {
      return `Завтра, ${format(date, "d MMMM", { locale: ru })}`;
    } else {
      return format(date, "EEEE, d MMMM", { locale: ru });
    }
  };

  const isDateAvailable = (date: Date) => {
    return availableDates.some(availableDate => 
      availableDate.toDateString() === date.toDateString()
    );
  };

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        <CalendarIcon className="w-4 h-4" />
        Дата посещения
      </Label>
      {selectedDate && (
        <div className="text-sm text-muted-foreground mb-2">
          {getDateDisplayText(selectedDate)}
        </div>
      )}
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        className="rounded-md border"
        disabled={(date) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          const dateToCheck = new Date(date);
          dateToCheck.setHours(0, 0, 0, 0);
          
          return dateToCheck < today || !isDateAvailable(date);
        }}
        modifiers={{
          available: availableDates,
        }}
        modifiersStyles={{
          available: {
            backgroundColor: 'hsl(var(--primary))',
            color: 'hsl(var(--primary-foreground))',
          }
        }}
      />
    </div>
  );
};