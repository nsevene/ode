import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft,
  MapPin, 
  Clock, 
  Star,
  ChefHat,
  Phone,
  Mail,
  Globe,
  Plus,
  Minus,
  ShoppingCart,
  Calendar,
  Users,
  Clock3
} from 'lucide-react';
import { vendorApi, menuApi } from '@/lib/api-client';
import { Vendor, MenuItem } from '@/types/database';
import { LoadingSpinner } from '@/components/LoadingStates';
import { useCartStore } from '@/store/cartStore';

const VendorDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [cartQuantities, setCartQuantities] = useState<Record<string, number>>({});

  useEffect(() => {
    if (id) {
      fetchVendor();
      fetchMenuItems();
    }
  }, [id]);

  const fetchVendor = async () => {
    try {
      const { data, error } = await vendorApi.getById(id!);
      
      if (error) {
        throw new Error(error.message);
      }
      
      setVendor(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки вендора');
    }
  };

  const fetchMenuItems = async () => {
    try {
      const { data, error } = await menuApi.getByVendor(id!);
      
      if (error) {
        throw new Error(error.message);
      }
      
      setMenuItems(data || []);
    } catch (err) {
      console.error('Ошибка загрузки меню:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCuisineLabel = (cuisine: string) => {
    const labels: Record<string, string> = {
      'italian': 'Итальянская',
      'asian': 'Азиатская',
      'mediterranean': 'Средиземноморская',
      'mexican': 'Мексиканская',
      'indian': 'Индийская',
      'french': 'Французская',
      'japanese': 'Японская',
      'thai': 'Тайская',
      'vietnamese': 'Вьетнамская',
      'korean': 'Корейская',
      'middle-eastern': 'Ближневосточная',
      'american': 'Американская',
      'european': 'Европейская'
    };
    return labels[cuisine] || cuisine;
  };

  const getCategories = () => {
    const categories = ['all', ...new Set(menuItems.map(item => item.category))];
    return categories;
  };

  const getFilteredMenuItems = () => {
    if (selectedCategory === 'all') {
      return menuItems;
    }
    return menuItems.filter(item => item.category === selectedCategory);
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    setCartQuantities(prev => ({
      ...prev,
      [itemId]: Math.max(0, quantity)
    }));
  };

  const addToCart = (item: MenuItem) => {
    const quantity = cartQuantities[item.id] || 1;
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity,
      vendor: {
        id: vendor!.id,
        name: vendor!.name
      }
    });
    
    // Сброс количества после добавления
    setCartQuantities(prev => ({
      ...prev,
      [item.id]: 0
    }));
  };

  const getSpiceLevelLabel = (level: string) => {
    const labels: Record<string, string> = {
      'mild': 'Мягкий',
      'medium': 'Средний',
      'hot': 'Острый',
      'extra-hot': 'Очень острый'
    };
    return labels[level] || level;
  };

  const getSpiceLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      'mild': 'bg-green-100 text-green-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'hot': 'bg-orange-100 text-orange-800',
      'extra-hot': 'bg-red-100 text-red-800'
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !vendor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <p className="text-red-600 mb-4">{error || 'Вендор не найден'}</p>
            <Button onClick={() => navigate('/vendors')}>
              Вернуться к списку
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/vendors')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{vendor.name}</h1>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary">
                  {getCuisineLabel(vendor.cuisine_type)}
                </Badge>
                <div className="flex items-center text-yellow-500">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="ml-1 text-sm">4.5</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Vendor Info */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Информация</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {vendor.description && (
                  <p className="text-gray-600">{vendor.description}</p>
                )}
                
                <div className="space-y-3">
                  {vendor.location && (
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{vendor.location}</span>
                    </div>
                  )}
                  
                  {vendor.phone && (
                    <div className="flex items-center text-sm">
                      <Phone className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{vendor.phone}</span>
                    </div>
                  )}
                  
                  {vendor.email && (
                    <div className="flex items-center text-sm">
                      <Mail className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{vendor.email}</span>
                    </div>
                  )}
                  
                  {vendor.website && (
                    <div className="flex items-center text-sm">
                      <Globe className="h-4 w-4 mr-2 text-gray-500" />
                      <a 
                        href={vendor.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-orange-600 hover:underline"
                      >
                        Веб-сайт
                      </a>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t">
                  <Button 
                    className="w-full bg-orange-600 hover:bg-orange-700"
                    onClick={() => navigate('/events')}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    События вендора
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Menu */}
          <div className="lg:col-span-2">
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
                <TabsTrigger value="all">Все</TabsTrigger>
                {getCategories().slice(1).map(category => (
                  <TabsTrigger key={category} value={category}>
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value={selectedCategory} className="mt-6">
                {getFilteredMenuItems().length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <ChefHat className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Меню пусто
                      </h3>
                      <p className="text-gray-600">
                        В этой категории пока нет блюд
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {getFilteredMenuItems().map((item) => (
                      <Card key={item.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                {item.name}
                              </h3>
                              {item.description && (
                                <p className="text-gray-600 mb-3">
                                  {item.description}
                                </p>
                              )}
                              
                              <div className="flex flex-wrap gap-2 mb-3">
                                {item.is_vegetarian && (
                                  <Badge variant="outline" className="bg-green-50 text-green-700">
                                    Вегетарианское
                                  </Badge>
                                )}
                                {item.is_vegan && (
                                  <Badge variant="outline" className="bg-green-50 text-green-700">
                                    Веганское
                                  </Badge>
                                )}
                                {item.is_gluten_free && (
                                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                    Без глютена
                                  </Badge>
                                )}
                                <Badge 
                                  variant="outline" 
                                  className={getSpiceLevelColor(item.spice_level)}
                                >
                                  {getSpiceLevelLabel(item.spice_level)}
                                </Badge>
                              </div>

                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center">
                                  <Clock3 className="h-4 w-4 mr-1" />
                                  <span>{item.preparation_time} мин</span>
                                </div>
                                <div className="flex items-center">
                                  <Users className="h-4 w-4 mr-1" />
                                  <span>{item.category}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="text-right ml-4">
                              <div className="text-2xl font-bold text-gray-900 mb-2">
                                {item.price.toFixed(0)} ₽
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateCartQuantity(item.id, (cartQuantities[item.id] || 0) - 1)}
                                  disabled={!cartQuantities[item.id]}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                
                                <span className="w-8 text-center">
                                  {cartQuantities[item.id] || 0}
                                </span>
                                
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateCartQuantity(item.id, (cartQuantities[item.id] || 0) + 1)}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                              
                              <Button
                                className="mt-2 bg-orange-600 hover:bg-orange-700"
                                size="sm"
                                onClick={() => addToCart(item)}
                                disabled={!cartQuantities[item.id]}
                              >
                                <ShoppingCart className="h-4 w-4 mr-1" />
                                В корзину
                              </Button>
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
        </div>
      </div>
    </div>
  );
};

export default VendorDetailPage;
