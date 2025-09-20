import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Building, Map, DollarSign, Settings, FileText, Users, HelpCircle,
  Calendar, CheckCircle, Star, TrendingUp, Shield, RefreshCw, AlertCircle, LucideProps
} from 'lucide-react';
import { useTenantsPortal } from '@/hooks/useTenantsPortal';
import ImprovedNavigation from '@/components/ImprovedNavigation';

// Icon mapping
const iconMap: { [key: string]: React.FC<LucideProps> } = {
  Building, Map, DollarSign, Settings, FileText, Users, HelpCircle,
  Calendar, CheckCircle, Star, TrendingUp, Shield
};

const TenantsPortal = () => {
  const { sections, benefits, loading, error, refreshData } = useTenantsPortal();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p>Loading Tenant Portal...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto p-6 text-center">
        <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
        <h2 className="text-2xl font-semibold text-red-600 mb-2">Failed to load portal data</h2>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={refreshData}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-pure-white via-cream-light to-cream-medium/30">
      <ImprovedNavigation />

      <div className="container mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-charcoal mb-4">
            Tenants Portal
          </h1>
          <p className="text-lg text-charcoal/70 max-w-2xl mx-auto">
            Join ODE Food Hall as a tenant and be part of Bali's premier
            culinary destination
          </p>
          <Badge variant="outline" className="mt-4">
            Open to All - Public Access
          </Badge>
        </div>

        {/* Tenant Sections */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-charcoal mb-8 text-center">
            Tenant Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sections.map((section) => {
                const Icon = iconMap[section.icon_name] || HelpCircle;
                return (
                    <Card
                        key={section.id}
                        className="group hover:shadow-elegant transition-all duration-300"
                    >
                        <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-gradient-light rounded-lg">
                            <Icon className="w-5 h-5 text-primary" />
                            </div>
                            <CardTitle className="text-lg">{section.title}</CardTitle>
                        </div>
                        <p className="text-sm text-charcoal/70">
                            {section.description}
                        </p>
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
                            <Link to={section.href}>View Details</Link>
                        </Button>
                        </CardContent>
                    </Card>
                );
            })}
          </div>
        </section>

        {/* Tenant Benefits */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-charcoal mb-8 text-center">
            Why Choose ODE Food Hall?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit) => {
                const Icon = iconMap[benefit.icon_name] || Star;
                return (
                    <Card
                        key={benefit.id}
                        className="group hover:shadow-elegant transition-all duration-300"
                    >
                        <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-gradient-light rounded-lg">
                            <Icon className="w-5 h-5 text-primary" />
                            </div>
                            <CardTitle className="text-lg">{benefit.title}</CardTitle>
                        </div>
                        <p className="text-sm text-charcoal/70">
                            {benefit.description}
                        </p>
                        </CardHeader>
                        <CardContent>
                        <div className="flex items-center gap-2 text-sm text-primary font-medium">
                            <CheckCircle className="w-4 h-4" />
                            {benefit.benefit}
                        </div>
                        </CardContent>
                    </Card>
                );
            })}
          </div>
        </section>

        {/* Quick Stats */}
        <section className="bg-gradient-light rounded-2xl p-8 text-center">
          <h3 className="text-xl font-bold text-charcoal mb-6">
            ODE Food Hall by Numbers
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <div className="text-2xl font-bold text-primary mb-2">
                1,800 m²
              </div>
              <div className="text-sm text-charcoal/70">Total Area</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary mb-2">12</div>
              <div className="text-sm text-charcoal/70">Kitchen Spaces</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary mb-2">400+</div>
              <div className="text-sm text-charcoal/70">Dining Seats</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary mb-2">24/7</div>
              <div className="text-sm text-charcoal/70">Support</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TenantsPortal;
