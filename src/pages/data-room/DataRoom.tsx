import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  BarChart3, 
  Download, 
  Eye,
  Shield,
  Lock,
  CheckCircle,
  AlertCircle,
  Calendar,
  Users,
  Building,
  DollarSign
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useRoles } from '@/hooks/useRoles';
import ProtectedRoute from '@/components/ProtectedRoute';
import ImprovedNavigation from '@/components/ImprovedNavigation';

const DataRoom = () => {
  const { user } = useAuth();
  const { userRole } = useRoles();

  const dataRoomSections = [
    {
      title: "Legal Documents",
      description: "Contracts, agreements, and legal documentation",
      icon: FileText,
      href: "/data-room/contracts",
      status: "restricted",
      files: 15,
      lastUpdated: "2024-01-15",
      features: ["Lease agreements", "Vendor contracts", "Legal compliance", "Insurance documents"]
    },
    {
      title: "Financial Statements",
      description: "Audited financial reports and statements",
      icon: BarChart3,
      href: "/data-room/financials",
      status: "restricted",
      files: 8,
      lastUpdated: "2024-01-10",
      features: ["Balance sheets", "Income statements", "Cash flow reports", "Audit reports"]
    },
    {
      title: "Presentation Decks",
      description: "Investment presentations and pitch decks",
      icon: Download,
      href: "/data-room/decks",
      status: "restricted",
      files: 12,
      lastUpdated: "2024-01-12",
      features: ["Investment deck", "Financial model", "Market analysis", "Team presentations"]
    },
    {
      title: "Press Materials",
      description: "Media kit and press releases",
      icon: Eye,
      href: "/data-room/press",
      status: "restricted",
      files: 6,
      lastUpdated: "2024-01-08",
      features: ["Press releases", "Media kit", "Brand assets", "Photo gallery"]
    },
    {
      title: "Internal Policies",
      description: "Internal policies and procedures (Admin only)",
      icon: Shield,
      href: "/data-room/policies",
      status: "admin-only",
      files: 20,
      lastUpdated: "2024-01-05",
      features: ["HR policies", "Security procedures", "Operational guidelines", "Compliance documents"]
    }
  ];

  const recentFiles = [
    {
      name: "Investment Deck v2.1",
      type: "PDF",
      size: "2.4 MB",
      updated: "2024-01-15",
      status: "new"
    },
    {
      name: "Financial Model Q4 2023",
      type: "Excel",
      size: "1.8 MB",
      updated: "2024-01-10",
      status: "updated"
    },
    {
      name: "Lease Agreement Template",
      type: "PDF",
      size: "3.2 MB",
      updated: "2024-01-08",
      status: "new"
    },
    {
      name: "Press Release - Opening",
      type: "PDF",
      size: "0.8 MB",
      updated: "2024-01-05",
      status: "updated"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'restricted':
        return <Lock className="w-4 h-4 text-amber-600" />;
      case 'admin-only':
        return <Shield className="w-4 h-4 text-red-600" />;
      default:
        return <CheckCircle className="w-4 h-4 text-green-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'restricted':
        return 'bg-amber-100 text-amber-800';
      case 'admin-only':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  return (
    <ProtectedRoute requiredRole="investor">
      <div className="min-h-screen bg-gradient-to-br from-pure-white via-cream-light to-cream-medium/30">
        <ImprovedNavigation />
        
        <div className="container mx-auto px-4 pt-24 pb-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-charcoal mb-4">
              Data Room
            </h1>
            <p className="text-lg text-charcoal/70 max-w-2xl mx-auto">
              Secure access to confidential documents and financial information
            </p>
            <Badge variant="outline" className="mt-4">
              <Shield className="w-4 h-4 mr-2" />
              Investor Access Only
            </Badge>
          </div>

          {/* Data Room Sections */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-charcoal mb-8 text-center">
              Document Categories
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dataRoomSections.map((section, index) => (
                <Card key={index} className="group hover:shadow-elegant transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-light rounded-lg">
                          <section.icon className="w-5 h-5 text-primary" />
                        </div>
                        <CardTitle className="text-lg">{section.title}</CardTitle>
                      </div>
                      {getStatusIcon(section.status)}
                    </div>
                    <p className="text-sm text-charcoal/70">{section.description}</p>
                    <div className="flex items-center gap-4 text-xs text-charcoal/60">
                      <span>{section.files} files</span>
                      <span>•</span>
                      <span>Updated {section.lastUpdated}</span>
                    </div>
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
                    <div className="flex items-center gap-2 mb-4">
                      <Badge className={getStatusColor(section.status)}>
                        {section.status === 'admin-only' ? 'Admin Only' : 
                         section.status === 'restricted' ? 'Restricted' : 'Available'}
                      </Badge>
                    </div>
                    <Button asChild className="w-full" disabled={section.status === 'admin-only' && userRole !== 'admin'}>
                      <Link to={section.href}>
                        Access Files
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Recent Files */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-charcoal mb-8 text-center">
              Recent Files
            </h2>
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {recentFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gradient-light rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-white rounded-lg">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium text-charcoal">{file.name}</div>
                          <div className="text-sm text-charcoal/60">
                            {file.type} • {file.size} • Updated {file.updated}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={file.status === 'new' ? 'default' : 'secondary'}>
                          {file.status === 'new' ? 'New' : 'Updated'}
                        </Badge>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Security Notice */}
          <section className="bg-gradient-light rounded-2xl p-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Shield className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-bold text-charcoal">Secure Access</h3>
            </div>
            <p className="text-charcoal/70 mb-6">
              All documents are protected with enterprise-grade security and access controls.
              Your access is logged and monitored for security purposes.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-2xl font-bold text-primary mb-2">256-bit</div>
                <div className="text-sm text-charcoal/70">SSL Encryption</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary mb-2">24/7</div>
                <div className="text-sm text-charcoal/70">Security Monitoring</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary mb-2">100%</div>
                <div className="text-sm text-charcoal/70">Access Logging</div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default DataRoom;
