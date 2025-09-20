import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Heart,
  ShoppingCart,
  Calendar,
  MapPin,
  Star,
  Trash2,
  ChefHat,
  Clock,
  Plus,
  Minus,
} from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { LoadingSpinner } from '@/components/LoadingStates';

interface FavoriteItem {
  id: string;
  type: 'menu_item' | 'vendor' | 'event';
  name: string;
  description?: string;
  price?: number;
  image_url?: string;
  vendor_name?: string;
  event_date?: string;
  event_time?: string;
  location?: string;
  added_at: string;
}

const FavoritesPage: React.FC = () => {
  const { addItem } = useCartStore();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      // Здесь будет реальный API вызов
      // Пока что используем моковые данные
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockFavorites: FavoriteItem[] = [
        {
          id: '1',
          type: 'menu_item',
          name: 'Паста Карбонара',
          description:
            'Классическая итальянская паста с беконом и сливочным соусом',
          price: 450,
          image_url: 'https://example.com/carbonara.jpg',
          vendor_name: 'Dolce Italia',
          added_at: '2024-01-15T10:30:00Z',
        },
        {
          id: '2',
          type: 'vendor',
          name: 'Spicy Asia',
          description: 'Азиатская кухня с острыми блюдами',
          image_url: 'https://example.com/spicy-asia.jpg',
          added_at: '2024-01-14T15:20:00Z',
        },
        {
          id: '3',
          type: 'event',
          name: 'Мастер-класс по суши',
          description:
            'Научитесь готовить суши и роллы от профессионального шеф-повара',
          price: 3200,
          image_url: 'https://example.com/sushi-class.jpg',
          event_date: '2024-01-25',
          event_time: '18:00',
          location: 'ODE Food Hall, зона Spicy Asia',
          added_at: '2024-01-13T12:15:00Z',
        },
        {
          id: '4',
          type: 'menu_item',
          name: 'Тирамису',
          description: 'Классический итальянский десерт',
          price: 350,
          image_url: 'https://example.com/tiramisu.jpg',
          vendor_name: 'Dolce Italia',
          added_at: '2024-01-12T09:45:00Z',
        },
      ];

      setFavorites(mockFavorites);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (id: string) => {
    try {
      // Здесь будет реальный API вызов
      setFavorites((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  const addToCart = (item: FavoriteItem) => {
    if (item.type === 'menu_item' && item.price) {
      addItem({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
        vendor: {
          id: 'vendor-id',
          name: item.vendor_name || 'Unknown',
        },
      });
    }
  };

  const getFilteredFavorites = () => {
    if (activeTab === 'all') {
      return favorites;
    }
    return favorites.filter((item) => item.type === activeTab);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Heart className="h-5 w-5 mr-2" />
            Избранное
          </CardTitle>
          <p className="text-gray-600">
            Ваши сохраненные блюда, вендоры и события
          </p>
        </CardHeader>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Все</TabsTrigger>
          <TabsTrigger value="menu_item">Блюда</TabsTrigger>
          <TabsTrigger value="vendor">Вендоры</TabsTrigger>
          <TabsTrigger value="event">События</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {getFilteredFavorites().length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Избранное пусто
                </h3>
                <p className="text-gray-600 mb-4">
                  {activeTab === 'all'
                    ? 'Вы еще ничего не добавили в избранное'
                    : `Нет ${
                        activeTab === 'menu_item'
                          ? 'блюд'
                          : activeTab === 'vendor'
                            ? 'вендоров'
                            : 'событий'
                      } в избранном`}
                </p>
                <Button onClick={() => (window.location.href = '/vendors')}>
                  Посмотреть вендоров
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getFilteredFavorites().map((item) => (
                <Card
                  key={item.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                        {item.description && (
                          <p className="text-sm text-gray-600 mt-1">
                            {item.description}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFavorite(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {item.image_url && (
                        <div className="w-full h-32 bg-gray-200 rounded-lg overflow-hidden">
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        {item.type === 'menu_item' && (
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700"
                          >
                            <ChefHat className="h-3 w-3 mr-1" />
                            Блюдо
                          </Badge>
                        )}
                        {item.type === 'vendor' && (
                          <Badge
                            variant="outline"
                            className="bg-blue-50 text-blue-700"
                          >
                            <MapPin className="h-3 w-3 mr-1" />
                            Вендор
                          </Badge>
                        )}
                        {item.type === 'event' && (
                          <Badge
                            variant="outline"
                            className="bg-purple-50 text-purple-700"
                          >
                            <Calendar className="h-3 w-3 mr-1" />
                            Событие
                          </Badge>
                        )}
                      </div>

                      {item.vendor_name && (
                        <p className="text-sm text-gray-600">
                          <strong>Вендор:</strong> {item.vendor_name}
                        </p>
                      )}

                      {item.event_date && (
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600">
                            <strong>Дата:</strong> {formatDate(item.event_date)}
                          </p>
                          {item.event_time && (
                            <p className="text-sm text-gray-600">
                              <strong>Время:</strong> {item.event_time}
                            </p>
                          )}
                          {item.location && (
                            <p className="text-sm text-gray-600">
                              <strong>Место:</strong> {item.location}
                            </p>
                          )}
                        </div>
                      )}

                      {item.price && (
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-gray-900">
                            {formatPrice(item.price)}
                          </span>
                          {item.type === 'menu_item' && (
                            <Button
                              size="sm"
                              onClick={() => addToCart(item)}
                              className="bg-orange-600 hover:bg-orange-700"
                            >
                              <ShoppingCart className="h-4 w-4 mr-1" />В корзину
                            </Button>
                          )}
                        </div>
                      )}

                      <div className="text-xs text-gray-500">
                        Добавлено: {formatDate(item.added_at)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FavoritesPage;
