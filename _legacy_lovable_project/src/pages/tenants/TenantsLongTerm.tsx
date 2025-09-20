import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  DollarSign,
  Shield,
  Star,
  CheckCircle,
  ArrowRight,
  Building,
  Users,
  Zap,
  Award,
} from 'lucide-react';
import ImprovedNavigation from '@/components/ImprovedNavigation';

const TenantsLongTerm = () => {
  const packages = [
    {
      name: 'Standard Corner',
      size: '15m²',
      price: '$2,500/month',
      duration: '12 months',
      features: [
        'Prime corner location',
        'Full equipment package',
        'Storage space included',
        'Basic marketing support',
        'Utilities covered',
        'Cleaning service',
      ],
      popular: false,
    },
    {
      name: 'Premium Corner',
      size: '25m²',
      price: '$4,000/month',
      duration: '12 months',
      features: [
        'Premium corner location',
        'Full equipment package',
        'Extended storage',
        'Full marketing package',
        'VIP entrance access',
        'Priority support',
        'Utilities covered',
        'Cleaning service',
      ],
      popular: true,
    },
    {
      name: 'Flexible Space',
      size: '10-20m²',
      price: '$1,800/month',
      duration: '6-12 months',
      features: [
        'Flexible space options',
        'Basic equipment',
        'Storage included',
        'Marketing support',
        'Utilities covered',
        'Cleaning service',
      ],
      popular: false,
    },
  ];

  const benefits = [
    {
      icon: Calendar,
      title: 'Long-term Stability',
      description:
        '12-month contracts provide business stability and growth planning',
    },
    {
      icon: Shield,
      title: 'Full Support',
      description:
        'Complete business support including operations, marketing, and management',
    },
    {
      icon: Star,
      title: 'Prime Locations',
      description:
        'Best spots in the food hall with maximum visibility and foot traffic',
    },
    {
      icon: Award,
      title: 'Premium Experience',
      description: 'Access to premium amenities and exclusive events',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pure-white via-cream-light to-cream-medium/30">
      <ImprovedNavigation />

      <div className="container mx-auto px-4 pt-24 pb-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-charcoal mb-4">
            Long-term Residency
          </h1>
          <p className="text-lg text-charcoal/70 max-w-3xl mx-auto mb-8">
            Establish your culinary presence in ODE Food Hall with our long-term
            residency program. Perfect for established restaurants and food
            businesses looking for a permanent home.
          </p>
          <Badge variant="outline" className="px-4 py-2">
            <Calendar className="w-4 h-4 mr-2" />
            12-Month Contracts Available
          </Badge>
        </div>

        {/* Packages */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-charcoal mb-8 text-center">
            Residency Packages
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.map((pkg, index) => (
              <Card
                key={index}
                className={`group hover:shadow-elegant transition-all duration-300 ${
                  pkg.popular ? 'ring-2 ring-primary' : ''
                }`}
              >
                {pkg.popular && (
                  <div className="bg-primary text-primary-foreground text-center py-2 text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-xl">{pkg.name}</CardTitle>
                    {pkg.popular && <Star className="w-5 h-5 text-primary" />}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-charcoal/60" />
                      <span className="text-sm text-charcoal/70">
                        {pkg.size}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-charcoal/60" />
                      <span className="text-sm text-charcoal/70">
                        {pkg.price}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-charcoal/60" />
                      <span className="text-sm text-charcoal/70">
                        {pkg.duration}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span className="text-sm text-charcoal">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    variant={pkg.popular ? 'default' : 'outline'}
                  >
                    Choose Package
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Benefits */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-charcoal mb-8 text-center">
            Long-term Benefits
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <Card
                key={index}
                className="group hover:shadow-elegant transition-all duration-300"
              >
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-gradient-light rounded-lg">
                      <benefit.icon className="w-5 h-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{benefit.title}</CardTitle>
                  </div>
                  <p className="text-sm text-charcoal/70">
                    {benefit.description}
                  </p>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-light rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-charcoal mb-4">
            Ready for Long-term Partnership?
          </h3>
          <p className="text-charcoal/70 mb-6 max-w-2xl mx-auto">
            Join our long-term residency program and build your culinary legacy
            in ODE Food Hall.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <a href="/tenants/apply">
                Apply for Residency
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="/tenants/rates">View Rates</a>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TenantsLongTerm;
