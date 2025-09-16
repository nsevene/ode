import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Clock } from "lucide-react";

interface TimeSlot {
  time_slot: string;
  is_available: boolean;
  booked_count: number;
}

interface TimeSlotSelectorProps {
  availableSlots: TimeSlot[];
  selectedTime: string;
  setSelectedTime: (time: string) => void;
  selectedDate: Date | undefined;
}

export const TimeSlotSelector = ({
  availableSlots,
  selectedTime,
  setSelectedTime,
  selectedDate
}: TimeSlotSelectorProps) => {
  if (!selectedDate) {
    return (
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Время
        </Label>
        <p className="text-sm text-muted-foreground">
          Сначала выберите дату
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        <Clock className="w-4 h-4" />
        Время
      </Label>
      <div className="grid grid-cols-3 gap-2">
        {availableSlots.map((slot) => (
          <Button
            key={slot.time_slot}
            variant={selectedTime === slot.time_slot ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedTime(slot.time_slot)}
            disabled={!slot.is_available}
            className="text-xs"
          >
            {slot.time_slot.slice(0, 5)}
          </Button>
        ))}
      </div>
      {availableSlots.length === 0 && (
        <p className="text-sm text-muted-foreground">
          На выбранную дату нет свободных слотов
        </p>
      )}
    </div>
  );
};