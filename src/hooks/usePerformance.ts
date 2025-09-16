import { useState, useEffect, useCallback } from 'react';

interface PerformanceData {
  loadTime: number;
  renderTime: number;
  memoryUsage: number;
  bundleSize: number;
}

export const usePerformance = () => {
  const [performanceData, setPerformanceData] = useState<PerformanceData>({
    loadTime: 0,
    renderTime: 0,
    memoryUsage: 0,
    bundleSize: 0
  });

  const measurePerformance = useCallback(() => {
    const perfInfo = performance as any;
    
    setPerformanceData({
      loadTime: Math.round(performance.now()),
      renderTime: Math.round(performance.now() - performance.timeOrigin),
      memoryUsage: perfInfo.memory ? 
        Math.round((perfInfo.memory.usedJSHeapSize / perfInfo.memory.totalJSHeapSize) * 100) : 0,
      bundleSize: 0 // Would be set by build tools
    });
  }, []);

  const trackUserTiming = useCallback((name: string, startTime?: number) => {
    if (startTime) {
      const duration = performance.now() - startTime;
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);
      console.log(`Performance: ${name} took ${duration.toFixed(2)}ms`);
      return duration;
    } else {
      performance.mark(`${name}-start`);
      return performance.now();
    }
  }, []);

  const getMetrics = useCallback(() => {
    const entries = performance.getEntriesByType('measure');
    return entries.map(entry => ({
      name: entry.name,
      duration: entry.duration,
      startTime: entry.startTime
    }));
  }, []);

  useEffect(() => {
    measurePerformance();
    const interval = setInterval(measurePerformance, 5000);
    
    return () => clearInterval(interval);
  }, [measurePerformance]);

  const trackEvent = useCallback((eventName: string, data: any) => {
    console.log(`Performance Event: ${eventName}`, data);
    // In real implementation, send to analytics
  }, []);

  return {
    performanceData,
    measurePerformance,
    trackUserTiming,
    getMetrics,
    trackEvent
  };
};