import { toast } from 'sonner';

// Error types
export enum ErrorType {
  NETWORK = 'NETWORK',
  VALIDATION = 'VALIDATION',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  NOT_FOUND = 'NOT_FOUND',
  SERVER = 'SERVER',
  UNKNOWN = 'UNKNOWN',
}

export interface AppError {
  type: ErrorType;
  message: string;
  code?: string;
  details?: any;
  timestamp: Date;
  userMessage?: string;
}

// Error class for application errors
export class AppErrorClass extends Error {
  public readonly type: ErrorType;
  public readonly code?: string;
  public readonly details?: any;
  public readonly timestamp: Date;
  public readonly userMessage?: string;

  constructor(
    type: ErrorType,
    message: string,
    code?: string,
    details?: any,
    userMessage?: string
  ) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.code = code;
    this.details = details;
    this.timestamp = new Date();
    this.userMessage = userMessage;
  }
}

// Error handler function
export const handleError = (error: unknown): AppError => {
  console.error('Error occurred:', error);

  // Supabase errors
  if (error && typeof error === 'object' && 'message' in error) {
    const supabaseError = error as any;
    
    if (supabaseError.code === 'PGRST116') {
      return new AppErrorClass(
        ErrorType.NOT_FOUND,
        'Resource not found',
        'NOT_FOUND',
        supabaseError,
        'The requested item could not be found'
      );
    }
    
    if (supabaseError.code === '23505') {
      return new AppErrorClass(
        ErrorType.VALIDATION,
        'Duplicate entry',
        'DUPLICATE',
        supabaseError,
        'This item already exists'
      );
    }
    
    if (supabaseError.code === '23503') {
      return new AppErrorClass(
        ErrorType.VALIDATION,
        'Foreign key constraint violation',
        'FOREIGN_KEY',
        supabaseError,
        'Cannot delete this item as it is referenced by other records'
      );
    }
  }

  // Network errors
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return new AppErrorClass(
      ErrorType.NETWORK,
      'Network connection failed',
      'NETWORK_ERROR',
      error,
      'Please check your internet connection and try again'
    );
  }

  // Validation errors
  if (error && typeof error === 'object' && 'issues' in error) {
    return new AppErrorClass(
      ErrorType.VALIDATION,
      'Validation failed',
      'VALIDATION_ERROR',
      error,
      'Please check your input and try again'
    );
  }

  // Authentication errors
  if (error && typeof error === 'object' && 'status' in error && (error as any).status === 401) {
    return new AppErrorClass(
      ErrorType.AUTHENTICATION,
      'Authentication failed',
      'AUTH_ERROR',
      error,
      'Please log in again'
    );
  }

  // Authorization errors
  if (error && typeof error === 'object' && 'status' in error && (error as any).status === 403) {
    return new AppErrorClass(
      ErrorType.AUTHORIZATION,
      'Access denied',
      'AUTHZ_ERROR',
      error,
      'You do not have permission to perform this action'
    );
  }

  // Server errors
  if (error && typeof error === 'object' && 'status' in error && (error as any).status >= 500) {
    return new AppErrorClass(
      ErrorType.SERVER,
      'Server error',
      'SERVER_ERROR',
      error,
      'Something went wrong on our end. Please try again later'
    );
  }

  // Default error
  return new AppErrorClass(
    ErrorType.UNKNOWN,
    error instanceof Error ? error.message : 'An unknown error occurred',
    'UNKNOWN_ERROR',
    error,
    'Something went wrong. Please try again'
  );
};

// Error display function
export const displayError = (error: AppError): void => {
  const userMessage = error.userMessage || error.message;
  
  switch (error.type) {
    case ErrorType.NETWORK:
      toast.error(userMessage, {
        description: 'Please check your internet connection',
        duration: 5000,
      });
      break;
      
    case ErrorType.VALIDATION:
      toast.error(userMessage, {
        description: 'Please check your input',
        duration: 4000,
      });
      break;
      
    case ErrorType.AUTHENTICATION:
      toast.error(userMessage, {
        description: 'Please log in again',
        duration: 4000,
      });
      break;
      
    case ErrorType.AUTHORIZATION:
      toast.error(userMessage, {
        description: 'Contact support if you believe this is an error',
        duration: 5000,
      });
      break;
      
    case ErrorType.NOT_FOUND:
      toast.error(userMessage, {
        description: 'The item may have been removed',
        duration: 4000,
      });
      break;
      
    case ErrorType.SERVER:
      toast.error(userMessage, {
        description: 'We are working to fix this issue',
        duration: 6000,
      });
      break;
      
    default:
      toast.error(userMessage, {
        description: 'Please try again or contact support',
        duration: 5000,
      });
  }
};

// Error logging function
export const logError = (error: AppError, context?: string): void => {
  const logData = {
    type: error.type,
    message: error.message,
    code: error.code,
    details: error.details,
    timestamp: error.timestamp,
    context,
    userAgent: navigator.userAgent,
    url: window.location.href,
  };

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error logged:', logData);
  }

  // In production, you would send this to your logging service
  // Example: sendToLoggingService(logData);
};

// Error boundary error handler
export const handleErrorBoundaryError = (error: Error, errorInfo: any): AppError => {
  const appError = new AppErrorClass(
    ErrorType.UNKNOWN,
    error.message,
    'BOUNDARY_ERROR',
    { error, errorInfo },
    'Something went wrong. Please refresh the page'
  );

  logError(appError, 'Error Boundary');
  return appError;
};

// Async error handler wrapper
export const withErrorHandling = <T extends any[], R>(
  fn: (...args: T) => Promise<R>
) => {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args);
    } catch (error) {
      const appError = handleError(error);
      logError(appError);
      displayError(appError);
      throw appError;
    }
  };
};

// Error recovery strategies
export const getErrorRecoveryStrategy = (error: AppError): (() => void) | null => {
  switch (error.type) {
    case ErrorType.NETWORK:
      return () => {
        // Retry the operation
        window.location.reload();
      };
      
    case ErrorType.AUTHENTICATION:
      return () => {
        // Redirect to login
        window.location.href = '/auth';
      };
      
    case ErrorType.NOT_FOUND:
      return () => {
        // Redirect to home
        window.location.href = '/';
      };
      
    default:
      return null;
  }
};

// Error monitoring hook
export const useErrorMonitoring = () => {
  const reportError = (error: AppError, context?: string) => {
    logError(error, context);
    
    // In production, you would send this to your error monitoring service
    // Example: Sentry.captureException(error);
  };

  const handleAsyncError = (error: unknown, context?: string) => {
    const appError = handleError(error);
    reportError(appError, context);
    displayError(appError);
  };

  return {
    reportError,
    handleAsyncError,
  };
};
