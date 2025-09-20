import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface Event {
  id: string;
  title: string;
  description?: string;
  event_date: string;
  start_time: string;
  end_time: string;
  price_usd: number;
  available_spots: number;
  max_guests: number;
  venue?: string;
  instructor?: string;
  category: string;
}

interface EventInfoProps {
  event: Event;
  guestCount: number;
}

export const EventInfo = ({ event, guestCount }: EventInfoProps) => {
  const eventDate = new Date(event.event_date);
  const totalPrice = event.price_usd * guestCount;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{event.title}</span>
          <Badge variant="secondary">{event.category}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {event.description && (
          <p className="text-muted-foreground">{event.description}</p>
        )}

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{format(eventDate, 'd MMMM yyyy', { locale: ru })}</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>
              {event.start_time.slice(0, 5)} - {event.end_time.slice(0, 5)}
            </span>
          </div>

          {event.venue && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{event.venue}</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>{event.available_spots} мест доступно</span>
          </div>
        </div>

        {event.instructor && (
          <div className="pt-2 border-t">
            <span className="text-sm font-medium">Инструктор: </span>
            <span className="text-sm text-muted-foreground">
              {event.instructor}
            </span>
          </div>
        )}

        <div className="pt-2 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              <span className="font-medium">
                Цена за человека: ${event.price_usd}
              </span>
            </div>
            <div className="text-lg font-bold">Итого: ${totalPrice}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
