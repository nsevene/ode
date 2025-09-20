import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Star, Clock, Leaf, Utensils, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCartStore, useCartActions } from '@/store/cartStore';
import { cn } from '@/lib/utils';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  image?: string;
  category: string;
  kitchen: string;
  allergens?: string[];
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  spiceLevel?: 'mild' | 'medium' | 'hot' | 'extra-hot';
  preparationTime?: number;
  rating?: number;
  isPopular?: boolean;
  isNew?: boolean;
}

interface FoodMenuProps {
  className?: string;
}

export const FoodMenu: React.FC<FoodMenuProps> = ({ className }) => {
  const { addItem } = useCartActions();
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock menu data - replace with actual data from API
  const menuItems: MenuItem[] = [
    {
      id: '1',
      name: 'Паста Карбонара',
      price: 45000,
      description:
        'Классическая итальянская паста с беконом, яйцами и пармезаном',
      category: 'pasta',
      kitchen: 'Итальянская кухня',
      isVegetarian: false,
      isGlutenFree: false,
      spiceLevel: 'mild',
      preparationTime: 15,
      rating: 4.8,
      isPopular: true,
    },
    {
      id: '2',
      name: 'Суши Ролл Филадельфия',
      price: 35000,
      description: 'Свежий лосось, сливочный сыр, огурец и нори',
      category: 'sushi',
      kitchen: 'Японская кухня',
      isVegetarian: false,
      isGlutenFree: true,
      spiceLevel: 'mild',
      preparationTime: 10,
      rating: 4.9,
      isPopular: true,
    },
    {
      id: '3',
      name: 'Бургер Классик',
      price: 55000,
      description: 'Сочная говяжья котлета, сыр, салат, помидор, лук и соус',
      category: 'burger',
      kitchen: 'Американская кухня',
      isVegetarian: false,
      isGlutenFree: false,
      spiceLevel: 'mild',
      preparationTime: 20,
      rating: 4.7,
      isPopular: true,
    },
    {
      id: '4',
      name: 'Салат Цезарь',
      price: 25000,
      description:
        'Свежий салат с курицей, пармезаном, сухариками и соусом цезарь',
      category: 'salad',
      kitchen: 'Здоровое питание',
      isVegetarian: false,
      isGlutenFree: false,
      spiceLevel: 'mild',
      preparationTime: 10,
      rating: 4.6,
      isNew: true,
    },
    {
      id: '5',
      name: 'Веганский Бургер',
      price: 45000,
      description: 'Растительная котлета, веганский сыр, салат, помидор и соус',
      category: 'burger',
      kitchen: 'Веганская кухня',
      isVegetarian: true,
      isVegan: true,
      isGlutenFree: false,
      spiceLevel: 'mild',
      preparationTime: 15,
      rating: 4.5,
      isNew: true,
    },
    {
      id: '6',
      name: 'Тайский Том Ям',
      price: 40000,
      description:
        'Острый тайский суп с креветками, грибами и кокосовым молоком',
      category: 'soup',
      kitchen: 'Тайская кухня',
      isVegetarian: false,
      isGlutenFree: true,
      spiceLevel: 'hot',
      preparationTime: 12,
      rating: 4.8,
    },
  ];

  const categories = [
    { id: 'all', name: 'Все блюда', icon: Utensils },
    { id: 'pasta', name: 'Паста', icon: Utensils },
    { id: 'sushi', name: 'Суши', icon: Utensils },
    { id: 'burger', name: 'Бургеры', icon: Utensils },
    { id: 'salad', name: 'Салаты', icon: Leaf },
    { id: 'soup', name: 'Супы', icon: Utensils },
  ];

  const filteredItems =
    selectedCategory === 'all'
      ? menuItems
      : menuItems.filter((item) => item.category === selectedCategory);

  const handleAddToCart = (item: MenuItem) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      category: item.category,
      description: item.description,
      kitchen: item.kitchen,
      allergens: item.allergens,
      isVegetarian: item.isVegetarian,
      isVegan: item.isVegan,
      isGlutenFree: item.isGlutenFree,
      spiceLevel: item.spiceLevel,
      preparationTime: item.preparationTime,
    });
  };

  const getSpiceIcon = (level: string) => {
    switch (level) {
      case 'mild':
        return '🌶️';
      case 'medium':
        return '🌶️🌶️';
      case 'hot':
        return '🌶️🌶️🌶️';
      case 'extra-hot':
        return '🌶️🌶️🌶️🌶️';
      default:
        return '';
    }
  };

  return (
    <div className={cn('w-full', className)}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Наше меню</h2>
        <p className="text-gray-600">Выберите из нашего разнообразного меню</p>
      </div>

      {/* Category Tabs */}
      <Tabs
        value={selectedCategory}
        onValueChange={setSelectedCategory}
        className="mb-6"
      >
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          {categories.map((category) => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className="flex items-center space-x-2"
            >
              <category.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{category.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="h-full flex flex-col">
              {/* Item Image */}
              <div className="relative h-48 bg-gray-100 rounded-t-lg overflow-hidden">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Utensils className="h-12 w-12 text-gray-400" />
                  </div>
                )}

                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col space-y-1">
                  {item.isPopular && (
                    <Badge className="bg-orange-500 text-white">
                      <Star className="h-3 w-3 mr-1" />
                      Популярное
                    </Badge>
                  )}
                  {item.isNew && (
                    <Badge className="bg-green-500 text-white">
                      <Zap className="h-3 w-3 mr-1" />
                      Новое
                    </Badge>
                  )}
                </div>

                {/* Dietary Badges */}
                <div className="absolute top-2 right-2 flex flex-col space-y-1">
                  {item.isVegetarian && (
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200"
                    >
                      <Leaf className="h-3 w-3 mr-1" />
                      Veg
                    </Badge>
                  )}
                  {item.isVegan && (
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200"
                    >
                      Vegan
                    </Badge>
                  )}
                  {item.isGlutenFree && (
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200"
                    >
                      GF
                    </Badge>
                  )}
                </div>
              </div>

              <CardContent className="flex-1 flex flex-col p-4">
                {/* Item Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {item.name}
                    </h3>
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-600">
                        {new Intl.NumberFormat('ru-RU', {
                          style: 'currency',
                          currency: 'RUB',
                          minimumFractionDigits: 0,
                        }).format(item.price)}
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{item.preparationTime} мин</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3" />
                      <span>{item.rating}</span>
                    </div>
                    {item.spiceLevel && (
                      <div className="flex items-center space-x-1">
                        <span>{getSpiceIcon(item.spiceLevel)}</span>
                        <span className="capitalize">{item.spiceLevel}</span>
                      </div>
                    )}
                  </div>

                  <div className="text-xs text-gray-500 mb-3">
                    <span className="font-medium">{item.kitchen}</span>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <Button
                  onClick={() => handleAddToCart(item)}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Добавить в корзину
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <Utensils className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Нет блюд в этой категории
          </h3>
          <p className="text-gray-500">Попробуйте выбрать другую категорию</p>
        </div>
      )}
    </div>
  );
};

export default FoodMenu;
