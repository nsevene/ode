import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, 
  Calendar, 
  MapPin, 
  Clock, 
  Star,
  Users,
  ChefHat,
  Wine,
  Coffee,
  Utensils
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '@/store/cartStore';

const GuestDemo: React.FC = () => {
  const navigate = useNavigate();
  const { totalItems } = useCartStore();

  const demoFeatures = [
    {
      icon: <ShoppingCart className="h-8 w-8" />,
      title: "Заказ еды",
      description: "Просматривайте меню вендоров и добавляйте блюда в корзину",
      action: "Перейти к меню",
      path: "/menu"
    },
    {
      icon: <Calendar className="h-8 w-8" />,
      title: "Бронирование событий",
      description: "Записывайтесь на кулинарные мастер-классы и дегустации",
      action: "Посмотреть события",
      path: "/events"
    },
    {
      icon: <MapPin className="h-8 w-8" />,
      title: "Навигация по пространству",
      description: "Изучайте зоны и вендоров в ODE Food Hall",
      action: "Исследовать",
      path: "/kitchens"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Сообщество",
      description: "Присоединяйтесь к кулинарному сообществу",
      action: "Узнать больше",
      path: "/community"
    }
  ];

  const quickActions = [
    {
      title: "Заказать завтрак",
      description: "Свежие блюда с утра",
      icon: <Coffee className="h-6 w-6" />,
      path: "/breakfast"
    },
    {
      title: "Обед",
      description: "Основные блюда и гарниры",
      icon: <Utensils className="h-6 w-6" />,
      path: "/menu"
    },
    {
      title: "Дегустация вин",
      description: "Винная лестница ODE",
      icon: <Wine className="h-6 w-6" />,
      path: "/wine-staircase"
    },
    {
      title: "Стол шеф-повара",
      description: "Эксклюзивные блюда",
      icon: <ChefHat className="h-6 w-6" />,
      path: "/chefs-table"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">ODE Food Hall</h1>
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                Демо-режим
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                onClick={() => navigate('/auth')}
                className="flex items-center space-x-2"
              >
                <Users className="h-4 w-4" />
                <span>Войти</span>
              </Button>
              {totalItems > 0 && (
                <Button 
                  onClick={() => navigate('/checkout')}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Корзина ({totalItems})
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Добро пожаловать в ODE Food Hall
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Исследуйте мир кулинарии, заказывайте блюда от лучших шеф-поваров 
            и участвуйте в уникальных гастрономических событиях
          </p>
        </div>

        {/* Main Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {demoFeatures.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-orange-100 rounded-lg text-orange-600">
                    {feature.icon}
                  </div>
                  <div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <Button 
                  onClick={() => navigate(feature.path)}
                  className="w-full bg-orange-600 hover:bg-orange-700"
                >
                  {feature.action}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Быстрые действия
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Card 
                key={index} 
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(action.path)}
              >
                <CardContent className="p-4 text-center">
                  <div className="flex justify-center mb-3">
                    <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                      {action.icon}
                    </div>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">{action.title}</h4>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            ODE Food Hall в цифрах
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">15+</div>
              <div className="text-gray-600">Вендоров</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">200+</div>
              <div className="text-gray-600">Блюд в меню</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">50+</div>
              <div className="text-gray-600">Событий в месяц</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestDemo;
