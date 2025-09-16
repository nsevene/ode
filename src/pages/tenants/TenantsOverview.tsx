import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Building, 
  MapPin, 
  Users, 
  Star,
  CheckCircle,
  ArrowRight,
  Calendar,
  DollarSign,
  Shield,
  Zap
} from 'lucide-react';
import ImprovedNavigation from '@/components/ImprovedNavigation';

const TenantsOverview = () => {
  const benefits = [
    {
      icon: MapPin,
      title: "Prime Location",
      description: "Located in the heart of Ubud, Bali - the cultural and spiritual center of the island",
      stats: "1,800 m² total area"
    },
    {
      icon: Users,
      title: "High Foot Traffic",
      description: "Strategic location between Central Market and Monkey Forest Road",
      stats: "10,000+ daily visitors"
    },
    {
      icon: Star,
      title: "Premium Experience",
      description: "Curated culinary experience with 12 diverse kitchen corners",
      stats: "400+ dining seats"
    },
    {
      icon: Shield,
      title: "Full Support",
      description: "Complete business support including marketing, operations, and management",
      stats: "24/7 support team"
    }
  ];

  const features = [
    "Professional kitchen equipment included",
    "Utilities and cleaning services covered",
    "Marketing and promotional support",
    "Flexible contract terms",
    "Prime location with high visibility",
    "Comprehensive business support"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pure-white via-cream-light to-cream-medium/30">
      <ImprovedNavigation />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-charcoal mb-4">
            Welcome to ODE Food Hall
          </h1>
          <p className="text-lg text-charcoal/70 max-w-3xl mx-auto mb-8">
            Join Bali's premier culinary destination and be part of a unique food hall experience 
            that celebrates authentic flavors from around the world.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Badge variant="outline" className="px-4 py-2">
              <Calendar className="w-4 h-4 mr-2" />
              Opening December 2025
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              <MapPin className="w-4 h-4 mr-2" />
              Ubud, Bali
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              <Building className="w-4 h-4 mr-2" />
              1,800 m²
            </Badge>
          </div>
        </div>

        {/* Benefits Grid */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-charcoal mb-8 text-center">
            Why Choose ODE Food Hall?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="group hover:shadow-elegant transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-gradient-light rounded-lg">
                      <benefit.icon className="w-5 h-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{benefit.title}</CardTitle>
                  </div>
                  <p className="text-sm text-charcoal/70">{benefit.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="text-sm font-medium text-primary">{benefit.stats}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Features List */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-charcoal mb-8 text-center">
            What's Included
          </h2>
          <Card>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-charcoal">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-light rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-charcoal mb-4">
            Ready to Join ODE Food Hall?
          </h3>
          <p className="text-charcoal/70 mb-6 max-w-2xl mx-auto">
            Start your culinary journey with us and be part of Bali's most innovative food hall experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <a href="/tenants/apply">
                Apply Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="/tenants/floor-plan">
                View Floor Plan
              </a>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TenantsOverview;