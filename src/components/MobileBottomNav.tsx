import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { 
  Home, 
  Menu, 
  Calendar, 
  User, 
  MapPin,
  Heart,
  Bell,
  Search
} from 'lucide-react';

interface MobileBottomNavProps {
  className?: string;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ className }) => {
  const location = useLocation();
  const { isAuthenticated, role } = useAuthStore();
  
  const navItems = [
    { 
      path: '/', 
      icon: Home, 
      label: 'Home',
      ariaLabel: 'Go to home page',
      roles: ['guest', 'tenant', 'investor', 'admin', 'internal']
    },
    { 
      path: '/menu', 
      icon: Menu, 
      label: 'Menu',
      ariaLabel: 'View menu',
      roles: ['guest', 'tenant', 'investor', 'admin', 'internal']
    },
    { 
      path: '/spaces', 
      icon: MapPin, 
      label: 'Spaces',
      ariaLabel: 'View spaces',
      roles: ['guest', 'tenant', 'investor', 'admin', 'internal']
    },
    { 
      path: '/my-bookings', 
      icon: Calendar, 
      label: 'Bookings',
      ariaLabel: 'View bookings',
      roles: ['tenant', 'investor', 'admin', 'internal']
    },
    { 
      path: isAuthenticated ? '/profile' : '/auth', 
      icon: User, 
      label: isAuthenticated ? 'Profile' : 'Login',
      ariaLabel: isAuthenticated ? 'View profile' : 'Login to your account',
      roles: ['guest', 'tenant', 'investor', 'admin', 'internal']
    },
  ].filter(item => !item.roles || item.roles.includes(role || 'guest'));

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav 
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50",
        "bg-white border-t border-gray-200",
        "md:hidden",
        className
      )}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex justify-around py-2">
        {navItems.map(({ path, icon: Icon, label, ariaLabel }) => (
          <Link
            key={path}
            to={path}
            className={cn(
              "flex flex-col items-center py-2 px-3 rounded-lg",
              "transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              isActive(path)
                ? "text-primary bg-primary/10"
                : "text-gray-600 hover:text-primary hover:bg-primary/5"
            )}
            aria-label={ariaLabel}
            aria-current={isActive(path) ? 'page' : undefined}
          >
            <motion.div
              animate={isActive(path) ? { scale: 1.1 } : { scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <Icon className="w-5 h-5" />
            </motion.div>
            <span className="text-xs mt-1 font-medium">{label}</span>
            
            {/* Active indicator */}
            {isActive(path) && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
              />
            )}
          </Link>
        ))}
      </div>
    </nav>
  );
};

// Mobile navigation with additional features
export const EnhancedMobileBottomNav: React.FC<MobileBottomNavProps> = ({ className }) => {
  const location = useLocation();
  
  const primaryItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/menu', icon: Menu, label: 'Menu' },
    { path: '/spaces', icon: MapPin, label: 'Spaces' },
  ];

  const secondaryItems = [
    { path: '/bookings', icon: Calendar, label: 'Bookings' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav 
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50",
        "bg-white border-t border-gray-200",
        "md:hidden",
        className
      )}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Primary navigation */}
      <div className="flex justify-around py-2">
        {primaryItems.map(({ path, icon: Icon, label }) => (
          <Link
            key={path}
            to={path}
            className={cn(
              "flex flex-col items-center py-2 px-3 rounded-lg",
              "transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              isActive(path)
                ? "text-primary bg-primary/10"
                : "text-gray-600 hover:text-primary hover:bg-primary/5"
            )}
            aria-label={`Go to ${label}`}
            aria-current={isActive(path) ? 'page' : undefined}
          >
            <motion.div
              animate={isActive(path) ? { scale: 1.1 } : { scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <Icon className="w-5 h-5" />
            </motion.div>
            <span className="text-xs mt-1 font-medium">{label}</span>
          </Link>
        ))}
      </div>
      
      {/* Secondary navigation */}
      <div className="flex justify-center py-1 border-t border-gray-100">
        {secondaryItems.map(({ path, icon: Icon, label }) => (
          <Link
            key={path}
            to={path}
            className={cn(
              "flex items-center py-1 px-3 rounded-lg",
              "transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              isActive(path)
                ? "text-primary bg-primary/10"
                : "text-gray-500 hover:text-primary hover:bg-primary/5"
            )}
            aria-label={`Go to ${label}`}
            aria-current={isActive(path) ? 'page' : undefined}
          >
            <Icon className="w-4 h-4 mr-1" />
            <span className="text-xs font-medium">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};
