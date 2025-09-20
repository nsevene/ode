import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Zap,
  Clock,
  Database,
  Wifi,
  WifiOff,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PerformanceMetrics {
  memoryUsage: number;
  loadTime: number;
  renderTime: number;
  fps: number;
  networkStatus: 'online' | 'offline';
  cacheStatus: 'enabled' | 'disabled' | 'unknown';
}

interface OptimizedPerformanceMonitorProps {
  show?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
}

export const OptimizedPerformanceMonitor: React.FC<
  OptimizedPerformanceMonitorProps
> = ({
  show = process.env.NODE_ENV === 'development',
  position = 'bottom-right',
  className,
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    memoryUsage: 0,
    loadTime: 0,
    renderTime: 0,
    fps: 60,
    networkStatus: 'online',
    cacheStatus: 'unknown',
  });

  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Safe performance metrics calculation
  const updateMetrics = useCallback(() => {
    try {
      const performanceInfo = performance as any;

      // Memory usage - safe calculation
      let memoryUsage = 0;
      if (
        performanceInfo.memory &&
        performanceInfo.memory.totalJSHeapSize > 0
      ) {
        memoryUsage = Math.min(
          100,
          Math.round(
            (performanceInfo.memory.usedJSHeapSize /
              performanceInfo.memory.totalJSHeapSize) *
              100
          )
        );
      }

      // Load time - use navigation timing
      let loadTime = 0;
      const navigation = performance.getEntriesByType(
        'navigation'
      )[0] as PerformanceNavigationTiming;
      if (navigation && navigation.loadEventEnd > 0) {
        loadTime = Math.round(
          navigation.loadEventEnd - navigation.loadEventStart
        );
      }

      // Render time - safe calculation
      let renderTime = 0;
      if (performance.timeOrigin) {
        renderTime = Math.max(
          0,
          Math.round(performance.now() - performance.timeOrigin)
        );
      }

      // Cache status
      let cacheStatus: 'enabled' | 'disabled' | 'unknown' = 'unknown';
      if ('caches' in window) {
        cacheStatus = 'enabled';
      } else {
        cacheStatus = 'disabled';
      }

      setMetrics((prev) => ({
        ...prev,
        memoryUsage,
        loadTime,
        renderTime,
        networkStatus: navigator.onLine ? 'online' : 'offline',
        cacheStatus,
      }));
    } catch (error) {
      console.warn('Performance metrics calculation failed:', error);
    }
  }, []);

  // FPS calculation with error handling
  const calculateFPS = useCallback(() => {
    let lastTime = performance.now();
    let frameCount = 0;
    let fps = 60;

    const measureFPS = () => {
      try {
        frameCount++;
        const currentTime = performance.now();

        if (currentTime - lastTime >= 1000) {
          fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
          setMetrics((prev) => ({
            ...prev,
            fps: Math.min(60, Math.max(0, fps)),
          }));

          frameCount = 0;
          lastTime = currentTime;
        }

        requestAnimationFrame(measureFPS);
      } catch (error) {
        console.warn('FPS calculation failed:', error);
      }
    };

    requestAnimationFrame(measureFPS);
  }, []);

  // Initialize metrics
  useEffect(() => {
    if (!show) return;

    updateMetrics();
    calculateFPS();

    const interval = setInterval(updateMetrics, 2000); // Update every 2 seconds
    return () => clearInterval(interval);
  }, [show, updateMetrics, calculateFPS]);

  // Position classes
  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  };

  // Status color helper
  const getStatusColor = (
    value: number,
    thresholds: { good: number; warning: number }
  ) => {
    if (value <= thresholds.good) return 'text-green-400';
    if (value <= thresholds.warning) return 'text-yellow-400';
    return 'text-red-400';
  };

  // Cache status color
  const getCacheStatusColor = (status: string) => {
    switch (status) {
      case 'enabled':
        return 'text-green-400';
      case 'disabled':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  if (!show) return null;

  return (
    <div className={cn('fixed z-50', positionClasses[position], className)}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-900 text-white rounded-lg shadow-lg p-3 min-w-[200px]"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Activity className="h-4 w-4 text-blue-400" />
            <span className="text-sm font-semibold">Performance</span>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              {isMinimized ? '▼' : '▲'}
            </button>
            <button
              onClick={() => setIsVisible(!isVisible)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              {isVisible ? '−' : '+'}
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
              <div className="flex items-center justify-between text-xs">
                <span>Memory:</span>
                <span
                  className={getStatusColor(metrics.memoryUsage, {
                    good: 50,
                    warning: 80,
                  })}
                >
                  {metrics.memoryUsage}%
                </span>
              </div>

              {/* Load Time */}
              <div className="flex items-center justify-between text-xs">
                <span>Load:</span>
                <span
                  className={getStatusColor(metrics.loadTime, {
                    good: 1000,
                    warning: 3000,
                  })}
                >
                  {metrics.loadTime}ms
                </span>
              </div>

              {/* Render Time */}
              <div className="flex items-center justify-between text-xs">
                <span>Render:</span>
                <span
                  className={getStatusColor(metrics.renderTime, {
                    good: 100,
                    warning: 300,
                  })}
                >
                  {metrics.renderTime}ms
                </span>
              </div>

              {/* FPS */}
              <div className="flex items-center justify-between text-xs">
                <span>FPS:</span>
                <span
                  className={getStatusColor(60 - metrics.fps, {
                    good: 10,
                    warning: 20,
                  })}
                >
                  {metrics.fps}
                </span>
              </div>

              {/* Network Status */}
              <div className="flex items-center justify-between text-xs">
                <span>Network:</span>
                <div className="flex items-center space-x-1">
                  {metrics.networkStatus === 'online' ? (
                    <Wifi className="h-3 w-3 text-green-400" />
                  ) : (
                    <WifiOff className="h-3 w-3 text-red-400" />
                  )}
                  <span
                    className={
                      metrics.networkStatus === 'online'
                        ? 'text-green-400'
                        : 'text-red-400'
                    }
                  >
                    {metrics.networkStatus}
                  </span>
                </div>
              </div>

              {/* Cache Status */}
              <div className="flex items-center justify-between text-xs">
                <span>Cache:</span>
                <span className={getCacheStatusColor(metrics.cacheStatus)}>
                  {metrics.cacheStatus === 'enabled'
                    ? 'E'
                    : metrics.cacheStatus === 'disabled'
                      ? 'D'
                      : '?'}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Performance Warnings */}
        {isVisible && !isMinimized && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 pt-2 border-t border-white/20"
          >
            {metrics.memoryUsage > 80 && (
              <div className="text-yellow-400 text-xs flex items-center space-x-1">
                <AlertTriangle className="h-3 w-3" />
                <span>High memory usage</span>
              </div>
            )}
            {metrics.fps < 30 && (
              <div className="text-red-400 text-xs flex items-center space-x-1">
                <AlertTriangle className="h-3 w-3" />
                <span>Low FPS detected</span>
              </div>
            )}
            {metrics.loadTime > 3000 && (
              <div className="text-yellow-400 text-xs flex items-center space-x-1">
                <AlertTriangle className="h-3 w-3" />
                <span>Slow page load</span>
              </div>
            )}
            {metrics.networkStatus === 'offline' && (
              <div className="text-red-400 text-xs flex items-center space-x-1">
                <AlertTriangle className="h-3 w-3" />
                <span>Offline mode</span>
              </div>
            )}
            {metrics.cacheStatus === 'disabled' && (
              <div className="text-yellow-400 text-xs flex items-center space-x-1">
                <AlertTriangle className="h-3 w-3" />
                <span>Cache disabled</span>
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default OptimizedPerformanceMonitor;
