import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Home,
  Calendar, 
  MapPin, 
  Users, 
  Wine, 
  Camera,
  ChefHat,
  Gamepad2,
  User,
  Settings,
  LogIn,
  LogOut,
  BookOpen,
  Award,
  Map,
  Store,
  Utensils,
  Compass,
  Building,
  Star,
  Leaf,
  Info,
  Coffee
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import i18n from '@/lib/i18n';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import LanguageSwitcher from './LanguageSwitcher';
import { NotificationCenter } from './NotificationCenter';
import { NavigationItem } from '@/types/common';

const ImprovedNavigation = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const navigationItems: NavigationItem[] = [
    // Main navigation items (primary - shown in desktop)
    { 
      href: "/philosophy", 
      label: "Philosophy", 
      icon: Leaf, 
      category: 'primary'
    },
    { 
      href: "#taste-compass", 
      label: "Taste Compass", 
      icon: Compass, 
      category: 'primary',
      isAnchor: true
    },
    { 
      href: "#food-corners", 
      label: "Food Corners", 
      icon: ChefHat, 
      category: 'primary',
      isAnchor: true
    },
    { 
      href: "#contact", 
      label: "Contact", 
      icon: MapPin, 
      category: 'primary',
      isAnchor: true
    },
    { 
      href: "#booking", 
      label: "Book Now", 
      icon: Calendar, 
      category: 'primary',
      badge: "Reserve",
      isAnchor: true,
      isCallToAction: true
    },

    // Secondary navigation (moved to mobile burger)
    { 
      href: '/events', 
      label: 'Events', 
      icon: Calendar, 
      category: 'secondary',
      description: 'Upcoming events and workshops'
    },
    { 
      href: '/menu', 
      label: 'Menu', 
      icon: ChefHat, 
      category: 'secondary',
      description: 'Полное меню food hall с зонированием'
    },
    { 
      href: '/kitchens', 
      label: 'Kitchens', 
      icon: ChefHat, 
      category: 'secondary',
      description: '12 кухонных корнеров + Gelato & Mercato'
    },
    { 
      href: '/spaces', 
      label: 'Spaces', 
      icon: Building, 
      category: 'secondary',
      description: 'Ground Floor + 2nd Floor зоны'
    },
    { 
      href: '/about', 
      label: 'About', 
      icon: Info, 
      category: 'secondary',
      description: 'ODE history and philosophy'
    },
    { 
      href: '/taste-quest',
      label: 'Taste Quest', 
      icon: Map, 
      badge: 'NFC',
      category: 'secondary',
      description: 'Taste Alley - quest through 8 sectors with NFC passports'
    },
    { 
      href: '/experiences', 
      label: 'Experiences', 
      icon: Star, 
      category: 'secondary',
      description: 'Специальные кулинарные опыты'
    },
    { 
      href: '/breakfast', 
      label: 'Breakfast', 
      icon: Coffee, 
      category: 'secondary',
      description: 'Завтраки в зале и доставка на виллы'
    },
    { 
      href: '/breakfast-for-villas', 
      label: 'Breakfast for Villas', 
      icon: Home, 
      category: 'secondary',
      description: 'Партнёрская программа для вилл и отелей'
    },
    { 
      href: '/delivery', 
      label: 'Delivery', 
      icon: Utensils, 
      category: 'secondary',
      description: 'Доставка блюд'
    },
    { 
      href: '/vendors', 
      label: 'Vendors', 
      icon: Store, 
      category: 'secondary',
      description: 'Become Vendor - аренда корнеров'
    },
    { 
      href: '/chefs-table', 
      label: "Chef's Table", 
      icon: ChefHat, 
      badge: 'VIP',
      category: 'secondary',
      description: '6-course эксклюзивный опыт'
    },
    { 
      href: '/sustainability', 
      label: 'Sustainability', 
      icon: Leaf, 
      category: 'secondary',
      description: 'Zero-waste инициативы'
    },

    // Пользовательские страницы
    { 
      href: '/my-bookings', 
      label: 'Bookings', 
      icon: BookOpen, 
      category: 'user',
      description: 'История и активные бронирования'
    },
    { 
      href: '/dashboard', 
      label: 'Profile', 
      icon: Award, 
      category: 'user',
      description: 'Your progress and rewards'
    },

    // Админ панель
    { 
      href: '/admin', 
      label: 'Administration', 
      icon: Settings, 
      category: 'admin',
      description: 'Управление системой'
    },
    { 
      href: '/games-admin', 
      label: 'Games', 
      icon: Gamepad2, 
      category: 'admin',
      description: 'Управление играми и квестами'
    },
  ];

  const getItemsByCategory = (category: string) => 
    navigationItems.filter(item => item.category === category);

  const isActive = (href: string) => location.pathname === href;

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      {/* Desktop Navigation */}
      <nav role="navigation" aria-label="Main navigation" className="bg-pure-white/95 backdrop-blur-lg shadow-soft sticky top-0 z-40 border-b border-cream-medium/50 transition-all duration-300 hover:shadow-medium">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center hover:scale-105 transition-all duration-300 group">
                <div className="flex flex-col justify-center">
                  <div className="text-xl font-bold text-charcoal group-hover:text-forest-green transition-colors leading-tight">ODE</div>
                </div>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-8">
              {getItemsByCategory('primary').map((item) => (
                item.isAnchor ? (
                  <a
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 relative group hover-scale ${
                      item.isCallToAction
                        ? 'bg-gradient-to-r from-primary to-secondary text-white hover:from-primary/90 hover:to-secondary/90 shadow-medium'
                        : 'text-charcoal hover:text-forest-green hover:bg-gradient-to-r hover:from-cream-light/70 hover:to-sage-blue/20'
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      const target = document.querySelector(item.href);
                      if (target) {
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                  >
                    <item.icon className={`w-4 h-4 transition-transform group-hover:scale-110`} />
                    <span className="story-link">{item.label}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="text-xs ml-1">
                        {item.badge}
                      </Badge>
                    )}
                  </a>
                ) : (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 relative group hover-scale ${
                      isActive(item.href)
                        ? 'text-forest-green bg-gradient-to-r from-sage-blue/20 to-forest-green/10 shadow-soft'
                        : 'text-charcoal hover:text-forest-green hover:bg-gradient-to-r hover:from-cream-light/70 hover:to-sage-blue/20'
                    }`}
                  >
                    <item.icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive(item.href) ? 'text-forest-green' : ''}`} />
                    <span className="story-link">{item.label}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="text-xs ml-1">
                        {item.badge}
                      </Badge>
                    )}
                    {isActive(item.href) && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-forest-green rounded-full" />
                    )}
                  </Link>
                )
              ))}

              {/* Burger Menu for Secondary Items */}
              <div className="relative group">
                <button className="flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium text-charcoal hover:text-forest-green hover:bg-gradient-to-r hover:from-cream-light/70 hover:to-sage-blue/20 transition-all duration-300">
                  <Menu className="w-4 h-4" />
                  <span>More</span>
                </button>
                
                <div className="absolute top-full right-0 mt-2 w-56 bg-cream-light/95 backdrop-blur-lg rounded-xl shadow-elegant border border-gold-accent/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <div className="py-2">
                    {getItemsByCategory('secondary').map((item) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        className={`flex items-center space-x-3 px-4 py-3 text-sm transition-colors ${
                          isActive(item.href) 
                            ? 'bg-primary/10 text-primary' 
                            : 'text-charcoal hover:bg-cream-light/50'
                        }`}
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.label}</span>
                        {item.badge && (
                          <Badge variant="secondary" className="text-xs ml-auto">
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* User Menu */}
            <div className="hidden lg:flex items-center space-x-4">
              <LanguageSwitcher 
                currentLanguage={i18n.language as 'en' | 'zh' | 'es' | 'de' | 'id' | 'ms'}
                onLanguageChange={(lang) => i18n.changeLanguage(lang)} 
              />
              {user && <NotificationCenter />}
              
              {user ? (
                <div className="flex items-center space-x-3">
                  <Link to="/my-bookings">
                    <Button variant="outline" size="sm">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Bookings
                    </Button>
                  </Link>
                  <Button onClick={signOut} variant="ghost" size="sm">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Link to="/auth">
                  <Button size="sm">
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center space-x-2">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-gray-700 hover:text-primary hover:bg-primary/5"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-cream-light/95 backdrop-blur-lg border-b border-gold-accent/20 shadow-elegant max-h-[80vh] overflow-y-auto z-30">
            <div className="px-4 py-6 space-y-6">
              
              {/* Main Navigation */}
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground mb-3 uppercase tracking-wide">
                  Main
                </h3>
                <div className="space-y-1">
                  {[...getItemsByCategory('primary'), ...getItemsByCategory('secondary')].map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive(item.href) 
                          ? 'bg-primary/10 text-primary' 
                          : 'text-charcoal hover:bg-cream-light/50'
                      }`}
                      onClick={closeMenu}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="text-xs ml-auto">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  ))}
                </div>
              </div>


              {user && (
                <>
                  <Separator />
                  
                  {/* User Section */}
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground mb-3 uppercase tracking-wide">
                      Account
                    </h3>
                    <div className="space-y-1">
                      {getItemsByCategory('user').map((item) => (
                        <Link
                          key={item.href}
                          to={item.href}
                          className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                            isActive(item.href) 
                              ? 'bg-primary/10 text-primary' 
                              : 'text-charcoal hover:bg-cream-light/50'
                          }`}
                          onClick={closeMenu}
                        >
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </>
              )}
              
              
              <Separator />
              
              {/* Language Switcher */}
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground mb-3 uppercase tracking-wide">
                  Language
                </h3>
                <div className="px-4">
                  <LanguageSwitcher 
                    currentLanguage={i18n.language as 'en' | 'zh' | 'es' | 'de' | 'id' | 'ms'} 
                    onLanguageChange={(lang) => i18n.changeLanguage(lang)} 
                  />
                </div>
              </div>

              <Separator />

              {/* Auth Section */}
              <div>
                {user ? (
                  <Button 
                    onClick={() => { signOut(); closeMenu(); }} 
                    variant="outline" 
                    className="w-full justify-start"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Sign Out
                  </Button>
                ) : (
                  <Link to="/auth" onClick={closeMenu}>
                    <Button className="w-full justify-start">
                      <LogIn className="w-4 h-4 mr-3" />
                      Sign In
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Enhanced Mobile Bottom Navigation */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-cream-light/95 backdrop-blur-lg border-t border-gold-accent/20 pb-safe shadow-elegant">
          <div className="grid grid-cols-5 h-16">
            {[
              { path: '/', icon: Home, name: 'Home' },
              { path: '/taste-quest', icon: MapPin, name: 'Quest' },
              { path: '/about', icon: Info, name: 'About' },
              { path: '/my-bookings', icon: BookOpen, name: 'Bookings' },
              { path: '/auth', icon: User, name: 'Profile' },
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center gap-1 p-2 transition-all duration-300 group ${
                  isActive(item.path)
                    ? 'text-primary bg-gradient-to-t from-primary/10 to-gold-accent/10' 
                    : 'text-muted-foreground hover:text-foreground hover:scale-105'
                }`}
              >
                <item.icon className={`h-5 w-5 group-hover:scale-110 transition-transform`} />
                <span className="text-xs leading-none">{item.name}</span>
                {isActive(item.path) && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                )}
              </Link>
            ))}
          </div>
          
        </div>
      )}
    </>
  );
};

export default ImprovedNavigation;