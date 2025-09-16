import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Play, Building2, Users, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';
import { SEOHead } from '@/components/seo/SEOHead';
import { track } from '@/lib/analytics';
import OnboardingOverlay from '@/components/demo/OnboardingOverlay';

const Demo = () => {
  const navigate = useNavigate();
  const [demoMode, setDemoMode] = useState<'guest' | 'partner'>('guest');
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Check if user has seen onboarding before
    const hasSeenOnboarding = localStorage.getItem('demo-onboarding-seen');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const handleModeSwitch = (mode: 'guest' | 'partner') => {
    setDemoMode(mode);
    track('mode_switch', { mode });
  };

  const handleStartDemo = () => {
    if (demoMode === 'guest') {
      navigate('/demo/guest');
      track('demo_start', { mode: 'guest' });
    } else {
      navigate('/demo/partners');
      track('demo_start', { mode: 'partner' });
    }
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    localStorage.setItem('demo-onboarding-seen', 'true');
    track('onboarding_complete');
  };

  return (
    <>
      <SEOHead 
        title="Demo Portal | Ode food hall Gastro village Ubud"
        description="Experience our guest journey or explore partner opportunities. Interactive demo portal for Ode food hall Gastro village Ubud."
        keywords="demo, food hall, ubud, partner, guest experience, ROI calculator"
      />

      {/* Demo Mode Disclaimer */}
      <div className="bg-mustard-accent/10 border-b border-mustard-accent/20 py-2">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-charcoal-dark">
            <Sparkles className="inline w-4 h-4 mr-1" />
            This is a non-transactional demo. All numbers are illustrative.
          </p>
        </div>
      </div>

      <div className="min-h-screen bg-gradient-to-br from-pure-white via-cream-light to-cream-medium/30">
        {/* Header with Mode Switch */}
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-8">
            <div className="text-2xl font-bold text-charcoal-dark">
              Demo Portal
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-pure-white rounded-full p-1 border border-cream-medium">
                <Button
                  variant={demoMode === 'guest' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => handleModeSwitch('guest')}
                  className="rounded-full px-4"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Guest Play
                </Button>
                <Button
                  variant={demoMode === 'partner' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => handleModeSwitch('partner')}
                  className="rounded-full px-4"
                >
                  <Building2 className="w-4 h-4 mr-2" />
                  Partner Proof
                </Button>
              </div>
            </div>
          </div>

          {/* Hero Section */}
          <div className="text-center max-w-4xl mx-auto mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-charcoal-dark mb-6">
              Guest experience that sells itself.
              <span className="text-burgundy-primary"> Partner value</span> you can model in minutes.
            </h1>
            
            <p className="text-xl text-charcoal-medium mb-8 max-w-2xl mx-auto">
              Ode food hall Gastro village Ubud — demo portal: попробуйте путь гостя или посчитайте экономику резидента.
            </p>

            <Button 
              size="lg" 
              onClick={handleStartDemo}
              className="bg-burgundy-primary hover:bg-burgundy-dark text-pure-white px-8 py-4 text-lg rounded-full"
            >
              {demoMode === 'guest' ? (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  Try as Guest
                </>
              ) : (
                <>
                  <TrendingUp className="w-5 h-5 mr-2" />
                  See Partner Value
                </>
              )}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          {/* Mode-specific Preview Cards */}
          <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {demoMode === 'guest' ? (
              <>
                <Card className="bg-pure-white/80 backdrop-blur border border-cream-medium">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-burgundy-primary/10 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-burgundy-primary" />
                      </div>
                      <h3 className="text-lg font-semibold text-charcoal-dark">Unified Menu Experience</h3>
                    </div>
                    <p className="text-charcoal-medium mb-4">
                      Explore our curated selection of 8-12 local kitchens with smart filters for dietary preferences.
                    </p>
                    <div className="flex gap-2">
                      <Badge variant="secondary" className="text-xs">Vegan Options</Badge>
                      <Badge variant="secondary" className="text-xs">Halal Certified</Badge>
                      <Badge variant="secondary" className="text-xs">Kids Menu</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-pure-white/80 backdrop-blur border border-cream-medium">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-mustard-accent/20 rounded-full flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-mustard-accent" />
                      </div>
                      <h3 className="text-lg font-semibold text-charcoal-dark">Taste Passport Quest</h3>
                    </div>
                    <p className="text-charcoal-medium mb-4">
                      Complete 3 interactive missions across our taste zones and unlock exclusive rewards.
                    </p>
                    <div className="flex gap-2">
                      <Badge variant="secondary" className="text-xs">3 Missions</Badge>
                      <Badge variant="secondary" className="text-xs">Digital Badges</Badge>
                      <Badge variant="secondary" className="text-xs">Hidden Bonuses</Badge>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <>
                <Card className="bg-pure-white/80 backdrop-blur border border-cream-medium">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-burgundy-primary/10 rounded-full flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-burgundy-primary" />
                      </div>
                      <h3 className="text-lg font-semibold text-charcoal-dark">ROI Calculator</h3>
                    </div>
                    <p className="text-charcoal-medium mb-4">
                      Interactive tool to model your investment returns with real market scenarios and payback timelines.
                    </p>
                    <div className="flex gap-2">
                      <Badge variant="secondary" className="text-xs">Conservative</Badge>
                      <Badge variant="secondary" className="text-xs">Ambitious</Badge>
                      <Badge variant="secondary" className="text-xs">Custom Input</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-pure-white/80 backdrop-blur border border-cream-medium">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-mustard-accent/20 rounded-full flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-mustard-accent" />
                      </div>
                      <h3 className="text-lg font-semibold text-charcoal-dark">Tenant Dashboard</h3>
                    </div>
                    <p className="text-charcoal-medium mb-4">
                      Preview the partner portal with sales analytics, footfall heatmaps, and promotional tools.
                    </p>
                    <div className="flex gap-2">
                      <Badge variant="secondary" className="text-xs">Real-time Sales</Badge>
                      <Badge variant="secondary" className="text-xs">Heat Maps</Badge>
                      <Badge variant="secondary" className="text-xs">Promo Tools</Badge>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-12">
            <div className="text-center">
              <div className="text-2xl font-bold text-burgundy-primary">8-12</div>
              <div className="text-sm text-charcoal-medium">Local Kitchens</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-burgundy-primary">3</div>
              <div className="text-sm text-charcoal-medium">Taste Zones</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-burgundy-primary">&lt; 60s</div>
              <div className="text-sm text-charcoal-medium">Demo Duration</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-burgundy-primary">PWA</div>
              <div className="text-sm text-charcoal-medium">App Ready</div>
            </div>
          </div>
        </div>

        {/* Onboarding Overlay */}
        {showOnboarding && (
          <OnboardingOverlay 
            mode={demoMode}
            onComplete={handleOnboardingComplete}
          />
        )}
      </div>
    </>
  );
};

export default Demo;