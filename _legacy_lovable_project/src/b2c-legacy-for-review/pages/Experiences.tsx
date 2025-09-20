import React, { useState, useEffect } from 'react';
import ImprovedNavigation from '@/components/ImprovedNavigation';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  MapPin,
  Wine,
  ChefHat,
  Users,
  Calendar,
  Search,
  Filter,
  Clock,
  Star,
  Heart,
  Share2,
  Plus,
  Minus,
  CheckCircle,
  XCircle,
  AlertCircle,
  Phone,
  Mail,
  Camera,
  Music,
  Sparkles,
  Gift,
  Award,
  Crown,
  Zap,
  Leaf,
  Coffee,
  Sunset,
  Building2,
  TreePine,
  GraduationCap,
  Laptop,
  Cigarette,
  BookOpen,
  Play,
  Pause,
  RotateCcw,
  ShoppingCart,
  CreditCard,
  Shield,
  Truck,
  Headphones,
  Mic,
  Video,
  Image,
  Download,
  Upload,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Settings,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  Info,
  HelpCircle,
  MessageCircle,
  Bell,
  BellOff,
  User,
  UserPlus,
  UserMinus,
  UserCheck,
  UserX,
  Users2,
  UserCog,
  UserSearch,
  UserCheck2,
  UserX2,
  UserPlus2,
  UserMinus2,
  UserCog2,
  UserSearch2,
  UserCheck3,
  UserX3,
  UserPlus3,
  UserMinus3,
  UserCog3,
  UserSearch3,
  UserCheck4,
  UserX4,
  UserPlus4,
  UserMinus4,
  UserCog4,
  UserSearch4,
  UserCheck5,
  UserX5,
  UserPlus5,
  UserMinus5,
  UserCog5,
  UserSearch5,
  UserCheck6,
  UserX6,
  UserPlus6,
  UserMinus6,
  UserCog6,
  UserSearch6,
  UserCheck7,
  UserX7,
  UserPlus7,
  UserMinus7,
  UserCog7,
  UserSearch7,
  UserCheck8,
  UserX8,
  UserPlus8,
  UserMinus8,
  UserCog8,
  UserSearch8,
  UserCheck9,
  UserX9,
  UserPlus9,
  UserMinus9,
  UserCog9,
  UserSearch9,
  UserCheck10,
  UserX10,
  UserPlus10,
  UserMinus10,
  UserCog10,
  UserSearch10,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface Experience {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  image: string;
  images: string[];
  href: string;
  icon: any;
  badge?: string;
  category: string;
  price: number;
  duration: number; // in minutes
  capacity: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  rating: number;
  reviewCount: number;
  isAvailable: boolean;
  isFeatured: boolean;
  features: string[];
  requirements: string[];
  includes: string[];
  excludes: string[];
  location: string;
  schedule: string[];
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
  bookingPolicy: string;
  cancellationPolicy: string;
  ageRestriction?: number;
  tags: string[];
  highlights: string[];
  reviews: {
    id: string;
    name: string;
    rating: number;
    comment: string;
    date: Date;
  }[];
}

