import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  FileText, BarChart3, Download, Eye, Shield, Lock, CheckCircle,
  AlertCircle, RefreshCw, LucideProps
} from 'lucide-react';
import { useRoles } from '@/hooks/useRoles';
import { useDataRoom } from '@/hooks/useDataRoom';
import ProtectedRoute from '@/components/ProtectedRoute';
import ImprovedNavigation from '@/components/ImprovedNavigation';

// Icon mapping
const iconMap: { [key: string]: React.FC<LucideProps> } = {
    FileText, BarChart3, Download, Eye, Shield, Lock, CheckCircle, AlertCircle
};

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


const DataRoom = () => {
  const { userRole } = useRoles();
  const { sections, recentFiles, loading, error, refreshData } = useDataRoom();

  if (loading) {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="text-center">
                <RefreshCw className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                <p>Loading Data Room...</p>
            </div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="container mx-auto p-6 text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
            <h2 className="text-2xl font-semibold text-red-600 mb-2">Failed to load Data Room</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={refreshData}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
            </Button>
        </div>
    );
  }

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
              {sections.map((section) => {
                const Icon = iconMap[section.icon_name] || FileText;
                return (
                    <Card
                        key={section.id}
                        className="group hover:shadow-elegant transition-all duration-300"
                    >
                        <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-light rounded-lg">
                                <Icon className="w-5 h-5 text-primary" />
                            </div>
                            <CardTitle className="text-lg">
                                {section.title}
                            </CardTitle>
                            </div>
                            {getStatusIcon(section.status)}
                        </div>
                        <p className="text-sm text-charcoal/70">
                            {section.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-charcoal/60">
                            <span>{section.files} files</span>
                            <span>•</span>
                            <span>Updated {new Date(section.lastUpdated).toLocaleDateString()}</span>
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
                            {section.status === 'admin-only'
                                ? 'Admin Only'
                                : section.status === 'restricted'
                                ? 'Restricted'
                                : 'Available'}
                            </Badge>
                        </div>
                        <Button
                            asChild
                            className="w-full"
                            disabled={
                            section.status === 'admin-only' && userRole !== 'admin'
                            }
                        >
                            <Link to={section.href}>Access Files</Link>
                        </Button>
                        </CardContent>
                    </Card>
                );
              })}
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
                  {recentFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-4 bg-gradient-light rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-white rounded-lg">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium text-charcoal">
                            {file.name}
                          </div>
                          <div className="text-sm text-charcoal/60">
                            {file.type} • {file.size} • Updated {new Date(file.updated).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            file.status === 'new' ? 'default' : 'secondary'
                          }
                        >
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
              All documents are protected with enterprise-grade security and
              access controls. Your access is logged and monitored for security
              purposes.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-2xl font-bold text-primary mb-2">
                  256-bit
                </div>
                <div className="text-sm text-charcoal/70">SSL Encryption</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary mb-2">24/7</div>
                <div className="text-sm text-charcoal/70">
                  Security Monitoring
                </div>
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
