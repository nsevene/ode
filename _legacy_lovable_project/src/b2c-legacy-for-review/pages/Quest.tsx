import React from 'react';
import ImprovedNavigation from '@/components/ImprovedNavigation';
import { useIsMobile } from '@/hooks/use-mobile';

// Lazy load taste alley components
const TasteAlleySection = React.lazy(
  () => import('@/components/TasteAlleySection')
);

const Quest = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pure-white via-cream-light to-cream-medium/30">
      <ImprovedNavigation />

      <main className={`${isMobile ? 'pb-20' : ''}`}>
        <React.Suspense
          fallback={
            <div className="flex items-center justify-center min-h-[50vh]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          }
        >
          <TasteAlleySection />
        </React.Suspense>
      </main>
    </div>
  );
};

export default Quest;
