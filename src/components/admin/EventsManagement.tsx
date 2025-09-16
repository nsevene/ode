import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, DollarSign, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import EventFormModal from './EventFormModal';

interface Event {
  id: string;
  title: string;
  description: string;
  event_type: string;
  event_date: string;
  start_time: string;
  end_time: string;
  price_usd: number;
  max_guests: number;
  available_spots: number;
  venue: string;
  instructor: string;
  category: string;
  image_url: string;
  status: string;
}

const EventsManagement = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: true })
        .order('start_time', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error loading events:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить события",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsFormModalOpen(true);
  };

  const handleCreateEvent = () => {
    setSelectedEvent(null);
    setIsFormModalOpen(true);
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;

      toast({
        title: "Событие удалено",
        description: "Событие успешно удалено из календаря",
      });

      loadEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить событие",
        variant: "destructive",
      });
    }
  };

  const toggleEventStatus = async (eventId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    
    try {
      const { error } = await supabase
        .from('events')
        .update({ status: newStatus })
        .eq('id', eventId);

      if (error) throw error;

      toast({
        title: "Статус изменен",
        description: `Событие ${newStatus === 'active' ? 'активировано' : 'деактивировано'}`,
      });

      loadEvents();
    } catch (error) {
      console.error('Error updating event status:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось изменить статус события",
        variant: "destructive",
      });
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'tasting': return 'bg-wine text-wine-foreground';
      case 'cooking': return 'bg-gold-accent text-black';
      case 'entertainment': return 'bg-burgundy-primary text-white';
      case 'family': return 'bg-earth-warm text-earth-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Загрузка событий...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Управление событиями</h2>
          <p className="text-muted-foreground">Создание и редактирование событий</p>
        </div>
        <Button onClick={handleCreateEvent} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Создать событие
        </Button>
      </div>

      {/* Events Grid */}
      {events.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">Нет событий</h3>
          <p className="text-muted-foreground mb-4">
            Создайте ваше первое событие для посетителей
          </p>
          <Button onClick={handleCreateEvent}>
            <Plus className="w-4 h-4 mr-2" />
            Создать событие
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Card key={event.id} className="overflow-hidden">
              <div className="relative h-32">
                <img
                  src={event.image_url}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <Badge className={getCategoryColor(event.category)}>
                    {event.category}
                  </Badge>
                  <Badge className={getStatusColor(event.status)}>
                    {event.status === 'active' ? 'Активно' : 'Неактивно'}
                  </Badge>
                </div>
              </div>

              <CardHeader className="pb-3">
                <CardTitle className="text-lg line-clamp-1">{event.title}</CardTitle>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {event.description}
                </p>
              </CardHeader>

              <CardContent className="space-y-3">
                {/* Event Details */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>
                      {format(new Date(event.event_date), 'dd MMMM yyyy', { locale: ru })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>{event.start_time} - {event.end_time}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="line-clamp-1">{event.venue}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>{event.available_spots} / {event.max_guests} мест</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <span className="font-semibold">${event.price_usd}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditEvent(event)}
                    className="flex items-center gap-2"
                  >
                    <Edit className="w-3 h-3" />
                    Изменить
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="flex items-center gap-2"
                      >
                        <Trash2 className="w-3 h-3" />
                        Удалить
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Удалить событие?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Это действие нельзя отменить. Событие будет полностью удалено
                          из системы вместе со всеми связанными бронированиями.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Отмена</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteEvent(event.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Удалить
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>

                {/* Status Toggle */}
                <Button
                  size="sm"
                  variant={event.status === 'active' ? 'secondary' : 'default'}
                  onClick={() => toggleEventStatus(event.id, event.status)}
                  className="w-full"
                >
                  {event.status === 'active' ? 'Деактивировать' : 'Активировать'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Event Form Modal */}
      <EventFormModal
        event={selectedEvent}
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSuccess={loadEvents}
      />
    </div>
  );
};

export default EventsManagement;