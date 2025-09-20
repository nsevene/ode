// Global application configuration
export const CONFIG = {
  // Demo Mode - disables all real actions and payments
  DEMO_MODE: true,

  // Stripe configuration based on demo mode
  STRIPE: {
    USE_TEST_KEYS: true,
    TEST_PUBLISHABLE_KEY: 'pk_test_...',
    LIVE_PUBLISHABLE_KEY: 'pk_live_...',
  },

  // Features that are disabled in demo mode
  DEMO_DISABLED_FEATURES: {
    PAYMENTS: true,
    BOOKINGS: true,
    LOYALTY_POINTS: true,
    REFERRALS: true,
    LEADERBOARDS: true,
    EDGE_TRIGGERS: true,
    EMAIL_NOTIFICATIONS: true,
  },

  // SEO settings for demo pages
  DEMO_SEO: {
    NOINDEX: true,
    NOFOLLOW: true,
    EXCLUDE_FROM_SITEMAP: true,
  },

  // Portal access control
  PORTAL_PASSWORD_ENABLED: false,
  PORTAL_PASSWORD: 'ode2024',

  // Show all navigation items (even restricted ones) in menu for testing
  SHOW_LOCKED_IN_MENU: true,
} as const;

// User roles enum
export type UserRole = 'tenant' | 'investor' | 'admin' | 'guest';

