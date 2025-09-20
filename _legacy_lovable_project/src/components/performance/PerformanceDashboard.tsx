import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Download,
  RefreshCw,
  Settings,
  TrendingUp,
  TrendingDown,
  Clock,
  Memory,
  Network,
  MousePointer,
} from 'lucide-react';
import { usePerformanceMonitoring } from '@/hooks/usePerformanceMonitoring';

const PerformanceDashboard = () => {
  const {
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
  } = usePerformanceMonitoring();

  const [selectedTab, setSelectedTab] = useState('overview');

  const handleExportData = () => {
    const data = exportPerformanceData();
    if (data) {
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `performance-data-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const getMetricStatus = (
    value: number,
    threshold: number,
    lowerIsBetter: boolean = true
  ) => {
    const isGood = lowerIsBetter ? value <= threshold : value >= threshold;
    return isGood ? 'good' : 'warning';
  };

  const formatMetric = (
    value: number,
    unit: string = 'ms',
    decimals: number = 0
  ) => {
    if (unit === 'MB') {
      return `${(value / 1024 / 1024).toFixed(decimals)} ${unit}`;
    }
    return `${value.toFixed(decimals)} ${unit}`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!metrics) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <Activity className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">Loading performance metrics...</p>
            <Button onClick={startMonitoring} className="mt-4">
              <RefreshCw className="h-4 w-4 mr-2" />
              Start Monitoring
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const performanceScore = getPerformanceScore();
  const recommendations = getRecommendations();

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            📊 Performance Dashboard
          </h1>
          <p className="text-muted-foreground">
            Real-time performance monitoring and optimization
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={isMonitoring ? stopMonitoring : startMonitoring}
            variant={isMonitoring ? 'destructive' : 'default'}
          >
            {isMonitoring ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Stop Monitoring
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Start Monitoring
              </>
            )}
          </Button>
          <Button onClick={handleExportData} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Performance Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Performance Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div className="text-4xl font-bold text-primary">
              {performanceScore}/100
            </div>
            <Progress value={performanceScore} className="h-3" />
            <div className="flex justify-center gap-4">
              <Badge
                className={
                  performanceScore >= 90
                    ? 'bg-green-100 text-green-800'
                    : performanceScore >= 70
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                }
              >
                {performanceScore >= 90
                  ? 'Excellent'
                  : performanceScore >= 70
                    ? 'Good'
                    : 'Needs Improvement'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts */}
      {alerts.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <AlertTriangle className="h-5 w-5" />
              Performance Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {alerts.map((alert, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-yellow-700"
                >
                  <AlertTriangle className="h-4 w-4" />
                  <span>{alert}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs
        value={selectedTab}
        onValueChange={setSelectedTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="core-vitals">Core Vitals</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Clock className="h-8 w-8 mx-auto text-blue-500 mb-2" />
                  <p className="text-2xl font-bold text-primary">
                    {formatMetric(metrics.loadTime)}
                  </p>
                  <p className="text-sm text-muted-foreground">Load Time</p>
                  <Badge
                    className={`mt-2 ${getStatusColor(getMetricStatus(metrics.loadTime, thresholds.loadTime))}`}
                  >
                    {getMetricStatus(metrics.loadTime, thresholds.loadTime) ===
                    'good'
                      ? 'Good'
                      : 'Warning'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Memory className="h-8 w-8 mx-auto text-green-500 mb-2" />
                  <p className="text-2xl font-bold text-primary">
                    {formatMetric(metrics.memoryUsage, 'MB', 1)}
                  </p>
                  <p className="text-sm text-muted-foreground">Memory Usage</p>
                  <Badge
                    className={`mt-2 ${getStatusColor(getMetricStatus(metrics.memoryUsage, thresholds.memoryUsage))}`}
                  >
                    {getMetricStatus(
                      metrics.memoryUsage,
                      thresholds.memoryUsage
                    ) === 'good'
                      ? 'Good'
                      : 'Warning'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Network className="h-8 w-8 mx-auto text-purple-500 mb-2" />
                  <p className="text-2xl font-bold text-primary">
                    {metrics.networkRequests}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Network Requests
                  </p>
                  <Badge className="mt-2 bg-blue-100 text-blue-800">
                    {metrics.networkErrors > 0
                      ? `${metrics.networkErrors} Errors`
                      : 'No Errors'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <MousePointer className="h-8 w-8 mx-auto text-orange-500 mb-2" />
                  <p className="text-2xl font-bold text-primary">
                    {metrics.userInteractions}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    User Interactions
                  </p>
                  <Badge className="mt-2 bg-gray-100 text-gray-800">
                    Active
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Core Vitals Tab */}
        <TabsContent value="core-vitals" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                name: 'LCP',
                value: metrics.lcp,
                threshold: thresholds.lcp,
                unit: 'ms',
                description: 'Largest Contentful Paint',
              },
              {
                name: 'FID',
                value: metrics.fid,
                threshold: thresholds.fid,
                unit: 'ms',
                description: 'First Input Delay',
              },
              {
                name: 'CLS',
                value: metrics.cls,
                threshold: thresholds.cls,
                unit: '',
                description: 'Cumulative Layout Shift',
              },
              {
                name: 'FCP',
                value: metrics.fcp,
                threshold: thresholds.fcp,
                unit: 'ms',
                description: 'First Contentful Paint',
              },
              {
                name: 'TTFB',
                value: metrics.ttfb,
                threshold: thresholds.ttfb,
                unit: 'ms',
                description: 'Time to First Byte',
              },
            ].map((metric, index) => {
              const status = getMetricStatus(metric.value, metric.threshold);
              return (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{metric.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {metric.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">
                          {formatMetric(metric.value, metric.unit)}
                        </p>
                        <Badge className={`mt-1 ${getStatusColor(status)}`}>
                          {status === 'good' ? 'Good' : 'Warning'}
                        </Badge>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex justify-between text-sm text-muted-foreground mb-1">
                        <span>0</span>
                        <span>
                          Threshold:{' '}
                          {formatMetric(metric.threshold, metric.unit)}
                        </span>
                      </div>
                      <Progress
                        value={(metric.value / metric.threshold) * 100}
                        className="h-2"
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Metrics Tab */}
        <TabsContent value="metrics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Loading Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Load Time:</span>
                  <span className="font-medium">
                    {formatMetric(metrics.loadTime)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>DOM Content Loaded:</span>
                  <span className="font-medium">
                    {formatMetric(metrics.domContentLoaded)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>First Paint:</span>
                  <span className="font-medium">
                    {formatMetric(metrics.firstPaint)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>First Contentful Paint:</span>
                  <span className="font-medium">
                    {formatMetric(metrics.firstContentfulPaint)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Memory Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Memory Usage:</span>
                  <span className="font-medium">
                    {formatMetric(metrics.memoryUsage, 'MB', 1)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Memory Limit:</span>
                  <span className="font-medium">
                    {formatMetric(metrics.memoryLimit, 'MB', 1)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Usage Percentage:</span>
                  <span className="font-medium">
                    {(
                      (metrics.memoryUsage / metrics.memoryLimit) *
                      100
                    ).toFixed(1)}
                    %
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Optimization Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recommendations.length > 0 ? (
                  recommendations.map((recommendation, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 border rounded-lg"
                    >
                      <TrendingUp className="h-5 w-5 text-primary mt-0.5" />
                      <p className="text-sm">{recommendation}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
                    <p className="text-muted-foreground">
                      Great! Your performance metrics are within optimal
                      thresholds.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PerformanceDashboard;
