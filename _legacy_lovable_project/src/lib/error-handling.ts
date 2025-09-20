import { ERROR_MESSAGES } from './constants';

// Error types
export enum ErrorType {
  NETWORK = 'NETWORK',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION = 'VALIDATION',
  SERVER = 'SERVER',
  TIMEOUT = 'TIMEOUT',
  UNKNOWN = 'UNKNOWN',
}

// Custom error class
export class AppError extends Error {
  public readonly type: ErrorType;
  public readonly code?: string;
  public readonly statusCode?: number;
  public readonly details?: any;

  constructor(
    message: string,
    type: ErrorType = ErrorType.UNKNOWN,
    code?: string,
    statusCode?: number,
    details?: any
  ) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

// Error handler class
export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorLog: Array<{
    timestamp: number;
    error: AppError;
    context?: string;
    userAgent?: string;
  }> = [];

  private constructor() {}

  public static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  // Handle different types of errors
  public handleError(error: unknown, context?: string): AppError {
    let appError: AppError;

    if (error instanceof AppError) {
      appError = error;
    } else if (error instanceof Error) {
      appError = this.parseError(error);
    } else {
      appError = new AppError(
        'An unexpected error occurred',
        ErrorType.UNKNOWN,
        'UNKNOWN_ERROR'
      );
    }

    // Log error
    this.logError(appError, context);

    return appError;
  }

  // Parse different error types
  private parseError(error: Error): AppError {
    const message = error.message.toLowerCase();

    // Network errors
    if (message.includes('network') || message.includes('fetch')) {
      return new AppError(
        ERROR_MESSAGES.NETWORK,
        ErrorType.NETWORK,
        'NETWORK_ERROR'
      );
    }

    // Timeout errors
    if (message.includes('timeout')) {
      return new AppError(
        ERROR_MESSAGES.TIMEOUT,
        ErrorType.TIMEOUT,
        'TIMEOUT_ERROR'
      );
    }

    // Validation errors
    if (message.includes('validation') || message.includes('invalid')) {
      return new AppError(
        ERROR_MESSAGES.VALIDATION,
        ErrorType.VALIDATION,
        'VALIDATION_ERROR'
      );
    }

    // HTTP status code errors
    if (message.includes('401') || message.includes('unauthorized')) {
      return new AppError(
        ERROR_MESSAGES.UNAUTHORIZED,
        ErrorType.UNAUTHORIZED,
        'UNAUTHORIZED_ERROR',
        401
      );
    }

    if (message.includes('403') || message.includes('forbidden')) {
      return new AppError(
        ERROR_MESSAGES.FORBIDDEN,
        ErrorType.FORBIDDEN,
        'FORBIDDEN_ERROR',
        403
      );
    }

    if (message.includes('404') || message.includes('not found')) {
      return new AppError(
        ERROR_MESSAGES.NOT_FOUND,
        ErrorType.NOT_FOUND,
        'NOT_FOUND_ERROR',
        404
      );
    }

    if (message.includes('500') || message.includes('server')) {
      return new AppError(
        ERROR_MESSAGES.SERVER,
        ErrorType.SERVER,
        'SERVER_ERROR',
        500
      );
    }

    // Default to unknown error
    return new AppError(
      ERROR_MESSAGES.UNKNOWN,
      ErrorType.UNKNOWN,
      'UNKNOWN_ERROR'
    );
  }

  // Log error
  private logError(error: AppError, context?: string): void {
    const errorEntry = {
      timestamp: Date.now(),
      error,
      context,
      userAgent: navigator.userAgent,
    };

    this.errorLog.push(errorEntry);

    // Keep only last 100 errors
    if (this.errorLog.length > 100) {
      this.errorLog = this.errorLog.slice(-100);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error logged:', errorEntry);
    }
  }

  // Get error logs
  public getErrorLogs(): Array<{
    timestamp: number;
    error: AppError;
    context?: string;
    userAgent?: string;
  }> {
    return [...this.errorLog];
  }

  // Clear error logs
  public clearErrorLogs(): void {
    this.errorLog = [];
  }

