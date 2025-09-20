// Application constants and configuration
export const APP_CONFIG = {
  name: 'ODE Food Hall',
  version: '1.0.0',
  description: 'Innovative gastro village with 12 food corners',
  url: 'https://odefoodhall.com',
  supportEmail: 'info@odefoodhall.com',
  phone: '+62-XXX-XXXX-XXXX',
  address: {
    street: 'Ubud, Bali',
    country: 'Indonesia',
    coordinates: {
      latitude: -8.5069,
      longitude: 115.2625,
    },
  },
};

// Default admin credentials (for development only)
export const DEFAULT_ADMIN = {
  email: 'admin@odefoodhall.com',
  password: 'Admin123!',
  fullName: 'System Administrator',
  phone: '+62-XXX-XXXX-XXXX',
};

// Test admin credentials (for development only - remove in production)
export const TEST_ADMIN = {
  email: 'test@odefoodhall.com',
  password: 'TestAdmin123!',
  fullName: 'Test Administrator',
  phone: '+62-XXX-XXXX-XXXX',
};

// User roles configuration
export const USER_ROLES = {
  ADMIN: 'admin',
  TENANT: 'tenant',
  INVESTOR: 'investor',
  INTERNAL: 'internal',
  GUEST: 'guest',
} as const;

// Role hierarchy for permissions
export const ROLE_HIERARCHY = {
  [USER_ROLES.GUEST]: 0,
  [USER_ROLES.TENANT]: 1,
  [USER_ROLES.INVESTOR]: 2,
  [USER_ROLES.INTERNAL]: 3,
  [USER_ROLES.ADMIN]: 4,
} as const;

// API endpoints configuration
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },
  USERS: {
    LIST: '/users',
    CREATE: '/users',
    UPDATE: '/users/:id',
    DELETE: '/users/:id',
    ROLES: '/users/:id/roles',
  },
  BOOKINGS: {
    LIST: '/bookings',
    CREATE: '/bookings',
    UPDATE: '/bookings/:id',
    DELETE: '/bookings/:id',
  },
  TENANTS: {
    APPLICATIONS: '/tenant-applications',
    APPROVE: '/tenant-applications/:id/approve',
    REJECT: '/tenant-applications/:id/reject',
  },
} as const;

// Form validation rules
export const VALIDATION_RULES = {
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    MESSAGE: 'Please enter a valid email address',
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    MESSAGE:
      'Password must be at least 8 characters with uppercase, lowercase, number and special character',
  },
  PHONE: {
    PATTERN: /^\+?[\d\s\-\(\)]+$/,
    MESSAGE: 'Please enter a valid phone number',
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
    PATTERN: /^[a-zA-Zа-яА-Я\s\-']+$/,
    MESSAGE:
      'Name must be 2-50 characters and contain only letters, spaces, hyphens and apostrophes',
  },
} as const;

// UI configuration
export const UI_CONFIG = {
  THEME: {
    PRIMARY_COLOR: '#3B82F6',
    SECONDARY_COLOR: '#64748B',
    SUCCESS_COLOR: '#10B981',
    WARNING_COLOR: '#F59E0B',
    ERROR_COLOR: '#EF4444',
  },
  BREAKPOINTS: {
    SM: '640px',
    MD: '768px',
    LG: '1024px',
    XL: '1280px',
    '2XL': '1536px',
  },
  ANIMATION: {
    DURATION: {
      FAST: '150ms',
      NORMAL: '300ms',
      SLOW: '500ms',
    },
  },
} as const;

// Business logic constants
export const BUSINESS_CONFIG = {
  BOOKING: {
    MAX_ADVANCE_DAYS: 30,
    MIN_ADVANCE_HOURS: 2,
    CANCELLATION_HOURS: 24,
  },
  TENANT: {
    APPLICATION_REVIEW_DAYS: 7,
    LEASE_MIN_MONTHS: 6,
    LEASE_MAX_MONTHS: 24,
  },
  PAYMENT: {
    CURRENCY: 'IDR',
    TAX_RATE: 0.11, // 11% VAT in Indonesia
    PROCESSING_FEE: 0.03, // 3% processing fee
  },
} as const;

// Feature flags
export const FEATURE_FLAGS = {
  ENABLE_PWA: true,
  ENABLE_NOTIFICATIONS: true,
  ENABLE_ANALYTICS: true,
  ENABLE_AB_TESTING: false,
  ENABLE_DARK_MODE: false,
  ENABLE_MULTI_LANGUAGE: false,
} as const;

// Error messages
export const ERROR_MESSAGES = {
  NETWORK: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied. Insufficient permissions.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION: 'Please check your input and try again.',
  SERVER: 'Server error. Please try again later.',
  TIMEOUT: 'Request timeout. Please try again.',
  UNKNOWN: 'An unexpected error occurred.',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  USER_CREATED: 'User created successfully.',
  USER_UPDATED: 'User updated successfully.',
  USER_DELETED: 'User deleted successfully.',
  BOOKING_CREATED: 'Booking created successfully.',
  BOOKING_UPDATED: 'Booking updated successfully.',
  BOOKING_CANCELLED: 'Booking cancelled successfully.',
  TENANT_APPLICATION_SUBMITTED: 'Tenant application submitted successfully.',
  TENANT_APPLICATION_APPROVED: 'Tenant application approved.',
  TENANT_APPLICATION_REJECTED: 'Tenant application rejected.',
} as const;
