import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, X, Home, Calendar, Wine, Users, Phone, ChefHat, 
  Leaf, Compass, Building, Info, Star, Coffee, Utensils, 
  Store, Map, Award, BookOpen, Gamepad2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export const MobileNavigationEnhanced = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/philosophy', label: 'Philosophy', icon: Leaf },
    { path: '/taste-compass', label: 'Taste Compass', icon: Compass },
    { path: '/chefs-table', label: "Chef's Table", icon: ChefHat },
    { path: '/wine-staircase', label: 'Wine Staircase', icon: Wine },
    { path: '/spaces', label: 'Spaces', icon: Building },
    { path: '/kitchens', label: 'Kitchens', icon: ChefHat },
    { path: '/events', label: 'Events', icon: Calendar },
    { path: '/taste-quest', label: 'Taste Quest', icon: Map },
    { path: '/experiences', label: 'Experiences', icon: Star },
    { path: '/breakfast', label: 'Breakfast', icon: Coffee },
    { path: '/delivery', label: 'Food Delivery', icon: Utensils },
    { path: '/vendors', label: 'For Chefs', icon: Store },
    { path: '/about', label: 'About', icon: Info },
    { path: '/sustainability', label: 'Sustainability', icon: Leaf },
    { path: '/my-bookings', label: 'My Bookings', icon: BookOpen },
    { path: '/dashboard', label: 'Profile', icon: Award },
    { path: '/community', label: 'Community', icon: Users },
    { path: '/contact', label: 'Contact', icon: Phone },
  ];

  const closeSheet = () => setIsOpen(false);

  return (
    <nav className="bg-pure-white/95 backdrop-blur-lg shadow-soft sticky top-0 z-40 border-b border-cream-medium/50">
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
          
          {/* Mobile menu button */}
          <div className="flex items-center">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-charcoal hover:bg-white/10"
                  aria-label="Open mobile menu"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] bg-card border-border">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between pb-4 border-b border-border">
                    <h2 className="text-lg font-semibold text-foreground">Navigation</h2>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={closeSheet}
                      aria-label="Close menu"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  
                  <nav className="flex-1 py-6">
                    <ul className="space-y-2">
                      {navigationItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        
                        return (
                          <li key={item.path}>
                            <Link
                              to={item.path}
                              onClick={closeSheet}
                              className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                                isActive 
                                  ? 'bg-primary text-primary-foreground' 
                                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                              }`}
                              aria-current={isActive ? 'page' : undefined}
                            >
                              <Icon className="h-5 w-5" />
                              <span className="font-medium">{item.label}</span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </nav>
                  
                  <div className="border-t border-border pt-4">
                    <Button 
                      asChild 
                      className="w-full"
                      onClick={closeSheet}
                    >
                      <Link to="/quick-booking">Quick Booking</Link>
                    </Button>
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