// Development error cleanup utility
// This will help remove console.log statements in production

const isDevelopment = import.meta.env.MODE === 'development';

// Safe console methods that only work in development
export const devLog = isDevelopment ? console.log : () => {};
export const devWarn = isDevelopment ? console.warn : () => {};
export const devError = isDevelopment ? console.error : () => {};

// Production-safe error reporting
export const reportError = (error: Error | string, context?: string) => {
  if (isDevelopment) {
    console.error(`Error in ${context || 'unknown context'}:`, error);
  } else {
    // In production, you might want to send to error tracking service
    // Example: Sentry.captureException(error);
  }
};

// Validation helper
export const validateRequired = (value: any, fieldName: string): boolean => {
  if (value === null || value === undefined || value === '') {
    devWarn(`Required field missing: ${fieldName}`);
    return false;
  }
  return true;
};

// Safe URL validation
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    devWarn(`Invalid URL: ${url}`);
    return false;
  }
};

// Form validation helper
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = emailRegex.test(email);
  if (!isValid) {
    devWarn(`Invalid email format: ${email}`);
  }
  return isValid;
};

// Link validation helper
export const validateInternalLink = (path: string): string => {
  // Ensure path starts with /
  if (!path.startsWith('/')) {
    devWarn(`Internal link should start with /: ${path}`);
    return `/${path}`;
  }
  return path;
};

export default {
  devLog,
  devWarn,
  devError,
  reportError,
  validateRequired,
  isValidUrl,
  validateEmail,
  validateInternalLink,
};
