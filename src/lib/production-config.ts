// Production configuration for ODE Food Hall
// This file contains production-ready settings

export const PRODUCTION_CONFIG = {
  // Application settings
  APP_NAME: 'ODE Food Hall',
  APP_VERSION: '1.0.0',
  APP_DESCRIPTION: 'Innovative gastro village with 12 food corners',
  
  // URLs and domains
  BASE_URL: 'https://odefoodhall.com',
  API_BASE_URL: 'https://odefoodhall.com/api',
  ADMIN_URL: 'https://odefoodhall.com/admin',
  
  // Contact information
  SUPPORT_EMAIL: 'info@odefoodhall.com',
  ADMIN_EMAIL: 'admin@odefoodhall.com',
  PHONE: '+62-XXX-XXXX-XXXX',
  
  // Address
  ADDRESS: {
    street: 'Ubud, Bali',
    country: 'Indonesia',
    coordinates: {
      latitude: -8.5069,
      longitude: 115.2625
    }
  },
  
  // Business settings
  BUSINESS: {
    OPENING_DATE: '2025-12-01',
    OPERATING_HOURS: {
      OPEN: '10:00',
      CLOSE: '23:00',
      DAYS: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    CURRENCY: 'IDR',
    TAX_RATE: 0.11, // 11% VAT in Indonesia
    PROCESSING_FEE: 0.03 // 3% processing fee
  },
  
  // Security settings
  SECURITY: {
    SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
    PASSWORD_MIN_LENGTH: 8,
    PASSWORD_REQUIREMENTS: {
      UPPERCASE: true,
      LOWERCASE: true,
      NUMBERS: true,
      SPECIAL_CHARS: true
    },
    MAX_LOGIN_ATTEMPTS: 5,
    LOCKOUT_DURATION: 15 * 60 * 1000 // 15 minutes
  },
  
  // Feature flags for production
  FEATURES: {
    ENABLE_PWA: true,
    ENABLE_NOTIFICATIONS: true,
    ENABLE_ANALYTICS: true,
    ENABLE_AB_TESTING: false,
    ENABLE_DARK_MODE: false,
    ENABLE_MULTI_LANGUAGE: false,
    ENABLE_GUEST_MODE: true,
    ENABLE_BOOKING: true,
    ENABLE_PAYMENTS: true,
    ENABLE_TENANT_APPLICATIONS: true
  },
  
  // API endpoints
  API_ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      REFRESH: '/auth/refresh',
      FORGOT_PASSWORD: '/auth/forgot-password',
      RESET_PASSWORD: '/auth/reset-password'
    },
    USERS: {
      LIST: '/users',
      CREATE: '/users',
      UPDATE: '/users/:id',
      DELETE: '/users/:id',
      ROLES: '/users/:id/roles'
    },
    BOOKINGS: {
      LIST: '/bookings',
      CREATE: '/bookings',
      UPDATE: '/bookings/:id',
      DELETE: '/bookings/:id',
      CANCEL: '/bookings/:id/cancel'
    },
    TENANTS: {
      APPLICATIONS: '/tenant-applications',
      APPROVE: '/tenant-applications/:id/approve',
      REJECT: '/tenant-applications/:id/reject'
    },
    SPACES: {
      LIST: '/spaces',
      AVAILABILITY: '/spaces/:id/availability',
      BOOK: '/spaces/:id/book'
    }
  },
  
  // Validation rules
  VALIDATION: {
    EMAIL: {
      PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      MESSAGE: 'Please enter a valid email address'
    },
    PASSWORD: {
      MIN_LENGTH: 8,
      PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      MESSAGE: 'Password must be at least 8 characters with uppercase, lowercase, number and special character'
    },
    PHONE: {
      PATTERN: /^\+?[\d\s\-\(\)]+$/,
      MESSAGE: 'Please enter a valid phone number'
    },
    NAME: {
      MIN_LENGTH: 2,
      MAX_LENGTH: 50,
      PATTERN: /^[a-zA-Zа-яА-Я\s\-']+$/,
      MESSAGE: 'Name must be 2-50 characters and contain only letters, spaces, hyphens and apostrophes'
    }
  },
  
  // Error messages
  ERROR_MESSAGES: {
    NETWORK: 'Network error. Please check your connection.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    FORBIDDEN: 'Access denied. Insufficient permissions.',
    NOT_FOUND: 'The requested resource was not found.',
    VALIDATION: 'Please check your input and try again.',
    SERVER: 'Server error. Please try again later.',
    TIMEOUT: 'Request timeout. Please try again.',
    UNKNOWN: 'An unexpected error occurred.'
  },
  
  // Success messages
  SUCCESS_MESSAGES: {
    USER_CREATED: 'User created successfully.',
    USER_UPDATED: 'User updated successfully.',
    USER_DELETED: 'User deleted successfully.',
    BOOKING_CREATED: 'Booking created successfully.',
    BOOKING_UPDATED: 'Booking updated successfully.',
    BOOKING_CANCELLED: 'Booking cancelled successfully.',
    TENANT_APPLICATION_SUBMITTED: 'Tenant application submitted successfully.',
    TENANT_APPLICATION_APPROVED: 'Tenant application approved.',
    TENANT_APPLICATION_REJECTED: 'Tenant application rejected.'
  },
  
  // UI settings
  UI: {
    THEME: {
      PRIMARY_COLOR: '#3B82F6',
      SECONDARY_COLOR: '#64748B',
      SUCCESS_COLOR: '#10B981',
      WARNING_COLOR: '#F59E0B',
      ERROR_COLOR: '#EF4444'
    },
    BREAKPOINTS: {
      SM: '640px',
      MD: '768px',
      LG: '1024px',
      XL: '1280px',
      '2XL': '1536px'
    },
    ANIMATION: {
      DURATION: {
        FAST: '150ms',
        NORMAL: '300ms',
        SLOW: '500ms'
      }
    }
  }
};

// Environment-specific configuration
export const getConfig = () => {
  const env = import.meta.env.MODE;
  
  switch (env) {
    case 'production':
      return PRODUCTION_CONFIG;
    case 'development':
      return {
        ...PRODUCTION_CONFIG,
        BASE_URL: 'http://localhost:5173',
        API_BASE_URL: 'http://localhost:5173/api',
        FEATURES: {
          ...PRODUCTION_CONFIG.FEATURES,
          ENABLE_AB_TESTING: true,
          ENABLE_DARK_MODE: true
        }
      };
    case 'test':
      return {
        ...PRODUCTION_CONFIG,
        BASE_URL: 'http://localhost:3000',
        API_BASE_URL: 'http://localhost:3000/api',
        FEATURES: {
          ...PRODUCTION_CONFIG.FEATURES,
          ENABLE_ANALYTICS: false
        }
      };
    default:
      return PRODUCTION_CONFIG;
  }
};

export default getConfig();
