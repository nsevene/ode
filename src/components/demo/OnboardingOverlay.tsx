import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, ChevronRight, ChevronLeft, Users, Building2, Calculator, Sparkles } from 'lucide-react';
import { track } from '@/lib/analytics';

interface OnboardingOverlayProps {
  mode: 'guest' | 'partner';
  onComplete: () => void;
}

const OnboardingOverlay: React.FC<OnboardingOverlayProps> = ({ mode, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const guestSteps = [
    {
      title: "Welcome to the Guest Experience",
      description: "Discover how visitors explore our food hall through an interactive demo.",
      icon: <Users className="w-6 h-6 text-burgundy-primary" />,
      highlight: "Try our unified menu system"
    },
    {
      title: "Unified Menu Demo",
      description: "Browse 8-12 curated local kitchens with smart dietary filters.",
      icon: <Sparkles className="w-6 h-6 text-mustard-accent" />,
      highlight: "Simulate the ordering process"
    },
    {
      title: "Taste Passport Quest",
      description: "Complete missions across taste zones to unlock rewards and badges.",
      icon: <Sparkles className="w-6 h-6 text-burgundy-primary" />,
      highlight: "Experience gamified dining"
    },
    {
      title: "Ready to Start!",
      description: "Everything is demo-only. No real transactions or personal data required.",
      icon: <ChevronRight className="w-6 h-6 text-charcoal-dark" />,
      highlight: "Begin your demo journey"
    }
  ];

  const partnerSteps = [
    {
      title: "Partner Value Calculator",
      description: "See how we help partners model their ROI with real market data.",
      icon: <Building2 className="w-6 h-6 text-burgundy-primary" />,
      highlight: "Explore investment scenarios"
    },
    {
      title: "Interactive ROI Tool",
      description: "Input your parameters and see payback calculations instantly.",
      icon: <Calculator className="w-6 h-6 text-mustard-accent" />,
      highlight: "Model your business case"
    },
    {
      title: "Tenant Benefits Preview",
      description: "Dashboard mockup showing sales analytics and promotional tools.",
      icon: <Sparkles className="w-6 h-6 text-burgundy-primary" />,
      highlight: "See partner advantages"
    },
    {
      title: "Ready to Calculate!",
      description: "All numbers are illustrative examples based on market research.",
      icon: <ChevronRight className="w-6 h-6 text-charcoal-dark" />,
      highlight: "Start exploring partner value"
    }
  ];

  const steps = mode === 'guest' ? guestSteps : partnerSteps;
  const totalSteps = steps.length;

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
      track('onboarding_step', { mode, step: currentStep + 1 });
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    track('onboarding_complete', { mode, completed_steps: currentStep + 1 });
    onComplete();
  };

  const handleSkip = () => {
    track('onboarding_skip', { mode, skipped_at_step: currentStep });
    onComplete();
  };

  return (
    <div className="fixed inset-0 bg-charcoal-dark/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full bg-pure-white border-2 border-cream-medium">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-burgundy-primary/10 rounded-full flex items-center justify-center">
                {steps[currentStep].icon}
              </div>
              <div className="text-xs text-charcoal-medium">
                Step {currentStep + 1} of {totalSteps}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className="text-charcoal-medium hover:text-charcoal-dark"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="w-full bg-cream-light rounded-full h-2">
              <div 
                className="bg-burgundy-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Content */}
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-charcoal-dark mb-3">
              {steps[currentStep].title}
            </h3>
            <p className="text-charcoal-medium mb-4">
              {steps[currentStep].description}
            </p>
            <div className="inline-flex items-center gap-2 bg-mustard-accent/10 text-mustard-dark px-3 py-2 rounded-full text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              {steps[currentStep].highlight}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            <Button
              onClick={handleNext}
              className="bg-burgundy-primary hover:bg-burgundy-dark text-pure-white flex items-center gap-2"
            >
              {currentStep === totalSteps - 1 ? 'Get Started' : 'Next'}
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Skip Option */}
          <div className="text-center mt-4">
            <button
              onClick={handleSkip}
              className="text-xs text-charcoal-medium hover:text-charcoal-dark underline"
            >
              Skip introduction
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingOverlay;