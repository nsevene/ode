import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ImprovedNavigation from '@/components/ImprovedNavigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  Coffee,
  ChefHat,
  Utensils,
  Wine,
  TreePine,
  Laptop,
  Sunset,
  Building2,
  Cigarette,
  Calendar,
  Users,
  GraduationCap,
  Music,
  Search,
  Filter,
  Clock,
  MapPin,
  Phone,
  Mail,
  Star,
  Heart,
  Share2,
  Plus,
  Minus,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useIsMobile } from '@/hooks/use-mobile';

interface Space {
  id: string;
  name: string;
  description: string;
  area: string;
  floor: number;
  capacity: number;
  price_per_hour: number;
  price_per_day: number;
  features: string[];
  amenities: string[];
  availability: {
    monday: string[];
    tuesday: string[];
    wednesday: string[];
    thursday: string[];
    friday: string[];
    saturday: string[];
    sunday: string[];
  };
  is_available: boolean;
  is_featured: boolean;
  rating: number;
  review_count: number;
  images: string[];
  contact_person: string;
  contact_phone: string;
  contact_email: string;
  booking_requirements: string[];
  cancellation_policy: string;
  icon: any;
  color: string;
  category: string;
  location: string;
  equipment_included: string[];
  additional_services: string[];
  max_guests: number;
  min_booking_hours: number;
  setup_time: number;
  breakdown_time: number;
}

