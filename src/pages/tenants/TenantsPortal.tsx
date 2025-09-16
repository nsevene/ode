import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Building, 
  Map, 
  DollarSign, 
  Settings, 
  FileText, 
  Users, 
  HelpCircle,
  Calendar,
  CheckCircle,
  Star,
  TrendingUp,
  Shield
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useRoles } from '@/hooks/useRoles';
import ProtectedRoute from '@/components/ProtectedRoute';
import ImprovedNavigation from '@/components/ImprovedNavigation';

const TenantsPortal = () => {
  const { user } = useAuth();
  const { userRole } = useRoles();

  const tenantSections = [
    {
      title: "Overview",
      description: "General information about ODE Food Hall and tenant opportunities",
      icon: Building,
      href: "/tenants/overview",
      status: "available",
      features: ["Project overview", "Location benefits", "Market opportunity", "Success stories"]
    },
    {
      title: "Long-term Residency",
      description: "Permanent kitchen spaces and long-term partnership opportunities",
      icon: Calendar,
      href: "/tenants/long-term",
      status: "available",
      features: ["12-month contracts", "Prime locations", "Full equipment", "Marketing support"]
    },
    {
      title: "Pop-up Kitchen",
      description: "Flexible pop-up kitchen concept for short-term partnerships",
      icon: Star,
      href: "/tenants/open-kitchen",
      status: "available",
      features: ["Flexible booking", "Event partnerships", "Trial periods", "Quick setup"]
    },
    {
      title: "Interactive Floor Plan",
      description: "Explore available spaces and book your preferred location",
      icon: Map,
      href: "/tenants/floor-plan",
      status: "available",
      features: ["Interactive map", "Space availability", "Real-time booking", "3D visualization"]
    },
    {
      title: "Rates & Pricing",
      description: "Transparent pricing structure and payment terms",
      icon: DollarSign,
      href: "/tenants/rates",
      status: "available",
      features: ["Competitive rates", "Flexible payment", "No hidden fees", "Volume discounts"]
    },
    {
      title: "Included Services",
      description: "Comprehensive services and amenities included with your space",
      icon: Settings,
      href: "/tenants/services",
      status: "available",
      features: ["Equipment included", "Utilities covered", "Cleaning service", "Security"]
    },
    {
      title: "Application Form",
      description: "Apply for a kitchen space and start your ODE journey",
      icon: FileText,
      href: "/tenants/apply",
      status: "available",
      features: ["Easy application", "Quick approval", "Personal consultation", "Support team"]
    },
    {
      title: "Team Information",
      description: "Meet the ODE Food Hall team and support staff",
      icon: Users,
      href: "/tenants/team",
      status: "available",
      features: ["Management team", "Support staff", "Contact information", "Response times"]
    },
    {
      title: "FAQ",
      description: "Frequently asked questions and answers for potential tenants",
      icon: HelpCircle,
      href: "/tenants/faq",
      status: "available",
      features: ["Common questions", "Application process", "Requirements", "Support"]
    }
  ];

  const tenantBenefits = [
    {
      title: "Prime Location",
      description: "Located in the heart of Ubud, Bali",
      icon: Map,
      benefit: "High foot traffic and tourist visibility"
    },
    {
      title: "Full Equipment",
      description: "Professional kitchen equipment included",
      icon: Settings,
      benefit: "No additional equipment costs"
    },
    {
      title: "Marketing Support",
      description: "Comprehensive marketing and promotion",
      icon: TrendingUp,
      benefit: "Increased visibility and customer reach"
    },
    {
      title: "Flexible Terms",
      description: "Adaptable contract terms and conditions",
      icon: Calendar,
      benefit: "Tailored to your business needs"
    }
  ];

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
            Join ODE Food Hall as a tenant and be part of Bali's premier culinary destination
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
            {tenantSections.map((section, index) => (
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
                      View Details
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Tenant Benefits */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-charcoal mb-8 text-center">
            Why Choose ODE Food Hall?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tenantBenefits.map((benefit, index) => (
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
                  <div className="flex items-center gap-2 text-sm text-primary font-medium">
                    <CheckCircle className="w-4 h-4" />
                    {benefit.benefit}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Quick Stats */}
        <section className="bg-gradient-light rounded-2xl p-8 text-center">
          <h3 className="text-xl font-bold text-charcoal mb-6">ODE Food Hall by Numbers</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <div className="text-2xl font-bold text-primary mb-2">1,800 m²</div>
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