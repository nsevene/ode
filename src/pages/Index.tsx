import { useSearchParams } from "react-router-dom";
import { Calendar } from "lucide-react";
import { lazy, Suspense, useState, useEffect } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";

// Layout components
import PageLayout from "@/components/layout/PageLayout";
import SEOWrapper from "@/components/layout/SEOWrapper";
import MobileQuickActions from "@/components/layout/MobileQuickActions";

// Critical components (above fold) - load immediately
import HeroSection from "@/components/HeroSection";
import PreloadResources from "@/components/PreloadResources";

// Lazy load philosophy too for faster initial load
const PhilosophySection = lazy(() => import("@/components/PhilosophySection"));

// Lazy load non-critical components
const TasteCompassSection = lazy(() => import("@/components/TasteCompassSection"));
const TasteCompassCTA = lazy(() => import("@/components/TasteCompassCTA"));
const KitchensSection = lazy(() => import("@/components/KitchensSection"));
const TasteAlleySection = lazy(() => import("@/components/TasteAlleySection"));
const SpacesSection = lazy(() => import("@/components/SpacesSection"));
const EventsTeaser = lazy(() => import("@/components/EventsTeaser"));
const ExperiencesSection = lazy(() => import("@/components/ExperiencesSection"));
const ARExperienceSection = lazy(() => import("@/components/ARExperienceSection"));
const ReviewsSection = lazy(() => import("@/components/ReviewsSection"));
const FeaturedBarsSection = lazy(() => import("@/components/FeaturedBarsSection"));
const BookingSection = lazy(() => import("@/components/BookingSection"));
const ColdDessertRetailSection = lazy(() => import("@/components/ColdDessertRetailSection"));
const EnhancedContactSection = lazy(() => import("@/components/EnhancedContactSection"));
const FAQSection = lazy(() => import("@/components/FAQSection"));

// Hooks and utilities
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import usePWA from "@/hooks/usePWA";
import { useIsMobile } from "@/hooks/use-mobile";

// Analytics and tracking

import { ErrorTracker } from "@/components/debug/ErrorTracker";
import { HTTPSRedirect } from "@/components/security/HTTPSRedirect";
import { CacheOptimization } from "@/components/performance/CacheOptimization";

// UI Components
import { InteractiveElements } from "@/components/interactive/InteractiveElements";
import { TastePassportModal } from "@/components/TastePassportModal";
import NFCPassportModal from "@/components/NFCPassportModal";
import CookieConsent from "@/components/CookieConsent";
import { SimpleBookingModal } from "@/components/booking/SimpleBookingModal";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import PerformanceMonitor from "@/components/PerformanceMonitor";
import DemoModeWrapper from "@/components/DemoModeWrapper";

