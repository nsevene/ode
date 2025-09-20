import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SEOHead } from '@/components/seo/SEOHead';
import { useSEO } from '@/hooks/useSEO';
import {
  BreadcrumbSchema,
  BreadcrumbNavigation,
} from '@/components/seo/BreadcrumbSchema';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  DollarSign,
  Filter,
  ArrowLeft,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import ImprovedNavigation from '@/components/ImprovedNavigation';
import SimpleEventBookingModal from '@/components/booking/SimpleEventBookingModal';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

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
}

const Events = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { getPageData } = useSEO();
  const pageData = getPageData('/events');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const categories = [
    { value: 'all', label: 'All Events' },
    { value: 'tasting', label: 'Дегустации' },
    { value: 'cooking', label: 'Мастер-классы' },
    { value: 'entertainment', label: 'Развлечения' },
    { value: 'family', label: 'Семейные' },
  ];

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'active')
        .gte('event_date', new Date().toISOString().split('T')[0])
        .order('event_date', { ascending: true })
        .order('start_time', { ascending: true });

      if (error || !data || data.length === 0) {
        // Используем моковые данные если база пустая
        const mockEvents: Event[] = [
          {
            id: '1',
            title: 'Мастер-класс по балийской кухне',
            description:
              'Explore the secrets of traditional Balinese cuisine with local chefs. Cook authentic dishes from fresh local ingredients.',
            event_type: 'cooking_class',
            event_date: '2025-08-05',
            start_time: '18:00',
            end_time: '21:00',
            price_usd: 75,
            max_guests: 12,
            available_spots: 8,
            venue: "Chef's Table",
            instructor: 'Шеф Кетут Сути',
            category: 'cooking',
            image_url:
              '/lovable-uploads/c249dca9-bfb0-49e1-89cc-41abfb0c64ad.png',
          },
          {
            id: '2',
            title: 'Винная дегустация "Terroir"',
            description:
              'Откройте для себя уникальные вина со всего мира в нашем винном погребе. Дегустация с сомелье и закусками.',
            event_type: 'wine_tasting',
            event_date: '2025-08-07',
            start_time: '19:00',
            end_time: '21:30',
            price_usd: 95,
            max_guests: 16,
            available_spots: 12,
            venue: 'Wine Staircase',
            instructor: 'Сомелье Анна Новак',
            category: 'tasting',
            image_url:
              '/lovable-uploads/eb0ecf72-72e4-4040-9c75-dbf57409f27d.png',
          },
          {
            id: '3',
            title: 'Семейный бранч с детскими активностями',
            description:
              'Уютный семейный бранч с игровой зоной для детей, мини-мастер-классами и развлекательной программой.',
            event_type: 'family_brunch',
            event_date: '2025-08-09',
            start_time: '11:00',
            end_time: '14:00',
            price_usd: 45,
            max_guests: 24,
            available_spots: 18,
            venue: 'Main Hall',
            instructor: 'Команда аниматоров',
            category: 'family',
            image_url:
              '/lovable-uploads/f41aad56-be6e-42c6-b101-46d8f2520a51.png',
          },
          {
            id: '4',
            title: 'Джазовый вечер с коктейлями',
            description:
              'Расслабьтесь под звуки живого джаза с авторскими коктейлями от наших барменов. Атмосферный вечер в стиле 1920-х.',
            event_type: 'entertainment',
            event_date: '2025-08-12',
            start_time: '20:00',
            end_time: '23:00',
            price_usd: 65,
            max_guests: 40,
            available_spots: 32,
            venue: 'Lounge Bar',
            instructor: 'Квартет "Bali Jazz"',
            category: 'entertainment',
            image_url:
              '/lovable-uploads/d83cc98e-b461-4440-8991-869f626494cf.png',
          },
        ];
        setEvents(mockEvents);
      } else {
        setEvents(data);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      // Используем моковые данные в случае ошибки
      const mockEvents: Event[] = [
        {
          id: '1',
          title: 'Мастер-класс по балийской кухне',
          description:
            'Изучите секреты традиционной балийской кухни с местными шеф-поварами.',
          event_type: 'cooking_class',
          event_date: '2025-08-05',
          start_time: '18:00',
          end_time: '21:00',
          price_usd: 75,
          max_guests: 12,
          available_spots: 8,
          venue: "Chef's Table",
          instructor: 'Шеф Кетут Сути',
          category: 'cooking',
          image_url:
            '/lovable-uploads/c249dca9-bfb0-49e1-89cc-41abfb0c64ad.png',
        },
      ];
      setEvents(mockEvents);
    } finally {
      setLoading(false);
    }
  };

  const handleBookEvent = (eventId: string) => {
    const event = events.find((e) => e.id === eventId);
    if (event) {
      setSelectedEvent(event);
      setIsBookingModalOpen(true);
    }
  };

  const handleBookingSuccess = () => {
    // Обновляем список событий после успешного бронирования
    fetchEvents();
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'tasting':
        return 'bg-wine text-wine-foreground';
      case 'cooking':
        return 'bg-gold-accent text-black';
      case 'entertainment':
        return 'bg-burgundy-primary text-white';
      case 'family':
        return 'bg-earth-warm text-earth-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const filteredEvents =
    selectedCategory === 'all'
      ? events
      : events.filter((event) => event.category === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <ImprovedNavigation />
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Загрузка событий...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={pageData.title}
        description={pageData.description}
        keywords={pageData.keywords}
        image={pageData.image}
        type={pageData.type}
      />
      <BreadcrumbSchema />

      <ImprovedNavigation />

      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <BreadcrumbNavigation />
          {/* Header */}
          <div className="mb-8">
            <Link to="/">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                На главную
              </Button>
            </Link>

            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-burgundy-primary to-gold-accent bg-clip-text text-transparent">
                Events and Masterclasses
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Присоединяйтесь к увлекательным кулинарным мастер-классам,
                винным дегустациям и музыкальным вечерам в атмосфере тропических
                джунглей Убуда
              </p>
            </div>

            {/* Filter */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <Filter className="w-5 h-5 text-muted-foreground" />
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Events Grid */}
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Нет предстоящих событий
              </h3>
              <p className="text-muted-foreground">
                Stay tuned - exciting new events coming soon!
              </p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredEvents.map((event) => (
                <Card
                  key={event.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-48">
                    <img
                      src={event.image_url}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className={getCategoryColor(event.category)}>
                        {
                          categories.find((c) => c.value === event.category)
                            ?.label
                        }
                      </Badge>
                    </div>
                  </div>

                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl mb-2">
                      {event.title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {event.description}
                    </p>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Date & Time */}
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>
                        {format(new Date(event.event_date), 'dd MMMM yyyy', {
                          locale: ru,
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>
                        {event.start_time} - {event.end_time}
                      </span>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{event.venue}</span>
                    </div>

                    {/* Instructor */}
                    {event.instructor && (
                      <div className="text-sm">
                        <span className="font-medium">Ведущий:</span>{' '}
                        {event.instructor}
                      </div>
                    )}

                    {/* Capacity & Price */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span>
                          {event.available_spots} / {event.max_guests} мест
                        </span>
                      </div>
                      <div className="flex items-center gap-2 font-semibold text-lg">
                        <DollarSign className="w-4 h-4" />
                        <span>${event.price_usd}</span>
                      </div>
                    </div>

                    {/* Booking Button */}
                    <Button
                      className="w-full"
                      onClick={() => handleBookEvent(event.id)}
                      disabled={event.available_spots === 0}
                    >
                      {event.available_spots === 0
                        ? 'Мест нет'
                        : 'Забронировать'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Event Booking Modal */}
      <SimpleEventBookingModal
        event={selectedEvent}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onBookingSuccess={handleBookingSuccess}
      />
    </div>
  );
};

export default Events;
