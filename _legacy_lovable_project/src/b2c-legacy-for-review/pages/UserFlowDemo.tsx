import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ShoppingCart,
  Calendar,
  User,
  ChefHat,
  Star,
  ArrowRight,
  CheckCircle,
  Clock,
  Users,
} from 'lucide-react';

const UserFlowDemo: React.FC = () => {
  const navigate = useNavigate();
  const {
    cart,
    currentBooking,
    getCartItemsCount,
    getCartTotal,
    addToCart,
    clearCart,
    setCurrentBooking,
    addNotification,
  } = useAppContext();

  const [selectedFlow, setSelectedFlow] = useState<string | null>(null);

  // Mock menu items for demo
  const mockMenuItems = [
    {
      id: '1',
      name: 'Паста Карбонара',
      price: 45000,
      category: 'Итальянская кухня',
    },
    { id: '2', name: 'Суши Ролл', price: 35000, category: 'Японская кухня' },
    {
      id: '3',
      name: 'Бургер Классик',
      price: 55000,
      category: 'Американская кухня',
    },
    {
      id: '4',
      name: 'Салат Цезарь',
      price: 25000,
      category: 'Здоровое питание',
    },
  ];

  const handleStartOrdering = () => {
    setSelectedFlow('ordering');
    navigate('/menu');
    addNotification({
      type: 'info',
      title: 'Начало заказа',
      message:
        'Вы перешли в раздел меню. Добавьте блюда в корзину для оформления заказа.',
    });
  };

  const handleStartBooking = () => {
    setSelectedFlow('booking');
    setCurrentBooking({
      date: '',
      time: '',
      guests: 2,
      name: '',
      email: '',
      phone: '',
      status: 'pending',
    });
    navigate('/booking');
    addNotification({
      type: 'info',
      title: 'Начало бронирования',
      message:
        'Вы перешли в раздел бронирования. Выберите дату и время для столика.',
    });
  };

  const handleAddToCart = (item: any) => {
    addToCart(item);
    addNotification({
      type: 'success',
      title: 'Добавлено в корзину',
      message: `${item.name} добавлено в корзину`,
    });
  };

  const handleCompleteOrder = () => {
    clearCart();
    addNotification({
      type: 'success',
      title: 'Заказ оформлен',
      message: 'Ваш заказ успешно оформлен и будет готов через 30 минут',
    });
    setSelectedFlow(null);
  };

  const handleCompleteBooking = () => {
    setCurrentBooking({
      ...currentBooking!,
      status: 'confirmed',
    });
    addNotification({
      type: 'success',
      title: 'Бронирование подтверждено',
      message: 'Ваш столик успешно забронирован',
    });
    setSelectedFlow(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Демонстрация пользовательских сценариев
        </h1>
        <p className="text-gray-600">
          Выберите сценарий для демонстрации навигации и функциональности
          приложения
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Ordering Flow */}
        <Card className="border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ShoppingCart className="h-5 w-5 text-blue-600" />
              <span>Сценарий заказа</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Полный цикл заказа: просмотр меню → добавление в корзину →
              оформление → оплата
            </p>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Просмотр меню</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Добавление в корзину</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Оформление заказа</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Оплата</span>
              </div>
            </div>

            {cart.length > 0 && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-blue-800">
                  В корзине: {getCartItemsCount()} товаров на{' '}
                  {getCartTotal().toLocaleString()} ₽
                </p>
              </div>
            )}

            <div className="space-y-2">
              {cart.length === 0 ? (
                <Button onClick={handleStartOrdering} className="w-full">
                  Начать заказ
                </Button>
              ) : (
                <div className="space-y-2">
                  <Button onClick={() => navigate('/cart')} className="w-full">
                    Перейти в корзину
                  </Button>
                  <Button
                    onClick={handleCompleteOrder}
                    variant="outline"
                    className="w-full"
                  >
                    Завершить заказ
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Booking Flow */}
        <Card className="border-2 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-green-600" />
              <span>Сценарий бронирования</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Бронирование столика: выбор даты → выбор времени → заполнение
              данных → подтверждение
            </p>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Выбор даты</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Выбор времени</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Заполнение данных</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Подтверждение</span>
              </div>
            </div>

            {currentBooking && (
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-green-800">
                  Бронирование: {currentBooking.date} в {currentBooking.time}
                </p>
                <p className="text-sm text-green-600">
                  Гостей: {currentBooking.guests}
                </p>
              </div>
            )}

            <div className="space-y-2">
              {!currentBooking ? (
                <Button onClick={handleStartBooking} className="w-full">
                  Начать бронирование
                </Button>
              ) : (
                <div className="space-y-2">
                  <Button
                    onClick={() => navigate('/booking')}
                    className="w-full"
                  >
                    Продолжить бронирование
                  </Button>
                  <Button
                    onClick={handleCompleteBooking}
                    variant="outline"
                    className="w-full"
                  >
                    Подтвердить бронирование
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Authentication Flow */}
        <Card className="border-2 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5 text-purple-600" />
              <span>Сценарий аутентификации</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Вход в систему: регистрация → вход → профиль → настройки
            </p>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Регистрация</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Вход в систему</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Профиль пользователя</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Настройки</span>
              </div>
            </div>

            <div className="space-y-2">
              <Button onClick={() => navigate('/auth')} className="w-full">
                Перейти к входу
              </Button>
              <Button
                onClick={() => navigate('/auth?mode=register')}
                variant="outline"
                className="w-full"
              >
                Регистрация
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Demo Actions */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Быстрые действия для демонстрации
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button
            onClick={() => handleAddToCart(mockMenuItems[0])}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <ChefHat className="h-4 w-4" />
            <span>Добавить пасту</span>
          </Button>

          <Button
            onClick={() => handleAddToCart(mockMenuItems[1])}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <ChefHat className="h-4 w-4" />
            <span>Добавить суши</span>
          </Button>

          <Button
            onClick={() => navigate('/events')}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <Calendar className="h-4 w-4" />
            <span>Посмотреть события</span>
          </Button>

          <Button
            onClick={() => navigate('/admin')}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <Star className="h-4 w-4" />
            <span>Админ-панель</span>
          </Button>
        </div>
      </div>

      {/* Current State Display */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Текущее состояние приложения
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Корзина</CardTitle>
            </CardHeader>
            <CardContent>
              {cart.length > 0 ? (
                <div className="space-y-2">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center"
                    >
                      <span className="text-sm">{item.name}</span>
                      <Badge variant="secondary">
                        {item.quantity} × {item.price.toLocaleString()} ₽
                      </Badge>
                    </div>
                  ))}
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-semibold">
                      <span>Итого:</span>
                      <span>{getCartTotal().toLocaleString()} ₽</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Корзина пуста</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Бронирование</CardTitle>
            </CardHeader>
            <CardContent>
              {currentBooking ? (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Дата:</span>
                    <span className="text-sm">
                      {currentBooking.date || 'Не выбрана'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Время:</span>
                    <span className="text-sm">
                      {currentBooking.time || 'Не выбрано'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Гостей:</span>
                    <span className="text-sm">{currentBooking.guests}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Статус:</span>
                    <Badge
                      variant={
                        currentBooking.status === 'confirmed'
                          ? 'default'
                          : 'secondary'
                      }
                    >
                      {currentBooking.status === 'confirmed'
                        ? 'Подтверждено'
                        : 'Ожидает'}
                    </Badge>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">
                  Нет активного бронирования
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserFlowDemo;
