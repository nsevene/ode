import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, X, Home, Calendar, MapPin, Users, Wine, Camera, ChefHat, 
  Gamepad2, User, Settings, LogIn, LogOut, BookOpen, Award, Map, 
  Store, Utensils, Compass, Building, Star, Leaf, Info, Coffee
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import i18n from '@/lib/i18n';
import { useAuth } from '@/hooks/useAuth';
import { useRoles } from '@/hooks/useRoles';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import LanguageSwitcher from '../LanguageSwitcher';
import { NotificationCenter } from '../NotificationCenter';
import { NavigationItem } from '@/types/common';
import { cn } from '@/lib/utils';

interface UnifiedNavigationProps {
  variant?: 'main' | 'portal' | 'mobile-bottom';
  className?: string;
}

export const UnifiedNavigation: React.FC<UnifiedNavigationProps> = ({ 
  variant = 'main', 
  className 
}) => {
  const { t } = useTranslation();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { userRole } = useRoles();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const navigationItems: NavigationItem[] = [
    // Main navigation items
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

    // Secondary navigation
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
      description: 'Полное меню food hall'
    },
    { 
      href: '/kitchens', 
      label: 'Kitchens', 
      icon: ChefHat, 
      category: 'secondary',
      description: '12 кухонных корнеров'
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
      description: 'Quest through 8 sectors with NFC passports'
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

    // User section
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

    // Admin section
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

  const handleAnchorClick = (href: string, e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    closeMenu();
  };

  const renderNavItem = (item: NavigationItem, compact = false) => {
    const active = isActive(item.href);
    const Icon = item.icon;

    const content = (
      <>
        <Icon className={cn(
          "transition-transform group-hover:scale-110",
          compact ? "w-4 h-4" : "w-5 h-5",
          active ? "text-primary" : ""
        )} />
        <span className={cn(
          "transition-colors",
          compact ? "text-sm" : "font-medium",
          active ? "text-primary font-semibold" : ""
        )}>
          {item.label}
        </span>
        {item.badge && (
          <Badge variant="secondary" className="text-xs ml-auto">
            {item.badge}
          </Badge>
        )}
      </>
    );

    const className = cn(
      "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group",
      active 
        ? "bg-primary/10 text-primary shadow-soft" 
        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
      item.isCallToAction && !active && "bg-gradient-to-r from-primary to-secondary text-white hover:from-primary/90 hover:to-secondary/90"
    );

    if (item.isAnchor) {
      return (
        <a
          key={item.href}
          href={item.href}
          className={className}
          onClick={(e) => handleAnchorClick(item.href, e)}
        >
          {content}
        </a>
      );
    }

    return (
      <Link
        key={item.href}
        to={item.href}
        className={className}
        onClick={closeMenu}
      >
        {content}
      </Link>
    );
  };

  // Mobile Bottom Navigation variant
  if (variant === 'mobile-bottom') {
    const bottomNavItems = [
      { path: "#philosophy", icon: Home, label: "Home", isAnchor: true },
      { path: "#taste-compass", icon: MapPin, label: "Compass", isAnchor: true },
      { path: "#booking", icon: Calendar, label: "Book", isAnchor: true },
      { path: "#contact", icon: User, label: "Contact", isAnchor: true },
    ];

    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-t border-border lg:hidden shadow-elegant">
        <div className="flex items-center justify-around py-2 px-2">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            
            return (
              <a
                key={item.path}
                href={item.path}
                className="flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all duration-300 active:scale-95 text-muted-foreground hover:text-foreground hover:bg-accent hover:scale-105"
                onClick={(e) => handleAnchorClick(item.path, e)}
              >
                <Icon size={20} className="transition-all duration-300 mb-1" />
                <span className="text-xs font-medium transition-all duration-300">
                  {item.label}
                </span>
              </a>
            );
          })}
          
          {/* Menu Button */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all duration-300 active:scale-95"
              >
                <Menu size={20} className="mb-1" />
                <span className="text-xs font-medium">Menu</span>
              </Button>
            </SheetTrigger>
            
            <SheetContent side="right" className="w-80">
              <div className="mt-6 space-y-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2">ODE FOOD HALL</h3>
                  <p className="text-sm text-muted-foreground">GASTRO VILLAGE UBUD</p>
                </div>
                
                <div className="space-y-2">
                  {getItemsByCategory('secondary').map((item) => renderNavItem(item, true))}
                </div>
                
                {user && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      {getItemsByCategory('user').map((item) => renderNavItem(item, true))}
                    </div>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    );
  }

  // Portal Navigation variant
  if (variant === 'portal') {
    return (
      <nav className={cn("bg-card border-r border-border", className)}>
        <div className="p-6">
          <Link to="/" className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg"></div>
            <span className="font-bold text-xl">ODE Portal</span>
          </Link>
          
          <div className="space-y-2">
            {navigationItems.filter(item => 
              item.category === 'secondary' || 
              (user && item.category === 'user') ||
              (userRole === 'admin' && item.category === 'admin')
            ).map((item) => renderNavItem(item, true))}
          </div>
          
          {/* User Section */}
          {user && (
            <div className="mt-8 pt-4 border-t border-border">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{user.email}</div>
                  <div className="text-xs text-muted-foreground">
                    {userRole || 'guest'}
                  </div>
                </div>
                <button
                  onClick={signOut}
                  className="p-1 hover:bg-destructive/10 hover:text-destructive rounded transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>
    );
  }

  // Main Navigation variant (default)
  return (
    <>
      {/* Desktop Navigation */}
      <nav className={cn(
        "bg-card/95 backdrop-blur-lg shadow-soft sticky top-0 z-40 border-b border-border transition-all duration-300 hover:shadow-medium",
        className
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center hover:scale-105 transition-all duration-300 group">
                <div className="flex flex-col justify-center">
                  <div className="text-xl font-bold text-foreground group-hover:text-primary transition-colors leading-tight">ODE</div>
                </div>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-6">
              {getItemsByCategory('primary').map((item) => renderNavItem(item))}

              {/* More Menu */}
              <div className="relative group">
                <button className="flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-300">
                  <Menu className="w-4 h-4" />
                  <span>More</span>
                </button>
                
                <div className="absolute top-full right-0 mt-2 w-56 bg-card/95 backdrop-blur-lg rounded-xl shadow-elegant border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <div className="py-2 space-y-1">
                    {getItemsByCategory('secondary').map((item) => renderNavItem(item, true))}
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
            <div className="lg:hidden flex items-center">
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                
                <SheetContent side="right" className="w-80">
                  <div className="space-y-6">
                    {/* Main Navigation */}
                    <div>
                      <h3 className="font-semibold text-sm text-muted-foreground mb-3 uppercase tracking-wide">
                        Main
                      </h3>
                      <div className="space-y-1">
                        {[...getItemsByCategory('primary'), ...getItemsByCategory('secondary')].map((item) => 
                          renderNavItem(item, true)
                        )}
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
                            {getItemsByCategory('user').map((item) => renderNavItem(item, true))}
                          </div>
                        </div>
                      </>
                    )}
                    
                    <Separator />
                    
                    {/* Language & Auth */}
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-sm text-muted-foreground mb-3 uppercase tracking-wide">
                          Settings
                        </h3>
                        <LanguageSwitcher 
                          currentLanguage={i18n.language as 'en' | 'zh' | 'es' | 'de' | 'id' | 'ms'} 
                          onLanguageChange={(lang) => i18n.changeLanguage(lang)} 
                        />
                      </div>

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
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      {isMobile && <UnifiedNavigation variant="mobile-bottom" />}
    </>
  );
};