import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface BrokenLinkCheckerProps {
  links: Array<{
    path: string;
    label: string;
    type: 'internal' | 'external';
    status?: 'working' | 'broken' | 'unknown';
  }>;
}

const BrokenLinkChecker: React.FC<BrokenLinkCheckerProps> = ({ links }) => {
  const [checkedLinks, setCheckedLinks] = React.useState<typeof links>([]);
  const [isChecking, setIsChecking] = React.useState(false);

  const checkLinks = async () => {
    setIsChecking(true);
    const results = await Promise.all(
      links.map(async (link) => {
        try {
          if (link.type === 'internal') {
            // For internal links, just check if they exist in our routing
            const internalRoutes = [
              '/',
              '/taste-compass',
              '/quick-booking',
              '/wine-staircase',
              '/virtual-tour',
              '/events',
              '/my-bookings',
              '/auth',
              '/dashboard',
              '/food-ordering',
              '/vendors',
              '/blog',
              '/chefs-table',
              '/lounge',
            ];
            const status: 'working' | 'broken' = internalRoutes.includes(
              link.path
            )
              ? 'working'
              : 'broken';
            return { ...link, status };
          } else {
            // For external links, try to fetch
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            const response = await fetch(link.path, {
              method: 'HEAD',
              mode: 'no-cors',
              signal: controller.signal,
            });
            clearTimeout(timeoutId);

            return { ...link, status: 'working' as const };
          }
        } catch (error) {
          return { ...link, status: 'broken' as const };
        }
      })
    );

    setCheckedLinks(results);
    setIsChecking(false);
  };

  const brokenLinks = checkedLinks.filter((link) => link.status === 'broken');

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Проверка ссылок</h3>
          <Button onClick={checkLinks} disabled={isChecking}>
            {isChecking ? 'Проверяем...' : 'Проверить ссылки'}
          </Button>
        </div>

        {checkedLinks.length > 0 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {checkedLinks.filter((l) => l.status === 'working').length}
                </div>
                <div className="text-sm text-green-600">Рабочие ссылки</div>
              </div>

              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {brokenLinks.length}
                </div>
                <div className="text-sm text-red-600">Сломанные ссылки</div>
              </div>

              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {checkedLinks.length}
                </div>
                <div className="text-sm text-blue-600">Всего проверено</div>
              </div>
            </div>

            {brokenLinks.length > 0 && (
              <div className="mt-6">
                <h4 className="font-semibold text-red-600 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Требуют исправления:
                </h4>
                <div className="space-y-2">
                  {brokenLinks.map((link, index) => (
                    <div
                      key={index}
                      className="p-3 bg-red-50 rounded-lg flex justify-between items-center"
                    >
                      <div>
                        <span className="font-medium">{link.label}</span>
                        <span className="text-sm text-gray-600 ml-2">
                          ({link.path})
                        </span>
                      </div>
                      <span className="text-xs bg-red-100 px-2 py-1 rounded">
                        {link.type === 'internal' ? 'Внутренняя' : 'Внешняя'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// All links found in the application
export const allAppLinks = [
  // Navigation links
  { path: '/', label: 'Home', type: 'internal' as const },
  { path: '/taste-compass', label: 'Taste Compass', type: 'internal' as const },
  { path: '/quick-booking', label: 'Quick Booking', type: 'internal' as const },
  {
    path: '/wine-staircase',
    label: 'Wine Staircase',
    type: 'internal' as const,
  },
  { path: '/virtual-tour', label: 'Virtual Tour', type: 'internal' as const },
  { path: '/events', label: 'Events', type: 'internal' as const },
  {
    path: '/my-bookings',
    label: 'Мои бронирования',
    type: 'internal' as const,
  },
  { path: '/auth', label: 'Авторизация', type: 'internal' as const },
  { path: '/dashboard', label: 'Панель управления', type: 'internal' as const },
  { path: '/food-ordering', label: 'Заказ еды', type: 'internal' as const },
  { path: '/vendors', label: 'Для поваров', type: 'internal' as const },
  { path: '/blog', label: 'Блог', type: 'internal' as const },
  { path: '/chefs-table', label: "Chef's Table", type: 'internal' as const },
  { path: '/lounge', label: 'VIP Lounge', type: 'internal' as const },
  {
    path: '/virtual-tour-fallback',
    label: 'Fallback тур',
    type: 'internal' as const,
  },

  // External links
  {
    path: 'https://wa.me/79251234567',
    label: 'WhatsApp',
    type: 'external' as const,
  },
  {
    path: 'https://instagram.com/odefoodhall',
    label: 'Instagram',
    type: 'external' as const,
  },
  {
    path: 'mailto:selena@odefoodhall.com',
    label: 'Email главный',
    type: 'external' as const,
  },
  {
    path: 'mailto:selena@odefoodhall.com',
    label: 'Email вендоров',
    type: 'external' as const,
  },
  { path: 'tel:+6281943286395', label: 'Телефон', type: 'external' as const },
];

export default BrokenLinkChecker;
