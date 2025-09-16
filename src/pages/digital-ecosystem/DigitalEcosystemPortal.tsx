import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Smartphone, 
  Globe, 
  Nfc, 
  QrCode,
  Wifi,
  Bluetooth,
  Camera,
  Map,
  Users,
  Settings,
  Shield,
  Zap
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useRoles } from '@/hooks/useRoles';
import ProtectedRoute from '@/components/ProtectedRoute';
import ImprovedNavigation from '@/components/ImprovedNavigation';

const DigitalEcosystemPortal = () => {
  const { user } = useAuth();
  const { userRole } = useRoles();

  const ecosystemComponents = [
    {
      title: "NFC Compass System",
      description: "Interactive NFC-based navigation and experience system",
      icon: Nfc,
      href: "/digital-ecosystem/compass",
      status: "available",
      features: ["NFC tags", "Interactive maps", "Experience tracking", "Digital rewards"]
    },
    {
      title: "Mobile App",
      description: "Native mobile application for guests and partners",
      icon: Smartphone,
      href: "/digital-ecosystem/app",
      status: "available",
      features: ["Ordering system", "Booking management", "Loyalty program", "Push notifications", "NFC integration", "Offline mode"]
    },
    {
      title: "Guest Website",
      description: "Public-facing website and guest portal",
      icon: Globe,
      href: "/digital-ecosystem/guest-website",
      status: "available",
      features: ["Public information", "Online booking", "Menu browsing", "Event calendar"]
    },
    {
      title: "QR Code System",
      description: "QR code integration for menus, payments, and experiences",
      icon: QrCode,
      href: "/digital-ecosystem/qr-system",
      status: "available",
      features: ["Menu QR codes", "Payment QR codes", "Experience QR codes", "Analytics tracking"]
    },
    {
      title: "WiFi & Connectivity",
      description: "Guest WiFi and connectivity infrastructure",
      icon: Wifi,
      href: "/digital-ecosystem/wifi",
      status: "available",
      features: ["Guest WiFi", "Network security", "Bandwidth management", "Usage analytics"]
    },
    {
      title: "Bluetooth Beacons",
      description: "Proximity-based marketing and location services",
      icon: Bluetooth,
      href: "/digital-ecosystem/beacons",
      status: "available",
      features: ["Proximity marketing", "Location tracking", "Push notifications", "Analytics"]
    },
    {
      title: "AR Experiences",
      description: "Augmented reality features and experiences",
      icon: Camera,
      href: "/digital-ecosystem/ar",
      status: "available",
      features: ["AR menus", "Virtual tours", "Interactive content", "3D experiences"]
    },
    {
      title: "Digital Maps",
      description: "Interactive floor plans and navigation",
      icon: Map,
      href: "/digital-ecosystem/maps",
      status: "available",
      features: ["Interactive maps", "Navigation", "Space booking", "Real-time updates"]
    }
  ];

  const managementTools = [
    {
      title: "User Management",
      description: "Guest and partner account management",
      icon: Users,
      href: "/digital-ecosystem/users",
      status: "available"
    },
    {
      title: "System Settings",
      description: "Digital ecosystem configuration and settings",
      icon: Settings,
      href: "/digital-ecosystem/settings",
      status: "available"
    },
    {
      title: "Security Dashboard",
      description: "Security monitoring and threat management",
      icon: Shield,
      href: "/digital-ecosystem/security",
      status: "available"
    },
    {
      title: "Performance Analytics",
      description: "System performance and usage analytics",
      icon: Zap,
      href: "/digital-ecosystem/analytics",
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
              Digital Ecosystem
            </h1>
            <p className="text-lg text-charcoal/70 max-w-2xl mx-auto">
              Comprehensive digital infrastructure and technology solutions for ODE Food Hall
            </p>
            <Badge variant="outline" className="mt-4">
              Technology & Innovation
            </Badge>
          </div>

          {/* Ecosystem Components */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-charcoal mb-8 text-center">
              Digital Components
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ecosystemComponents.map((component, index) => (
                <Card key={index} className="group hover:shadow-elegant transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-gradient-light rounded-lg">
                        <component.icon className="w-5 h-5 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{component.title}</CardTitle>
                    </div>
                    <p className="text-sm text-charcoal/70">{component.description}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-xs text-charcoal/60 space-y-1 mb-4">
                      {component.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <div className="w-1 h-1 bg-primary rounded-full" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button asChild className="w-full">
                      <Link to={component.href}>
                        View Details
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Management Tools */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-charcoal mb-8 text-center">
              Management Tools
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {managementTools.map((tool, index) => (
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

          {/* Technology Stats */}
          <section className="bg-gradient-light rounded-2xl p-8 text-center">
            <h3 className="text-xl font-bold text-charcoal mb-6">Digital Infrastructure</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <div className="text-2xl font-bold text-primary mb-2">8</div>
                <div className="text-sm text-charcoal/70">Digital Components</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary mb-2">100%</div>
                <div className="text-sm text-charcoal/70">WiFi Coverage</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary mb-2">24/7</div>
                <div className="text-sm text-charcoal/70">System Monitoring</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary mb-2">99.9%</div>
                <div className="text-sm text-charcoal/70">Uptime</div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default DigitalEcosystemPortal;