  // Get user-friendly error message
  public getUserFriendlyMessage(error: AppError): string {
    switch (error.type) {
      case ErrorType.NETWORK:
        return 'Please check your internet connection and try again.';
      case ErrorType.UNAUTHORIZED:
        return 'Please log in to continue.';
      case ErrorType.FORBIDDEN:
        return 'You do not have permission to perform this action.';
      case ErrorType.NOT_FOUND:
        return 'The requested resource was not found.';
      case ErrorType.VALIDATION:
        return 'Please check your input and try again.';
      case ErrorType.SERVER:
        return 'Server error. Please try again later.';
      case ErrorType.TIMEOUT:
        return 'Request timed out. Please try again.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  }

  // Check if error is retryable
  public isRetryable(error: AppError): boolean {
    return [ErrorType.NETWORK, ErrorType.TIMEOUT, ErrorType.SERVER].includes(
      error.type
    );
  }

  // Get retry delay
  public getRetryDelay(attempt: number): number {
    // Exponential backoff: 1s, 2s, 4s, 8s, 16s
    return Math.min(1000 * Math.pow(2, attempt), 16000);
  }
}

// Global error handler instance
export const errorHandler = ErrorHandler.getInstance();

// Error boundary props
export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: AppError; retry: () => void }>;
  onError?: (error: AppError, errorInfo: any) => void;
}

// Error boundary state
export interface ErrorBoundaryState {
  hasError: boolean;
  error?: AppError;
}

// Retry mechanism
export class RetryManager {
  private static instance: RetryManager;
  private retryQueues: Map<string, Array<() => Promise<any>>> = new Map();

  private constructor() {}

  public static getInstance(): RetryManager {
    if (!RetryManager.instance) {
      RetryManager.instance = new RetryManager();
    }
    return RetryManager.instance;
  }

  // Retry a function with exponential backoff
  public async retry<T>(
    fn: () => Promise<T>,
    maxAttempts: number = 3,
    context: string = 'default'
  ): Promise<T> {
    let lastError: AppError;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = errorHandler.handleError(error, context);

        if (
          !errorHandler.isRetryable(lastError) ||
          attempt === maxAttempts - 1
        ) {
          throw lastError;
        }

        const delay = errorHandler.getRetryDelay(attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    throw lastError!;
  }

  // Queue retry for later
  public queueRetry(fn: () => Promise<any>, context: string = 'default'): void {
    if (!this.retryQueues.has(context)) {
      this.retryQueues.set(context, []);
    }
    this.retryQueues.get(context)!.push(fn);
  }

  // Process retry queue
  public async processRetryQueue(context: string = 'default'): Promise<void> {
    const queue = this.retryQueues.get(context);
    if (!queue || queue.length === 0) return;

    const functions = [...queue];
    this.retryQueues.set(context, []);

    for (const fn of functions) {
      try {
        await this.retry(fn, 3, context);
      } catch (error) {
        console.error('Retry failed:', error);
      }
    }
  }
}

// Global retry manager instance
export const retryManager = RetryManager.getInstance();

// Utility functions
export const isAppError = (error: unknown): error is AppError => {
  return error instanceof AppError;
};

export const createError = (
  message: string,
  type: ErrorType = ErrorType.UNKNOWN,
  code?: string,
  statusCode?: number,
  details?: any
): AppError => {
  return new AppError(message, type, code, statusCode, details);
};

export const handleAsyncError = async <T>(
  fn: () => Promise<T>,
  context?: string
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    throw errorHandler.handleError(error, context);
  }
};

export const withErrorHandling = <T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  context?: string
) => {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args);
    } catch (error) {
      throw errorHandler.handleError(error, context);
    }
  };
};

// Display error function for UI
export const displayError = (error: AppError | Error | unknown): void => {
  const appError =
    error instanceof AppError ? error : errorHandler.handleError(error);

  // Log error to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error displayed:', appError);
  }

  // You can add toast notifications or other UI error display here
  // For now, we'll just log to console
  console.error(`[${appError.type}] ${appError.message}`, appError.details);
};
