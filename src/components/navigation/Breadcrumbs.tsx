import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  path: string;
  isActive?: boolean;
}

interface BreadcrumbsProps {
  className?: string;
  customItems?: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ 
  className,
  customItems 
}) => {
  const location = useLocation();

  // Get breadcrumb items from current path
  const getBreadcrumbItems = (): BreadcrumbItem[] => {
    if (customItems) return customItems;

    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Главная', path: '/' }
    ];

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;
      
      breadcrumbs.push({
        label: getSegmentLabel(segment),
        path: currentPath,
        isActive: isLast
      });
    });

    return breadcrumbs;
  };

  // Convert URL segment to readable label
  const getSegmentLabel = (segment: string): string => {
    const labelMap: Record<string, string> = {
      'admin': 'Админ-панель',
      'dashboard': 'Панель управления',
      'my-bookings': 'Мои бронирования',
      'menu': 'Меню',
      'events': 'События',
      'kitchens': 'Кухни',
      'spaces': 'Пространства',
      'experiences': 'Опыты',
      'taste-compass': 'Taste Compass',
      'about': 'О нас',
      'tenants': 'Арендаторы',
      'investors': 'Инвесторы',
      'marketing': 'Маркетинг',
      'digital-ecosystem': 'Цифровая экосистема',
      'games-admin': 'Управление играми',
      'auth': 'Аутентификация',
      'profile': 'Профиль',
      'settings': 'Настройки',
      'bookings': 'Бронирования',
      'orders': 'Заказы',
      'cart': 'Корзина',
      'checkout': 'Оформление заказа',
      'payment': 'Оплата',
      'success': 'Успешно',
      'cancelled': 'Отменено',
      'overview': 'Обзор',
      'long-term': 'Долгосрочная аренда',
      'open-kitchen': 'Открытая кухня',
      'rates': 'Тарифы',
      'services': 'Услуги',
      'floor-plan': 'Планировка',
      'faq': 'Часто задаваемые вопросы',
      'team': 'Команда',
      'apply': 'Подать заявку',
      'marketing-budget': 'Маркетинговый бюджет',
      'setup': 'Настройка',
      'promote': 'Назначить администратора',
      'users': 'Пользователи',
      'analytics': 'Аналитика',
      'reports': 'Отчеты',
      'notifications': 'Уведомления',
      'data': 'Данные',
      'export': 'Экспорт',
      'import': 'Импорт',
      'backup': 'Резервное копирование',
      'restore': 'Восстановление',
      'logs': 'Логи',
      'security': 'Безопасность',
      'permissions': 'Разрешения',
      'roles': 'Роли',
      'settings': 'Настройки',
      'configuration': 'Конфигурация',
      'maintenance': 'Обслуживание',
      'monitoring': 'Мониторинг',
      'performance': 'Производительность',
      'optimization': 'Оптимизация',
      'testing': 'Тестирование',
      'debug': 'Отладка',
      'development': 'Разработка',
      'staging': 'Тестовая среда',
      'production': 'Продакшен',
      'deployment': 'Развертывание',
      'migration': 'Миграция',
      'upgrade': 'Обновление',
      'downgrade': 'Откат',
      'rollback': 'Откат изменений',
      'revert': 'Отменить',
      'undo': 'Отменить',
      'redo': 'Повторить',
      'refresh': 'Обновить',
      'reload': 'Перезагрузить',
      'restart': 'Перезапустить',
      'stop': 'Остановить',
      'start': 'Запустить',
      'pause': 'Приостановить',
      'resume': 'Возобновить',
      'cancel': 'Отменить',
      'confirm': 'Подтвердить',
      'approve': 'Одобрить',
      'reject': 'Отклонить',
      'accept': 'Принять',
      'decline': 'Отклонить',
      'submit': 'Отправить',
      'save': 'Сохранить',
      'edit': 'Редактировать',
      'update': 'Обновить',
      'create': 'Создать',
      'add': 'Добавить',
      'remove': 'Удалить',
      'delete': 'Удалить',
      'archive': 'Архивировать',
      'unarchive': 'Разархивировать',
      'hide': 'Скрыть',
      'show': 'Показать',
      'view': 'Просмотр',
      'preview': 'Предварительный просмотр',
      'download': 'Скачать',
      'upload': 'Загрузить',
      'share': 'Поделиться',
      'copy': 'Копировать',
      'paste': 'Вставить',
      'cut': 'Вырезать',
      'select': 'Выбрать',
      'deselect': 'Отменить выбор',
      'toggle': 'Переключить',
      'switch': 'Переключить',
      'change': 'Изменить',
      'modify': 'Изменить',
      'adjust': 'Настроить',
      'configure': 'Настроить',
      'customize': 'Настроить',
      'personalize': 'Персонализировать',
      'optimize': 'Оптимизировать',
      'improve': 'Улучшить',
      'enhance': 'Улучшить',
      'upgrade': 'Обновить',
      'update': 'Обновить',
      'refresh': 'Обновить',
      'renew': 'Обновить',
      'restore': 'Восстановить',
      'recover': 'Восстановить',
      'repair': 'Исправить',
      'fix': 'Исправить',
      'resolve': 'Решить',
      'solve': 'Решить',
      'handle': 'Обработать',
      'process': 'Обработать',
      'execute': 'Выполнить',
      'run': 'Запустить',
      'start': 'Начать',
      'begin': 'Начать',
      'initiate': 'Инициировать',
      'launch': 'Запустить',
      'activate': 'Активировать',
      'enable': 'Включить',
      'disable': 'Отключить',
      'deactivate': 'Деактивировать',
      'suspend': 'Приостановить',
      'resume': 'Возобновить',
      'continue': 'Продолжить',
      'proceed': 'Продолжить',
      'advance': 'Продвинуться',
      'progress': 'Прогресс',
      'status': 'Статус',
      'state': 'Состояние',
      'condition': 'Условие',
      'situation': 'Ситуация',
      'context': 'Контекст',
      'environment': 'Окружение',
      'atmosphere': 'Атмосфера',
      'mood': 'Настроение',
      'feeling': 'Чувство',
      'emotion': 'Эмоция',
      'sentiment': 'Настроение',
      'attitude': 'Отношение',
      'perspective': 'Перспектива',
      'viewpoint': 'Точка зрения',
      'opinion': 'Мнение',
      'belief': 'Убеждение',
      'conviction': 'Убеждение',
      'principle': 'Принцип',
      'value': 'Ценность',
      'priority': 'Приоритет',
      'importance': 'Важность',
      'significance': 'Значимость',
      'relevance': 'Релевантность',
      'pertinence': 'Уместность',
      'applicability': 'Применимость',
      'suitability': 'Подходящность',
      'appropriateness': 'Уместность',
      'correctness': 'Правильность',
      'accuracy': 'Точность',
      'precision': 'Точность',
      'exactness': 'Точность',
      'clarity': 'Ясность',
      'clearness': 'Ясность',
      'transparency': 'Прозрачность',
      'openness': 'Открытость',
      'honesty': 'Честность',
      'integrity': 'Целостность',
      'authenticity': 'Аутентичность',
      'genuineness': 'Подлинность',
      'originality': 'Оригинальность',
      'uniqueness': 'Уникальность',
      'distinctiveness': 'Отличительность',
      'specialness': 'Особенность',
      'peculiarity': 'Особенность',
      'characteristic': 'Характеристика',
      'feature': 'Функция',
      'function': 'Функция',
      'capability': 'Возможность',
      'ability': 'Способность',
      'skill': 'Навык',
      'talent': 'Талант',
      'gift': 'Дар',
      'strength': 'Сила',
      'power': 'Сила',
      'energy': 'Энергия',
      'force': 'Сила',
      'influence': 'Влияние',
      'impact': 'Влияние',
      'effect': 'Эффект',
      'result': 'Результат',
      'outcome': 'Результат',
      'consequence': 'Последствие',
      'implication': 'Последствие',
      'significance': 'Значимость',
      'importance': 'Важность',
      'relevance': 'Релевантность',
      'pertinence': 'Уместность',
      'applicability': 'Применимость',
      'suitability': 'Подходящность',
      'appropriateness': 'Уместность',
      'correctness': 'Правильность',
      'accuracy': 'Точность',
      'precision': 'Точность',
      'exactness': 'Точность',
      'clarity': 'Ясность',
      'clearness': 'Ясность',
      'transparency': 'Прозрачность',
      'openness': 'Открытость',
      'honesty': 'Честность',
      'integrity': 'Целостность',
      'authenticity': 'Аутентичность',
      'genuineness': 'Подлинность',
      'originality': 'Оригинальность',
      'uniqueness': 'Уникальность',
      'distinctiveness': 'Отличительность',
      'specialness': 'Особенность',
      'peculiarity': 'Особенность',
      'characteristic': 'Характеристика',
      'feature': 'Функция',
      'function': 'Функция',
      'capability': 'Возможность',
      'ability': 'Способность',
      'skill': 'Навык',
      'talent': 'Талант',
      'gift': 'Дар',
      'strength': 'Сила',
      'power': 'Сила',
      'energy': 'Энергия',
      'force': 'Сила',
      'influence': 'Влияние',
      'impact': 'Влияние',
      'effect': 'Эффект',
      'result': 'Результат',
      'outcome': 'Результат',
      'consequence': 'Последствие',
      'implication': 'Последствие'
    };

    return labelMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
  };

  const breadcrumbItems = getBreadcrumbItems();

  // Don't show breadcrumbs on home page
  if (breadcrumbItems.length <= 1) return null;

  return (
    <nav className={cn("bg-gray-50 border-b", className)} aria-label="Breadcrumb">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-2 py-3">
          <ol className="flex items-center space-x-2">
            {breadcrumbItems.map((item, index) => (
              <li key={item.path} className="flex items-center">
                {index > 0 && (
                  <ChevronRight className="h-4 w-4 text-gray-400 mx-2" />
                )}
                {item.isActive ? (
                  <span className="text-gray-500 text-sm font-medium">
                    {item.label}
                  </span>
                ) : (
                  <Link
                    to={item.path}
                    className="text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors"
                  >
                    {index === 0 ? (
                      <div className="flex items-center">
                        <Home className="h-4 w-4 mr-1" />
                        {item.label}
                      </div>
                    ) : (
                      item.label
                    )}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </nav>
  );
};

export default Breadcrumbs;
