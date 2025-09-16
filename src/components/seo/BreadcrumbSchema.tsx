import { JsonLd } from './JsonLd';
import { useLocation } from 'react-router-dom';

interface BreadcrumbItem {
  name: string;
  url: string;
}

const breadcrumbMap: Record<string, BreadcrumbItem[]> = {
  '/': [
    { name: 'Главная', url: '/' }
  ],
  '/chefs-table': [
    { name: 'Главная', url: '/' },
    { name: "Chef's Table", url: '/chefs-table' }
  ],
  '/taste-compass': [
    { name: 'Главная', url: '/' },
    { name: 'Taste Compass', url: '/taste-compass' }
  ],
  '/wine-staircase': [
    { name: 'Главная', url: '/' },
    { name: 'Wine Staircase', url: '/wine-staircase' }
  ],
  '/events': [
    { name: 'Главная', url: '/' },
    { name: 'События', url: '/events' }
  ],
  '/photos': [
    { name: 'Главная', url: '/' },
    { name: 'Фотогалерея', url: '/photos' }
  ],
  '/lounge': [
    { name: 'Главная', url: '/' },
    { name: 'VIP Lounge', url: '/lounge' }
  ],
  '/my-bookings': [
    { name: 'Главная', url: '/' },
    { name: 'Мои бронирования', url: '/my-bookings' }
  ]
};

export const BreadcrumbSchema = () => {
  const location = useLocation();
  const breadcrumbs = breadcrumbMap[location.pathname] || breadcrumbMap['/'];
  
  if (breadcrumbs.length <= 1) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": {
        "@type": "Thing",
        "@id": `${window.location.origin}${item.url}`,
        "name": item.name
      }
    }))
  };

  return <JsonLd data={schema} />;
};

// Компонент для отображения навигационных хлебных крошек
export const BreadcrumbNavigation = () => {
  const location = useLocation();
  const breadcrumbs = breadcrumbMap[location.pathname] || breadcrumbMap['/'];
  
  if (breadcrumbs.length <= 1) return null;

  return (
    <nav aria-label="Хлебные крошки" className="py-4">
      <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
        {breadcrumbs.map((item, index) => (
          <li key={item.url} className="flex items-center">
            {index > 0 && <span className="mx-2">/</span>}
            {index === breadcrumbs.length - 1 ? (
              <span className="text-foreground font-medium">{item.name}</span>
            ) : (
              <a 
                href={item.url} 
                className="hover:text-foreground transition-colors"
              >
                {item.name}
              </a>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};