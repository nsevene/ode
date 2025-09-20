import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  TrendingUp,
  Users,
  ShoppingCart,
  Star,
  Eye,
  Clock,
  MapPin,
} from 'lucide-react';
import { track } from '@/lib/analytics';

const DemoBusinessMetrics = () => {
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>(
    'month'
  );

  // Demo metrics data
  const metrics = {
    week: {
      totalVisitors: 1247,
      orderConversion: 68.4,
      avgTicket: 145000,
      tastePassportEngagement: 34.7,
      repeatCustomers: 23.1,
      peakHours: '12:00-14:00, 18:00-20:00',
    },
    month: {
      totalVisitors: 5892,
      orderConversion: 71.2,
      avgTicket: 152000,
      tastePassportEngagement: 41.3,
      repeatCustomers: 31.8,
      peakHours: 'Weekends, Lunch & Dinner',
    },
    quarter: {
      totalVisitors: 18476,
      orderConversion: 69.8,
      avgTicket: 148000,
      tastePassportEngagement: 38.9,
      repeatCustomers: 28.4,
      peakHours: 'Consistent Daily Pattern',
    },
  };

  const zoneMetrics = [
    { zone: 'Spice Sector', visits: 1840, engagement: 4.2, orders: 1247 },
    { zone: 'Ferment Sector', visits: 1623, engagement: 3.8, orders: 1098 },
    { zone: 'Smoke Sector', visits: 1456, engagement: 3.9, orders: 982 },
    { zone: 'Umami Sector', visits: 1389, engagement: 3.6, orders: 901 },
  ];

  const revenueStreams = [
    { stream: 'Food Orders', percentage: 65, amount: 'Rp 89.2M' },
    { stream: 'Beverage Sales', percentage: 18, amount: 'Rp 24.7M' },
    { stream: 'Event Bookings', percentage: 12, amount: 'Rp 16.5M' },
    { stream: 'Merchandise', percentage: 3, amount: 'Rp 4.1M' },
    { stream: 'Space Rental', percentage: 2, amount: 'Rp 2.8M' },
  ];

  const handleMetricClick = (metric: string) => {
    setSelectedMetric(selectedMetric === metric ? null : metric);
    track('business_metric_view', { metric, time_range: timeRange });
  };

  const handleTimeRangeChange = (range: 'week' | 'month' | 'quarter') => {
    setTimeRange(range);
    track('metric_timerange_change', { range });
  };

  const currentMetrics = metrics[timeRange];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-charcoal-dark mb-3">
          Business Metrics Dashboard
        </h2>
        <p className="text-charcoal-medium max-w-2xl mx-auto">
          Real-time analytics showing guest engagement, conversion rates, and
          revenue performance across our food hall ecosystem.
        </p>
      </div>

      {/* Time Range Selector */}
      <div className="flex justify-center gap-2">
        {(['week', 'month', 'quarter'] as const).map((range) => (
          <Button
            key={range}
            variant={timeRange === range ? 'default' : 'outline'}
            onClick={() => handleTimeRangeChange(range)}
            className="capitalize"
          >
            {range === 'week' && <Clock className="w-4 h-4 mr-2" />}
            Past {range}
          </Button>
        ))}
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card
          className="bg-pure-white/80 backdrop-blur cursor-pointer hover:border-burgundy-primary/30 transition-colors"
          onClick={() => handleMetricClick('visitors')}
        >
          <CardContent className="p-4 text-center">
            <Users className="w-6 h-6 text-burgundy-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-charcoal-dark">
              {currentMetrics.totalVisitors.toLocaleString()}
            </div>
            <div className="text-xs text-charcoal-medium">Total Visitors</div>
            <Badge variant="secondary" className="mt-1 text-xs">
              +12.4%
            </Badge>
          </CardContent>
        </Card>

        <Card
          className="bg-pure-white/80 backdrop-blur cursor-pointer hover:border-burgundy-primary/30 transition-colors"
          onClick={() => handleMetricClick('conversion')}
        >
          <CardContent className="p-4 text-center">
            <ShoppingCart className="w-6 h-6 text-burgundy-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-charcoal-dark">
              {currentMetrics.orderConversion}%
            </div>
            <div className="text-xs text-charcoal-medium">Order Conversion</div>
            <Badge variant="secondary" className="mt-1 text-xs">
              +5.2%
            </Badge>
          </CardContent>
        </Card>

        <Card
          className="bg-pure-white/80 backdrop-blur cursor-pointer hover:border-burgundy-primary/30 transition-colors"
          onClick={() => handleMetricClick('ticket')}
        >
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-6 h-6 text-burgundy-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-charcoal-dark">
              {(currentMetrics.avgTicket / 1000).toFixed(0)}k
            </div>
            <div className="text-xs text-charcoal-medium">Avg Ticket (IDR)</div>
            <Badge variant="secondary" className="mt-1 text-xs">
              +8.1%
            </Badge>
          </CardContent>
        </Card>

        <Card
          className="bg-pure-white/80 backdrop-blur cursor-pointer hover:border-burgundy-primary/30 transition-colors"
          onClick={() => handleMetricClick('passport')}
        >
          <CardContent className="p-4 text-center">
            <Star className="w-6 h-6 text-mustard-accent mx-auto mb-2" />
            <div className="text-2xl font-bold text-charcoal-dark">
              {currentMetrics.tastePassportEngagement}%
            </div>
            <div className="text-xs text-charcoal-medium">
              Passport Engagement
            </div>
            <Badge variant="secondary" className="mt-1 text-xs">
              +15.3%
            </Badge>
          </CardContent>
        </Card>

        <Card
          className="bg-pure-white/80 backdrop-blur cursor-pointer hover:border-burgundy-primary/30 transition-colors"
          onClick={() => handleMetricClick('repeat')}
        >
          <CardContent className="p-4 text-center">
            <Eye className="w-6 h-6 text-burgundy-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-charcoal-dark">
              {currentMetrics.repeatCustomers}%
            </div>
            <div className="text-xs text-charcoal-medium">Repeat Customers</div>
            <Badge variant="secondary" className="mt-1 text-xs">
              +7.9%
            </Badge>
          </CardContent>
        </Card>

        <Card
          className="bg-pure-white/80 backdrop-blur cursor-pointer hover:border-burgundy-primary/30 transition-colors"
          onClick={() => handleMetricClick('hours')}
        >
          <CardContent className="p-4 text-center">
            <Clock className="w-6 h-6 text-burgundy-primary mx-auto mb-2" />
            <div className="text-lg font-bold text-charcoal-dark">Peak</div>
            <div className="text-xs text-charcoal-medium">Hours Analysis</div>
            <Badge variant="secondary" className="mt-1 text-xs">
              Live Data
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Zone Performance */}
      <Card className="bg-pure-white/80 backdrop-blur">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-charcoal-dark mb-4">
            Zone Performance Analytics
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {zoneMetrics.map((zone) => (
              <div key={zone.zone} className="bg-cream-light/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-burgundy-primary" />
                  <span className="font-medium text-charcoal-dark text-sm">
                    {zone.zone}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-charcoal-medium">Visits:</span>
                    <span className="font-medium">{zone.visits}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-charcoal-medium">Engagement:</span>
                    <span className="font-medium">{zone.engagement} min</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-charcoal-medium">Orders:</span>
                    <span className="font-medium">{zone.orders}</span>
                  </div>
                  <div className="w-full bg-cream-medium h-2 rounded-full">
                    <div
                      className="bg-burgundy-primary h-2 rounded-full"
                      style={{ width: `${(zone.orders / zone.visits) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Revenue Streams */}
      <Card className="bg-pure-white/80 backdrop-blur">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-charcoal-dark mb-4">
            Revenue Streams Breakdown
          </h3>
          <div className="space-y-3">
            {revenueStreams.map((stream) => (
              <div
                key={stream.stream}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-sm font-medium text-charcoal-dark min-w-32">
                    {stream.stream}
                  </span>
                  <div className="flex-1 bg-cream-light h-3 rounded-full">
                    <div
                      className="bg-gradient-to-r from-burgundy-primary to-burgundy-dark h-3 rounded-full"
                      style={{ width: `${stream.percentage}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-charcoal-medium">
                    {stream.percentage}%
                  </span>
                  <span className="text-sm font-bold text-burgundy-primary min-w-20">
                    {stream.amount}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Demo Note */}
      <div className="text-center bg-cream-light/50 rounded-lg p-6">
        <h4 className="font-semibold text-charcoal-dark mb-2">
          Real Analytics Integration
        </h4>
        <p className="text-sm text-charcoal-medium mb-4">
          Live data from POS systems, foot traffic sensors, mobile app
          analytics, and guest feedback platforms provide comprehensive business
          intelligence.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-burgundy-primary">
              Real-time
            </div>
            <div className="text-xs text-charcoal-medium">Data Updates</div>
          </div>
          <div>
            <div className="text-lg font-bold text-burgundy-primary">99.9%</div>
            <div className="text-xs text-charcoal-medium">Accuracy Rate</div>
          </div>
          <div>
            <div className="text-lg font-bold text-burgundy-primary">24/7</div>
            <div className="text-xs text-charcoal-medium">Monitoring</div>
          </div>
          <div>
            <div className="text-lg font-bold text-burgundy-primary">API</div>
            <div className="text-xs text-charcoal-medium">
              Integration Ready
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoBusinessMetrics;
