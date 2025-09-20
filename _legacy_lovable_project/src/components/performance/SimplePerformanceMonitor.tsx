import React, { useState, useEffect } from 'react';
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

interface SimplePerformanceMonitorProps {
  show?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
}

export const SimplePerformanceMonitor: React.FC<
  SimplePerformanceMonitorProps
> = ({
  show = process.env.NODE_ENV === 'development',
  position = 'bottom-right',
  className,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [metrics, setMetrics] = useState({
    memoryUsage: 0,
    loadTime: 0,
    renderTime: 0,
    fps: 60,
    networkStatus: 'online' as 'online' | 'offline',
    cacheStatus: 'enabled' as 'enabled' | 'disabled' | 'unknown',
  });

  // Simple metrics calculation
  useEffect(() => {
    if (!show) return;

    const updateMetrics = () => {
      try {
        // Safe memory calculation
        let memoryUsage = 0;
        if (performance.memory && performance.memory.totalJSHeapSize > 0) {
          memoryUsage = Math.min(
            100,
            Math.round(
              (performance.memory.usedJSHeapSize /
                performance.memory.totalJSHeapSize) *
                100
            )
          );
        }

        // Safe load time calculation
        let loadTime = 0;
        try {
          const navigation = performance.getEntriesByType(
            'navigation'
          )[0] as PerformanceNavigationTiming;
          if (
            navigation &&
            navigation.loadEventEnd > 0 &&
            navigation.loadEventStart > 0
          ) {
            loadTime = Math.round(
              navigation.loadEventEnd - navigation.loadEventStart
            );
          }
        } catch (e) {
          // Fallback to a reasonable default
          loadTime = 1000;
        }

        // Safe render time calculation
        let renderTime = 0;
        try {
          if (performance.timeOrigin) {
            renderTime = Math.max(
              0,
              Math.min(
                10000,
                Math.round(performance.now() - performance.timeOrigin)
              )
            );
          }
        } catch (e) {
          renderTime = 100;
        }

        // Cache status
        let cacheStatus: 'enabled' | 'disabled' | 'unknown' = 'unknown';
        try {
          if ('caches' in window) {
            cacheStatus = 'enabled';
          } else {
            cacheStatus = 'disabled';
          }
        } catch (e) {
          cacheStatus = 'unknown';
        }

        setMetrics({
          memoryUsage,
          loadTime,
          renderTime,
          fps: 60, // Default to 60 FPS
          networkStatus: navigator.onLine ? 'online' : 'offline',
          cacheStatus,
        });
      } catch (error) {
        console.warn('Performance metrics calculation failed:', error);
        // Set safe defaults
        setMetrics({
          memoryUsage: 0,
          loadTime: 1000,
          renderTime: 100,
          fps: 60,
          networkStatus: 'online',
          cacheStatus: 'enabled',
        });
      }
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, [show]);

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
              className="text-gray-400 hover:text-white transition-colors text-xs"
            >
              {isMinimized ? '▼' : '▲'}
            </button>
            <button
              onClick={() => setIsVisible(!isVisible)}
              className="text-gray-400 hover:text-white transition-colors text-xs"
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
                <span className="text-green-400">{metrics.fps}</span>
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
            {metrics.loadTime > 3000 && (
              <div className="text-yellow-400 text-xs flex items-center space-x-1">
                <AlertTriangle className="h-3 w-3" />
                <span>Slow page load</span>
              </div>
            )}
            {metrics.renderTime > 1000 && (
              <div className="text-yellow-400 text-xs flex items-center space-x-1">
                <AlertTriangle className="h-3 w-3" />
                <span>Slow rendering</span>
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

export default SimplePerformanceMonitor;
