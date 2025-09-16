import React, { ReactNode } from "react";
import { UnifiedNavigation } from '@/components/navigation';
import { useIsMobile } from "@/hooks/use-mobile";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { MobilePWABanner } from "@/components/mobile/MobilePWABanner";
import EnhancedScrollToTop from "@/components/EnhancedScrollToTop";
import { Suspense } from "react";
import { cn } from "@/lib/utils";

interface PageLayoutProps {
  children: ReactNode;
  showMobileActions?: boolean;
  mobileActionsContent?: ReactNode;
  variant?: 'main' | 'portal';
  className?: string;
}

const PageLayout = ({ 
  children, 
  showMobileActions = false, 
  mobileActionsContent,
  variant = 'main',
  className 
}: PageLayoutProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pure-white via-cream-light to-cream-medium/30">
      <OfflineIndicator />
      <MobilePWABanner />
      
      {/* Unified Navigation */}
      <UnifiedNavigation variant={variant} />
      
      {showMobileActions && mobileActionsContent}
      
      <main 
        role="main" 
        className={cn(
          isMobile ? 'pb-20 pt-16' : 'pt-16',
          'relative',
          className
        )}
      >
        <Suspense fallback={<div className="flex items-center justify-center p-8">Loading...</div>}>
          {children}
        </Suspense>
      </main>
      
      <EnhancedScrollToTop />
    </div>
  );
};

export default PageLayout;