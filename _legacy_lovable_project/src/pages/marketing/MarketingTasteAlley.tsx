import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Target,
  Users,
  TrendingUp,
  Star,
  CheckCircle,
  ArrowRight,
  BarChart3,
  Share2,
  Camera,
  Map,
} from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import ImprovedNavigation from '@/components/ImprovedNavigation';

const MarketingTasteAlley = () => {
  const strategies = [
    {
      title: 'Brand Positioning',
      description:
        "Position ODE Food Hall as Bali's premier culinary destination",
      icon: Target,
      features: [
        'Unique value proposition',
        'Brand differentiation',
        'Market positioning',
        'Competitive analysis',
      ],
    },
    {
      title: 'Content Marketing',
      description:
        'Create engaging content that showcases the food hall experience',
      icon: Camera,
      features: [
        'Social media content',
        'Blog posts',
        'Video content',
        'Photography',
      ],
    },
    {
      title: 'Digital Marketing',
      description:
        'Comprehensive digital marketing strategy across all channels',
      icon: BarChart3,
      features: [
        'SEO optimization',
        'Google Ads',
        'Social media ads',
        'Email marketing',
      ],
    },
    {
      title: 'Community Building',
      description: 'Build a strong community around ODE Food Hall',
      icon: Users,
      features: [
        'Local partnerships',
        'Influencer collaborations',
        'Event marketing',
        'User-generated content',
      ],
    },
  ];

  const metrics = [
    {
      title: 'Brand Awareness',
      value: '85%',
      description: 'Target brand awareness in Ubud area',
    },
    {
      title: 'Social Media Reach',
      value: '50K+',
      description: 'Monthly social media reach',
    },
    {
      title: 'Website Traffic',
      value: '25K+',
      description: 'Monthly website visitors',
    },
    {
      title: 'Engagement Rate',
      value: '12%',
      description: 'Average social media engagement',
    },
  ];

  return (
    <ProtectedRoute requiredRole="tenant">
      <div className="min-h-screen bg-gradient-to-br from-pure-white via-cream-light to-cream-medium/30">
        <ImprovedNavigation />

        <div className="container mx-auto px-4 pt-24 pb-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-charcoal mb-4">
              Taste Alley Marketing Strategy
            </h1>
            <p className="text-lg text-charcoal/70 max-w-3xl mx-auto">
              Comprehensive marketing strategy for ODE Food Hall's main concept
              - the Taste Alley experience that celebrates authentic flavors
              from around the world.
            </p>
          </div>

          {/* Marketing Strategies */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-charcoal mb-8 text-center">
              Marketing Strategies
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {strategies.map((strategy, index) => (
                <Card
                  key={index}
                  className="group hover:shadow-elegant transition-all duration-300"
                >
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-gradient-light rounded-lg">
                        <strategy.icon className="w-5 h-5 text-primary" />
                      </div>
                      <CardTitle className="text-lg">
                        {strategy.title}
                      </CardTitle>
                    </div>
                    <p className="text-sm text-charcoal/70">
                      {strategy.description}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-xs text-charcoal/60 space-y-1 mb-4">
                      {strategy.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <div className="w-1 h-1 bg-primary rounded-full" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button variant="outline" className="w-full">
                      View Details
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Key Metrics */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-charcoal mb-8 text-center">
              Key Performance Indicators
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {metrics.map((metric, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <div className="text-3xl font-bold text-primary mb-2">
                      {metric.value}
                    </div>
                    <div className="text-lg font-medium text-charcoal mb-1">
                      {metric.title}
                    </div>
                    <div className="text-sm text-charcoal/60">
                      {metric.description}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Marketing Tools */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-charcoal mb-8 text-center">
              Marketing Tools & Resources
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="w-5 h-5" />
                    Brand Assets
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-charcoal/70 mb-4">
                    Download logos, images, and brand guidelines for your
                    marketing materials.
                  </p>
                  <Button variant="outline" className="w-full">
                    <Share2 className="w-4 h-4 mr-2" />
                    Download Assets
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Analytics Dashboard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-charcoal/70 mb-4">
                    Track your marketing performance and campaign effectiveness.
                  </p>
                  <Button variant="outline" className="w-full">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    View Analytics
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Map className="w-5 h-5" />
                    Local Partnerships
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-charcoal/70 mb-4">
                    Connect with local businesses and tourism partners in Ubud.
                  </p>
                  <Button variant="outline" className="w-full">
                    <Users className="w-4 h-4 mr-2" />
                    Find Partners
                  </Button>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-gradient-light rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-charcoal mb-4">
              Ready to Start Marketing?
            </h3>
            <p className="text-charcoal/70 mb-6 max-w-2xl mx-auto">
              Access our comprehensive marketing toolkit and start promoting ODE
              Food Hall today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">
                <Target className="w-4 h-4 mr-2" />
                Start Campaign
              </Button>
              <Button variant="outline" size="lg">
                <BarChart3 className="w-4 h-4 mr-2" />
                View Analytics
              </Button>
            </div>
          </section>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default MarketingTasteAlley;
