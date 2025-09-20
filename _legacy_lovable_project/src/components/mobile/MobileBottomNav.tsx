import { Home, Calendar, MapPin, User, Menu } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const MobileBottomNav = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { path: '#philosophy', icon: Home, label: 'Home', isAnchor: true },
    { path: '#taste-compass', icon: MapPin, label: 'Compass', isAnchor: true },
    { path: '#booking', icon: Calendar, label: 'Book', isAnchor: true },
    { path: '#contact', icon: User, label: 'Contact', isAnchor: true },
  ];

  const menuItems = [
    { path: '/vendors', label: 'For Chefs' },
    { path: '/chefs-table', label: "Chef's Table" },
    { path: '/lounge', label: 'VIP Lounge' },
    { path: '/food-ordering', label: 'Food Delivery' },
    { path: '/events', label: 'Events' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-sage-blue/20 lg:hidden shadow-2xl">
      <div className="flex items-center justify-around py-3 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.isAnchor
            ? false
            : location.pathname === item.path;

          if (item.isAnchor) {
            return (
              <a
                key={item.path}
                href={item.path}
                className={cn(
                  'flex flex-col items-center justify-center py-2 px-3 rounded-2xl transition-all duration-300',
                  'active:scale-95 text-charcoal/60 hover:text-charcoal hover:bg-sage-blue/10 hover:scale-105'
                )}
                onClick={(e) => {
                  e.preventDefault();
                  const target = document.querySelector(item.path);
                  if (target) {
                    target.scrollIntoView({
                      behavior: 'smooth',
                      block: 'start',
                    });
                  }
                }}
              >
                <Icon size={22} className="transition-all duration-300 mb-1" />
                <span className="text-xs font-medium transition-all duration-300">
                  {item.label}
                </span>
              </a>
            );
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex flex-col items-center justify-center py-2 px-3 rounded-2xl transition-all duration-300',
                'active:scale-95',
                isActive
                  ? 'text-forest-green bg-gradient-to-br from-sage-blue/20 to-forest-green/10 shadow-lg scale-105'
                  : 'text-charcoal/60 hover:text-charcoal hover:bg-sage-blue/10 hover:scale-105'
              )}
            >
              <Icon
                size={22}
                className={cn(
                  'transition-all duration-300 mb-1',
                  isActive ? 'drop-shadow-sm' : ''
                )}
              />
              <span
                className={cn(
                  'text-xs font-medium transition-all duration-300',
                  isActive ? 'font-semibold' : ''
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* Menu Button */}
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center justify-center py-2 px-3 rounded-2xl text-charcoal/60 hover:text-charcoal hover:bg-sage-blue/10 hover:scale-105 transition-all duration-300 active:scale-95"
            >
              <Menu size={22} className="mb-1" />
              <span className="text-xs font-medium">Menu</span>
            </Button>
          </SheetTrigger>

          <SheetContent side="right" className="w-80 bg-white">
            <div className="mt-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-charcoal mb-2">
                  ODE FOOD HALL
                </h3>
                <p className="text-sm text-charcoal/70">GASTRO VILLAGE UBUD</p>
              </div>

              <div className="space-y-3">
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-4 rounded-xl text-charcoal hover:bg-gradient-to-r hover:from-sage-blue/10 hover:to-forest-green/10 transition-all duration-300 border border-transparent hover:border-sage-blue/20 font-medium"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="mt-8 p-4 bg-gradient-to-br from-cream-light to-cream-medium rounded-xl">
                <p className="text-sm text-charcoal/70 text-center">
                  From Balinese Roots - Global Routes
                </p>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default MobileBottomNav;