const Spaces = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [spaces, setSpaces] = useState<Space[]>([]);
  const [filteredSpaces, setFilteredSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFloor, setSelectedFloor] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCapacity, setSelectedCapacity] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState('');
  const [guests, setGuests] = useState(1);
  const [duration, setDuration] = useState(2);
  const [specialRequests, setSpecialRequests] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);

  const getMockSpaces = (): Space[] => [
    {
      id: 'bakery-desserts',
      name: 'Bakery & Desserts (AC)',
      description:
        'Вся выпечка + классические десерты в комфортной зоне с кондиционером',
      area: '100 м²',
      floor: 1,
      capacity: 40,
      price_per_hour: 5000,
      price_per_day: 35000,
      features: [
        'Кондиционер',
        '40 посадок',
        'Кейк-кубы',
        'Чизкейки',
        'Тирамису',
      ],
      amenities: ['WiFi', 'Кондиционер', 'Звуковая система', 'Проектор'],
      availability: {
        monday: ['09:00-22:00'],
        tuesday: ['09:00-22:00'],
        wednesday: ['09:00-22:00'],
        thursday: ['09:00-22:00'],
        friday: ['09:00-23:00'],
        saturday: ['09:00-23:00'],
        sunday: ['09:00-21:00'],
      },
      is_available: true,
      is_featured: true,
      rating: 4.8,
      review_count: 45,
      images: ['/images/bakery-1.jpg', '/images/bakery-2.jpg'],
      contact_person: 'Анна Петрова',
      contact_phone: '+62 361 123 4567',
      contact_email: 'bakery@odefoodhall.com',
      booking_requirements: ['Предоплата 50%', 'Подтверждение за 24 часа'],
      cancellation_policy: 'Бесплатная отмена за 48 часов',
      icon: Coffee,
      color: 'text-orange-600',
      category: 'dining',
      location: '1-й этаж, Зона A',
      equipment_included: ['Столы', 'Стулья', 'Освещение', 'Звуковая система'],
      additional_services: ['Кейтеринг', 'Декорации', 'Фотограф'],
      max_guests: 40,
      min_booking_hours: 2,
      setup_time: 30,
      breakdown_time: 30,
    },
    {
      id: 'kitchen-corners',
      name: 'Kitchen Corners',
      description: 'Все кулинарные направления в 12 точках с live cooking',
      area: '200 м²',
      floor: 1,
      capacity: 60,
      price_per_hour: 8000,
      price_per_day: 50000,
      features: [
        '8 вкусовых секторов',
        '12 kitchen-corners',
        'Pop-up кухня',
        'Live cooking',
      ],
      amenities: [
        'Кухонное оборудование',
        'WiFi',
        'Звуковая система',
        'Освещение',
      ],
      availability: {
        monday: ['10:00-22:00'],
        tuesday: ['10:00-22:00'],
        wednesday: ['10:00-22:00'],
        thursday: ['10:00-22:00'],
        friday: ['10:00-23:00'],
        saturday: ['10:00-23:00'],
        sunday: ['10:00-21:00'],
      },
      is_available: true,
      is_featured: true,
      rating: 4.9,
      review_count: 78,
      images: ['/images/kitchen-1.jpg', '/images/kitchen-2.jpg'],
      contact_person: 'Марко Росси',
      contact_phone: '+62 361 123 4568',
      contact_email: 'kitchen@odefoodhall.com',
      booking_requirements: ['Предоплата 50%', 'Подтверждение за 48 часов'],
      cancellation_policy: 'Бесплатная отмена за 72 часа',
      icon: ChefHat,
      color: 'text-orange-600',
      category: 'cooking',
      location: '1-й этаж, Центральная зона',
      equipment_included: [
        'Кухонное оборудование',
        'Столы',
        'Стулья',
        'Освещение',
      ],
      additional_services: ['Шеф-повар', 'Ингредиенты', 'Посуда', 'Уборка'],
      max_guests: 60,
      min_booking_hours: 3,
      setup_time: 45,
      breakdown_time: 45,
    },
    {
      id: 'taste-garden',
      name: 'Taste Garden',
      description: 'Мастер-классы, лекции, ужины в уютной атмосфере',
      area: '150 м²',
      floor: 2,
      capacity: 50,
      price_per_hour: 6000,
      price_per_day: 40000,
      features: [
        'Live выступления',
        'Master-классы',
        'Лекции',
        'Private dinners',
      ],
      amenities: ['Сцена', 'Микрофоны', 'Проектор', 'WiFi', 'Освещение'],
      availability: {
        monday: ['17:00-22:00'],
        tuesday: ['17:00-22:00'],
        wednesday: ['17:00-22:00'],
        thursday: ['17:00-22:00'],
        friday: ['17:00-23:00'],
        saturday: ['17:00-23:00'],
        sunday: ['17:00-21:00'],
      },
      is_available: true,
      is_featured: true,
      rating: 4.7,
      review_count: 62,
      images: ['/images/garden-1.jpg', '/images/garden-2.jpg'],
      contact_person: 'Сара Грин',
      contact_phone: '+62 361 123 4569',
      contact_email: 'garden@odefoodhall.com',
      booking_requirements: ['Предоплата 30%', 'Подтверждение за 24 часа'],
      cancellation_policy: 'Бесплатная отмена за 24 часа',
      icon: GraduationCap,
      color: 'text-emerald-600',
      category: 'events',
      location: '2-й этаж, Зона B',
      equipment_included: ['Сцена', 'Столы', 'Стулья', 'Звуковая система'],
      additional_services: ['Ведущий', 'Декорации', 'Кейтеринг', 'Фотограф'],
      max_guests: 50,
      min_booking_hours: 2,
      setup_time: 60,
      breakdown_time: 30,
    },
    {
      id: 'ode-garden',
      name: 'OdeGarden',
      description: 'Арендуемое event-пространство для частных мероприятий',
      area: '100 м²',
      floor: 2,
      capacity: 80,
      price_per_hour: 10000,
      price_per_day: 60000,
      features: ['Private events', 'Корпоративы', 'Celebrations', 'Workshops'],
      amenities: [
        'Открытая терраса',
        'WiFi',
        'Звуковая система',
        'Освещение',
        'Кухня',
      ],
      availability: {
        monday: ['10:00-22:00'],
        tuesday: ['10:00-22:00'],
        wednesday: ['10:00-22:00'],
        thursday: ['10:00-22:00'],
        friday: ['10:00-23:00'],
        saturday: ['10:00-23:00'],
        sunday: ['10:00-21:00'],
      },
      is_available: true,
      is_featured: false,
      rating: 4.6,
      review_count: 34,
      images: ['/images/ode-garden-1.jpg', '/images/ode-garden-2.jpg'],
      contact_person: 'Джон Смит',
      contact_phone: '+62 361 123 4570',
      contact_email: 'events@odefoodhall.com',
      booking_requirements: ['Предоплата 50%', 'Подтверждение за 48 часов'],
      cancellation_policy: 'Бесплатная отмена за 48 часов',
      icon: TreePine,
      color: 'text-green-700',
      category: 'events',
      location: '2-й этаж, Терраса',
      equipment_included: ['Столы', 'Стулья', 'Звуковая система', 'Освещение'],
      additional_services: ['Кейтеринг', 'Декорации', 'Фотограф', 'Ведущий'],
      max_guests: 80,
      min_booking_hours: 4,
      setup_time: 90,
      breakdown_time: 60,
    },
    {
      id: 'sunset-terrace',
      name: 'Sunset Terrace',
      description: 'Открытая терраса с видом на закат для особых моментов',
      area: '100 м²',
      floor: 2,
      capacity: 30,
      price_per_hour: 4000,
      price_per_day: 25000,
      features: [
        'Sunset views',
        'Открытая терраса',
        'Photo spot',
        'Evening drinks',
      ],
      amenities: ['Открытая терраса', 'Освещение', 'WiFi', 'Бар'],
      availability: {
        monday: ['18:00-22:00'],
        tuesday: ['18:00-22:00'],
        wednesday: ['18:00-22:00'],
        thursday: ['18:00-22:00'],
        friday: ['18:00-23:00'],
        saturday: ['18:00-23:00'],
        sunday: ['18:00-21:00'],
      },
      is_available: true,
      is_featured: false,
      rating: 4.9,
      review_count: 28,
      images: ['/images/terrace-1.jpg', '/images/terrace-2.jpg'],
      contact_person: 'Мария Сантос',
      contact_phone: '+62 361 123 4571',
      contact_email: 'terrace@odefoodhall.com',
      booking_requirements: ['Предоплата 30%', 'Подтверждение за 24 часа'],
      cancellation_policy: 'Бесплатная отмена за 24 часа',
      icon: Sunset,
      color: 'text-yellow-600',
      category: 'outdoor',
      location: '2-й этаж, Терраса',
      equipment_included: ['Столы', 'Стулья', 'Освещение', 'Зонты'],
      additional_services: ['Кейтеринг', 'Декорации', 'Фотограф', 'Музыка'],
      max_guests: 30,
      min_booking_hours: 2,
      setup_time: 30,
      breakdown_time: 30,
    },
    {
      id: 'coworking',
      name: 'Coworking',
      description: 'AC-зона для работы с утренней йогой',
      area: '8 м²',
      floor: 2,
      capacity: 12,
      price_per_hour: 2000,
      price_per_day: 12000,
      features: ['Тихая работа', 'WiFi', 'AC comfort', 'Утренняя йога'],
      amenities: ['WiFi', 'Кондиционер', 'Столы', 'Стулья', 'Розетки'],
      availability: {
        monday: ['08:00-20:00'],
        tuesday: ['08:00-20:00'],
        wednesday: ['08:00-20:00'],
        thursday: ['08:00-20:00'],
        friday: ['08:00-20:00'],
        saturday: ['08:00-18:00'],
        sunday: ['08:00-18:00'],
      },
      is_available: true,
      is_featured: false,
      rating: 4.5,
      review_count: 15,
      images: ['/images/coworking-1.jpg'],
      contact_person: 'Алексей Иванов',
      contact_phone: '+62 361 123 4572',
      contact_email: 'coworking@odefoodhall.com',
      booking_requirements: ['Предоплата 100%', 'Подтверждение за 2 часа'],
      cancellation_policy: 'Бесплатная отмена за 2 часа',
      icon: Laptop,
      color: 'text-blue-500',
      category: 'work',
      location: '2-й этаж, Зона C',
      equipment_included: ['Столы', 'Стулья', 'WiFi', 'Розетки'],
      additional_services: ['Кофе', 'Печенье', 'Йога-класс'],
      max_guests: 12,
      min_booking_hours: 1,
      setup_time: 0,
      breakdown_time: 0,
    },
  ];

  useEffect(() => {
    fetchSpaces();
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = spaces;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (space) =>
          space.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          space.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          space.features.some((feature) =>
            feature.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    // Floor filter
    if (selectedFloor !== 'all') {
      filtered = filtered.filter(
        (space) => space.floor.toString() === selectedFloor
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(
        (space) => space.category === selectedCategory
      );
    }

    // Capacity filter
    if (selectedCapacity !== 'all') {
      const capacity = parseInt(selectedCapacity);
      filtered = filtered.filter((space) => space.capacity >= capacity);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price_low':
          return a.price_per_hour - b.price_per_hour;
        case 'price_high':
          return b.price_per_hour - a.price_per_hour;
        case 'rating':
          return b.rating - a.rating;
        case 'capacity':
          return b.capacity - a.capacity;
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredSpaces(filtered);
  }, [
    spaces,
    searchQuery,
    selectedFloor,
    selectedCategory,
    selectedCapacity,
    sortBy,
  ]);

  const fetchSpaces = async () => {
    try {
      setLoading(true);

      // Fetch from CMS database
      const { data, error } = await supabase
        .from('spaces')
        .select('*')
        .eq('is_available', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching spaces from CMS:', error);
        // Fallback to mock data if CMS fails
        setSpaces(getMockSpaces());
        return;
      }

      // Transform CMS data to match the interface
      const transformedSpaces: Space[] = data.map((space: any) => ({
        id: space.id,
        name: space.name,
        description: space.description,
        long_description: space.long_description || space.description,
        image_url: space.image_url,
        gallery_urls: space.gallery_urls || [],
        location: space.location || 'Ground Floor',
        capacity: space.capacity || 20,
        space_type: space.space_type || 'Event Space',
        amenities: space.amenities || [],
        price_per_hour: space.price_per_hour_usd / 100 || 0,
        is_available: space.is_available || true,
        is_featured: space.is_featured || false,
        contact_person: space.contact_person || '',
        contact_phone: space.contact_phone || '',
        contact_email: space.contact_email || '',
        opening_hours: space.opening_hours || {},
        special_requirements: space.special_requirements || [],
        rating: 4.5, // Default rating
        review_count: Math.floor(Math.random() * 50) + 10,
        is_favorite: false,
        floor: space.location?.includes('Second') ? 'second' : 'ground',
        category:
          space.space_type?.toLowerCase().replace(' ', '-') || 'event-space',
      }));

      setSpaces(transformedSpaces);
    } catch (error) {
      console.error('Error fetching spaces:', error);
      setSpaces(getMockSpaces());
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = (spaceId: string) => {
    setFavorites((prev) =>
      prev.includes(spaceId)
        ? prev.filter((id) => id !== spaceId)
        : [...prev, spaceId]
    );
  };

  const handleBookSpace = (space: Space) => {
    setSelectedSpace(space);
    setShowBookingModal(true);
  };

  const handleShare = (space: Space) => {
    if (navigator.share) {
      navigator.share({
        title: space.name,
        text: space.description,
        url: window.location.origin + `/spaces/${space.id}`,
      });
    } else {
      navigator.clipboard.writeText(
        window.location.origin + `/spaces/${space.id}`
      );
      toast({
        title: 'Ссылка скопирована',
        description: 'Ссылка на пространство скопирована в буфер обмена',
      });
    }
  };

  const handleBookingSubmit = () => {
    if (!selectedSpace || !selectedDate || !selectedTime) {
      toast({
        title: 'Ошибка',
        description: 'Пожалуйста, заполните все обязательные поля',
        variant: 'destructive',
      });
      return;
    }

    const totalPrice = selectedSpace.price_per_hour * duration;

    toast({
      title: 'Бронирование отправлено',
      description: `Заявка на ${selectedSpace.name} на ${format(selectedDate, 'dd.MM.yyyy', { locale: ru })} в ${selectedTime} отправлена`,
    });

    setShowBookingModal(false);
    setSelectedSpace(null);
    setSelectedDate(undefined);
    setSelectedTime('');
    setGuests(1);
    setDuration(2);
    setSpecialRequests('');
  };

  const categories = [
    { id: 'all', name: 'Все категории' },
    { id: 'dining', name: 'Ресторан' },
    { id: 'cooking', name: 'Кулинария' },
    { id: 'events', name: 'События' },
    { id: 'outdoor', name: 'На открытом воздухе' },
    { id: 'work', name: 'Работа' },
  ];

  const capacityOptions = [
    { id: 'all', name: 'Любая вместимость' },
    { id: '10', name: 'До 10 человек' },
    { id: '20', name: 'До 20 человек' },
    { id: '50', name: 'До 50 человек' },
    { id: '80', name: 'До 80 человек' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ImprovedNavigation />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-burgundy-primary to-gold-accent bg-clip-text text-transparent mb-4">
              Наши пространства
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Два этажа возможностей — от кулинарного путешествия до релакса и
              событий
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Поиск пространств, функций или особенностей..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap gap-4">
              <Select value={selectedFloor} onValueChange={setSelectedFloor}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Этаж" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все этажи</SelectItem>
                  <SelectItem value="1">1-й этаж</SelectItem>
                  <SelectItem value="2">2-й этаж</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Категория" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={selectedCapacity}
                onValueChange={setSelectedCapacity}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Вместимость" />
                </SelectTrigger>
                <SelectContent>
                  {capacityOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Сортировка" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">По названию</SelectItem>
                  <SelectItem value="price_low">
                    Цена: по возрастанию
                  </SelectItem>
                  <SelectItem value="price_high">Цена: по убыванию</SelectItem>
                  <SelectItem value="rating">По рейтингу</SelectItem>
                  <SelectItem value="capacity">По вместимости</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-muted-foreground">
              Найдено {filteredSpaces.length} пространств
            </p>
          </div>

          {/* Spaces Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSpaces.map((space) => {
              const IconComponent = space.icon;
              const isFavorite = favorites.includes(space.id);

              return (
                <Card
                  key={space.id}
                  className="hover:shadow-lg transition-shadow duration-300"
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <IconComponent className={`h-5 w-5 ${space.color}`} />
                          <CardTitle className="text-lg">
                            {space.name}
                          </CardTitle>
                          {space.is_featured && (
                            <Badge variant="secondary" className="text-xs">
                              Рекомендуем
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {space.description}
                        </p>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            {space.area}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {space.floor}-й этаж
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {space.capacity} мест
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleFavorite(space.id)}
                        className="p-1"
                      >
                        <Heart
                          className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`}
                        />
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {/* Rating and Price */}
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{space.rating}</span>
                          <span className="text-muted-foreground">
                            ({space.review_count})
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">
                            {space.price_per_hour.toLocaleString()} ₽/час
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {space.price_per_day.toLocaleString()} ₽/день
                          </div>
                        </div>
                      </div>

                      {/* Features */}
                      <div className="flex flex-wrap gap-1">
                        {space.features.slice(0, 3).map((feature, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {feature}
                          </Badge>
                        ))}
                        {space.features.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{space.features.length - 3} еще
                          </Badge>
                        )}
                      </div>

                      {/* Location and Status */}
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{space.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {space.is_available ? (
                            <div className="flex items-center gap-1 text-green-600">
                              <CheckCircle className="h-4 w-4" />
                              <span>Доступно</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-red-600">
                              <XCircle className="h-4 w-4" />
                              <span>Занято</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleBookSpace(space)}
                          disabled={!space.is_available}
                          className="flex-1 bg-primary hover:bg-primary/90"
                        >
                          <Calendar className="h-4 w-4 mr-1" />
                          Забронировать
                        </Button>
                        <Button
                          onClick={() => handleShare(space)}
                          variant="outline"
                          size="sm"
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Contact Info */}
                      <div className="text-xs text-muted-foreground">
                        <p>Контакт: {space.contact_person}</p>
                        <p>Тел: {space.contact_phone}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredSpaces.length === 0 && (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Пространства не найдены
              </h3>
              <p className="text-muted-foreground mb-4">
                Попробуйте изменить фильтры или поисковый запрос
              </p>
              <Button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedFloor('all');
                  setSelectedCategory('all');
                  setSelectedCapacity('all');
                }}
              >
                Сбросить фильтры
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Booking Modal */}
      <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Бронирование пространства</DialogTitle>
          </DialogHeader>
          {selectedSpace && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="font-semibold text-lg">{selectedSpace.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedSpace.location}
                </p>
                <p className="text-sm text-muted-foreground">
                  {selectedSpace.area} • {selectedSpace.capacity} мест
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Дата</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {selectedDate
                          ? format(selectedDate, 'dd.MM.yyyy', { locale: ru })
                          : 'Выберите дату'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Время</label>
                  <Select value={selectedTime} onValueChange={setSelectedTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите время" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="09:00">09:00</SelectItem>
                      <SelectItem value="10:00">10:00</SelectItem>
                      <SelectItem value="11:00">11:00</SelectItem>
                      <SelectItem value="12:00">12:00</SelectItem>
                      <SelectItem value="13:00">13:00</SelectItem>
                      <SelectItem value="14:00">14:00</SelectItem>
                      <SelectItem value="15:00">15:00</SelectItem>
                      <SelectItem value="16:00">16:00</SelectItem>
                      <SelectItem value="17:00">17:00</SelectItem>
                      <SelectItem value="18:00">18:00</SelectItem>
                      <SelectItem value="19:00">19:00</SelectItem>
                      <SelectItem value="20:00">20:00</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Количество гостей
                  </label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setGuests(Math.max(1, guests - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center">{guests}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setGuests(
                          Math.min(selectedSpace.max_guests, guests + 1)
                        )
                      }
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Максимум: {selectedSpace.max_guests} гостей
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Продолжительность (часы)
                  </label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setDuration(
                          Math.max(
                            selectedSpace.min_booking_hours,
                            duration - 1
                          )
                        )
                      }
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center">{duration}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDuration(duration + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Минимум: {selectedSpace.min_booking_hours} часов
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Особые пожелания</label>
                <Textarea
                  placeholder="Аллергии, предпочтения, особые требования..."
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                />
              </div>

              {/* Price Summary */}
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Итого:</span>
                  <span className="font-bold text-lg">
                    {selectedSpace.price_per_hour * duration} ₽
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {selectedSpace.price_per_hour} ₽/час × {duration} часов
                </div>
                {selectedSpace.setup_time > 0 && (
                  <div className="text-sm text-muted-foreground">
                    + {selectedSpace.setup_time} мин на подготовку
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => setShowBookingModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Отмена
                </Button>
                <Button onClick={handleBookingSubmit} className="flex-1">
                  Забронировать
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Spaces;