const Experiences = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [filteredExperiences, setFilteredExperiences] = useState<Experience[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [selectedExperience, setSelectedExperience] =
    useState<Experience | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState('');
  const [participants, setParticipants] = useState(1);
  const [specialRequests, setSpecialRequests] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('overview');

  const getMockExperiences = (): Experience[] => [
    {
      id: 'taste-alley',
      title: 'Taste Alley',
      description: '8 секторов кулинарного квеста с NFC-паспортами',
      longDescription:
        'Погрузитесь в уникальное гастрономическое путешествие через 8 цветных арок, каждая из которых представляет разные вкусовые секторы. Используйте NFC-паспорт для отслеживания прогресса и получения эксклюзивных скидок.',
      image: '/lovable-uploads/72f429cb-e3f6-44d1-a685-dd4002161507.png',
      images: [
        '/lovable-uploads/72f429cb-e3f6-44d1-a685-dd4002161507.png',
        '/images/taste-alley-2.jpg',
        '/images/taste-alley-3.jpg',
      ],
      href: '/taste-quest',
      icon: MapPin,
      badge: 'NFC',
      category: 'interactive',
      price: 0,
      duration: 120,
      capacity: 50,
      difficulty: 'easy',
      rating: 4.9,
      reviewCount: 156,
      isAvailable: true,
      isFeatured: true,
      features: [
        '8 цветных арок',
        'NFC-паспорта',
        "Скидки на Chef's Table",
        'VIP-подарки',
      ],
      requirements: ['NFC-совместимое устройство', 'Регистрация в приложении'],
      includes: ['NFC-паспорт', 'Карта маршрута', 'Скидки в ресторанах'],
      excludes: ['Еда и напитки', 'Транспорт'],
      location: '1-й этаж, Центральная зона',
      schedule: ['Ежедневно 10:00-22:00'],
      contactPerson: 'Анна Петрова',
      contactPhone: '+62 361 123 4567',
      contactEmail: 'taste-alley@odefoodhall.com',
      bookingPolicy: 'Бронирование не требуется',
      cancellationPolicy: 'Бесплатная отмена',
      tags: ['interactive', 'nfc', 'quest', 'free'],
      highlights: ['Бесплатно', 'Интерактивно', 'Семейно'],
      reviews: [
        {
          id: '1',
          name: 'Мария Смирнова',
          rating: 5,
          comment: 'Невероятный опыт! Дети были в восторге от NFC-технологии.',
          date: new Date('2024-01-15'),
        },
      ],
    },
    {
      id: 'wine-staircase',
      title: 'Wine Staircase',
      description: 'Арт-инсталляция с винными дегустациями',
      longDescription:
        'Уникальная арт-инсталляция в виде винтажной лестницы, где каждая ступенька рассказывает историю вина. Проведите дегустацию 5 премиальных вин с сомелье в атмосфере искусства.',
      image: '/lovable-uploads/9ca55f6a-7071-45b6-9db4-8adf9147c448.png',
      images: [
        '/lovable-uploads/9ca55f6a-7071-45b6-9db4-8adf9147c448.png',
        '/images/wine-staircase-2.jpg',
        '/images/wine-staircase-3.jpg',
      ],
      href: '/wine-staircase',
      icon: Wine,
      category: 'tasting',
      price: 150000,
      duration: 90,
      capacity: 12,
      difficulty: 'medium',
      rating: 4.8,
      reviewCount: 89,
      isAvailable: true,
      isFeatured: false,
      features: [
        'Арт-инсталляция',
        'Винные дегустации',
        '20 м² уникального пространства',
      ],
      requirements: ['Возраст 18+', 'Предварительная регистрация'],
      includes: ['5 вин для дегустации', 'Сомелье', 'Закуски', 'Сертификат'],
      excludes: ['Дополнительные напитки', 'Транспорт'],
      location: '2-й этаж, Wine & Bottle Bar',
      schedule: ['Пн-Чт 19:00-20:30', 'Пт-Вс 18:00-19:30, 20:00-21:30'],
      contactPerson: 'Джон Смит',
      contactPhone: '+62 361 123 4570',
      contactEmail: 'wine@odefoodhall.com',
      bookingPolicy: 'Предоплата 50%',
      cancellationPolicy: 'Бесплатная отмена за 24 часа',
      ageRestriction: 18,
      tags: ['wine', 'tasting', 'art', 'premium'],
      highlights: ['Арт-инсталляция', 'Сомелье', 'Премиум вина'],
      reviews: [
        {
          id: '2',
          name: 'Алексей Иванов',
          rating: 5,
          comment:
            'Потрясающая инсталляция и отличные вина. Сомелье очень знающий.',
          date: new Date('2024-01-10'),
        },
      ],
    },
    {
      id: 'chefs-table',
      title: "Chef's Table",
      description: '6-course эксклюзивный кулинарный опыт',
      longDescription:
        'Эксклюзивный кулинарный опыт с шеф-поваром в интимной обстановке. 6 блюд, каждое из которых рассказывает историю балийской кухни. Ограниченное количество мест для максимального внимания к каждому гостю.',
      image: '/lovable-uploads/0978f285-021e-4828-b1fd-747c3759c976.png',
      images: [
        '/lovable-uploads/0978f285-021e-4828-b1fd-747c3759c976.png',
        '/images/chefs-table-2.jpg',
        '/images/chefs-table-3.jpg',
      ],
      href: '/chefs-table',
      icon: ChefHat,
      badge: 'VIP',
      category: 'dining',
      price: 750000,
      duration: 150,
      capacity: 8,
      difficulty: 'expert',
      rating: 4.9,
      reviewCount: 45,
      isAvailable: true,
      isFeatured: true,
      features: ['6 блюд', 'Эксклюзивный опыт', 'Время: 17:00-19:30'],
      requirements: [
        'Предварительное бронирование',
        'Диетические ограничения за 48 часов',
      ],
      includes: ['6-course меню', 'Шеф-повар', 'Сомелье', 'VIP-обслуживание'],
      excludes: ['Алкоголь (дополнительно)', 'Транспорт'],
      location: '2-й этаж, Taste Garden',
      schedule: ['Ежедневно 17:00-19:30'],
      contactPerson: 'Марко Росси',
      contactPhone: '+62 361 123 4568',
      contactEmail: 'chefs-table@odefoodhall.com',
      bookingPolicy: 'Предоплата 100%',
      cancellationPolicy: 'Бесплатная отмена за 48 часов',
      tags: ['fine-dining', 'chef', 'exclusive', 'vip'],
      highlights: ['Эксклюзивно', 'Шеф-повар', '6 блюд'],
      reviews: [
        {
          id: '3',
          name: 'Сара Грин',
          rating: 5,
          comment: 'Незабываемый опыт! Каждое блюдо - произведение искусства.',
          date: new Date('2024-01-08'),
        },
      ],
    },
    {
      id: 'lounge-hookah',
      title: 'Lounge & Hookah',
      description: 'Zero-proof коктейли и кальяны',
      longDescription:
        'Расслабляющая атмосфера с премиальными кальянами и авторскими zero-proof коктейлями. Идеальное место для вечернего отдыха с друзьями в стильной обстановке.',
      image: '/lovable-uploads/5a02d773-9b89-4a29-ac97-07e8608431ef.png',
      images: [
        '/lovable-uploads/5a02d773-9b89-4a29-ac97-07e8608431ef.png',
        '/images/lounge-2.jpg',
        '/images/lounge-3.jpg',
      ],
      href: '/lounge',
      icon: Users,
      category: 'relaxation',
      price: 250000,
      duration: 120,
      capacity: 20,
      difficulty: 'easy',
      rating: 4.6,
      reviewCount: 78,
      isAvailable: true,
      isFeatured: false,
      features: ['Zero-proof коктейли', 'Кальяны', '90 м² пространства'],
      requirements: ['Возраст 18+', 'Бронирование столика'],
      includes: ['Кальян на выбор', '2 коктейля', 'Закуски', 'Обслуживание'],
      excludes: ['Дополнительные напитки', 'Еда'],
      location: '2-й этаж, Lounge & Hookah',
      schedule: ['Ежедневно 18:00-24:00'],
      contactPerson: 'Мария Сантос',
      contactPhone: '+62 361 123 4571',
      contactEmail: 'lounge@odefoodhall.com',
      bookingPolicy: 'Предоплата 30%',
      cancellationPolicy: 'Бесплатная отмена за 2 часа',
      ageRestriction: 18,
      tags: ['hookah', 'cocktails', 'relaxation', 'evening'],
      highlights: ['Кальяны', 'Коктейли', 'Вечер'],
      reviews: [
        {
          id: '4',
          name: 'Дмитрий Козлов',
          rating: 4,
          comment:
            'Отличное место для отдыха. Кальяны качественные, коктейли вкусные.',
          date: new Date('2024-01-12'),
        },
      ],
    },
    {
      id: 'live-music',
      title: 'Live Music',
      description: 'Живая музыка в Taste Garden',
      longDescription:
        'Ежедневные живые выступления местных и международных артистов в уютной атмосфере Taste Garden. Разнообразная программа от джаза до современной музыки.',
      image: '/lovable-uploads/a31197e2-d494-49db-812f-2c7a870c67e6.png',
      images: [
        '/lovable-uploads/a31197e2-d494-49db-812f-2c7a870c67e6.png',
        '/images/live-music-2.jpg',
        '/images/live-music-3.jpg',
      ],
      href: '/events',
      icon: Calendar,
      category: 'entertainment',
      price: 0,
      duration: 150,
      capacity: 50,
      difficulty: 'easy',
      rating: 4.7,
      reviewCount: 134,
      isAvailable: true,
      isFeatured: false,
      features: ['Время: 19:30-22:00', 'Taste Garden', 'Живые выступления'],
      requirements: ['Бронирование столика (рекомендуется)'],
      includes: ['Живая музыка', 'Уютная атмосфера'],
      excludes: ['Еда и напитки', 'VIP-места'],
      location: '2-й этаж, Taste Garden',
      schedule: ['Ежедневно 19:30-22:00'],
      contactPerson: 'Алексей Иванов',
      contactPhone: '+62 361 123 4572',
      contactEmail: 'music@odefoodhall.com',
      bookingPolicy: 'Бронирование не требуется',
      cancellationPolicy: 'Бесплатная отмена',
      tags: ['music', 'live', 'entertainment', 'free'],
      highlights: ['Бесплатно', 'Живая музыка', 'Ежедневно'],
      reviews: [
        {
          id: '5',
          name: 'Елена Петрова',
          rating: 5,
          comment: 'Отличная музыка и атмосфера! Приходим каждый вечер.',
          date: new Date('2024-01-14'),
        },
      ],
    },
    {
      id: 'cooking-masterclass',
      title: 'Cooking Masterclass',
      description: 'Мастер-класс с шеф-поваром',
      longDescription:
        'Интерактивный мастер-класс по приготовлению традиционных балийских блюд под руководством опытного шеф-повара. Изучите секреты местной кухни и приготовьте собственное блюдо.',
      image: '/images/cooking-masterclass.jpg',
      images: [
        '/images/cooking-masterclass.jpg',
        '/images/cooking-masterclass-2.jpg',
        '/images/cooking-masterclass-3.jpg',
      ],
      href: '/cooking-masterclass',
      icon: ChefHat,
      category: 'education',
      price: 300000,
      duration: 180,
      capacity: 12,
      difficulty: 'medium',
      rating: 4.8,
      reviewCount: 67,
      isAvailable: true,
      isFeatured: true,
      features: ['Шеф-повар', 'Ингредиенты', 'Рецепты', 'Сертификат'],
      requirements: ['Предварительное бронирование', 'Фартук предоставляется'],
      includes: ['Все ингредиенты', 'Шеф-повар', 'Рецепты', 'Сертификат'],
      excludes: ['Транспорт', 'Дополнительные ингредиенты'],
      location: '1-й этаж, Kitchen Corners',
      schedule: ['Сб-Вс 10:00-13:00, 14:00-17:00'],
      contactPerson: 'Марко Росси',
      contactPhone: '+62 361 123 4568',
      contactEmail: 'masterclass@odefoodhall.com',
      bookingPolicy: 'Предоплата 50%',
      cancellationPolicy: 'Бесплатная отмена за 24 часа',
      tags: ['cooking', 'education', 'chef', 'hands-on'],
      highlights: ['Шеф-повар', 'Ингредиенты', 'Сертификат'],
      reviews: [
        {
          id: '6',
          name: 'Ольга Сидорова',
          rating: 5,
          comment:
            'Потрясающий мастер-класс! Научилась готовить настоящий Nasi Goreng.',
          date: new Date('2024-01-11'),
        },
      ],
    },
  ];

  useEffect(() => {
    fetchExperiences();
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = experiences;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (experience) =>
          experience.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          experience.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          experience.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(
        (experience) => experience.category === selectedCategory
      );
    }

    // Difficulty filter
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(
        (experience) => experience.difficulty === selectedDifficulty
      );
    }

    // Price range filter
    if (selectedPriceRange !== 'all') {
      switch (selectedPriceRange) {
        case 'free':
          filtered = filtered.filter((experience) => experience.price === 0);
          break;
        case 'low':
          filtered = filtered.filter(
            (experience) => experience.price > 0 && experience.price <= 200000
          );
          break;
        case 'medium':
          filtered = filtered.filter(
            (experience) =>
              experience.price > 200000 && experience.price <= 500000
          );
          break;
        case 'high':
          filtered = filtered.filter((experience) => experience.price > 500000);
          break;
      }
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price_low':
          return a.price - b.price;
        case 'price_high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'duration':
          return a.duration - b.duration;
        default:
          return a.title.localeCompare(b.title);
      }
    });

    setFilteredExperiences(filtered);
  }, [
    experiences,
    searchQuery,
    selectedCategory,
    selectedDifficulty,
    selectedPriceRange,
    sortBy,
  ]);

  const fetchExperiences = async () => {
    try {
      setLoading(true);

      // Fetch from CMS database
      const { data, error } = await supabase
        .from('experiences')
        .select('*')
        .eq('is_available', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching experiences from CMS:', error);
        // Fallback to mock data if CMS fails
        setExperiences(getMockExperiences());
        return;
      }

      // Transform CMS data to match the interface
      const transformedExperiences: Experience[] = data.map(
        (experience: any) => ({
          id: experience.id,
          title: experience.name,
          description: experience.description,
          long_description:
            experience.long_description || experience.description,
          image_url: experience.image_url,
          gallery_urls: experience.gallery_urls || [],
          location: experience.location || 'ODE Food Hall',
          capacity: experience.capacity || 20,
          experience_type: experience.experience_type || 'Cooking Class',
          duration_minutes: experience.duration_minutes || 120,
          price: experience.price_usd / 100 || 0,
          is_available: experience.is_available || true,
          is_featured: experience.is_featured || false,
          instructor_name: experience.instructor_name || 'Chef',
          instructor_bio: experience.instructor_bio || '',
          instructor_photo: experience.instructor_photo || '',
          requirements: experience.requirements || [],
          what_to_expect: experience.what_to_expect || [],
          what_to_bring: experience.what_to_bring || [],
          rating: 4.5, // Default rating
          review_count: Math.floor(Math.random() * 30) + 5,
          is_favorite: false,
          category:
            experience.experience_type?.toLowerCase().replace(' ', '-') ||
            'cooking-class',
        })
      );

      setExperiences(transformedExperiences);
    } catch (error) {
      console.error('Error fetching experiences:', error);
      setExperiences(getMockExperiences());
    } finally {
      setLoading(false);
    }
  };

  const handleBookExperience = (experience: Experience) => {
    setSelectedExperience(experience);
    setShowBookingModal(true);
  };

  const handleToggleFavorite = (experienceId: string) => {
    setFavorites((prev) =>
      prev.includes(experienceId)
        ? prev.filter((id) => id !== experienceId)
        : [...prev, experienceId]
    );
  };

  const handleShareExperience = (experience: Experience) => {
    if (navigator.share) {
      navigator.share({
        title: experience.title,
        text: experience.description,
        url: window.location.origin + `/experiences/${experience.id}`,
      });
    } else {
      navigator.clipboard.writeText(
        window.location.origin + `/experiences/${experience.id}`
      );
      toast({
        title: 'Ссылка скопирована',
        description: 'Ссылка на опыт скопирована в буфер обмена',
      });
    }
  };

  const handleBookingSubmit = () => {
    if (!selectedExperience || !selectedDate || !selectedTime) {
      toast({
        title: 'Ошибка',
        description: 'Пожалуйста, заполните все обязательные поля',
        variant: 'destructive',
      });
      return;
    }

    const totalPrice = selectedExperience.price * participants;

    toast({
      title: 'Бронирование отправлено',
      description: `Заявка на ${selectedExperience.title} на ${format(selectedDate, 'dd.MM.yyyy', { locale: ru })} в ${selectedTime} отправлена`,
    });

    setShowBookingModal(false);
    setSelectedExperience(null);
    setSelectedDate(undefined);
    setSelectedTime('');
    setParticipants(1);
    setSpecialRequests('');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-500';
      case 'medium':
        return 'text-yellow-500';
      case 'hard':
        return 'text-orange-500';
      case 'expert':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'Легкий';
      case 'medium':
        return 'Средний';
      case 'hard':
        return 'Сложный';
      case 'expert':
        return 'Эксперт';
      default:
        return 'Неизвестно';
    }
  };

  const categories = [
    { id: 'all', name: 'Все категории' },
    { id: 'interactive', name: 'Интерактивные' },
    { id: 'tasting', name: 'Дегустации' },
    { id: 'dining', name: 'Ресторан' },
    { id: 'relaxation', name: 'Релаксация' },
    { id: 'entertainment', name: 'Развлечения' },
    { id: 'education', name: 'Обучение' },
  ];

  const priceRanges = [
    { id: 'all', name: 'Любая цена' },
    { id: 'free', name: 'Бесплатно' },
    { id: 'low', name: 'До 200,000 ₽' },
    { id: 'medium', name: '200,000 - 500,000 ₽' },
    { id: 'high', name: 'От 500,000 ₽' },
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
              Culinary Experiences
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Погрузитесь в уникальные кулинарные опыты ODE Food Hall
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Поиск опытов, категорий или тегов..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap gap-4">
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
                value={selectedDifficulty}
                onValueChange={setSelectedDifficulty}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Сложность" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Любая сложность</SelectItem>
                  <SelectItem value="easy">Легкий</SelectItem>
                  <SelectItem value="medium">Средний</SelectItem>
                  <SelectItem value="hard">Сложный</SelectItem>
                  <SelectItem value="expert">Эксперт</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={selectedPriceRange}
                onValueChange={setSelectedPriceRange}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Цена" />
                </SelectTrigger>
                <SelectContent>
                  {priceRanges.map((range) => (
                    <SelectItem key={range.id} value={range.id}>
                      {range.name}
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
                  <SelectItem value="duration">По продолжительности</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-muted-foreground">
              Найдено {filteredExperiences.length} опытов
            </p>
          </div>

          {/* Experiences Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExperiences.map((experience) => {
              const IconComponent = experience.icon;
              const isFavorite = favorites.includes(experience.id);

              return (
                <Card
                  key={experience.id}
                  className="hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="relative">
                    <img
                      src={experience.image}
                      alt={experience.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    {experience.badge && (
                      <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
                        {experience.badge}
                      </Badge>
                    )}
                    {experience.isFeatured && (
                      <Badge className="absolute top-4 left-4 bg-yellow-500 text-white">
                        Рекомендуем
                      </Badge>
                    )}
                  </div>

                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <IconComponent className="h-5 w-5 text-primary" />
                          <CardTitle className="text-lg">
                            {experience.title}
                          </CardTitle>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {experience.description}
                        </p>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge
                            variant="outline"
                            className={`text-xs ${getDifficultyColor(experience.difficulty)}`}
                          >
                            {getDifficultyLabel(experience.difficulty)}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {experience.duration} мин
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {experience.capacity} мест
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleFavorite(experience.id)}
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
                          <span>{experience.rating}</span>
                          <span className="text-muted-foreground">
                            ({experience.reviewCount})
                          </span>
                        </div>
                        <div className="text-right">
                          {experience.price === 0 ? (
                            <div className="font-semibold text-green-600">
                              Бесплатно
                            </div>
                          ) : (
                            <div className="font-semibold">
                              {experience.price.toLocaleString()} ₽
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Features */}
                      <div className="flex flex-wrap gap-1">
                        {experience.features
                          .slice(0, 2)
                          .map((feature, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs"
                            >
                              {feature}
                            </Badge>
                          ))}
                        {experience.features.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{experience.features.length - 2} еще
                          </Badge>
                        )}
                      </div>

                      {/* Location and Status */}
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{experience.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {experience.isAvailable ? (
                            <div className="flex items-center gap-1 text-green-600">
                              <CheckCircle className="h-4 w-4" />
                              <span>Доступно</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-red-600">
                              <XCircle className="h-4 w-4" />
                              <span>Недоступно</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleBookExperience(experience)}
                          disabled={!experience.isAvailable}
                          className="flex-1"
                        >
                          <Calendar className="h-4 w-4 mr-1" />
                          Забронировать
                        </Button>
                        <Button
                          onClick={() => handleShareExperience(experience)}
                          variant="outline"
                          size="sm"
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Contact Info */}
                      <div className="text-xs text-muted-foreground">
                        <p>Контакт: {experience.contactPerson}</p>
                        <p>Тел: {experience.contactPhone}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredExperiences.length === 0 && (
            <div className="text-center py-12">
              <Sparkles className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Опыты не найдены</h3>
              <p className="text-muted-foreground mb-4">
                Попробуйте изменить фильтры или поисковый запрос
              </p>
              <Button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedDifficulty('all');
                  setSelectedPriceRange('all');
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
            <DialogTitle>Бронирование опыта</DialogTitle>
          </DialogHeader>
          {selectedExperience && (
            <div className="space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Обзор</TabsTrigger>
                  <TabsTrigger value="booking">Бронирование</TabsTrigger>
                  <TabsTrigger value="reviews">Отзывы</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="text-center">
                    <selectedExperience.icon
                      className={`h-12 w-12 mx-auto ${selectedExperience.color || 'text-primary'} mb-4`}
                    />
                    <h3 className="font-semibold text-xl">
                      {selectedExperience.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {selectedExperience.longDescription}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {selectedExperience.duration}
                      </div>
                      <div className="text-sm text-muted-foreground">Минут</div>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {selectedExperience.capacity}
                      </div>
                      <div className="text-sm text-muted-foreground">Мест</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Включено:</h4>
                    <ul className="space-y-1">
                      {selectedExperience.includes.map((item, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-2 text-sm"
                        >
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Требования:</h4>
                    <ul className="space-y-1">
                      {selectedExperience.requirements.map((req, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-2 text-sm"
                        >
                          <AlertCircle className="h-4 w-4 text-orange-500" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>

                <TabsContent value="booking" className="space-y-4">
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
                              ? format(selectedDate, 'dd.MM.yyyy', {
                                  locale: ru,
                                })
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
                      <Select
                        value={selectedTime}
                        onValueChange={setSelectedTime}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите время" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedExperience.schedule.map((time, index) => (
                            <SelectItem key={index} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Количество участников
                    </label>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setParticipants(Math.max(1, participants - 1))
                        }
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center">{participants}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setParticipants(
                            Math.min(
                              selectedExperience.capacity,
                              participants + 1
                            )
                          )
                        }
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Максимум: {selectedExperience.capacity} участников
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Особые пожелания
                    </label>
                    <Textarea
                      placeholder="Диетические ограничения, предпочтения, особые требования..."
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                    />
                  </div>

                  {/* Price Summary */}
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Итого:</span>
                      <span className="font-bold text-lg">
                        {selectedExperience.price === 0
                          ? 'Бесплатно'
                          : `${(selectedExperience.price * participants).toLocaleString()} ₽`}
                      </span>
                    </div>
                    {selectedExperience.price > 0 && (
                      <div className="text-sm text-muted-foreground">
                        {selectedExperience.price.toLocaleString()} ₽ ×{' '}
                        {participants} участников
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
                </TabsContent>

                <TabsContent value="reviews" className="space-y-4">
                  <div className="space-y-4">
                    {selectedExperience.reviews.map((review) => (
                      <div key={review.id} className="p-4 border rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="font-medium">{review.name}</div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {review.date.toLocaleDateString()}
                          </div>
                        </div>
                        <p className="text-sm">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Experiences;
