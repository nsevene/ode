// Advanced monitoring and logging
export interface LogEntry {
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  timestamp: number;
  context?: Record<string, any>;
  userId?: string;
  sessionId?: string;
}

export class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  // Log info message
  info(message: string, context?: Record<string, any>) {
    this.log('info', message, context);
  }

  // Log warning
  warn(message: string, context?: Record<string, any>) {
    this.log('warn', message, context);
  }

  // Log error
  error(message: string, error?: Error, context?: Record<string, any>) {
    this.log('error', message, {
      ...context,
      error: error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : undefined
    });
  }

  // Log debug message
  debug(message: string, context?: Record<string, any>) {
    this.log('debug', message, context);
  }

  // Internal log method
  private log(level: LogEntry['level'], message: string, context?: Record<string, any>) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: Date.now(),
      context,
      userId: this.getCurrentUserId(),
      sessionId: this.getSessionId()
    };

    this.logs.push(entry);
    
    // Send to external logging service
    this.sendToExternalService(entry);
    
    // Console logging in development
    if (process.env.NODE_ENV === 'development') {
      console[level](`[${new Date().toISOString()}] ${message}`, context);
    }
  }

  // Get current user ID
  private getCurrentUserId(): string | undefined {
    // This would be implemented with your auth system
    return undefined;
  }

  // Get session ID
  private getSessionId(): string | undefined {
    // This would be implemented with your session management
    return undefined;
  }

  // Send to external logging service
  private sendToExternalService(entry: LogEntry) {
    // Send to Supabase, Sentry, or other logging service
    if (typeof window !== 'undefined') {
      // Implementation would go here
    }
  }

  // Get logs
  getLogs(): LogEntry[] {
    return this.logs;
  }

  // Clear logs
  clearLogs() {
    this.logs = [];
  }
}

// Performance monitoring
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Start timing
  startTiming(name: string): () => void {
    const start = performance.now();
    
    return () => {
      const duration = performance.now() - start;
      this.recordMetric(name, duration);
    };
  }

  // Record metric
  recordMetric(name: string, value: number) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    
    const values = this.metrics.get(name)!;
    values.push(value);
    
    // Keep only last 100 values
    if (values.length > 100) {
      values.shift();
    }
  }

  // Get metric statistics
  getMetricStats(name: string) {
    const values = this.metrics.get(name);
    if (!values || values.length === 0) {
      return null;
    }

    const sorted = [...values].sort((a, b) => a - b);
    const len = sorted.length;
    
    return {
      count: len,
      min: sorted[0],
      max: sorted[len - 1],
      avg: values.reduce((a, b) => a + b, 0) / len,
      median: len % 2 === 0 
        ? (sorted[len / 2 - 1] + sorted[len / 2]) / 2
        : sorted[Math.floor(len / 2)],
      p95: sorted[Math.floor(len * 0.95)],
      p99: sorted[Math.floor(len * 0.99)]
    };
  }

  // Get all metrics
  getAllMetrics() {
    const result: Record<string, any> = {};
    for (const [name] of this.metrics) {
      result[name] = this.getMetricStats(name);
    }
    return result;
  }
}

// Error tracking
export class ErrorTracker {
  private static instance: ErrorTracker;

  static getInstance(): ErrorTracker {
    if (!ErrorTracker.instance) {
      ErrorTracker.instance = new ErrorTracker();
    }
    return ErrorTracker.instance;
  }

  // Track JavaScript errors
  trackJSErrors() {
    if (typeof window === 'undefined') return;

    window.addEventListener('error', (event) => {
      this.trackError('JavaScript Error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.trackError('Unhandled Promise Rejection', {
        reason: event.reason,
        stack: event.reason?.stack
      });
    });
  }

  // Track error
  trackError(type: string, details: Record<string, any>) {
    Logger.getInstance().error(`Error: ${type}`, undefined, details);
    
    // Send to external error tracking service
    this.sendToErrorService(type, details);
  }

  // Send to error service
  private sendToErrorService(type: string, details: Record<string, any>) {
    // Implementation for Sentry, Bugsnag, etc.
    if (typeof window !== 'undefined') {
      // This would be implemented with your error tracking service
    }
  }
}

// Export instances
export const logger = Logger.getInstance();
export const performanceMonitor = PerformanceMonitor.getInstance();
export const errorTracker = ErrorTracker.getInstance();
