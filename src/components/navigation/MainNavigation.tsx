import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, Home, Calendar, MapPin, Users, Wine, Camera, ChefHat, 
  Gamepad2, User, Settings, LogIn, LogOut, BookOpen, Award, Map, 
  Store, Utensils, Compass, Building, Star, Leaf, Info, Coffee,
  Bell, Search, Globe, ShoppingCart, UserPlus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { useRoles } from '@/hooks/useRoles';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon: React.ComponentType<any>;
  category: 'public' | 'user' | 'admin' | 'portal';
  roles?: string[];
  badge?: string;
  description?: string;
  isExternal?: boolean;
}

interface MainNavigationProps {
  className?: string;
}

export const MainNavigation: React.FC<MainNavigationProps> = ({ className }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, signOut } = useAuth();
  const { userRole } = useRoles();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Navigation items configuration
  const navigationItems: NavigationItem[] = [
    // Public navigation
    {
      id: 'home',
      label: 'Главная',
      path: '/',
      icon: Home,
      category: 'public',
      description: 'Добро пожаловать в ODE Food Hall'
    },
    {
      id: 'menu',
      label: 'Меню',
      path: '/menu',
      icon: ChefHat,
      category: 'public',
      description: 'Полное меню food hall'
    },
    {
      id: 'events',
      label: 'События',
      path: '/events',
      icon: Calendar,
      category: 'public',
      description: 'Предстоящие события и мастер-классы'
    },
    {
      id: 'kitchens',
      label: 'Кухни',
      path: '/kitchens',
      icon: ChefHat,
      category: 'public',
      description: '12 кухонных корнеров'
    },
    {
      id: 'spaces',
      label: 'Пространства',
      path: '/spaces',
      icon: Building,
      category: 'public',
      description: 'Ground Floor + 2nd Floor зоны'
    },
    {
      id: 'experiences',
      label: 'Опыты',
      path: '/experiences',
      icon: Star,
      category: 'public',
      description: 'Специальные кулинарные опыты'
    },
    {
      id: 'taste-compass',
      label: 'Taste Compass',
      path: '/taste-compass',
      icon: Compass,
      category: 'public',
      description: 'Путешествие по вкусам'
    },
    {
      id: 'about',
      label: 'О нас',
      path: '/about',
      icon: Info,
      category: 'public',
      description: 'История и философия ODE'
    },

    // User navigation
    {
      id: 'my-bookings',
      label: 'Мои бронирования',
      path: '/my-bookings',
      icon: BookOpen,
      category: 'user',
      description: 'История и активные бронирования'
    },
    {
      id: 'dashboard',
      label: 'Профиль',
      path: '/dashboard',
      icon: User,
      category: 'user',
      description: 'Ваш прогресс и награды'
    },
    {
      id: 'cart',
      label: 'Корзина',
      path: '/cart',
      icon: ShoppingCart,
      category: 'user',
      description: 'Ваши заказы'
    },

    // Portal navigation
    {
      id: 'tenants',
      label: 'Арендаторы',
      path: '/tenants',
      icon: Building,
      category: 'portal',
      roles: ['tenant', 'admin'],
      description: 'Портал арендаторов'
    },
    {
      id: 'investors',
      label: 'Инвесторы',
      path: '/investors',
      icon: Award,
      category: 'portal',
      roles: ['investor', 'admin'],
      description: 'Инвестиционные возможности'
    },
    {
      id: 'marketing',
      label: 'Маркетинг',
      path: '/marketing',
      icon: Star,
      category: 'portal',
      roles: ['tenant', 'admin'],
      description: 'Маркетинговые инструменты'
    },
    {
      id: 'digital-ecosystem',
      label: 'Цифровая экосистема',
      path: '/digital-ecosystem',
      icon: Globe,
      category: 'portal',
      roles: ['tenant', 'admin'],
      description: 'Цифровые решения'
    },

    // Admin navigation
    {
      id: 'admin',
      label: 'Админ-панель',
      path: '/admin',
      icon: Settings,
      category: 'admin',
      roles: ['admin'],
      description: 'Управление системой'
    },
    {
      id: 'games-admin',
      label: 'Игры',
      path: '/games-admin',
      icon: Gamepad2,
      category: 'admin',
      roles: ['admin'],
      description: 'Управление играми'
    }
  ];

  // Filter navigation items based on user role and authentication
  const getFilteredNavigationItems = () => {
    return navigationItems.filter(item => {
      // Public items are always visible
      if (item.category === 'public') return true;
      
      // User items require authentication
      if (item.category === 'user' && !isAuthenticated) return false;
      
      // Portal and admin items require specific roles
      if (item.category === 'portal' || item.category === 'admin') {
        if (!isAuthenticated || !userRole) return false;
        if (item.roles && !item.roles.includes(userRole)) return false;
      }
      
      return true;
    });
  };

  const filteredItems = getFilteredNavigationItems();

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav className={cn("bg-white shadow-lg border-b", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img className="h-8 w-8" src="/logo.svg" alt="ODE Food Hall" />
              <span className="ml-2 text-xl font-bold text-gray-900">ODE</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {filteredItems
              .filter(item => item.category === 'public')
              .map(item => (
                <Link
                  key={item.id}
                  to={item.path}
                  className={cn(
                    "text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    location.pathname === item.path && "text-blue-600 bg-blue-50"
                  )}
                >
                  {item.label}
                </Link>
              ))}
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="Поиск..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pr-10"
              />
              <Button
                type="submit"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {/* User Navigation */}
                {filteredItems
                  .filter(item => item.category === 'user')
                  .map(item => (
                    <Link
                      key={item.id}
                      to={item.path}
                      className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      {item.label}
                    </Link>
                  ))}

                {/* Portal Navigation */}
                {filteredItems
                  .filter(item => item.category === 'portal')
                  .map(item => (
                    <Link
                      key={item.id}
                      to={item.path}
                      className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      {item.label}
                    </Link>
                  ))}

                {/* Admin Navigation */}
                {filteredItems
                  .filter(item => item.category === 'admin')
                  .map(item => (
                    <Link
                      key={item.id}
                      to={item.path}
                      className="text-red-600 hover:text-red-700 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      {item.label}
                    </Link>
                  ))}

                {/* User Dropdown */}
                <div className="relative">
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>{user?.email}</span>
                  </Button>
                </div>

                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Выйти
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/auth">
                  <Button variant="outline" size="sm">
                    <LogIn className="h-4 w-4 mr-2" />
                    Войти
                  </Button>
                </Link>
                <Link to="/auth?mode=register">
                  <Button size="sm">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Регистрация
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col h-full">
                  {/* Mobile Logo */}
                  <div className="flex items-center mb-6">
                    <img className="h-8 w-8" src="/logo.svg" alt="ODE Food Hall" />
                    <span className="ml-2 text-xl font-bold">ODE</span>
                  </div>

                  {/* Mobile Search */}
                  <form onSubmit={handleSearch} className="mb-6">
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="Поиск..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pr-10"
                      />
                      <Button
                        type="submit"
                        size="sm"
                        className="absolute right-1 top-1/2 transform -translate-y-1/2"
                      >
                        <Search className="h-4 w-4" />
                      </Button>
                    </div>
                  </form>

                  {/* Mobile Navigation */}
                  <div className="flex-1 overflow-y-auto">
                    <div className="space-y-4">
                      {/* Public Navigation */}
                      <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                          Основное
                        </h3>
                        <div className="space-y-1">
                          {filteredItems
                            .filter(item => item.category === 'public')
                            .map(item => (
                              <Link
                                key={item.id}
                                to={item.path}
                                className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                                onClick={() => setIsMenuOpen(false)}
                              >
                                <item.icon className="h-4 w-4" />
                                <span>{item.label}</span>
                              </Link>
                            ))}
                        </div>
                      </div>

                      {/* User Navigation */}
                      {isAuthenticated && (
                        <div>
                          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                            Личный кабинет
                          </h3>
                          <div className="space-y-1">
                            {filteredItems
                              .filter(item => item.category === 'user')
                              .map(item => (
                                <Link
                                  key={item.id}
                                  to={item.path}
                                  className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                                  onClick={() => setIsMenuOpen(false)}
                                >
                                  <item.icon className="h-4 w-4" />
                                  <span>{item.label}</span>
                                </Link>
                              ))}
                          </div>
                        </div>
                      )}

                      {/* Portal Navigation */}
                      {isAuthenticated && filteredItems.some(item => item.category === 'portal') && (
                        <div>
                          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                            Портал
                          </h3>
                          <div className="space-y-1">
                            {filteredItems
                              .filter(item => item.category === 'portal')
                              .map(item => (
                                <Link
                                  key={item.id}
                                  to={item.path}
                                  className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                                  onClick={() => setIsMenuOpen(false)}
                                >
                                  <item.icon className="h-4 w-4" />
                                  <span>{item.label}</span>
                                </Link>
                              ))}
                          </div>
                        </div>
                      )}

                      {/* Admin Navigation */}
                      {isAuthenticated && filteredItems.some(item => item.category === 'admin') && (
                        <div>
                          <h3 className="text-sm font-semibold text-red-500 uppercase tracking-wider mb-2">
                            Администрирование
                          </h3>
                          <div className="space-y-1">
                            {filteredItems
                              .filter(item => item.category === 'admin')
                              .map(item => (
                                <Link
                                  key={item.id}
                                  to={item.path}
                                  className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => setIsMenuOpen(false)}
                                >
                                  <item.icon className="h-4 w-4" />
                                  <span>{item.label}</span>
                                </Link>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Mobile Auth */}
                  <div className="border-t pt-4">
                    {isAuthenticated ? (
                      <div className="space-y-2">
                        <div className="px-3 py-2 text-sm text-gray-500">
                          {user?.email}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleSignOut}
                          className="w-full"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Выйти
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                          <Button variant="outline" size="sm" className="w-full">
                            <LogIn className="h-4 w-4 mr-2" />
                            Войти
                          </Button>
                        </Link>
                        <Link to="/auth?mode=register" onClick={() => setIsMenuOpen(false)}>
                          <Button size="sm" className="w-full">
                            <UserPlus className="h-4 w-4 mr-2" />
                            Регистрация
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MainNavigation;
