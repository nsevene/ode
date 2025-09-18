import { useState, useEffect, useCallback } from 'react';

interface PerformanceMetrics {
  // Core Web Vitals
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  fcp: number; // First Contentful Paint
  ttfb: number; // Time to First Byte
  
  // Additional metrics
  loadTime: number;
  domContentLoaded: number;
  firstPaint: number;
  firstContentfulPaint: number;
  
  // Memory usage
  memoryUsage: number;
  memoryLimit: number;
  
  // Network metrics
  networkRequests: number;
  networkErrors: number;
  
  // Custom metrics
  userInteractions: number;
  errors: number;
  warnings: number;
}

interface PerformanceThresholds {
  lcp: number; // 2.5s
  fid: number; // 100ms
  cls: number; // 0.1
  fcp: number; // 1.8s
  ttfb: number; // 600ms
  loadTime: number; // 3s
  memoryUsage: number; // 50MB
}

const DEFAULT_THRESHOLDS: PerformanceThresholds = {
  lcp: 2500,
  fid: 100,
  cls: 0.1,
  fcp: 1800,
  ttfb: 600,
  loadTime: 3000,
  memoryUsage: 50 * 1024 * 1024, // 50MB
};

export const usePerformanceMonitoring = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [thresholds, setThresholds] = useState<PerformanceThresholds>(DEFAULT_THRESHOLDS);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [alerts, setAlerts] = useState<string[]>([]);

  // Get Core Web Vitals
  const getCoreWebVitals = useCallback(async () => {
    if (!('PerformanceObserver' in window) || !('PerformanceEntry' in window)) {
      return null;
    }

    return new Promise<Partial<PerformanceMetrics>>((resolve) => {
      const vitals: Partial<PerformanceMetrics> = {};
      let vitalsCount = 0;
      const expectedVitals = 5;

      const checkVitals = () => {
        if (vitalsCount >= expectedVitals) {
          resolve(vitals);
        }
      };

      // LCP - Largest Contentful Paint
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          vitals.lcp = lastEntry.startTime;
          vitalsCount++;
          checkVitals();
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        vitalsCount++;
        checkVitals();
      }

      // FID - First Input Delay
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            vitals.fid = entry.processingStart - entry.startTime;
          });
          vitalsCount++;
          checkVitals();
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
      } catch (e) {
        vitalsCount++;
        checkVitals();
      }

      // CLS - Cumulative Layout Shift
      try {
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          vitals.cls = clsValue;
          vitalsCount++;
          checkVitals();
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (e) {
        vitalsCount++;
        checkVitals();
      }

      // FCP - First Contentful Paint
      try {
        const fcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            vitals.fcp = entry.startTime;
          });
          vitalsCount++;
          checkVitals();
        });
        fcpObserver.observe({ entryTypes: ['paint'] });
      } catch (e) {
        vitalsCount++;
        checkVitals();
      }

      // TTFB - Time to First Byte
      try {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        vitals.ttfb = navigation.responseStart - navigation.requestStart;
        vitalsCount++;
        checkVitals();
      } catch (e) {
        vitalsCount++;
        checkVitals();
      }
    });
  }, []);

  // Get additional performance metrics
  const getAdditionalMetrics = useCallback((): Partial<PerformanceMetrics> => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    return {
      loadTime: navigation.loadEventEnd - navigation.loadEventStart,
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
      firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0,
      memoryUsage: (performance as any).memory?.usedJSHeapSize || 0,
      memoryLimit: (performance as any).memory?.totalJSHeapSize || 0,
      networkRequests: performance.getEntriesByType('resource').length,
      networkErrors: performance.getEntriesByType('resource').filter(
        (entry: any) => entry.transferSize === 0 && entry.decodedBodySize === 0
      ).length,
    };
  }, []);

  // Check performance thresholds
  const checkThresholds = useCallback((currentMetrics: PerformanceMetrics) => {
    const newAlerts: string[] = [];

    if (currentMetrics.lcp > thresholds.lcp) {
      newAlerts.push(`LCP is ${currentMetrics.lcp.toFixed(0)}ms (threshold: ${thresholds.lcp}ms)`);
    }

    if (currentMetrics.fid > thresholds.fid) {
      newAlerts.push(`FID is ${currentMetrics.fid.toFixed(0)}ms (threshold: ${thresholds.fid}ms)`);
    }

    if (currentMetrics.cls > thresholds.cls) {
      newAlerts.push(`CLS is ${currentMetrics.cls.toFixed(3)} (threshold: ${thresholds.cls})`);
    }

    if (currentMetrics.fcp > thresholds.fcp) {
      newAlerts.push(`FCP is ${currentMetrics.fcp.toFixed(0)}ms (threshold: ${thresholds.fcp}ms)`);
    }

    if (currentMetrics.ttfb > thresholds.ttfb) {
      newAlerts.push(`TTFB is ${currentMetrics.ttfb.toFixed(0)}ms (threshold: ${thresholds.ttfb}ms)`);
    }

    if (currentMetrics.loadTime > thresholds.loadTime) {
      newAlerts.push(`Load time is ${currentMetrics.loadTime.toFixed(0)}ms (threshold: ${thresholds.loadTime}ms)`);
    }

    if (currentMetrics.memoryUsage > thresholds.memoryUsage) {
      newAlerts.push(`Memory usage is ${(currentMetrics.memoryUsage / 1024 / 1024).toFixed(1)}MB (threshold: ${(thresholds.memoryUsage / 1024 / 1024).toFixed(1)}MB)`);
    }

    setAlerts(newAlerts);
  }, [thresholds]);

  // Start monitoring
  const startMonitoring = useCallback(async () => {
    setIsMonitoring(true);
    
    try {
      // Get Core Web Vitals
      const vitals = await getCoreWebVitals();
      
      // Get additional metrics
      const additionalMetrics = getAdditionalMetrics();
      
      // Combine metrics
      const allMetrics: PerformanceMetrics = {
        lcp: vitals?.lcp || 0,
        fid: vitals?.fid || 0,
        cls: vitals?.cls || 0,
        fcp: vitals?.fcp || 0,
        ttfb: vitals?.ttfb || 0,
        loadTime: additionalMetrics.loadTime || 0,
        domContentLoaded: additionalMetrics.domContentLoaded || 0,
        firstPaint: additionalMetrics.firstPaint || 0,
        firstContentfulPaint: additionalMetrics.firstContentfulPaint || 0,
        memoryUsage: additionalMetrics.memoryUsage || 0,
        memoryLimit: additionalMetrics.memoryLimit || 0,
        networkRequests: additionalMetrics.networkRequests || 0,
        networkErrors: additionalMetrics.networkErrors || 0,
        userInteractions: 0,
        errors: 0,
        warnings: 0,
      };

      setMetrics(allMetrics);
      checkThresholds(allMetrics);
    } catch (error) {
      console.error('Error monitoring performance:', error);
    }
  }, [getCoreWebVitals, getAdditionalMetrics, checkThresholds]);

  // Stop monitoring
  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false);
  }, []);

  // Update thresholds
  const updateThresholds = useCallback((newThresholds: Partial<PerformanceThresholds>) => {
    setThresholds(prev => ({ ...prev, ...newThresholds }));
  }, []);

  // Get performance score
  const getPerformanceScore = useCallback((): number => {
    if (!metrics) return 0;

    let score = 100;
    
    // Deduct points for each threshold violation
    if (metrics.lcp > thresholds.lcp) score -= 20;
    if (metrics.fid > thresholds.fid) score -= 20;
    if (metrics.cls > thresholds.cls) score -= 20;
    if (metrics.fcp > thresholds.fcp) score -= 10;
    if (metrics.ttfb > thresholds.ttfb) score -= 10;
    if (metrics.loadTime > thresholds.loadTime) score -= 10;
    if (metrics.memoryUsage > thresholds.memoryUsage) score -= 10;

    return Math.max(0, score);
  }, [metrics, thresholds]);

  // Get performance recommendations
  const getRecommendations = useCallback((): string[] => {
    if (!metrics) return [];

    const recommendations: string[] = [];

    if (metrics.lcp > thresholds.lcp) {
      recommendations.push('Optimize images and reduce server response time to improve LCP');
    }

    if (metrics.fid > thresholds.fid) {
      recommendations.push('Reduce JavaScript execution time to improve FID');
    }

    if (metrics.cls > thresholds.cls) {
      recommendations.push('Add size attributes to images and avoid inserting content above existing content');
    }

    if (metrics.fcp > thresholds.fcp) {
      recommendations.push('Optimize critical rendering path and reduce server response time');
    }

    if (metrics.ttfb > thresholds.ttfb) {
      recommendations.push('Improve server response time and use a CDN');
    }

    if (metrics.loadTime > thresholds.loadTime) {
      recommendations.push('Optimize bundle size and use code splitting');
    }

    if (metrics.memoryUsage > thresholds.memoryUsage) {
      recommendations.push('Optimize memory usage and avoid memory leaks');
    }

    if (metrics.networkErrors > 0) {
      recommendations.push('Fix network errors and implement proper error handling');
    }

    return recommendations;
  }, [metrics, thresholds]);

  // Export performance data
  const exportPerformanceData = useCallback() => {
    if (!metrics) return null;

    return {
      timestamp: new Date().toISOString(),
      metrics,
      thresholds,
      score: getPerformanceScore(),
      alerts,
      recommendations: getRecommendations(),
    };
  }, [metrics, thresholds, getPerformanceScore, alerts, getRecommendations]);

  // Auto-start monitoring on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      startMonitoring();
    }, 1000); // Wait 1 second for page to load

    return () => clearTimeout(timer);
  }, [startMonitoring]);

  return {
    metrics,
    thresholds,
    isMonitoring,
    alerts,
    startMonitoring,
    stopMonitoring,
    updateThresholds,
    getPerformanceScore,
    getRecommendations,
    exportPerformanceData,
  };
};
