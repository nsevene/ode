import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MapPin, 
  Clock, 
  Users, 
  Star, 
  ChefHat,
  Wine,
  BookOpen,
  Camera,
  Heart,
  Share2,
  Calendar,
  DollarSign,
  Award,
  Globe,
  Utensils,
  Sparkles,
  Target,
  CheckCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GastroTour {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  image: string;
  images: string[];
  duration: number; // in minutes
  maxParticipants: number;
  currentParticipants: number;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'cooking' | 'tasting' | 'cultural' | 'adventure';
  tags: string[];
  instructor: {
    name: string;
    avatar: string;
    bio: string;
    experience: string;
    specialties: string[];
    rating: number;
  };
  schedule: Array<{
    date: string;
    time: string;
    available: boolean;
    participants: number;
  }>;
  location: {
    name: string;
    address: string;
    coordinates: { lat: number; lng: number };
  };
  includes: string[];
  requirements: string[];
  highlights: string[];
  itinerary: Array<{
    time: string;
    activity: string;
    description: string;
  }>;
  reviews: Array<{
    id: string;
    userName: string;
    userAvatar: string;
    rating: number;
    comment: string;
    date: string;
  }>;
  isBookmarked: boolean;
  isPopular: boolean;
  isNew: boolean;
}

const GastroTours = () => {
  const [selectedTab, setSelectedTab] = useState('tours');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTour, setSelectedTour] = useState<GastroTour | null>(null);
  
  const { toast } = useToast();

  // Mock data
  const [tours, setTours] = useState<GastroTour[]>([
    {
      id: '1',
      title: 'Мастер-класс по итальянской пасте',
      description: 'Научитесь готовить настоящую итальянскую пасту от шеф-повара из Dolce Italia. Изучите секреты приготовления идеального теста и соусов.',
      shortDescription: 'Научитесь готовить настоящую итальянскую пасту',
      image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&h=600&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop'
      ],
      duration: 120,
      maxParticipants: 12,
      currentParticipants: 8,
      price: 2500,
      originalPrice: 3000,
      rating: 4.9,
      reviewsCount: 24,
      difficulty: 'beginner',
      category: 'cooking',
      tags: ['итальянская кухня', 'паста', 'мастер-класс', 'для начинающих'],
      instructor: {
        name: 'Marco Rossi',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        bio: 'Шеф-повар с 15-летним опытом работы в лучших ресторанах Италии',
        experience: '15 лет',
        specialties: ['итальянская кухня', 'паста', 'ризотто'],
        rating: 4.9
      },
      schedule: [
        { date: '2024-02-15', time: '18:00', available: true, participants: 8 },
        { date: '2024-02-22', time: '18:00', available: true, participants: 5 },
        { date: '2024-03-01', time: '18:00', available: false, participants: 12 }
      ],
      location: {
        name: 'Dolce Italia Kitchen',
        address: 'ODE Food Hall, 1 этаж',
        coordinates: { lat: 55.7558, lng: 37.6176 }
      },
      includes: [
        'Все необходимые ингредиенты',
        'Аппарат для пасты',
        'Рецепты на дом',
        'Дегустация готовых блюд',
        'Сертификат участника'
      ],
      requirements: [
        'Возраст от 16 лет',
        'Базовые навыки готовки',
        'Желание учиться'
      ],
      highlights: [
        'Научитесь готовить 3 вида пасты',
        'Узнайте секреты итальянских соусов',
        'Попробуете вино из региона Эмилия-Романья',
        'Получите сертификат от шеф-повара'
      ],
      itinerary: [
        { time: '18:00', activity: 'Приветствие и знакомство', description: 'Знакомство с участниками и шеф-поваром' },
        { time: '18:15', activity: 'Теория пасты', description: 'Изучение основ приготовления итальянской пасты' },
        { time: '18:30', activity: 'Практика', description: 'Приготовление теста и формирование пасты' },
        { time: '19:30', activity: 'Соусы', description: 'Приготовление классических итальянских соусов' },
        { time: '20:00', activity: 'Дегустация', description: 'Дегустация приготовленных блюд с вином' }
      ],
      reviews: [
        {
          id: '1',
          userName: 'Анна Петрова',
          userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
          rating: 5,
          comment: 'Невероятный мастер-класс! Научилась готовить пасту как в Италии. Marco - потрясающий преподаватель!',
          date: '2024-01-15'
        }
      ],
      isBookmarked: false,
      isPopular: true,
      isNew: false
    },
    {
      id: '2',
      title: 'Дегустация вин с сырами',
      description: 'Погрузитесь в мир вин и сыров с сомелье. Изучите основы виноделия и правильного сочетания вин с сырами.',
      shortDescription: 'Погрузитесь в мир вин и сыров с сомелье',
      image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&h=600&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800&h=600&fit=crop'
      ],
      duration: 90,
      maxParticipants: 15,
      currentParticipants: 12,
      price: 1800,
      rating: 4.7,
      reviewsCount: 18,
      difficulty: 'beginner',
      category: 'tasting',
      tags: ['вино', 'сыр', 'дегустация', 'сомелье'],
      instructor: {
        name: 'Elena Sommelier',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
        bio: 'Сертифицированный сомелье с опытом работы в лучших ресторанах мира',
        experience: '12 лет',
        specialties: ['вино', 'сыр', 'спиртные напитки'],
        rating: 4.8
      },
      schedule: [
        { date: '2024-02-16', time: '19:00', available: true, participants: 12 },
        { date: '2024-02-23', time: '19:00', available: true, participants: 8 }
      ],
      location: {
        name: 'Wine Cellar',
        address: 'ODE Food Hall, подвал',
        coordinates: { lat: 55.7558, lng: 37.6176 }
      },
      includes: [
        '5 видов вин',
        '5 видов сыров',
        'Хлеб и крекеры',
        'Вода для очистки вкуса',
        'Брошюра с описанием вин'
      ],
      requirements: [
        'Возраст от 18 лет',
        'Любовь к вину и сыру'
      ],
      highlights: [
        'Попробуете вина из разных регионов',
        'Узнаете секреты сочетания вин и сыров',
        'Научитесь правильно дегустировать вино',
        'Получите сертификат дегустатора'
      ],
      itinerary: [
        { time: '19:00', activity: 'Встреча', description: 'Знакомство с участниками и сомелье' },
        { time: '19:15', activity: 'Теория вин', description: 'Основы виноделия и классификация вин' },
        { time: '19:30', activity: 'Дегустация', description: 'Дегустация 5 видов вин с сырами' },
        { time: '20:15', activity: 'Обсуждение', description: 'Обсуждение впечатлений и вопросов' }
      ],
      reviews: [
        {
          id: '1',
          userName: 'Михаил Иванов',
          userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
          rating: 5,
          comment: 'Отличная дегустация! Узнал много нового о винах. Elena очень профессионально все объяснила.',
          date: '2024-01-10'
        }
      ],
      isBookmarked: true,
      isPopular: false,
      isNew: true
    }
  ]);

  const filteredTours = tours.filter(tour => {
    const matchesSearch = tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        tour.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        tour.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || tour.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || tour.difficulty === selectedDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cooking': return <ChefHat className="h-5 w-5" />;
      case 'tasting': return <Wine className="h-5 w-5" />;
      case 'cultural': return <Globe className="h-5 w-5" />;
      case 'adventure': return <Target className="h-5 w-5" />;
      default: return <Utensils className="h-5 w-5" />;
    }
  };

  const handleBookTour = (tourId: string) => {
    toast({
      title: "Бронирование тура",
      description: "Функция бронирования будет реализована",
    });
  };

  const handleBookmarkTour = (tourId: string) => {
    setTours(prev => 
      prev.map(tour => 
        tour.id === tourId 
          ? { ...tour, isBookmarked: !tour.isBookmarked }
          : tour
      )
    );
    
    const tour = tours.find(t => t.id === tourId);
    toast({
      title: tour?.isBookmarked ? "Удалено из избранного" : "Добавлено в избранное",
      description: tour?.title,
    });
  };

  const handleShareTour = (tourId: string) => {
    toast({
      title: "Поделиться туром",
      description: "Ссылка скопирована в буфер обмена",
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          🍷 Гастро-туры и мастер-классы
        </h1>
        <p className="text-muted-foreground">
          Уникальные кулинарные опыты, дегустации и мастер-классы от лучших шеф-поваров
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-64">
              <input
                type="text"
                placeholder="Поиск туров и мастер-классов..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">Все категории</option>
                <option value="cooking">Кулинария</option>
                <option value="tasting">Дегустация</option>
                <option value="cultural">Культурные</option>
                <option value="adventure">Приключения</option>
              </select>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">Все уровни</option>
                <option value="beginner">Начинающий</option>
                <option value="intermediate">Средний</option>
                <option value="advanced">Продвинутый</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{tours.length}</p>
              <p className="text-sm text-muted-foreground">Туров и мастер-классов</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-secondary">
                {tours.reduce((sum, tour) => sum + tour.currentParticipants, 0)}
              </p>
              <p className="text-sm text-muted-foreground">Участников</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-accent">
                {Math.round(tours.reduce((sum, tour) => sum + tour.rating, 0) / tours.length * 10) / 10}
              </p>
              <p className="text-sm text-muted-foreground">Средний рейтинг</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-500">
                {tours.filter(tour => tour.isPopular).length}
              </p>
              <p className="text-sm text-muted-foreground">Популярных</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tours Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTours.map((tour) => (
          <Card key={tour.id} className="relative overflow-hidden">
            {tour.isPopular && (
              <div className="absolute top-2 right-2 z-10">
                <Badge className="bg-red-100 text-red-800">Популярный</Badge>
              </div>
            )}
            {tour.isNew && (
              <div className="absolute top-2 left-2 z-10">
                <Badge className="bg-green-100 text-green-800">Новый</Badge>
              </div>
            )}
            
            <div className="aspect-video overflow-hidden">
              <img
                src={tour.image}
                alt={tour.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(tour.category)}
                  <CardTitle className="text-lg">{tour.title}</CardTitle>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleBookmarkTour(tour.id)}
                >
                  <Heart className={`h-4 w-4 ${tour.isBookmarked ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{tour.shortDescription}</p>
              
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{tour.duration} мин</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{tour.currentParticipants}/{tour.maxParticipants}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{tour.rating}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge className={getDifficultyColor(tour.difficulty)}>
                  {tour.difficulty}
                </Badge>
                {tour.tags.slice(0, 2).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-primary">{tour.price} ₽</p>
                  {tour.originalPrice && (
                    <p className="text-sm text-muted-foreground line-through">
                      {tour.originalPrice} ₽
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleBookTour(tour.id)}
                    disabled={tour.schedule.every(s => !s.available)}
                  >
                    Забронировать
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleShareTour(tour.id)}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="text-sm text-muted-foreground">
                <p>Инструктор: {tour.instructor.name}</p>
                <p>Рейтинг: {tour.instructor.rating}/5</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Featured Tours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Рекомендуемые туры
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tours.filter(tour => tour.isPopular).map((tour) => (
              <div key={tour.id} className="flex items-center gap-4 p-4 border rounded-lg">
                <img
                  src={tour.image}
                  alt={tour.title}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-medium">{tour.title}</h3>
                  <p className="text-sm text-muted-foreground">{tour.shortDescription}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{tour.duration} мин</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{tour.rating}</span>
                    </div>
                    <span className="font-medium text-primary">{tour.price} ₽</span>
                  </div>
                </div>
                <Button onClick={() => handleBookTour(tour.id)}>
                  Забронировать
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GastroTours;
