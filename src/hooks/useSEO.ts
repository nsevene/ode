import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOPageData {
  title: string;
  description: string;
  keywords: string;
  image?: string;
  type?: 'website' | 'article' | 'profile' | 'experience';
}

const pageDataMap: Record<string, SEOPageData> = {
  '/': {
    title: 'ODE Food Hall — Gastro Village Ubud',
    description: '12 food corners, Wine Staircase tastings, Taste Compass quests. Book now!',
    keywords: 'ODE Food Hall Ubud, food hall Bali, wine tasting Ubud, Taste Compass, Chef\'s Table, gastro village Ubud, restaurants Bali',
    image: '/lovable-uploads/f87f7680-1120-438b-9064-7951f566be15.png'
  },
  '/chefs-table': {
    title: "Chef's Table - Exclusive Culinary Experience | ODE Food Hall Ubud",
    description: 'Book exclusive Chef\'s Table at ODE Food Hall. 6-course tasting dinner with wine pairing. Maximum 6 guests. Premium dining experience in Ubud.',
    keywords: "Chef's Table Ubud, tasting menu, wine pairing, exclusive dinner, fine dining Bali",
    type: 'experience',
    image: '/src/assets/chefs-table.jpg'
  },
  '/taste-compass': {
    title: 'Taste Compass - Interactive Culinary Journey | ODE Food Hall Ubud',
    description: 'Experience unique Taste Compass at ODE Food Hall. Explore 8 culinary sectors, collect rewards and discover new flavors. Interactive dining adventure.',
    keywords: 'Taste Compass Ubud, culinary journey, interactive experience, NFC passport, food adventure',
    type: 'experience',
    image: '/src/assets/food-overview.jpg'
  },
  '/wine-staircase': {
    title: 'Wine Staircase - Винная лестница Terroir',
    description: 'Откройте для себя Wine Staircase в ODE Food Hall. Уникальная коллекция вин, дегустации и винные ужины в атмосферном винном погребе.',
    keywords: 'Wine Staircase, винная лестница, дегустация вин, винный погреб, Terroir',
    type: 'experience',
    image: '/src/assets/wine-staircase.jpg'
  },
  '/events': {
    title: 'События и мероприятия',
    description: 'Актуальные события в ODE Food Hall. Кулинарные мастер-классы, винные дегустации, тематические ужины и специальные мероприятия.',
    keywords: 'события, мероприятия, мастер-классы, дегустации, тематические ужины',
    image: '/src/assets/food-hall-interior.jpg'
  },
  '/my-bookings': {
    title: 'Мои бронирования',
    description: 'Управляйте своими бронированиями в ODE Food Hall. Просматривайте, изменяйте и отменяйте резервации.',
    keywords: 'мои бронирования, управление бронированиями, резервации',
    type: 'profile'
  },
  '/auth': {
    title: 'Вход в систему',
    description: 'Войдите в свой аккаунт ODE Food Hall для управления бронированиями, накопления баллов лояльности и доступа к эксклюзивным предложениям.',
    keywords: 'вход, регистрация, аккаунт, авторизация'
  },
  '/photos': {
    title: 'ODE Food Hall Photo Gallery Ubud — Atmosphere and Interiors',
    description: 'Photo gallery of ODE Food Hall in Ubud. See our unique interiors, signature dishes, events and atmosphere of the gastronomic complex in tropical jungle.',
    keywords: 'ODE Food Hall photo gallery, Ubud restaurant photos, interiors, dishes, atmosphere, restaurant design'
  },
  '/lounge': {
    title: 'VIP Lounge ODE Food Hall — Exclusive Rest Area in Ubud',
    description: 'VIP Lounge at ODE Food Hall Ubud. Private area with personal service, exclusive menu and panoramic view of tropical jungle.',
    keywords: 'VIP Lounge Ubud, exclusive area, personal service, privacy, VIP restaurant Bali',
    type: 'experience',
    image: '/src/assets/vip-lounge.jpg'
  },
  '/community': {
    title: 'Сообщество ODE Food Hall — Социальные функции и достижения',
    description: 'Присоединяйтесь к сообществу ODE Food Hall. Делитесь опытом, участвуйте в квестах, получайте достижения и общайтесь с другими гурманами.',
    keywords: 'сообщество, социальные функции, достижения, квесты, геймификация'
  },
  '/admin': {
    title: 'Панель администратора — ODE Food Hall',
    description: 'Административная панель для управления ODE Food Hall',
    keywords: 'админ панель, управление, администрирование'
  },
  '/performance': {
    title: 'Производительность — ODE Food Hall',
    description: 'Мониторинг производительности ODE Food Hall',
    keywords: 'производительность, мониторинг, аналитика'
  },
  '/vendors': {
    title: 'Стать арендатором — Присоединяйтесь к ODE Food Hall Ubud',
    description: 'Open your restaurant at ODE Food Hall Ubud. Premium location, high customer flow 500-800/day, marketing support. Apply for culinary space rental.',
    keywords: 'restaurant rental Ubud, food hall tenant, open restaurant Bali, culinary space, restaurant franchise',
    image: '/src/assets/food-hall-interior.jpg'
  },
  '/food-ordering': {
    title: 'Заказ еды онлайн — Доставка от ODE Food Hall Ubud',
    description: 'Order food delivery from the best chefs at ODE Food Hall. Fresh Asian and European cuisine dishes. Fast delivery in Ubud.',
    keywords: 'food order Ubud, food delivery Bali, online restaurant order, home food Ubud'
  },
  '/quick-booking': {
    title: 'Quick Booking — ODE Food Hall Ubud',
    description: 'Book a table at ODE Food Hall in 30 seconds. Choose date, time and number of guests. Instant confirmation.',
    keywords: 'quick restaurant booking, book table Ubud, online reservation',
    type: 'experience'
  },
  '/virtual-tour': {
    title: 'Виртуальный тур — Explore ODE Food Hall Online',
    description: '360° virtual tour of ODE Food Hall Ubud. Explore all 8 culinary sectors, Wine Staircase and VIP areas from home.',
    keywords: 'виртуальный тур ресторан, 360 обзор, онлайн экскурсия ODE Food Hall'
  }
};

export const useSEO = () => {
  const location = useLocation();

  const getPageData = (pathname: string): SEOPageData => {
    return pageDataMap[pathname] || {
      title: 'ODE Food Hall',
      description: 'Innovative gastronomic complex in Ubud with unique culinary experiences.',
      keywords: 'ODE Food Hall, gastronomy, Ubud, restaurant, culinary experiences'
    };
  };

  // Track page views for SEO analytics
  useEffect(() => {
    // Send page view to analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'G-XXXXXXXXXX', {
        page_path: location.pathname,
        page_title: document.title,
      });
    }
  }, [location]);

  return {
    getPageData,
    currentPageData: getPageData(location.pathname)
  };
};