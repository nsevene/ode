import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  Calendar, 
  Gamepad2, 
  Coffee, 
  Truck, 
  Megaphone, 
  Users, 
  Building,
  Star,
  TrendingUp,
  Share2,
  Camera
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useRoles } from '@/hooks/useRoles';
import ProtectedRoute from '@/components/ProtectedRoute';
import ImprovedNavigation from '@/components/ImprovedNavigation';

const MarketingPortal = () => {
  const { user } = useAuth();
  const { userRole } = useRoles();

  const marketingSections = [
    {
      title: "Taste Alley Marketing",
      description: "Main concept marketing and brand positioning",
      icon: Target,
      href: "/marketing/taste-alley",
      status: "available",
      features: ["Brand strategy", "Visual identity", "Content marketing", "Social media"]
    },
    {
      title: "Events & Nightlife",
      description: "Evening events and nightlife marketing strategy",
      icon: Calendar,
      href: "/marketing/events-nightlife",
      status: "available",
      features: ["Event planning", "Nightlife promotion", "Entertainment booking", "Atmosphere design"]
    },
    {
      title: "Compass & Passport",
      description: "Gamification features and digital engagement",
      icon: Gamepad2,
      href: "/marketing/compass-passport",
      status: "available",
      features: ["Gamification strategy", "Digital rewards", "User engagement", "Loyalty programs"]
    },
    {
      title: "Breakfast for Villas",
      description: "Villa delivery service and partnership program",
      icon: Coffee,
      href: "/marketing/breakfast-for-villas",
      status: "available",
      features: ["Partnership program", "Delivery marketing", "Villa outreach", "Commission structure"]
    },
    {
      title: "Delivery Partnerships",
      description: "Food delivery platform integrations",
      icon: Truck,
      href: "/marketing/delivery-partnerships",
      status: "available",
      features: ["Platform integration", "Delivery optimization", "Partner management", "Commission tracking"]
    },
    {
      title: "PR & Digital Marketing",
      description: "Public relations and digital marketing strategy",
      icon: Megaphone,
      href: "/marketing/pr-digital",
      status: "available",
      features: ["PR strategy", "Digital campaigns", "Influencer partnerships", "Media relations"]
    },
    {
      title: "Kids Area Marketing",
      description: "Family experience and children's programming",
      icon: Users,
      href: "/marketing/kids-area",
      status: "available",
      features: ["Family marketing", "Kids programming", "Safety messaging", "Parent engagement"]
    },
    {
      title: "Event Hall Marketing",
      description: "Private events and corporate bookings",
      icon: Building,
      href: "/marketing/event-hall",
      status: "available",
      features: ["Event marketing", "Corporate outreach", "Wedding packages", "Private dining"]
    }
  ];

  const marketingTools = [
    {
      title: "Brand Assets",
      description: "Logos, images, and brand guidelines",
      icon: Camera,
      href: "/marketing/assets",
      status: "available"
    },
    {
      title: "Content Calendar",
      description: "Social media and content planning",
      icon: Calendar,
      href: "/marketing/calendar",
      status: "available"
    },
    {
      title: "Analytics Dashboard",
      description: "Marketing performance and metrics",
      icon: TrendingUp,
      href: "/marketing/analytics",
      status: "available"
    },
    {
      title: "Social Media Kit",
      description: "Ready-to-use social media content",
      icon: Share2,
      href: "/marketing/social-kit",
      status: "available"
    }
  ];

  return (
    <ProtectedRoute requiredRole="tenant">
      <div className="min-h-screen bg-gradient-to-br from-pure-white via-cream-light to-cream-medium/30">
        <ImprovedNavigation />
        
        <div className="container mx-auto px-4 pt-24 pb-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-charcoal mb-4">
              Marketing Portal
            </h1>
            <p className="text-lg text-charcoal/70 max-w-2xl mx-auto">
              Comprehensive marketing tools and strategies for ODE Food Hall
            </p>
            <Badge variant="outline" className="mt-4">
              Tenant & Partner Access
            </Badge>
          </div>

          {/* Marketing Sections */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-charcoal mb-8 text-center">
              Marketing Strategies
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {marketingSections.map((section, index) => (
                <Card key={index} className="group hover:shadow-elegant transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-gradient-light rounded-lg">
                        <section.icon className="w-5 h-5 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{section.title}</CardTitle>
                    </div>
                    <p className="text-sm text-charcoal/70">{section.description}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-xs text-charcoal/60 space-y-1 mb-4">
                      {section.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <div className="w-1 h-1 bg-primary rounded-full" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button asChild className="w-full">
                      <Link to={section.href}>
                        View Strategy
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Marketing Tools */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-charcoal mb-8 text-center">
              Marketing Tools
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {marketingTools.map((tool, index) => (
                <Card key={index} className="group hover:shadow-elegant transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-gradient-light rounded-lg">
                        <tool.icon className="w-5 h-5 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{tool.title}</CardTitle>
                    </div>
                    <p className="text-sm text-charcoal/70">{tool.description}</p>
                  </CardHeader>
                  <CardContent>
                    <Button asChild className="w-full">
                      <Link to={tool.href}>
                        Access Tool
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Marketing Stats */}
          <section className="bg-gradient-light rounded-2xl p-8 text-center">
            <h3 className="text-xl font-bold text-charcoal mb-6">Marketing Performance</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <div className="text-2xl font-bold text-primary mb-2">12</div>
                <div className="text-sm text-charcoal/70">Marketing Channels</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary mb-2">50K+</div>
                <div className="text-sm text-charcoal/70">Social Media Reach</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary mb-2">85%</div>
                <div className="text-sm text-charcoal/70">Brand Awareness</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary mb-2">24/7</div>
                <div className="text-sm text-charcoal/70">Digital Presence</div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default MarketingPortal;