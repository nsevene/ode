import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Star, TrendingUp, Users, Eye, ShoppingCart, Heart } from 'lucide-react';
import { track } from '@/lib/analytics';

const DemoGuestJourney = () => {
  const [selectedStep, setSelectedStep] = useState<number | null>(null);
  const [activeMetric, setActiveMetric] = useState<string | null>(null);

  const journeySteps = [
    {
      id: 1,
      title: 'Discovery & Arrival',
      description: 'Guest discovers Ode through social media, reviews, or word-of-mouth',
      icon: <Eye className="w-5 h-5" />,
      duration: '5-10 min',
      conversionRate: '85%',
      dropoffReasons: ['Parking issues', 'Wait times', 'Price concerns'],
      optimizations: ['Valet service', 'Reservation system', 'Value communication'],
      metrics: {
        socialTraffic: '42%',
        organicSearch: '28%',
        wordOfMouth: '30%'
      }
    },
    {
      id: 2,
      title: 'First Impression',
      description: 'Guest enters and experiences our ambiance, layout, and initial service',
      icon: <Star className="w-5 h-5" />,
      duration: '2-5 min',
      conversionRate: '92%',
      dropoffReasons: ['Overwhelming choice', 'No clear guidance', 'Crowded'],
      optimizations: ['Welcome experience', 'Clear signage', 'Staff guidance'],
      metrics: {
        satisfaction: '4.7/5',
        stayDuration: '47 min',
        returnRate: '31%'
      }
    },
    {
      id: 3,
      title: 'Menu Exploration',
      description: 'Guest browses different kitchens and menu options',
      icon: <MapPin className="w-5 h-5" />,
      duration: '8-15 min',
      conversionRate: '78%',
      dropoffReasons: ['Decision paralysis', 'Unclear pricing', 'Dietary restrictions'],
      optimizations: ['Curated recommendations', 'Clear dietary labels', 'Staff assistance'],
      metrics: {
        zonesVisited: '2.3 avg',
        menuViews: '4.1 avg',
        askQuestions: '67%'
      }
    },
    {
      id: 4,
      title: 'Order Placement',
      description: 'Guest selects items and places order through our system',
      icon: <ShoppingCart className="w-5 h-5" />,
      duration: '3-7 min',
      conversionRate: '71%',
      dropoffReasons: ['Complex ordering', 'Payment issues', 'Long queues'],
      optimizations: ['Streamlined UX', 'Multiple payment options', 'Queue management'],
      metrics: {
        avgTicket: 'Rp 152k',
        itemsPerOrder: '2.4',
        upsellSuccess: '23%'
      }
    },
    {
      id: 5,
      title: 'Dining Experience',
      description: 'Guest receives order, dines, and potentially explores other areas',
      icon: <Heart className="w-5 h-5" />,
      duration: '25-45 min',
      conversionRate: '96%',
      dropoffReasons: ['Food quality issues', 'Service delays', 'Uncomfortable seating'],
      optimizations: ['Quality control', 'Service training', 'Seating variety'],
      metrics: {
        satisfaction: '4.6/5',
        additionalPurchases: '34%',
        photoShares: '28%'
      }
    },
    {
      id: 6,
      title: 'Taste Passport Engagement',
      description: 'Guest discovers and engages with gamification elements',
      icon: <TrendingUp className="w-5 h-5" />,
      duration: '5-20 min',
      conversionRate: '41%',
      dropoffReasons: ['Not aware', 'Too complex', 'No immediate value'],
      optimizations: ['Better promotion', 'Simplified onboarding', 'Instant rewards'],
      metrics: {
        signupRate: '41%',
        missionCompletion: '23%',
        returnForQuests: '18%'
      }
    },
    {
      id: 7,
      title: 'Departure & Retention',
      description: 'Guest leaves with intention to return and potentially shares experience',
      icon: <Users className="w-5 h-5" />,
      duration: '2-5 min',
      conversionRate: '89%',
      dropoffReasons: ['Forgotten experience', 'No follow-up', 'Competition'],
      optimizations: ['Email collection', 'Social follow-up', 'Loyalty program'],
      metrics: {
        returnIntention: '89%',
        socialShares: '15%',
        reviewRate: '8%'
      }
    }
  ];

  const overallMetrics = {
    totalVisitors: 5892,
    conversionToOrder: 71.2,
    avgSessionTime: 47,
    returnRate: 31.8,
    npsScore: 67,
    tastePassportAdoption: 41.3
  };

  const handleStepClick = (stepId: number) => {
    setSelectedStep(selectedStep === stepId ? null : stepId);
    track('guest_journey_step_view', { step: stepId });
  };

  const handleMetricClick = (metric: string) => {
    setActiveMetric(activeMetric === metric ? null : metric);
    track('guest_journey_metric_view', { metric });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-charcoal-dark mb-3">Guest Journey Analytics</h2>
        <p className="text-charcoal-medium max-w-2xl mx-auto">
          Detailed analysis of the guest experience from discovery to retention. 
          Identify opportunities to optimize conversion at each touchpoint.
        </p>
      </div>

      {/* Overall Metrics */}
      <Card className="bg-gradient-to-r from-burgundy-primary to-burgundy-dark text-pure-white">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-center">Overall Journey Performance</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div 
              className="text-center cursor-pointer hover:bg-pure-white/10 rounded-lg p-2 transition-colors"
              onClick={() => handleMetricClick('visitors')}
            >
              <div className="text-xl font-bold">{overallMetrics.totalVisitors.toLocaleString()}</div>
              <div className="text-xs text-burgundy-light">Monthly Visitors</div>
            </div>
            <div 
              className="text-center cursor-pointer hover:bg-pure-white/10 rounded-lg p-2 transition-colors"
              onClick={() => handleMetricClick('conversion')}
            >
              <div className="text-xl font-bold">{overallMetrics.conversionToOrder}%</div>
              <div className="text-xs text-burgundy-light">Order Conversion</div>
            </div>
            <div 
              className="text-center cursor-pointer hover:bg-pure-white/10 rounded-lg p-2 transition-colors"
              onClick={() => handleMetricClick('session')}
            >
              <div className="text-xl font-bold">{overallMetrics.avgSessionTime} min</div>
              <div className="text-xs text-burgundy-light">Avg Session</div>
            </div>
            <div 
              className="text-center cursor-pointer hover:bg-pure-white/10 rounded-lg p-2 transition-colors"
              onClick={() => handleMetricClick('return')}
            >
              <div className="text-xl font-bold">{overallMetrics.returnRate}%</div>
              <div className="text-xs text-burgundy-light">Return Rate</div>
            </div>
            <div 
              className="text-center cursor-pointer hover:bg-pure-white/10 rounded-lg p-2 transition-colors"
              onClick={() => handleMetricClick('nps')}
            >
              <div className="text-xl font-bold">{overallMetrics.npsScore}</div>
              <div className="text-xs text-burgundy-light">NPS Score</div>
            </div>
            <div 
              className="text-center cursor-pointer hover:bg-pure-white/10 rounded-lg p-2 transition-colors"
              onClick={() => handleMetricClick('passport')}
            >
              <div className="text-xl font-bold">{overallMetrics.tastePassportAdoption}%</div>
              <div className="text-xs text-burgundy-light">Passport Adoption</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Journey Steps */}
      <div className="space-y-4">
        {journeySteps.map((step, index) => (
          <Card 
            key={step.id}
            className={`bg-pure-white/80 backdrop-blur cursor-pointer transition-all ${
              selectedStep === step.id 
                ? 'border-burgundy-primary shadow-lg' 
                : 'border-cream-medium hover:border-burgundy-primary/30'
            }`}
            onClick={() => handleStepClick(step.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-burgundy-primary text-pure-white rounded-full flex items-center justify-center font-bold text-sm">
                    {step.id}
                  </div>
                  <div className="w-10 h-10 bg-burgundy-primary/10 rounded-lg flex items-center justify-center text-burgundy-primary">
                    {step.icon}
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-charcoal-dark">{step.title}</h4>
                    <div className="flex items-center gap-2">
                <Badge 
                  className={`${
                    parseFloat(step.conversionRate.toString()) >= 80 
                      ? 'bg-green-100 text-green-700' 
                      : parseFloat(step.conversionRate.toString()) >= 70 
                      ? 'bg-yellow-100 text-yellow-700' 
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                        {step.conversionRate}% conversion
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        {step.duration}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-sm text-charcoal-medium">{step.description}</p>
                </div>
              </div>

              {selectedStep === step.id && (
                <div className="mt-4 pt-4 border-t border-cream-medium">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <h5 className="font-medium text-charcoal-dark mb-2 text-sm">Drop-off Reasons</h5>
                      <ul className="text-xs text-charcoal-medium space-y-1">
                        {step.dropoffReasons.map((reason, idx) => (
                          <li key={idx} className="flex items-center gap-1">
                            <div className="w-1 h-1 bg-red-500 rounded-full" />
                            {reason}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-charcoal-dark mb-2 text-sm">Optimizations</h5>
                      <ul className="text-xs text-charcoal-medium space-y-1">
                        {step.optimizations.map((optimization, idx) => (
                          <li key={idx} className="flex items-center gap-1">
                            <div className="w-1 h-1 bg-green-500 rounded-full" />
                            {optimization}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-charcoal-dark mb-2 text-sm">Key Metrics</h5>
                      <div className="space-y-1">
                        {Object.entries(step.metrics).map(([key, value]) => (
                          <div key={key} className="flex justify-between text-xs">
                            <span className="text-charcoal-medium capitalize">
                              {key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                            </span>
                            <span className="font-medium text-burgundy-primary">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Optimization Opportunities */}
      <Card className="bg-mustard-accent/10 border-mustard-accent/30">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-charcoal-dark mb-4">Top Optimization Opportunities</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-charcoal-dark mb-3">Highest Impact Improvements</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-pure-white rounded-lg">
                  <span className="text-sm text-charcoal-dark">Taste Passport Promotion</span>
                  <Badge className="bg-green-100 text-green-700">+15% retention</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-pure-white rounded-lg">
                  <span className="text-sm text-charcoal-dark">Menu Decision Support</span>
                  <Badge className="bg-green-100 text-green-700">+8% conversion</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-pure-white rounded-lg">
                  <span className="text-sm text-charcoal-dark">Payment Flow Optimization</span>
                  <Badge className="bg-green-100 text-green-700">+5% completion</Badge>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-charcoal-dark mb-3">Revenue Impact Analysis</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-pure-white rounded-lg">
                  <span className="text-sm text-charcoal-dark">Avg Ticket Increase</span>
                  <span className="text-sm font-bold text-burgundy-primary">Rp 23k potential</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-pure-white rounded-lg">
                  <span className="text-sm text-charcoal-dark">Return Visit Frequency</span>
                  <span className="text-sm font-bold text-burgundy-primary">+1.2x monthly</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-pure-white rounded-lg">
                  <span className="text-sm text-charcoal-dark">Referral Rate Improvement</span>
                  <span className="text-sm font-bold text-burgundy-primary">+12% referrals</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Demo Summary */}
      <div className="text-center bg-cream-light/50 rounded-lg p-6">
        <h4 className="font-semibold text-charcoal-dark mb-2">Real-Time Journey Analytics</h4>
        <p className="text-sm text-charcoal-medium mb-4">
          Live tracking of guest behavior, conversion funnel analysis, and automated optimization recommendations 
          help partners maximize revenue at every touchpoint.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div>
            <div className="text-lg font-bold text-burgundy-primary">Real-time</div>
            <div className="text-xs text-charcoal-medium">Journey Tracking</div>
          </div>
          <div>
            <div className="text-lg font-bold text-burgundy-primary">7 Steps</div>
            <div className="text-xs text-charcoal-medium">Conversion Analysis</div>
          </div>
          <div>
            <div className="text-lg font-bold text-burgundy-primary">Auto</div>
            <div className="text-xs text-charcoal-medium">Optimization</div>
          </div>
          <div>
            <div className="text-lg font-bold text-burgundy-primary">A/B</div>
            <div className="text-xs text-charcoal-medium">Testing Ready</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoGuestJourney;