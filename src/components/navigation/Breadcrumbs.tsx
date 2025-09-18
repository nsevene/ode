import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  className?: string;
  items?: BreadcrumbItem[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ className, items }) => {
  const location = useLocation();
  
  // Generate breadcrumbs from current path if no items provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Главная', href: '/' }
    ];

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;
      
      breadcrumbs.push({
        label: getSegmentLabel(segment),
        href: isLast ? undefined : currentPath
      });
    });

    return breadcrumbs;
  };

  const getSegmentLabel = (segment: string): string => {
    const labels: Record<string, string> = {
      'admin': 'Админ-панель',
      'vendors': 'Вендоры',
      'events': 'События',
      'profile': 'Профиль',
      'orders': 'Заказы',
      'bookings': 'Бронирования',
      'settings': 'Настройки',
      'users': 'Пользователи',
      'analytics': 'Аналитика',
      'reports': 'Отчеты',
      'dashboard': 'Панель управления',
      'guest-demo': 'Демо-режим',
      'storytelling': 'Истории',
      'tenants': 'Арендаторы',
      'investors': 'Инвесторы',
      'marketing': 'Маркетинг',
      'digital-ecosystem': 'Цифровая экосистема'
    };

    return labels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
  };

  const breadcrumbItems = items || generateBreadcrumbs();

  return (
    <nav className={cn('flex items-center space-x-1 text-sm text-gray-500', className)}>
      {breadcrumbItems.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <ChevronRight className="h-4 w-4 text-gray-400" />
          )}
          {item.href ? (
            <Link
              to={item.href}
              className="hover:text-gray-700 transition-colors"
            >
              {index === 0 && <Home className="h-4 w-4 mr-1 inline" />}
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs;