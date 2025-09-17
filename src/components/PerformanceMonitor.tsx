import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Zap, Clock, Database, Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PerformanceMetrics {
  memoryUsage: number;
  loadTime: number;
  renderTime: number;
  fps: number;
  networkStatus: 'online' | 'offline';
  bundleSize: number;
  cacheHitRate: number;
}

interface PerformanceMonitorProps {
  show?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  show = process.env.NODE_ENV === 'development',
  position = 'bottom-right',
  className
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    memoryUsage: 0,
    loadTime: 0,
    renderTime: 0,
    fps: 60,
    networkStatus: 'online',
    bundleSize: 0,
    cacheHitRate: 0,
  });

  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Update metrics
  const updateMetrics = useCallback(() => {
    const performanceInfo = performance as any;
    
    // Memory usage - fix calculation
    const memoryUsage = performanceInfo.memory ? 
      Math.min(100, Math.round((performanceInfo.memory.usedJSHeapSize / performanceInfo.memory.totalJSHeapSize) * 100)) : 0;
    
    // Load time - fix calculation to show actual page load time
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const loadTime = navigation ? Math.round(navigation.loadEventEnd - navigation.loadEventStart) : 0;
    
    // Render time - fix calculation to show actual render time
    const renderTime = Math.max(0, Math.round(performance.now() - (performance.timeOrigin || 0)));
    
    setMetrics(prev => ({
      ...prev,
      memoryUsage,
      loadTime,
      renderTime,
      networkStatus: navigator.onLine ? 'online' : 'offline',
    }));
  }, []);

  // FPS calculation
  const calculateFPS = useCallback(() => {
    let lastTime = performance.now();
    let frameCount = 0;
    
    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        setMetrics(prev => ({ ...prev, fps }));
        
        frameCount = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(measureFPS);
    };
    
    requestAnimationFrame(measureFPS);
  }, []);

  // Cache hit rate calculation
  const calculateCacheHitRate = useCallback(() => {
    const cache = (performance as any).getEntriesByType?.('navigation')?.[0];
    if (cache) {
      const hitRate = Math.round((cache.transferSize / cache.encodedBodySize) * 100);
      setMetrics(prev => ({ ...prev, cacheHitRate: hitRate }));
    }
  }, []);

  // Bundle size calculation
  const calculateBundleSize = useCallback(() => {
    const scripts = document.querySelectorAll('script[src]');
    let totalSize = 0;
    
    scripts.forEach(script => {
      const src = (script as HTMLScriptElement).src;
      if (src.includes('assets/')) {
        // Estimate size based on file name patterns
        totalSize += 100; // Simplified estimation
      }
    });
    
    setMetrics(prev => ({ ...prev, bundleSize: totalSize }));
  }, []);

  // Update metrics periodically
  useEffect(() => {
    if (!show) return;

    updateMetrics();
    calculateFPS();
    calculateCacheHitRate();
    calculateBundleSize();

    const interval = setInterval(updateMetrics, 2000);
    
    return () => clearInterval(interval);
  }, [show, updateMetrics, calculateFPS, calculateCacheHitRate, calculateBundleSize]);

  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => setMetrics(prev => ({ ...prev, networkStatus: 'online' }));
    const handleOffline = () => setMetrics(prev => ({ ...prev, networkStatus: 'offline' }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Get status color for metrics
  const getStatusColor = (value: number, thresholds: { good: number; warning: number }) => {
    if (value <= thresholds.good) return 'text-green-500';
    if (value <= thresholds.warning) return 'text-yellow-500';
    return 'text-red-500';
  };

  // Get position classes
  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4';
      case 'top-right':
        return 'top-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      default:
        return 'bottom-4 right-4';
    }
  };

  if (!show) return null;

  return (
    <div className={cn("fixed z-50", getPositionClasses(), className)}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-black/80 backdrop-blur-sm rounded-lg p-3 text-white text-xs font-mono"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4" />
            <span className="font-semibold">Performance</span>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 hover:bg-white/20 rounded"
            >
              {isMinimized ? '▼' : '▲'}
            </button>
            <button
              onClick={() => setIsVisible(!isVisible)}
              className="p-1 hover:bg-white/20 rounded"
            >
              {isVisible ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
        </div>

        {/* Metrics */}
        <AnimatePresence>
          {!isMinimized && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-1"
            >
              {/* Memory Usage */}
              <div className="flex items-center justify-between">
                <span>Memory:</span>
                <span className={getStatusColor(metrics.memoryUsage, { good: 50, warning: 80 })}>
                  {metrics.memoryUsage}%
                </span>
              </div>

              {/* Load Time */}
              <div className="flex items-center justify-between">
                <span>Load:</span>
                <span className={getStatusColor(metrics.loadTime, { good: 1000, warning: 3000 })}>
                  {metrics.loadTime}ms
                </span>
              </div>

              {/* Render Time */}
              <div className="flex items-center justify-between">
                <span>Render:</span>
                <span className={getStatusColor(metrics.renderTime, { good: 100, warning: 300 })}>
                  {metrics.renderTime}ms
                </span>
              </div>

              {/* FPS */}
              <div className="flex items-center justify-between">
                <span>FPS:</span>
                <span className={getStatusColor(60 - metrics.fps, { good: 10, warning: 20 })}>
                  {metrics.fps}
                </span>
              </div>

              {/* Network Status */}
              <div className="flex items-center justify-between">
                <span>Network:</span>
                <div className="flex items-center space-x-1">
                  {metrics.networkStatus === 'online' ? (
                    <Wifi className="w-3 h-3 text-green-500" />
                  ) : (
                    <WifiOff className="w-3 h-3 text-red-500" />
                  )}
                  <span className={metrics.networkStatus === 'online' ? 'text-green-500' : 'text-red-500'}>
                    {metrics.networkStatus}
                  </span>
                </div>
              </div>

              {/* Cache Hit Rate */}
              <div className="flex items-center justify-between">
                <span>Cache:</span>
                <span className={getStatusColor(100 - metrics.cacheHitRate, { good: 20, warning: 50 })}>
                  {metrics.cacheHitRate}%
                </span>
              </div>

              {/* Bundle Size */}
              <div className="flex items-center justify-between">
                <span>Bundle:</span>
                <span className={getStatusColor(metrics.bundleSize, { good: 500, warning: 1000 })}>
                  {metrics.bundleSize}KB
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Performance Warnings */}
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 pt-2 border-t border-white/20"
          >
            {metrics.memoryUsage > 80 && (
              <div className="text-yellow-400 text-xs">
                ⚠️ High memory usage
              </div>
            )}
            {metrics.fps < 30 && (
              <div className="text-red-400 text-xs">
                ⚠️ Low FPS detected
              </div>
            )}
            {metrics.loadTime > 3000 && (
              <div className="text-yellow-400 text-xs">
                ⚠️ Slow page load
              </div>
            )}
            {metrics.networkStatus === 'offline' && (
              <div className="text-red-400 text-xs">
                ⚠️ Offline mode
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

// Performance metrics hook
export const usePerformanceMetrics = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    memoryUsage: 0,
    loadTime: 0,
    renderTime: 0,
    fps: 60,
    networkStatus: 'online',
    bundleSize: 0,
    cacheHitRate: 0,
  });

  const updateMetrics = useCallback(() => {
    const performanceInfo = performance as any;
    
    // Memory usage - fix calculation
    const memoryUsage = performanceInfo.memory ? 
      Math.min(100, Math.round((performanceInfo.memory.usedJSHeapSize / performanceInfo.memory.totalJSHeapSize) * 100)) : 0;
    
    // Load time - fix calculation to show actual page load time
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const loadTime = navigation ? Math.round(navigation.loadEventEnd - navigation.loadEventStart) : 0;
    
    // Render time - fix calculation to show actual render time
    const renderTime = Math.max(0, Math.round(performance.now() - (performance.timeOrigin || 0)));
    
    setMetrics(prev => ({
      ...prev,
      memoryUsage,
      loadTime,
      renderTime,
      networkStatus: navigator.onLine ? 'online' : 'offline',
    }));
  }, []);

  useEffect(() => {
    updateMetrics();
    const interval = setInterval(updateMetrics, 1000);
    return () => clearInterval(interval);
  }, [updateMetrics]);

  return metrics;
};

// Performance optimization suggestions
export const PerformanceSuggestions: React.FC = () => {
  const metrics = usePerformanceMetrics();

  const suggestions = [];

  if (metrics.memoryUsage > 80) {
    suggestions.push({
      type: 'warning',
      message: 'High memory usage detected. Consider reducing component complexity or implementing lazy loading.',
      action: 'Optimize components'
    });
  }

  if (metrics.fps < 30) {
    suggestions.push({
      type: 'error',
      message: 'Low FPS detected. Consider reducing animations or optimizing rendering.',
      action: 'Optimize rendering'
    });
  }

  if (metrics.loadTime > 3000) {
    suggestions.push({
      type: 'warning',
      message: 'Slow page load detected. Consider optimizing bundle size or implementing code splitting.',
      action: 'Optimize bundle'
    });
  }

  if (suggestions.length === 0) {
    return (
      <div className="text-green-500 text-sm">
        ✅ Performance is optimal
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {suggestions.map((suggestion, index) => (
        <div key={index} className={`text-sm ${
          suggestion.type === 'error' ? 'text-red-500' : 'text-yellow-500'
        }`}>
          ⚠️ {suggestion.message}
        </div>
      ))}
    </div>
  );
};

export default PerformanceMonitor;