import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SEOHead } from '@/components/seo/SEOHead';
import { useSEO } from '@/hooks/useSEO';
import {
  BreadcrumbSchema,
  BreadcrumbNavigation,
} from '@/components/seo/BreadcrumbSchema';
import {
  ArrowLeft,
  ChefHat,
  Search,
  Filter,
  ShoppingCart,
  Plus,
  Minus,
  Star,
  Clock,
  MapPin,
  Heart,
} from 'lucide-react';
import { Link } from 'react-router-dom';
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
import { useToast } from '@/hooks/use-toast';
import { useCartStore } from '@/store/cartStore';
import { useAuth } from '@/hooks/useAuth';
import PolicyBadges from '@/components/PolicyBadges';
import { supabase } from '@/integrations/supabase/client';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  cuisine: string;
  allergens: string[];
  image_url?: string;
  is_available: boolean;
  preparation_time: number;
  rating: number;
  is_vegetarian: boolean;
  is_vegan: boolean;
  is_halal: boolean;
  is_spicy: boolean;
  calories?: number;
  kitchen_id: string;
  kitchen_name: string;
}

const Menu = () => {
  const { t } = useTranslation();
  const { getPageData } = useSEO();
  const pageData = getPageData('/menu');
  const { toast } = useToast();
  const { user } = useAuth();
  const { addItem, removeItem, items, totalItems, totalPrice } = useCartStore();

  // State management
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCuisine, setSelectedCuisine] = useState('all');
  const [selectedKitchen, setSelectedKitchen] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('all');

  // Fetch menu data
  useEffect(() => {
    fetchMenuItems();
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = menuItems;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.cuisine.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    // Cuisine filter
    if (selectedCuisine !== 'all') {
      filtered = filtered.filter((item) => item.cuisine === selectedCuisine);
    }

    // Kitchen filter
    if (selectedKitchen !== 'all') {
      filtered = filtered.filter((item) => item.kitchen_id === selectedKitchen);
    }

    // Tab filter
    if (activeTab === 'vegetarian') {
      filtered = filtered.filter((item) => item.is_vegetarian);
    } else if (activeTab === 'vegan') {
      filtered = filtered.filter((item) => item.is_vegan);
    } else if (activeTab === 'halal') {
      filtered = filtered.filter((item) => item.is_halal);
    } else if (activeTab === 'spicy') {
      filtered = filtered.filter((item) => item.is_spicy);
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
        case 'preparation_time':
          return a.preparation_time - b.preparation_time;
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredItems(filtered);
  }, [
    menuItems,
    searchQuery,
    selectedCategory,
    selectedCuisine,
    selectedKitchen,
    sortBy,
    activeTab,
  ]);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);

      // For now, use mock data since Supabase schema might not be set up
      // In production, this would fetch from Supabase
      const { data, error } = await supabase
        .from('menu_items')
        .select(
          `
          *,
          kitchens (
            name
          )
        `
        )
        .eq('is_active', true);

      if (error) throw error;

      const formattedData = data.map((item: any) => ({
        ...item,
        kitchen_name: item.kitchens.name,
      }));

      setMenuItems(formattedData as MenuItem[]);
    } catch (error) {
      console.error('Error fetching menu:', error);
      toast({
        title: 'Failed to load menu',
        description: 'Please try again later.',
        variant: 'destructive',
      });
      // Fallback to mock data if fetch fails
      setMenuItems(getMockMenuItems());
    } finally {
      setLoading(false);
    }
  };

  const getMockMenuItems = (): MenuItem[] => [
    {
      id: '1',
      name: 'Margherita Pizza',
      description:
        'Classic Italian pizza with fresh tomatoes, mozzarella, and basil',
      price: 450,
      category: 'Main Course',
      cuisine: 'Italian',
      allergens: ['gluten', 'dairy'],
      image_url: '/images/margherita.jpg',
      is_available: true,
      preparation_time: 15,
      rating: 4.8,
      is_vegetarian: true,
      is_vegan: false,
      is_halal: true,
      is_spicy: false,
      calories: 320,
      kitchen_id: '1',
      kitchen_name: 'Dolce Italia',
    },
    {
      id: '2',
      name: 'Pad Thai',
      description:
        'Traditional Thai stir-fried noodles with shrimp and vegetables',
      price: 380,
      category: 'Main Course',
      cuisine: 'Thai',
      allergens: ['shellfish', 'peanuts'],
      image_url: '/images/pad-thai.jpg',
      is_available: true,
      preparation_time: 12,
      rating: 4.6,
      is_vegetarian: false,
      is_vegan: false,
      is_halal: true,
      is_spicy: true,
      calories: 450,
      kitchen_id: '2',
      kitchen_name: 'Spicy Asia',
    },
    {
      id: '3',
      name: 'Nasi Goreng',
      description:
        'Indonesian fried rice with chicken, vegetables, and fried egg',
      price: 320,
      category: 'Main Course',
      cuisine: 'Indonesian',
      allergens: ['eggs', 'soy'],
      image_url: '/images/nasi-goreng.jpg',
      is_available: true,
      preparation_time: 10,
      rating: 4.7,
      is_vegetarian: false,
      is_vegan: false,
      is_halal: true,
      is_spicy: false,
      calories: 380,
      kitchen_id: '3',
      kitchen_name: 'Wild Bali',
    },
    {
      id: '4',
      name: 'Caesar Salad',
      description: 'Fresh romaine lettuce with parmesan cheese and croutons',
      price: 280,
      category: 'Salad',
      cuisine: 'International',
      allergens: ['dairy', 'gluten'],
      image_url: '/images/caesar-salad.jpg',
      is_available: true,
      preparation_time: 8,
      rating: 4.5,
      is_vegetarian: true,
      is_vegan: false,
      is_halal: true,
      is_spicy: false,
      calories: 250,
      kitchen_id: '4',
      kitchen_name: 'Green Garden',
    },
    {
      id: '5',
      name: 'Chocolate Lava Cake',
      description:
        'Warm chocolate cake with molten center and vanilla ice cream',
      price: 180,
      category: 'Dessert',
      cuisine: 'International',
      allergens: ['dairy', 'eggs', 'gluten'],
      image_url: '/images/lava-cake.jpg',
      is_available: true,
      preparation_time: 15,
      rating: 4.9,
      is_vegetarian: true,
      is_vegan: false,
      is_halal: true,
      is_spicy: false,
      calories: 420,
      kitchen_id: '5',
      kitchen_name: 'Sweet Dreams',
    },
  ];

  const handleAddToCart = (item: MenuItem) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image_url || '',
      kitchen: item.kitchen_name,
    });

    toast({
      title: 'Добавлено в корзину',
      description: `${item.name} добавлен в корзину`,
    });
  };

  const handleRemoveFromCart = (itemId: string) => {
    removeItem(itemId);
    toast({
      title: 'Удалено из корзины',
      description: 'Блюдо удалено из корзины',
    });
  };

  const toggleFavorite = (itemId: string) => {
    setFavorites((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const getCartQuantity = (itemId: string) => {
    const cartItem = items.find((item) => item.id === itemId);
    return cartItem?.quantity || 0;
  };

  const categories = [...new Set(menuItems.map((item) => item.category))];
  const cuisines = [...new Set(menuItems.map((item) => item.cuisine))];
  const kitchens = [
    ...new Set(
      menuItems.map((item) => ({
        id: item.kitchen_id,
        name: item.kitchen_name,
      }))
    ),
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-muted rounded w-1/3"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-64 bg-muted rounded"></div>
                ))}
              </div>
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

      <div className="pt-8 pb-16">
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
              <div className="flex items-center justify-center gap-3 mb-4">
                <ChefHat className="w-8 h-8 text-primary" />
                <h1 className="text-4xl font-bold bg-gradient-to-r from-burgundy-primary to-gold-accent bg-clip-text text-transparent">
                  Меню Food Hall
                </h1>
              </div>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Исследуйте вкусы всего мира в нашем гастрономическом зале. От
                традиционной балийской кухни до современных интерпретаций
                классических блюд.
              </p>
            </div>

            {/* Policy Information */}
            <div className="bg-muted/50 rounded-xl p-6 mb-8">
              <h3 className="font-semibold mb-4">
                Политика зонирования и сервиса:
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">1F — AC Зона (Halal):</h4>
                  <PolicyBadges acHalal serviceFee5 noBYO noRetail />
                </div>
                <div>
                  <h4 className="font-medium mb-2">2F — Alcohol Lounge:</h4>
                  <PolicyBadges alcoholAllowed age21 serviceFee5 noBYO />
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Поиск блюд, кухонь или ингредиентов..."
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
                  <SelectItem value="all">Все категории</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
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

              <Select
                value={selectedKitchen}
                onValueChange={setSelectedKitchen}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Кухня" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все кухни</SelectItem>
                  {kitchens.map((kitchen) => (
                    <SelectItem key={kitchen.id} value={kitchen.id}>
                      {kitchen.name}
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
                  <SelectItem value="preparation_time">
                    По времени приготовления
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Quick Filter Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all">Все</TabsTrigger>
                <TabsTrigger value="vegetarian">Вегетарианское</TabsTrigger>
                <TabsTrigger value="vegan">Веганское</TabsTrigger>
                <TabsTrigger value="halal">Халяль</TabsTrigger>
                <TabsTrigger value="spicy">Острое</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Results Count */}
          <div className="mb-6 flex justify-between items-center">
            <p className="text-muted-foreground">
              Найдено {filteredItems.length} блюд
            </p>
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              <span className="font-medium">{totalItems} товаров</span>
              <span className="text-muted-foreground">•</span>
              <span className="font-medium">{totalPrice.toFixed(0)} ₽</span>
            </div>
          </div>

          {/* Menu Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => {
              const cartQuantity = getCartQuantity(item.id);
              const isFavorite = favorites.includes(item.id);

              return (
                <Card
                  key={item.id}
                  className="hover:shadow-lg transition-shadow duration-300"
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">
                          {item.name}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mb-2">
                          {item.description}
                        </p>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            {item.cuisine}
                          </Badge>
                          <Link to={`/vendors/${item.kitchen_id}`}>
                            <Badge
                              variant="outline"
                              className="text-xs hover:bg-gray-100"
                            >
                              {item.kitchen_name}
                            </Badge>
                          </Link>
                          {item.is_vegetarian && (
                            <Badge variant="secondary" className="text-xs">
                              Veg
                            </Badge>
                          )}
                          {item.is_vegan && (
                            <Badge variant="secondary" className="text-xs">
                              Vegan
                            </Badge>
                          )}
                          {item.is_halal && (
                            <Badge variant="secondary" className="text-xs">
                              Halal
                            </Badge>
                          )}
                          {item.is_spicy && (
                            <Badge variant="destructive" className="text-xs">
                              Spicy
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleFavorite(item.id)}
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
                      {/* Rating and Time */}
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{item.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{item.preparation_time} мин</span>
                        </div>
                        {item.calories && <span>{item.calories} ккал</span>}
                      </div>

                      {/* Allergens */}
                      {item.allergens.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {item.allergens.map((allergen, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {allergen}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Price and Add to Cart */}
                      <div className="flex items-center justify-between">
                        <div className="text-xl font-bold">{item.price} ₽</div>

                        <div className="flex items-center gap-2">
                          {cartQuantity > 0 ? (
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRemoveFromCart(item.id)}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="font-medium">
                                {cartQuantity}
                              </span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleAddToCart(item)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              onClick={() => handleAddToCart(item)}
                              disabled={!item.is_available}
                              className="bg-primary hover:bg-primary/90"
                            >
                              <Plus className="h-4 w-4 mr-1" />В корзину
                            </Button>
                          )}
                        </div>
                      </div>

                      {!item.is_available && (
                        <Badge
                          variant="destructive"
                          className="w-full justify-center"
                        >
                          Недоступно
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <ChefHat className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Блюда не найдены</h3>
              <p className="text-muted-foreground mb-4">
                Попробуйте изменить фильтры или поисковый запрос
              </p>
              <Button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedCuisine('all');
                  setSelectedKitchen('all');
                  setActiveTab('all');
                }}
              >
                Сбросить фильтры
              </Button>
            </div>
          )}

          {/* Footer Info */}
          <div className="mt-12 text-center text-sm text-muted-foreground">
            <p>* Цены включают service fee 5%</p>
            <p>
              * Время приготовления может варьироваться в зависимости от
              загруженности
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
