// Advanced analytics and monitoring
export interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  userId?: string;
  timestamp?: number;
}

export class AnalyticsManager {
  private static instance: AnalyticsManager;
  private events: AnalyticsEvent[] = [];

  static getInstance(): AnalyticsManager {
    if (!AnalyticsManager.instance) {
      AnalyticsManager.instance = new AnalyticsManager();
    }
    return AnalyticsManager.instance;
  }

  // Track user interactions
  track(event: string, properties?: Record<string, any>) {
    const analyticsEvent: AnalyticsEvent = {
      event,
      properties,
      timestamp: Date.now(),
    };

    this.events.push(analyticsEvent);

    // Send to analytics service
    this.sendToAnalytics(analyticsEvent);
  }

  // Track page views
  trackPageView(page: string, properties?: Record<string, any>) {
    this.track('page_view', {
      page,
      ...properties,
    });
  }

  // Track user actions
  trackUserAction(action: string, properties?: Record<string, any>) {
    this.track('user_action', {
      action,
      ...properties,
    });
  }

  // Track business metrics
  trackBusinessMetric(
    metric: string,
    value: number,
    properties?: Record<string, any>
  ) {
    this.track('business_metric', {
      metric,
      value,
      ...properties,
    });
  }

  // Track errors
  trackError(error: Error, context?: string) {
    this.track('error', {
      message: error.message,
      stack: error.stack,
      context,
    });
  }

  // Track performance
  trackPerformance(metric: string, value: number) {
    this.track('performance', {
      metric,
      value,
    });
  }

  private sendToAnalytics(event: AnalyticsEvent) {
    // Send to Supabase analytics table
    if (typeof window !== 'undefined') {
      // This would be implemented with Supabase client
      console.log('Analytics event:', event);
    }
  }

  // Get analytics data
  getAnalyticsData() {
    return this.events;
  }
}

// Performance monitoring
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Monitor Core Web Vitals
  monitorCoreWebVitals() {
    if (typeof window === 'undefined') return;

    // Largest Contentful Paint
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      AnalyticsManager.getInstance().trackPerformance(
        'LCP',
        lastEntry.startTime
      );
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        AnalyticsManager.getInstance().trackPerformance(
          'FID',
          entry.processingStart - entry.startTime
        );
      });
    }).observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (!entry.hadRecentInput) {
          AnalyticsManager.getInstance().trackPerformance('CLS', entry.value);
        }
      });
    }).observe({ entryTypes: ['layout-shift'] });
  }

  // Monitor page load time
  monitorPageLoad() {
    if (typeof window === 'undefined') return;

    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType(
        'navigation'
      )[0] as PerformanceNavigationTiming;

      AnalyticsManager.getInstance().trackPerformance(
        'page_load_time',
        navigation.loadEventEnd - navigation.fetchStart
      );
      AnalyticsManager.getInstance().trackPerformance(
        'dom_content_loaded',
        navigation.domContentLoadedEventEnd - navigation.fetchStart
      );
    });
  }
}

// Business metrics tracking
export class BusinessMetrics {
  private static instance: BusinessMetrics;

  static getInstance(): BusinessMetrics {
    if (!BusinessMetrics.instance) {
      BusinessMetrics.instance = new BusinessMetrics();
    }
    return BusinessMetrics.instance;
  }

  // Track tenant applications
  trackTenantApplication(applicationData: any) {
    AnalyticsManager.getInstance().trackBusinessMetric(
      'tenant_application',
      1,
      {
        business_type: applicationData.businessType,
        cuisine_type: applicationData.cuisineType,
        preferred_space: applicationData.preferredSpace,
      }
    );
  }

  // Track investor consultations
  trackInvestorConsultation(consultationData: any) {
    AnalyticsManager.getInstance().trackBusinessMetric(
      'investor_consultation',
      1,
      {
        investment_range: consultationData.investmentRange,
        meeting_type: consultationData.meetingType,
      }
    );
  }

  // Track user engagement
  trackUserEngagement(page: string, action: string) {
    AnalyticsManager.getInstance().trackUserAction(action, {
      page,
      timestamp: Date.now(),
    });
  }
}

// Export instances
export const analytics = AnalyticsManager.getInstance();
export const performanceMonitor = PerformanceMonitor.getInstance();
export const businessMetrics = BusinessMetrics.getInstance();

// Export functions for compatibility
export const track = (event: string, properties?: Record<string, any>) => {
  analytics.track(event, properties);
};

export const trackZoneClick = (
  zone: string,
  properties?: Record<string, any>
) => {
  analytics.track('zone_click', { zone, ...properties });
};
