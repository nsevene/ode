import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  FileText, 
  Calculator, 
  Users, 
  Calendar,
  Building,
  DollarSign,
  BarChart3,
  Phone,
  Download,
  Eye
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useRoles } from '@/hooks/useRoles';
import ProtectedRoute from '@/components/ProtectedRoute';
import ImprovedNavigation from '@/components/ImprovedNavigation';

const InvestorsPortal = () => {
  const { user } = useAuth();
  const { userRole } = useRoles();

  const investorSections = [
    {
      title: "Investment Deck",
      description: "Comprehensive presentation of ODE Food Hall investment opportunity",
      icon: FileText,
      href: "/investors/deck",
      status: "available",
      features: ["Market analysis", "Financial projections", "Team overview", "Risk assessment"]
    },
    {
      title: "Financial Model",
      description: "Detailed financial projections and revenue models",
      icon: Calculator,
      href: "/investors/financial-model",
      status: "available",
      features: ["Revenue projections", "Cost analysis", "ROI calculations", "Break-even analysis"]
    },
    {
      title: "Ode by Night",
      description: "Evening concept and nightlife strategy",
      icon: Building,
      href: "/investors/ode-by-night",
      status: "available",
      features: ["Evening programming", "Nightlife strategy", "Revenue optimization", "Event planning"]
    },
    {
      title: "Development Roadmap",
      description: "Project timeline and development milestones",
      icon: BarChart3,
      href: "/investors/roadmap",
      status: "available",
      features: ["Construction timeline", "Opening phases", "Market entry strategy", "Growth plans"]
    },
    {
      title: "Team Profiles",
      description: "Meet the ODE Food Hall leadership team",
      icon: Users,
      href: "/investors/team",
      status: "available",
      features: ["Executive team", "Advisory board", "Key partnerships", "Experience highlights"]
    },
    {
      title: "OPEX Breakdown",
      description: "Detailed operational expense analysis",
      icon: DollarSign,
      href: "/investors/opex-breakdown",
      status: "available",
      features: ["Operating costs", "Staff expenses", "Utilities", "Maintenance"]
    },
    {
      title: "Schedule Call",
      description: "Book a personal investment consultation",
      icon: Phone,
      href: "/investors/intro-call",
      status: "available",
      features: ["Personal consultation", "Q&A session", "Custom presentation", "Investment discussion"]
    }
  ];

  const dataRoomSections = [
    {
      title: "Legal Documents",
      description: "Contracts, agreements, and legal documentation",
      icon: FileText,
      href: "/data-room/contracts",
      status: "restricted"
    },
    {
      title: "Financial Statements",
      description: "Audited financial reports and statements",
      icon: BarChart3,
      href: "/data-room/financials",
      status: "restricted"
    },
    {
      title: "Presentation Materials",
      description: "Additional decks and presentation files",
      icon: Download,
      href: "/data-room/decks",
      status: "restricted"
    },
    {
      title: "Press Materials",
      description: "Media kit and press releases",
      icon: Eye,
      href: "/data-room/press",
      status: "restricted"
    }
  ];

  return (
    <ProtectedRoute requiredRole="investor">
      <div className="min-h-screen bg-gradient-to-br from-pure-white via-cream-light to-cream-medium/30">
        <ImprovedNavigation />
        
        <div className="container mx-auto px-4 pt-24 pb-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-charcoal mb-4">
              Investors Portal
            </h1>
            <p className="text-lg text-charcoal/70 max-w-2xl mx-auto">
              Comprehensive investment information and documentation for ODE Food Hall
            </p>
            <Badge variant="outline" className="mt-4">
              Restricted Access - Investor Level
            </Badge>
          </div>

          {/* Investment Sections */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-charcoal mb-8 text-center">
              Investment Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {investorSections.map((section, index) => (
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

          {/* Data Room */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-charcoal mb-8 text-center">
              Data Room
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dataRoomSections.map((section, index) => (
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
                    <Button asChild className="w-full">
                      <Link to={section.href}>
                        Access Files
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Quick Stats */}
          <section className="bg-gradient-light rounded-2xl p-8 text-center">
            <h3 className="text-xl font-bold text-charcoal mb-6">Investment Highlights</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-2xl font-bold text-primary mb-2">1,800 m²</div>
                <div className="text-sm text-charcoal/70">Total Area</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary mb-2">12</div>
                <div className="text-sm text-charcoal/70">Kitchen Corners</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary mb-2">400+</div>
                <div className="text-sm text-charcoal/70">Dining Seats</div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default InvestorsPortal;