import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ShoppingCart, MapPin, Star, Clock, Users, Smartphone } from 'lucide-react';
import { SEOHead } from '@/components/seo/SEOHead';
import { track } from '@/lib/analytics';
import DemoUnifiedMenu from '@/components/demo/DemoUnifiedMenu';
import DemoOrderFlow from '@/components/demo/DemoOrderFlow';
import DemoTastePassport from '@/components/demo/DemoTastePassport';
import DemoPWAPrompt from '@/components/demo/DemoPWAPrompt';

const DemoGuest = () => {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState<'menu' | 'order' | 'passport' | 'pwa'>('menu');

  const handleSectionChange = (section: 'menu' | 'order' | 'passport' | 'pwa') => {
    setCurrentSection(section);
    track('demo_section_change', { section, mode: 'guest' });
  };

  const handleBack = () => {
    navigate('/demo');
  };

  return (
    <>
      <SEOHead 
        title="Guest Demo Experience | Ode food hall Gastro village Ubud"
        description="Experience our guest journey - unified menu, order simulation, taste passport quest, and PWA features."
        keywords="guest demo, food hall experience, unified menu, taste passport, PWA"
      />

      {/* Demo Mode Banner */}
      <div className="bg-burgundy-primary text-pure-white py-2">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm font-medium">
            🎭 Guest Demo Mode - No real transactions or data collection
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
              Guest Experience Demo
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-8">
            <Button
              variant={currentSection === 'menu' ? 'default' : 'outline'}
              onClick={() => handleSectionChange('menu')}
              className="flex items-center gap-2 py-3"
            >
              <ShoppingCart className="w-4 h-4" />
              Unified Menu
            </Button>
            <Button
              variant={currentSection === 'order' ? 'default' : 'outline'}
              onClick={() => handleSectionChange('order')}
              className="flex items-center gap-2 py-3"
            >
              <Clock className="w-4 h-4" />
              Order Flow
            </Button>
            <Button
              variant={currentSection === 'passport' ? 'default' : 'outline'}
              onClick={() => handleSectionChange('passport')}
              className="flex items-center gap-2 py-3"
            >
              <MapPin className="w-4 h-4" />
              Taste Passport
            </Button>
            <Button
              variant={currentSection === 'pwa' ? 'default' : 'outline'}
              onClick={() => handleSectionChange('pwa')}
              className="flex items-center gap-2 py-3"
            >
              <Smartphone className="w-4 h-4" />
              PWA Features
            </Button>
          </div>

          {/* Content Sections */}
          <div className="min-h-[600px]">
            {currentSection === 'menu' && <DemoUnifiedMenu />}
            {currentSection === 'order' && <DemoOrderFlow />}
            {currentSection === 'passport' && <DemoTastePassport />}
            {currentSection === 'pwa' && <DemoPWAPrompt />}
          </div>

          {/* Demo Stats */}
          <div className="bg-pure-white/80 backdrop-blur rounded-lg border border-cream-medium p-6 mt-8">
            <h3 className="text-lg font-semibold text-charcoal-dark mb-4 text-center">
              Demo Journey Statistics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-burgundy-primary">8-12</div>
                <div className="text-sm text-charcoal-medium">Kitchen Partners</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-burgundy-primary">30-50</div>
                <div className="text-sm text-charcoal-medium">Menu Items</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-burgundy-primary">3</div>
                <div className="text-sm text-charcoal-medium">Taste Missions</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-burgundy-primary">PWA</div>
                <div className="text-sm text-charcoal-medium">Install Ready</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DemoGuest;