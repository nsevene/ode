import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { useRoles } from '@/hooks/useRoles';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  Coffee,
  Bell,
  Search,
  Globe,
} from 'lucide-react';
import LanguageSwitcher from '../LanguageSwitcher';
import { NotificationCenter } from '../NotificationCenter';

interface NavigationItem {
  href: string;
  label: string;
  icon: React.ComponentType<any>;
  category: 'primary' | 'secondary' | 'portal' | 'admin';
  roles?: string[];
  badge?: string;
  description?: string;
}

interface EnhancedNavigationProps {
  variant?: 'main' | 'portal' | 'mobile-bottom';
  className?: string;
}

export const EnhancedNavigation: React.FC<EnhancedNavigationProps> = ({
  variant = 'main',
  className,
}) => {
  const { t } = useTranslation();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { userRole } = useRoles();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState(0);

  const navigationItems: NavigationItem[] = [
    // Main navigation
    {
      href: '/philosophy',
      label: t('nav.philosophy'),
      icon: Leaf,
      category: 'primary',
      description: 'Learn about our philosophy',
    },
    {
      href: '#taste-compass',
      label: t('nav.tasteCompass'),
      icon: Compass,
      category: 'primary',
      description: 'Explore taste sectors',
    },
    {
      href: '/kitchens',
      label: t('nav.kitchens'),
      icon: ChefHat,
      category: 'primary',
      description: 'Discover our kitchens',
    },
    {
      href: '/spaces',
      label: t('nav.spaces'),
      icon: MapPin,
      category: 'primary',
      description: 'View our spaces',
    },
    {
      href: '/experiences',
      label: t('nav.experiences'),
      icon: Star,
      category: 'primary',
      description: 'Unique experiences',
    },

    // Portal navigation
    {
      href: '/tenants',
      label: 'Tenants',
      icon: Building,
      category: 'portal',
      roles: ['tenant', 'admin'],
      description: 'Tenant portal',
    },
    {
      href: '/investors',
      label: 'Investors',
      icon: Award,
      category: 'portal',
      roles: ['investor', 'admin'],
      description: 'Investment opportunities',
    },
    {
      href: '/marketing',
      label: 'Marketing',
      icon: Star,
      category: 'portal',
      roles: ['tenant', 'admin'],
      description: 'Marketing tools',
    },
    {
      href: '/digital-ecosystem',
      label: 'Digital',
      icon: Globe,
      category: 'portal',
      roles: ['tenant', 'investor', 'admin'],
      description: 'Digital ecosystem',
    },
    {
      href: '/data-room',
      label: 'Data Room',
      icon: BookOpen,
      category: 'portal',
      roles: ['investor', 'admin'],
      description: 'Confidential documents',
    },
  ];

  const filteredItems = navigationItems.filter((item) => {
    if (item.roles && userRole && !item.roles.includes(userRole)) return false;
    if (
      searchQuery &&
      !item.label.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  const getCategoryItems = (category: string) =>
    filteredItems.filter((item) => item.category === category);

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.2 },
    },
  };

  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      className={cn(
        'sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b',
        className
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">
                  O
                </span>
              </div>
              <span className="font-bold text-xl">ODE</span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {getCategoryItems('primary').map((item, index) => (
              <motion.div
                key={item.href}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={item.href}
                  className={cn(
                    'flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200',
                    'hover:bg-primary/10 hover:text-primary',
                    location.pathname === item.href &&
                      'bg-primary/10 text-primary'
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="ml-1">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
              className="hidden md:block"
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-64 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </motion.div>

            {/* Notifications */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                {notifications > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {notifications}
                  </Badge>
                )}
              </Button>
            </motion.div>

            {/* Language Switcher */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <LanguageSwitcher />
            </motion.div>

            {/* User Menu */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6 }}
            >
              {user ? (
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon">
                    <User className="w-5 h-5" />
                  </Button>
                  <Button onClick={signOut} variant="outline" size="sm">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button asChild>
                  <Link to="/auth">
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </Link>
                </Button>
              )}
            </motion.div>

            {/* Mobile Menu Button */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.7 }}
              className="md:hidden"
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              variants={navVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="md:hidden border-t py-4"
            >
              <div className="space-y-2">
                {filteredItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={cn(
                        'flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200',
                        'hover:bg-primary/10 hover:text-primary',
                        location.pathname === item.href &&
                          'bg-primary/10 text-primary'
                      )}
                    >
                      <item.icon className="w-5 h-5" />
                      <div>
                        <div className="font-medium">{item.label}</div>
                        {item.description && (
                          <div className="text-sm text-muted-foreground">
                            {item.description}
                          </div>
                        )}
                      </div>
                      {item.badge && (
                        <Badge variant="secondary" className="ml-auto">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Notification Center */}
      <NotificationCenter />
    </motion.nav>
  );
};

export default EnhancedNavigation;
