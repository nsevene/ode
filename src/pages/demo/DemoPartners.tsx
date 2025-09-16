import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calculator, TrendingUp, Building2, BarChart3, Users, ExternalLink } from 'lucide-react';
import { SEOHead } from '@/components/seo/SEOHead';
import { track } from '@/lib/analytics';
import DemoROICalculator from '@/components/demo/DemoROICalculator';
import DemoBusinessMetrics from '@/components/demo/DemoBusinessMetrics';
import DemoGuestJourney from '@/components/demo/DemoGuestJourney';

const DemoPartners = () => {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState<'roi' | 'metrics' | 'journey' | 'portal'>('roi');

  const handleSectionChange = (section: 'roi' | 'metrics' | 'journey' | 'portal') => {
    setCurrentSection(section);
    track('demo_section_change', { section, mode: 'partner' });
  };

  const handleTenantPortal = () => {
    track('demo_tenant_portal_redirect');
    navigate('/tenants');
  };

  const handleBack = () => {
    navigate('/demo');
  };

  return (
    <>
      <SEOHead 
        title="Partner Demo Portal | Ode food hall Gastro village Ubud"
        description="Explore partner opportunities - ROI calculator, business metrics, tenant benefits, and guest journey analytics."
        keywords="partner demo, ROI calculator, business metrics, tenant benefits, food hall investment"
      />

      {/* Demo Mode Banner */}
      <div className="bg-mustard-accent text-charcoal-dark py-2">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm font-medium">
            📊 Partner Demo Mode - All figures are illustrative examples
          </p>
        </div>
      </div>

      <div className="min-h-screen bg-gradient-to-br from-pure-white via-cream-light to-cream-medium/30">
        {/* Header */}
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={handleBack}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Demo Hub
              </Button>
            </div>
            
            <div className="text-xl font-semibold text-charcoal-dark">
              Partner Value Demo
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-8">
            <Button
              variant={currentSection === 'roi' ? 'default' : 'outline'}
              onClick={() => handleSectionChange('roi')}
              className="flex items-center gap-2 py-3"
            >
              <Calculator className="w-4 h-4" />
              ROI Calculator
            </Button>
            <Button
              variant={currentSection === 'metrics' ? 'default' : 'outline'}
              onClick={() => handleSectionChange('metrics')}
              className="flex items-center gap-2 py-3"
            >
              <BarChart3 className="w-4 h-4" />
              Business Metrics
            </Button>
            <Button
              variant={currentSection === 'portal' ? 'default' : 'outline'}
              onClick={() => handleSectionChange('portal')}
              className="flex items-center gap-2 py-3"
            >
              <Building2 className="w-4 h-4" />
              Tenant Portal
            </Button>
            <Button
              variant={currentSection === 'journey' ? 'default' : 'outline'}
              onClick={() => handleSectionChange('journey')}
              className="flex items-center gap-2 py-3"
            >
              <Users className="w-4 h-4" />
              Guest Journey
            </Button>
          </div>

          {/* Content Sections */}
          <div className="min-h-[600px]">
            {currentSection === 'roi' && <DemoROICalculator />}
            {currentSection === 'metrics' && <DemoBusinessMetrics />}
            {currentSection === 'journey' && <DemoGuestJourney />}
            {currentSection === 'portal' && (
              <Card className="bg-pure-white/80 backdrop-blur border-cream-medium">
                <CardHeader>
                  <CardTitle className="text-2xl text-charcoal-dark flex items-center gap-3">
                    <Building2 className="w-8 h-8 text-burgundy-primary" />
                    Complete Tenant Portal
                  </CardTitle>
                  <p className="text-charcoal-medium">
                    Comprehensive tenant information, pricing, benefits, and application process
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="text-center p-6">
                      <div className="w-16 h-16 bg-burgundy-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <Building2 className="w-8 h-8 text-burgundy-primary" />
                      </div>
                      <h4 className="font-semibold text-charcoal-dark mb-2">Floor Plans & Spaces</h4>
                      <p className="text-sm text-charcoal-medium">Detailed layouts and available spaces for lease</p>
                    </div>
                    <div className="text-center p-6">
                      <div className="w-16 h-16 bg-burgundy-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <TrendingUp className="w-8 h-8 text-burgundy-primary" />
                      </div>
                      <h4 className="font-semibold text-charcoal-dark mb-2">Rate Cards & Pricing</h4>
                      <p className="text-sm text-charcoal-medium">Transparent pricing for all spaces and services</p>
                    </div>
                    <div className="text-center p-6">
                      <div className="w-16 h-16 bg-burgundy-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <Users className="w-8 h-8 text-burgundy-primary" />
                      </div>
                      <h4 className="font-semibold text-charcoal-dark mb-2">Support Team & Benefits</h4>
                      <p className="text-sm text-charcoal-medium">Meet your support team and exclusive benefits</p>
                    </div>
                  </div>
                  
                  <div className="text-center bg-gradient-to-r from-burgundy-primary to-burgundy-dark rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-pure-white mb-3">
                      Ready to explore partnership opportunities?
                    </h3>
                    <p className="text-burgundy-light mb-4">
                      Access our complete tenant portal with detailed information, pricing, and application process.
                    </p>
                    <Button 
                      onClick={handleTenantPortal}
                      variant="outline"
                      className="bg-pure-white/10 text-pure-white border-pure-white/30 hover:bg-pure-white/20"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open Tenant Portal
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Partner Value Proposition */}
          <div className="bg-gradient-to-r from-burgundy-primary to-burgundy-dark text-pure-white rounded-lg p-6 mt-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-3">
                Ready to Join Ode food hall Gastro village Ubud?
              </h3>
              <p className="text-burgundy-light mb-4 max-w-2xl mx-auto">
                Partner with us to be part of Ubud's premier culinary destination. 
                Multiple revenue streams, proven guest engagement, and comprehensive support.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">5-12M</div>
                  <div className="text-sm text-burgundy-light">Investment Range (IDR)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">18-36</div>
                  <div className="text-sm text-burgundy-light">Payback Months</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">15-25%</div>
                  <div className="text-sm text-burgundy-light">Target IRR</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">24/7</div>
                  <div className="text-sm text-burgundy-light">Support Available</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DemoPartners;