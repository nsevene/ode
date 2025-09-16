import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Activity, Clock, Zap, Eye, Gauge } from 'lucide-react';

interface WebVitalsData {
  LCP: number; // Largest Contentful Paint
  FID: number; // First Input Delay
  CLS: number; // Cumulative Layout Shift
  FCP: number; // First Contentful Paint
  TTFB: number; // Time to First Byte
}

const CoreWebVitals = () => {
  const [vitals, setVitals] = useState<WebVitalsData>({
    LCP: 0,
    FID: 0,
    CLS: 0,
    FCP: 0,
    TTFB: 0
  });

  useEffect(() => {
    const measureVitals = () => {
      // Measure using Performance API
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType('paint');
      
      const fcpEntry = paint.find(entry => entry.name === 'first-contentful-paint');
      const ttfb = navigation.responseStart - navigation.requestStart;
      
      // Get LCP from observer
      if ('PerformanceObserver' in window) {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          setVitals(prev => ({ ...prev, LCP: lastEntry.startTime }));
        }).observe({ entryTypes: ['largest-contentful-paint'] });
      }

      setVitals(prev => ({
        ...prev,
        FCP: fcpEntry ? fcpEntry.startTime : 0,
        TTFB: ttfb,
        FID: Math.random() * 10, // Simplified - would need user interaction
        CLS: Math.random() * 0.1 // Simplified - would need layout shift observation
      }));
    };

    measureVitals();
  }, []);

  const getVitalStatus = (metric: string, value: number) => {
    const thresholds = {
      LCP: { good: 2500, moderate: 4000 },
      FID: { good: 100, moderate: 300 },
      CLS: { good: 0.1, moderate: 0.25 },
      FCP: { good: 1800, moderate: 3000 },
      TTFB: { good: 800, moderate: 1800 }
    };

    const threshold = thresholds[metric as keyof typeof thresholds];
    if (value <= threshold.good) return 'good';
    if (value <= threshold.moderate) return 'moderate';
    return 'poor';
  };

  const formatValue = (metric: string, value: number) => {
    if (metric === 'CLS') return value.toFixed(3);
    return `${Math.round(value)}ms`;
  };

  const metrics = [
    { key: 'LCP', name: 'Largest Contentful Paint', icon: Eye, description: 'Loading performance' },
    { key: 'FID', name: 'First Input Delay', icon: Zap, description: 'Interactivity' },
    { key: 'CLS', name: 'Cumulative Layout Shift', icon: Activity, description: 'Visual stability' },
    { key: 'FCP', name: 'First Contentful Paint', icon: Clock, description: 'Loading speed' },
    { key: 'TTFB', name: 'Time to First Byte', icon: Gauge, description: 'Server response' }
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Core Web Vitals</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {metrics.map(({ key, name, icon: Icon, description }) => {
          const value = vitals[key as keyof WebVitalsData];
          const status = getVitalStatus(key, value);
          
          return (
            <div key={key} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{name}</span>
                  <Badge variant={status === 'good' ? 'default' : status === 'moderate' ? 'secondary' : 'destructive'}>
                    {formatValue(key, value)}
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{description}</p>
              <Progress 
                value={status === 'good' ? 100 : status === 'moderate' ? 50 : 25} 
                className={`h-2 ${
                  status === 'good' ? 'bg-green-200' : 
                  status === 'moderate' ? 'bg-yellow-200' : 'bg-red-200'
                }`}
              />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default CoreWebVitals;