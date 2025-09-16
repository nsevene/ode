import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface PerformanceMetrics {
  memoryUsage: number;
  loadTime: number;
  renderTime: number;
  bundleSize: number;
  fps: number;
}

export const PerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    memoryUsage: 0,
    loadTime: 0,
    renderTime: 0,
    bundleSize: 0,
    fps: 60
  });

  useEffect(() => {
    const updateMetrics = () => {
      const performanceInfo = performance as any;
      
      setMetrics({
        memoryUsage: performanceInfo.memory ? 
          Math.round((performanceInfo.memory.usedJSHeapSize / performanceInfo.memory.totalJSHeapSize) * 100) : 0,
        loadTime: Math.round(performance.now()),
        renderTime: Math.round(performance.now() - performance.timeOrigin),
        bundleSize: 0, // Will be calculated by build tools
        fps: 60 // Simplified - would need more complex calculation for real FPS
      });
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 2000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (value: number, thresholds: { good: number; warning: number }) => {
    if (value <= thresholds.good) return 'bg-green-500';
    if (value <= thresholds.warning) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Performance Monitor
          <Badge variant="outline">Live</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Memory Usage</span>
              <span className="text-sm text-muted-foreground">{metrics.memoryUsage}%</span>
            </div>
            <Progress 
              value={metrics.memoryUsage} 
              className={`h-2 ${getStatusColor(metrics.memoryUsage, { good: 50, warning: 80 })}`}
            />
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Load Time</span>
              <span className="text-sm text-muted-foreground">{metrics.loadTime}ms</span>
            </div>
            <Progress 
              value={Math.min(metrics.loadTime / 30, 100)} 
              className={`h-2 ${getStatusColor(metrics.loadTime, { good: 1000, warning: 3000 })}`}
            />
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Render Time</span>
              <span className="text-sm text-muted-foreground">{metrics.renderTime}ms</span>
            </div>
            <Progress 
              value={Math.min(metrics.renderTime / 50, 100)} 
              className={`h-2 ${getStatusColor(metrics.renderTime, { good: 500, warning: 2000 })}`}
            />
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">FPS</span>
              <span className="text-sm text-muted-foreground">{metrics.fps}</span>
            </div>
            <Progress 
              value={(metrics.fps / 60) * 100} 
              className={`h-2 ${getStatusColor(60 - metrics.fps, { good: 10, warning: 20 })}`}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};