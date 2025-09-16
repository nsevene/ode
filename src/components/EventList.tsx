import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, DollarSign } from 'lucide-react';
import { formatIDR } from '@/lib/idr';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  price?: number;
  venue: string;
  category: string;
  age21?: boolean;
  cta?: string;
}

interface EventListProps {
  events?: Event[];
}

export default function EventList({ events = [] }: EventListProps) {
  const [eventData, setEventData] = React.useState<Event[]>(events);
  const [loading, setLoading] = React.useState(events.length === 0);

  React.useEffect(() => {
    if (events.length === 0) {
      // Fetch from Supabase Edge Function
      fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/cms-events`, {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        }
      })
        .then(r => r.json())
        .then(data => {
          setEventData(data.items || []);
          setLoading(false);
        })
        .catch(err => {
          console.error('Failed to fetch events:', err);
          setLoading(false);
        });
    }
  }, [events.length]);

  if (loading) {
    return (
      <div className="grid gap-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-muted rounded w-1/2"></div>
                <div className="h-3 bg-muted rounded w-1/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (eventData.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">События не найдены</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {eventData.map((event) => (
        <Card key={event.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <CardTitle className="text-lg">{event.title}</CardTitle>
              {event.age21 && (
                <Badge variant="warning" className="ml-2">21+</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {event.date}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {event.time}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {event.venue}
                </div>
              </div>
              
              {event.price && (
                <div className="flex items-center gap-1 text-sm">
                  <DollarSign className="w-4 h-4" />
                  {formatIDR(event.price)}
                </div>
              )}
              
              <Badge variant="outline">{event.category}</Badge>
              
              <div className="pt-2">
                <Button asChild size="sm">
                  <a href={event.cta || '#'}>
                    Подробнее →
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}