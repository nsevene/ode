import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  ShoppingBag, 
  Calendar, 
  Settings, 
  LogOut,
  ArrowLeft,
  Bell,
  Heart,
  CreditCard,
  MapPin
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';

const ProfileLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuthStore();
  const { totalItems } = useCartStore();

  const menuItems = [
    {
      id: 'details',
      label: 'Личные данные',
      icon: <User className="h-4 w-4" />,
      path: '/profile/details',
      description: 'Управление профилем и контактами'
    },
    {
      id: 'orders',
      label: 'Мои заказы',
      icon: <ShoppingBag className="h-4 w-4" />,
      path: '/profile/orders',
      description: 'История заказов и статусы',
      badge: totalItems > 0 ? totalItems : undefined
    },
    {
      id: 'bookings',
      label: 'Бронирования',
      icon: <Calendar className="h-4 w-4" />,
      path: '/profile/bookings',
      description: 'События и мастер-классы'
    },
    {
      id: 'favorites',
      label: 'Избранное',
      icon: <Heart className="h-4 w-4" />,
      path: '/profile/favorites',
      description: 'Сохраненные блюда и вендоры'
    },
    {
      id: 'addresses',
      label: 'Адреса',
      icon: <MapPin className="h-4 w-4" />,
      path: '/profile/addresses',
      description: 'Адреса доставки'
    },
    {
      id: 'payments',
      label: 'Способы оплаты',
      icon: <CreditCard className="h-4 w-4" />,
      path: '/profile/payments',
      description: 'Карты и платежные методы'
    },
    {
      id: 'notifications',
      label: 'Уведомления',
      icon: <Bell className="h-4 w-4" />,
      path: '/profile/notifications',
      description: 'Настройки уведомлений'
    },
    {
      id: 'settings',
      label: 'Настройки',
      icon: <Settings className="h-4 w-4" />,
      path: '/profile/settings',
      description: 'Общие настройки аккаунта'
    }
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    }
  };

  const isActivePath = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                На главную
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Личный кабинет</h1>
                <p className="text-gray-600">
                  Добро пожаловать, {user?.user_metadata?.full_name || user?.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {totalItems > 0 && (
                <Button 
                  onClick={() => navigate('/vendors')}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Корзина ({totalItems})
                </Button>
              )}
              <Button 
                variant="outline"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Выйти
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {menuItems.map((item) => (
                    <Button
                      key={item.id}
                      variant={isActivePath(item.path) ? 'default' : 'ghost'}
                      className={`w-full justify-start h-auto p-4 ${
                        isActivePath(item.path) 
                          ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                          : 'hover:bg-gray-100'
                      }`}
                      onClick={() => navigate(item.path)}
                    >
                      <div className="flex items-center w-full">
                        <div className="flex-shrink-0 mr-3">
                          {item.icon}
                        </div>
                        <div className="flex-1 text-left">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{item.label}</span>
                            {item.badge && (
                              <Badge variant="secondary" className="ml-2">
                                {item.badge}
                              </Badge>
                            )}
                          </div>
                          <p className={`text-xs mt-1 ${
                            isActivePath(item.path) ? 'text-orange-100' : 'text-gray-500'
                          }`}>
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </Button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileLayout;