// Navigation structure based on YAML
export const NAVIGATION_TREE = {
  '/': {
    name: 'Home',
    roles: ['tenant', 'investor', 'internal', 'guest'],
    children: {
      '/storytelling': {
        name: 'Storytelling',
        roles: ['tenant', 'investor', 'internal', 'guest'],
        children: {
          '/storytelling/ode-to-origin': {
            name: 'ODE to Origin',
            roles: ['tenant', 'investor', 'internal', 'guest'],
          },
          '/storytelling/ode-to-bali': {
            name: 'ODE to Bali',
            roles: ['tenant', 'investor', 'internal', 'guest'],
          },
          '/storytelling/ode-to-night': {
            name: 'ODE to Night',
            roles: ['tenant', 'investor', 'internal', 'guest'],
          },
          '/storytelling/ode-to-journey': {
            name: 'ODE to Journey',
            roles: ['tenant', 'investor', 'internal', 'guest'],
          },
        },
      },
      '/tenants': {
        name: 'Tenants',
        roles: ['tenant', 'admin', 'guest'],
        children: {
          '/tenants/overview': {
            name: 'Overview',
            roles: ['tenant', 'admin', 'guest'],
          },
          '/tenants/long-term': {
            name: 'Long-Term Residency',
            roles: ['tenant', 'admin', 'guest'],
          },
          '/tenants/open-kitchen': {
            name: 'Pop-Up Open Kitchen',
            roles: ['tenant', 'admin', 'guest'],
          },
          '/tenants/floor-plan': {
            name: 'Floor Plan',
            roles: ['tenant', 'admin', 'guest'],
          },
          '/tenants/rates': {
            name: 'Rates & Terms',
            roles: ['tenant', 'admin', 'guest'],
          },
          '/tenants/services': {
            name: "What's Included",
            roles: ['tenant', 'admin', 'guest'],
          },
          '/tenants/faq': { name: 'FAQ', roles: ['tenant', 'admin', 'guest'] },
          '/tenants/apply': {
            name: 'Apply',
            roles: ['tenant', 'admin', 'guest'],
          },
          '/tenants/team': {
            name: 'Team',
            roles: ['tenant', 'admin', 'guest'],
          },
        },
      },
      '/investors': {
        name: 'Investors',
        roles: ['investor', 'internal', 'admin'],
        children: {
          '/investors/deck': {
            name: 'Deck',
            roles: ['investor', 'internal', 'admin'],
          },
          '/investors/financial-model': {
            name: 'Financial Model',
            roles: ['investor', 'internal', 'admin'],
          },
          '/investors/ode-by-night': {
            name: 'ODE by Night',
            roles: ['investor', 'internal', 'admin'],
          },
          '/investors/roadmap': {
            name: 'Roadmap',
            roles: ['investor', 'internal', 'admin'],
          },
          '/investors/team': {
            name: 'Team',
            roles: ['investor', 'internal', 'admin'],
          },
          '/investors/opex-breakdown': {
            name: 'OPEX Breakdown',
            roles: ['investor', 'internal', 'admin'],
          },
          '/investors/intro-call': {
            name: 'Intro Call',
            roles: ['investor', 'internal', 'admin'],
          },
        },
      },
      '/marketing': {
        name: 'Marketing',
        roles: ['tenant', 'investor', 'internal', 'admin'],
        children: {
          '/marketing/taste-alley': {
            name: 'Taste Alley',
            roles: ['tenant', 'investor', 'internal', 'admin'],
          },
          '/marketing/events-nightlife': {
            name: 'Events & Nightlife',
            roles: ['tenant', 'investor', 'internal', 'admin'],
          },
          '/marketing/compass-passport': {
            name: 'Compass & Passport',
            roles: ['tenant', 'investor', 'internal', 'admin'],
          },
          '/marketing/breakfast-for-villas': {
            name: 'Breakfast for Villas',
            roles: ['tenant', 'investor', 'internal', 'admin'],
          },
          '/marketing/delivery-partnerships': {
            name: 'Delivery Partnerships',
            roles: ['tenant', 'investor', 'internal', 'admin'],
          },
          '/marketing/pr-digital': {
            name: 'PR & Digital',
            roles: ['tenant', 'investor', 'internal', 'admin'],
          },
          '/marketing/kids-area': {
            name: 'Kids Area',
            roles: ['tenant', 'investor', 'internal', 'admin'],
          },
          '/marketing/event-hall': {
            name: 'Event Hall',
            roles: ['tenant', 'investor', 'internal', 'admin'],
          },
        },
      },
      '/digital-ecosystem': {
        name: 'Digital Ecosystem',
        roles: ['tenant', 'investor', 'internal', 'admin'],
        children: {
          '/digital-ecosystem/compass': {
            name: 'Compass',
            roles: ['tenant', 'investor', 'internal', 'admin'],
          },
          '/digital-ecosystem/app': {
            name: 'App',
            roles: ['tenant', 'investor', 'internal', 'admin'],
          },
          '/digital-ecosystem/guest-website': {
            name: 'Guest Website',
            roles: ['tenant', 'investor', 'internal', 'admin'],
          },
        },
      },
      '/guest-demo': {
        name: 'Guest Demo',
        roles: ['tenant', 'investor', 'internal', 'guest'],
        children: {
          '/guest-demo/unified-menu': {
            name: 'Unified Menu',
            roles: ['tenant', 'investor', 'internal', 'guest'],
          },
          '/guest-demo/order-flow': {
            name: 'Order Flow',
            roles: ['tenant', 'investor', 'internal', 'guest'],
          },
          '/guest-demo/payments': {
            name: 'Payments',
            roles: ['tenant', 'investor', 'internal', 'guest'],
          },
          '/guest-demo/taste-passport': {
            name: 'Taste Passport',
            roles: ['tenant', 'investor', 'internal', 'guest'],
          },
          '/guest-demo/taste-compass': {
            name: 'Taste Compass',
            roles: ['tenant', 'investor', 'internal', 'guest'],
          },
          '/guest-demo/ecosystem-flow': {
            name: 'Ecosystem Flow',
            roles: ['tenant', 'investor', 'internal', 'guest'],
          },
        },
      },
      '/data-room': {
        name: 'Data Room',
        roles: ['investor', 'internal', 'admin'],
        children: {
          '/data-room/contracts': {
            name: 'Contracts',
            roles: ['investor', 'internal', 'admin'],
          },
          '/data-room/financials': {
            name: 'Financials',
            roles: ['investor', 'internal', 'admin'],
          },
          '/data-room/decks': {
            name: 'Decks',
            roles: ['investor', 'internal', 'admin'],
          },
          '/data-room/policies': {
            name: 'Policies',
            roles: ['internal', 'admin'],
          }, // Only internal and admin
          '/data-room/press': {
            name: 'Press',
            roles: ['investor', 'internal', 'admin'],
          },
        },
      },
      '/cms-dashboard': {
        name: 'CMS Dashboard',
        roles: ['admin'],
      },
    },
  },
} as const;

// Helper function to check if user has access to a route
export const hasRouteAccess = (route: string, userRole: UserRole): boolean => {
  // Default access for home page
  if (route === '/') return true;

  // Guest demo is always accessible
  if (route.startsWith('/guest-demo')) return true;

  // Find the route in navigation tree
  const findRoute = (path: string, tree: Record<string, any>): any => {
    for (const [key, value] of Object.entries(tree)) {
      if (key === path) return value;
      if (value && typeof value === 'object' && value.children) {
        const found = findRoute(path, value.children);
        if (found) return found;
      }
    }
    return null;
  };

  const routeConfig = findRoute(route, NAVIGATION_TREE['/'].children);
  if (!routeConfig) return false;

  return (
    Array.isArray(routeConfig.roles) && routeConfig.roles.includes(userRole)
  );
};
