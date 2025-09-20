import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import ImprovedNavigation from '@/components/ImprovedNavigation';
import {
  ChefHat,
  Coffee,
  Utensils,
  Leaf,
  FlameKindling,
  Wheat,
  Cookie,
  Fish,
  Search,
  Filter,
  Star,
  Clock,
  MapPin,
  Users,
  Phone,
  Calendar,
  Heart,
  BookOpen,
  Award,
  TrendingUp,
  Eye,
  Share2,
  MessageCircle,
  ThumbsUp,
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import LoadingSpinner from '@/components/LoadingSpinner';

interface Kitchen {
  id: string;
  name: string;
  description: string;
  category: string;
  cuisine_type: string;
  area: number;
  image_url?: string;
  slug: string;
  rating: number;
  review_count: number;
  chef_name: string;
  chef_experience: number;
  specialties: string[];
  price_range: string;
  opening_hours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  location: string;
  capacity: number;
  is_halal: boolean;
  is_vegetarian_friendly: boolean;
  is_vegan_friendly: boolean;
  is_spicy: boolean;
  contact_phone: string;
  contact_email: string;
  social_media: {
    instagram?: string;
    facebook?: string;
  };
  menu_highlights: string[];
  awards: string[];
  is_featured: boolean;
  is_open: boolean;
  wait_time: number;
  popular_dishes: Array<{
    name: string;
    price: number;
    description: string;
  }>;
}

const Kitchens = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [kitchens, setKitchens] = useState<Kitchen[]>([]);
  const [filteredKitchens, setFilteredKitchens] = useState<Kitchen[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCuisine, setSelectedCuisine] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedKitchen, setSelectedKitchen] = useState<Kitchen | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const iconMap = {
    Cookie,
    ChefHat,
    Coffee,
    Utensils,
    Leaf,
    FlameKindling,
    Wheat,
    Fish,
  };

  const getIconByCategory = (category: string) => {
    const iconName = category?.toLowerCase();
    if (iconName?.includes('dessert') || iconName?.includes('sweet'))
      return Cookie;
    if (iconName?.includes('drink') || iconName?.includes('bar')) return Coffee;
    if (iconName?.includes('vegetarian') || iconName?.includes('vegan'))
      return Leaf;
    if (iconName?.includes('italian') || iconName?.includes('pasta'))
      return Wheat;
    if (iconName?.includes('fish') || iconName?.includes('seafood'))
      return Fish;
    if (iconName?.includes('bbq') || iconName?.includes('grill'))
      return FlameKindling;
    return ChefHat;
  };

  useEffect(() => {
    fetchKitchens();
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = kitchens;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (kitchen) =>
          kitchen.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          kitchen.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          kitchen.chef_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          kitchen.specialties.some((specialty) =>
            specialty.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(
        (kitchen) => kitchen.category === selectedCategory
      );
    }

    // Cuisine filter
    if (selectedCuisine !== 'all') {
      filtered = filtered.filter(
        (kitchen) => kitchen.cuisine_type === selectedCuisine
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'popularity':
          return b.review_count - a.review_count;
        case 'wait_time':
          return a.wait_time - b.wait_time;
        case 'capacity':
          return b.capacity - a.capacity;
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredKitchens(filtered);
  }, [kitchens, searchQuery, selectedCategory, selectedCuisine, sortBy]);

  const fetchKitchens = async () => {
    try {
      setLoading(true);

      // Fetch from CMS database
      const { data, error } = await supabase
        .from('kitchens')
        .select('*')
        .eq('is_available', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching kitchens from CMS:', error);
        // Fallback to mock data if CMS fails
        setKitchens(getMockKitchens());
        return;
      }

      // Transform CMS data to match the interface
      const transformedKitchens: Kitchen[] = data.map((kitchen: any) => ({
        id: kitchen.id,
        name: kitchen.name,
        description: kitchen.description,
        category: kitchen.cuisine_type?.toLowerCase() || 'other',
        cuisine_type: kitchen.cuisine_type || 'Other',
        area: 25, // Default area
        image_url: kitchen.image_url,
        slug: kitchen.slug,
        rating: 4.5, // Default rating
        review_count: Math.floor(Math.random() * 100) + 20, // Random review count
        chef_name: kitchen.contact_person || 'Chef',
        chef_experience: Math.floor(Math.random() * 20) + 5, // Random experience
        specialties: kitchen.equipment || ['Specialty'],
        price_range:
          kitchen.price_per_hour_usd > 5000
            ? '$$$'
            : kitchen.price_per_hour_usd > 3000
              ? '$$'
              : '$',
        opening_hours: {
          monday: '11:00 - 22:00',
          tuesday: '11:00 - 22:00',
          wednesday: '11:00 - 22:00',
          thursday: '11:00 - 22:00',
          friday: '11:00 - 23:00',
          saturday: '11:00 - 23:00',
          sunday: '11:00 - 21:00',
        },
        location: kitchen.location || 'Ground Floor',
        capacity: kitchen.capacity || 20,
        is_halal: true,
        is_vegetarian_friendly: true,
        is_vegan_friendly: false,
        is_spicy: false,
        contact_phone: kitchen.contact_phone || '',
        contact_email: kitchen.contact_email || '',
        social_media: {},
        menu_highlights: ['Signature Dish'],
        awards: [],
        is_featured: kitchen.is_featured || false,
        is_open: true,
        wait_time: Math.floor(Math.random() * 30) + 10,
        popular_dishes: [
          {
            name: 'Signature Dish',
            price: Math.floor(Math.random() * 200) + 100,
            description: 'Our signature dish',
          },
        ],
      }));

      setKitchens(transformedKitchens);
    } catch (error) {
      console.error('Error fetching kitchens:', error);
      setKitchens(getMockKitchens());
    } finally {
      setLoading(false);
    }
  };

  const getMockKitchens = (): Kitchen[] => [
    {
      id: 'dolce-italia',
      name: 'Dolce Italia',
      description:
        'Authentic Italian cuisine with fresh ingredients and traditional recipes',
      category: 'italian',
      cuisine_type: 'Italian',
      area: 25,
      image_url: '/images/dolce-italia.jpg',
      slug: 'dolce-italia',
      rating: 4.8,
      review_count: 127,
      chef_name: 'Marco Rossi',
      chef_experience: 15,
      specialties: ['Pasta', 'Pizza', 'Risotto', 'Tiramisu'],
      price_range: '$$',
      opening_hours: {
        monday: '11:00 - 22:00',
        tuesday: '11:00 - 22:00',
        wednesday: '11:00 - 22:00',
        thursday: '11:00 - 22:00',
        friday: '11:00 - 23:00',
        saturday: '11:00 - 23:00',
        sunday: '11:00 - 21:00',
      },
      location: 'Ground Floor, Zone A',
      capacity: 24,
      is_halal: true,
      is_vegetarian_friendly: true,
      is_vegan_friendly: false,
      is_spicy: false,
      contact_phone: '+62 361 123 4567',
      contact_email: 'dolce@odefoodhall.com',
      social_media: {
        instagram: '@dolceitalia_bali',
        facebook: 'DolceItaliaBali',
      },
      menu_highlights: ['Margherita Pizza', 'Carbonara', 'Osso Buco'],
      awards: ['Best Italian Restaurant 2023', "Chef's Choice Award"],
      is_featured: true,
      is_open: true,
      wait_time: 15,
      popular_dishes: [
        {
          name: 'Margherita Pizza',
          price: 450,
          description:
            'Classic Italian pizza with fresh tomatoes and mozzarella',
        },
        {
          name: 'Spaghetti Carbonara',
          price: 380,
          description: 'Traditional Roman pasta with eggs and pancetta',
        },
        {
          name: 'Tiramisu',
          price: 180,
          description: 'Classic Italian dessert with coffee and mascarpone',
        },
      ],
    },
    {
      id: 'spicy-asia',
      name: 'Spicy Asia',
      description:
        'Authentic Asian street food with bold flavors and fresh ingredients',
      category: 'asian',
      cuisine_type: 'Asian',
      area: 20,
      image_url: '/images/spicy-asia.jpg',
      slug: 'spicy-asia',
      rating: 4.6,
      review_count: 89,
      chef_name: 'Li Wei',
      chef_experience: 12,
      specialties: ['Pad Thai', 'Ramen', 'Dumplings', 'Curry'],
      price_range: '$',
      opening_hours: {
        monday: '10:00 - 22:00',
        tuesday: '10:00 - 22:00',
        wednesday: '10:00 - 22:00',
        thursday: '10:00 - 22:00',
        friday: '10:00 - 23:00',
        saturday: '10:00 - 23:00',
        sunday: '10:00 - 21:00',
      },
      location: 'Ground Floor, Zone B',
      capacity: 18,
      is_halal: true,
      is_vegetarian_friendly: true,
      is_vegan_friendly: true,
      is_spicy: true,
      contact_phone: '+62 361 123 4568',
      contact_email: 'spicy@odefoodhall.com',
      social_media: {
        instagram: '@spicyasia_bali',
        facebook: 'SpicyAsiaBali',
      },
      menu_highlights: ['Pad Thai', 'Tonkotsu Ramen', 'Xiao Long Bao'],
      awards: ['Best Asian Food 2023'],
      is_featured: false,
      is_open: true,
      wait_time: 20,
      popular_dishes: [
        {
          name: 'Pad Thai',
          price: 380,
          description: 'Traditional Thai stir-fried noodles',
        },
        {
          name: 'Tonkotsu Ramen',
          price: 420,
          description: 'Rich pork bone broth ramen',
        },
        {
          name: 'Xiao Long Bao',
          price: 280,
          description: 'Shanghai soup dumplings',
        },
      ],
    },
    {
      id: 'wild-bali',
      name: 'Wild Bali',
      description:
        'Traditional Balinese cuisine with modern presentation and authentic flavors',
      category: 'indonesian',
      cuisine_type: 'Indonesian',
      area: 22,
      image_url: '/images/wild-bali.jpg',
      slug: 'wild-bali',
      rating: 4.9,
      review_count: 156,
      chef_name: 'Made Sari',
      chef_experience: 20,
      specialties: ['Nasi Goreng', 'Babi Guling', 'Gado-gado', 'Sate'],
      price_range: '$$',
      opening_hours: {
        monday: '11:00 - 22:00',
        tuesday: '11:00 - 22:00',
        wednesday: '11:00 - 22:00',
        thursday: '11:00 - 22:00',
        friday: '11:00 - 23:00',
        saturday: '11:00 - 23:00',
        sunday: '11:00 - 21:00',
      },
      location: 'Ground Floor, Zone C',
      capacity: 20,
      is_halal: true,
      is_vegetarian_friendly: true,
      is_vegan_friendly: false,
      is_spicy: true,
      contact_phone: '+62 361 123 4569',
      contact_email: 'wild@odefoodhall.com',
      social_media: {
        instagram: '@wildbali_food',
        facebook: 'WildBaliFood',
      },
      menu_highlights: ['Babi Guling', 'Nasi Campur', 'Lawar'],
      awards: ['Best Local Cuisine 2023', 'Heritage Award'],
      is_featured: true,
      is_open: true,
      wait_time: 12,
      popular_dishes: [
        {
          name: 'Nasi Goreng',
          price: 320,
          description: 'Indonesian fried rice with chicken and vegetables',
        },
        {
          name: 'Babi Guling',
          price: 450,
          description: 'Traditional Balinese roasted pork',
        },
        {
          name: 'Gado-gado',
          price: 280,
          description: 'Indonesian vegetable salad with peanut sauce',
        },
      ],
    },
    {
      id: 'green-garden',
      name: 'Green Garden',
      description:
        'Fresh vegetarian and vegan cuisine with organic ingredients',
      category: 'vegetarian',
      cuisine_type: 'Vegetarian',
      area: 18,
      image_url: '/images/green-garden.jpg',
      slug: 'green-garden',
      rating: 4.7,
      review_count: 94,
      chef_name: 'Sarah Green',
      chef_experience: 8,
      specialties: ['Salads', 'Smoothies', 'Vegan Bowls', 'Fresh Juices'],
      price_range: '$$',
      opening_hours: {
        monday: '08:00 - 20:00',
        tuesday: '08:00 - 20:00',
        wednesday: '08:00 - 20:00',
        thursday: '08:00 - 20:00',
        friday: '08:00 - 21:00',
        saturday: '08:00 - 21:00',
        sunday: '08:00 - 19:00',
      },
      location: 'Ground Floor, Zone D',
      capacity: 16,
      is_halal: true,
      is_vegetarian_friendly: true,
      is_vegan_friendly: true,
      is_spicy: false,
      contact_phone: '+62 361 123 4570',
      contact_email: 'green@odefoodhall.com',
      social_media: {
        instagram: '@greengarden_bali',
        facebook: 'GreenGardenBali',
      },
      menu_highlights: ['Acai Bowl', 'Quinoa Salad', 'Green Smoothie'],
      awards: ['Best Healthy Food 2023'],
      is_featured: false,
      is_open: true,
      wait_time: 8,
      popular_dishes: [
        {
          name: 'Acai Bowl',
          price: 280,
          description: 'Fresh acai bowl with granola and fruits',
        },
        {
          name: 'Quinoa Salad',
          price: 320,
          description: 'Healthy quinoa salad with vegetables',
        },
        {
          name: 'Green Smoothie',
          price: 180,
          description: 'Fresh green smoothie with spinach and fruits',
        },
      ],
    },
    {
      id: 'sweet-dreams',
      name: 'Sweet Dreams',
      description: 'Artisanal desserts and pastries made fresh daily',
      category: 'dessert',
      cuisine_type: 'Dessert',
      area: 15,
      image_url: '/images/sweet-dreams.jpg',
      slug: 'sweet-dreams',
      rating: 4.9,
      review_count: 203,
      chef_name: 'Pierre Dubois',
      chef_experience: 18,
      specialties: ['Chocolate', 'Pastries', 'Ice Cream', 'Cakes'],
      price_range: '$$',
      opening_hours: {
        monday: '10:00 - 22:00',
        tuesday: '10:00 - 22:00',
        wednesday: '10:00 - 22:00',
        thursday: '10:00 - 22:00',
        friday: '10:00 - 23:00',
        saturday: '10:00 - 23:00',
        sunday: '10:00 - 21:00',
      },
      location: 'Ground Floor, Zone E',
      capacity: 12,
      is_halal: true,
      is_vegetarian_friendly: true,
      is_vegan_friendly: false,
      is_spicy: false,
      contact_phone: '+62 361 123 4571',
      contact_email: 'sweet@odefoodhall.com',
      social_media: {
        instagram: '@sweetdreams_bali',
        facebook: 'SweetDreamsBali',
      },
      menu_highlights: ['Chocolate Lava Cake', 'Macarons', 'Gelato'],
      awards: ['Best Desserts 2023', 'Pastry Excellence Award'],
      is_featured: true,
      is_open: true,
      wait_time: 5,
      popular_dishes: [
        {
          name: 'Chocolate Lava Cake',
          price: 180,
          description: 'Warm chocolate cake with molten center',
        },
        {
          name: 'Macarons (6pcs)',
          price: 120,
          description: 'French macarons in various flavors',
        },
        { name: 'Gelato', price: 80, description: 'Artisanal Italian gelato' },
      ],
    },
  ];

  const categories = [
    { id: 'all', name: 'Все' },
    { id: 'italian', name: 'Итальянская' },
    { id: 'asian', name: 'Азиатская' },
    { id: 'indonesian', name: 'Индонезийская' },
    { id: 'vegetarian', name: 'Вегетарианская' },
    { id: 'dessert', name: 'Десерты' },
  ];

  const cuisines = [
    ...new Set(kitchens.map((kitchen) => kitchen.cuisine_type)),
  ];

  const handleToggleFavorite = (kitchenId: string) => {
    setFavorites((prev) =>
      prev.includes(kitchenId)
        ? prev.filter((id) => id !== kitchenId)
        : [...prev, kitchenId]
    );
  };

  const handleBookTable = (kitchen: Kitchen) => {
    setSelectedKitchen(kitchen);
    setShowBookingModal(true);
  };

  const handleViewMenu = (kitchen: Kitchen) => {
    navigate(`/kitchen/${kitchen.slug}`);
  };

  const handleShare = (kitchen: Kitchen) => {
    if (navigator.share) {
      navigator.share({
        title: kitchen.name,
        text: kitchen.description,
        url: window.location.origin + `/kitchen/${kitchen.slug}`,
      });
    } else {
      navigator.clipboard.writeText(
        window.location.origin + `/kitchen/${kitchen.slug}`
      );
      toast({
        title: 'Ссылка скопирована',
        description: 'Ссылка на кухню скопирована в буфер обмена',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner />
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
              10 Кухонь · Крафтовые Бары · Джелато
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              От балийского огня до неаполитанского жара — исследуйте каждый
              вкус под одной крышей.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Поиск кухонь, шеф-поваров или специализаций..."
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
                value={selectedCuisine}
                onValueChange={setSelectedCuisine}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Кухня" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все кухни</SelectItem>
                  {cuisines.map((cuisine) => (
                    <SelectItem key={cuisine} value={cuisine}>
                      {cuisine}
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
                  <SelectItem value="rating">По рейтингу</SelectItem>
                  <SelectItem value="popularity">По популярности</SelectItem>
                  <SelectItem value="wait_time">По времени ожидания</SelectItem>
                  <SelectItem value="capacity">По вместимости</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  Grid
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  List
                </Button>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-muted-foreground">
              Найдено {filteredKitchens.length} кухонь
            </p>
          </div>

          {/* Kitchens Grid/List */}
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }
          >
            {filteredKitchens.map((kitchen) => {
              const IconComponent = getIconByCategory(kitchen.category);
              const isFavorite = favorites.includes(kitchen.id);

              return (
                <Card
                  key={kitchen.id}
                  className="hover:shadow-lg transition-shadow duration-300"
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <IconComponent className="h-5 w-5 text-primary" />
                          <CardTitle className="text-lg">
                            {kitchen.name}
                          </CardTitle>
                          {kitchen.is_featured && (
                            <Badge variant="secondary" className="text-xs">
                              Рекомендуем
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {kitchen.description}
                        </p>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            {kitchen.cuisine_type}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {kitchen.price_range}
                          </Badge>
                          {kitchen.is_halal && (
                            <Badge variant="secondary" className="text-xs">
                              Halal
                            </Badge>
                          )}
                          {kitchen.is_vegetarian_friendly && (
                            <Badge variant="secondary" className="text-xs">
                              Veg
                            </Badge>
                          )}
                          {kitchen.is_vegan_friendly && (
                            <Badge variant="secondary" className="text-xs">
                              Vegan
                            </Badge>
                          )}
                          {kitchen.is_spicy && (
                            <Badge variant="destructive" className="text-xs">
                              Spicy
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleFavorite(kitchen.id)}
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
                      {/* Rating and Info */}
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{kitchen.rating}</span>
                          <span>({kitchen.review_count})</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{kitchen.wait_time} мин</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{kitchen.capacity} мест</span>
                        </div>
                      </div>

                      {/* Chef Info */}
                      <div className="text-sm">
                        <p className="font-medium">
                          Шеф-повар: {kitchen.chef_name}
                        </p>
                        <p className="text-muted-foreground">
                          {kitchen.chef_experience} лет опыта
                        </p>
                      </div>

                      {/* Specialties */}
                      <div className="flex flex-wrap gap-1">
                        {kitchen.specialties
                          .slice(0, 3)
                          .map((specialty, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {specialty}
                            </Badge>
                          ))}
                        {kitchen.specialties.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{kitchen.specialties.length - 3} еще
                          </Badge>
                        )}
                      </div>

                      {/* Awards */}
                      {kitchen.awards.length > 0 && (
                        <div className="flex items-center gap-1">
                          <Award className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm text-muted-foreground">
                            {kitchen.awards[0]}
                            {kitchen.awards.length > 1 &&
                              ` +${kitchen.awards.length - 1} наград`}
                          </span>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleViewMenu(kitchen)}
                          className="flex-1 bg-primary hover:bg-primary/90"
                        >
                          <BookOpen className="h-4 w-4 mr-1" />
                          Меню
                        </Button>
                        <Button
                          onClick={() => handleBookTable(kitchen)}
                          variant="outline"
                          className="flex-1"
                        >
                          <Calendar className="h-4 w-4 mr-1" />
                          Столик
                        </Button>
                        <Button
                          onClick={() => handleShare(kitchen)}
                          variant="outline"
                          size="sm"
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Status */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {kitchen.location}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          {kitchen.is_open ? (
                            <div className="flex items-center gap-1 text-green-600">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-sm">Открыто</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-red-600">
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                              <span className="text-sm">Закрыто</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredKitchens.length === 0 && (
            <div className="text-center py-12">
              <ChefHat className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Кухни не найдены</h3>
              <p className="text-muted-foreground mb-4">
                Попробуйте изменить фильтры или поисковый запрос
              </p>
              <Button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedCuisine('all');
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Бронирование столика</DialogTitle>
          </DialogHeader>
          {selectedKitchen && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="font-semibold">{selectedKitchen.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedKitchen.location}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Дата и время</label>
                <Input type="datetime-local" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Количество гостей</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите количество" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? 'гость' : 'гостей'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Особые пожелания</label>
                <Input placeholder="Аллергии, предпочтения..." />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => setShowBookingModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Отмена
                </Button>
                <Button
                  onClick={() => {
                    toast({
                      title: 'Бронирование отправлено',
                      description: `Заявка на столик в ${selectedKitchen.name} отправлена`,
                    });
                    setShowBookingModal(false);
                  }}
                  className="flex-1"
                >
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

export default Kitchens;