const Index = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [showTastePassportModal, setShowTastePassportModal] = useState(false);
  const [showNFCModal, setShowNFCModal] = useState(false);
  const [showQuickBooking, setShowQuickBooking] = useState(false);

  // Referral handling
  useEffect(() => {
    const handleReferral = async () => {
      const referralCode = searchParams.get('ref');
      
      if (referralCode && user) {
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('referred_by')
            .eq('id', user.id)
            .single();

          if (!profile?.referred_by) {
            const { error } = await supabase.rpc('handle_referral_reward', {
              referrer_code: referralCode,
              new_user_id: user.id
            });

            if (!error) {
              toast({
                title: "Welcome bonus!",
                description: "You received 25 points for joining through a referral!",
              });
            }
          }
        } catch (error) {
          console.error('Error handling referral:', error);
        }
      }
    };

    handleReferral();
  }, [searchParams, user, toast]);

  // NFC Modal event listener
  useEffect(() => {
    const handleOpenNFCModal = () => {
      setShowNFCModal(true);
    };

    window.addEventListener('openNFCModal', handleOpenNFCModal);
    return () => window.removeEventListener('openNFCModal', handleOpenNFCModal);
  }, []);

  // 404 Error handling
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (event.message.includes('Failed to load')) {
        console.error('Resource failed to load:', event);
        // Could redirect to 404 page or show error toast
      }
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  usePWA();

  return (
    <>
      <HTTPSRedirect />
      
      <ErrorTracker />
      <CacheOptimization />
      <PreloadResources />
      <SEOWrapper />
      <PerformanceMonitor />
      
      <PageLayout 
        showMobileActions={false}
        variant="main"
      >
        {/* Desktop Quick Booking Floating Button - Hidden in production */}
        {!isMobile && process.env.NODE_ENV === 'development' && (
          <div className="fixed bottom-6 left-6 z-50">
            <DemoModeWrapper action="booking">
              <Button
                onClick={() => setShowQuickBooking(true)}
                size="lg"
                className="rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3"
              >
                <Calendar className="w-5 h-5 mr-2 flex-shrink-0" />
                <span>Quick Booking</span>
              </Button>
            </DemoModeWrapper>
          </div>
        )}

        {/* Main Content Sections - Strategy 4.2 Order */}
        {/* 1. Hero */}
        <HeroSection />
        
        {/* 2. Philosophy ODE + Tri Hita Karana + 4 Odes */}
        <Suspense fallback={<LoadingSpinner variant="minimal" />}>
          <PhilosophySection />
        </Suspense>
        
        {/* 3. Kitchens Grid (12 Kitchen Corners) */}
        <Suspense fallback={<LoadingSpinner variant="minimal" />}>
          <KitchensSection />
        </Suspense>
        
        {/* 4. Taste Compass 2.0 (8 sectors interactive) */}
        <Suspense fallback={<LoadingSpinner variant="minimal" />}>
          <TasteCompassSection />
        </Suspense>
        
        {/* 5. Taste Alley intro (experience overview) */}
        <Suspense fallback={<LoadingSpinner variant="minimal" />}>
          <TasteAlleySection />
        </Suspense>
        
        {/* 5. Spaces tabs (First / Second Floor) */}
        <Suspense fallback={<LoadingSpinner variant="minimal" />}>
          <SpacesSection />
        </Suspense>
        
        {/* 6. Events teaser (Yoga • Live Music • Sunday Market → /Events) */}
        <Suspense fallback={<LoadingSpinner variant="minimal" />}>
          <EventsTeaser />
        </Suspense>
        
        {/* 7. Experiences cards (Wine Staircase • Lounge • Live DJ …) */}
        <Suspense fallback={<LoadingSpinner variant="minimal" />}>
          <ExperiencesSection />
        </Suspense>
        
        {/* 8. AR Experience Section - Hidden in production */}
        {process.env.NODE_ENV === 'development' && (
          <Suspense fallback={<LoadingSpinner variant="minimal" />}>
            <ARExperienceSection />
          </Suspense>
        )}
        
        {/* 9. Guest Reviews */}
        <Suspense fallback={<LoadingSpinner variant="minimal" />}>
          <ReviewsSection />
        </Suspense>
        
        {/* 10. Featured Bars (Beverage Bar / Wine & Bottle Bar) */}
        <Suspense fallback={<LoadingSpinner variant="minimal" />}>
          <FeaturedBarsSection />
        </Suspense>
        
        {/* 9. Cold Dessert & Juice Bar + Retail */}
        <Suspense fallback={<LoadingSpinner variant="minimal" />}>
          <ColdDessertRetailSection />
        </Suspense>
        
        {/* 10. Booking Section */}
        <Suspense fallback={<LoadingSpinner variant="minimal" />}>
          <BookingSection />
        </Suspense>
        
        {/* 11. FAQ */}
        <Suspense fallback={<LoadingSpinner variant="minimal" />}>
          <FAQSection />
        </Suspense>
        
        {/* 12. Contact */}
        <Suspense fallback={<LoadingSpinner variant="minimal" />}>
          <EnhancedContactSection />
        </Suspense>

        {/* 13. Taste Compass CTA */}
        <Suspense fallback={<LoadingSpinner variant="minimal" />}>
          <TasteCompassCTA />
        </Suspense>
        
        {/* Footer */}
        <Footer />
      </PageLayout>
      
      {/* Modals */}
      <TastePassportModal 
        isOpen={showTastePassportModal} 
        onClose={() => setShowTastePassportModal(false)} 
      />
      
      <NFCPassportModal 
        isOpen={showNFCModal} 
        onClose={() => setShowNFCModal(false)} 
      />
      
      <SimpleBookingModal 
        isOpen={showQuickBooking} 
        onClose={() => setShowQuickBooking(false)} 
      />
      
      {/* Cookie Consent */}
      <CookieConsent />
      
    </>
  );
};

export default Index;