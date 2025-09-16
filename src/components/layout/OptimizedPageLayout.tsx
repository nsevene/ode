import React, { memo, Suspense } from 'react';
import { UnifiedNavigation } from '@/components/navigation';
import { useIsMobile } from '@/hooks/use-mobile';
import ErrorBoundary from "@/components/ErrorBoundary";
import { Toaster } from "@/components/ui/sonner";
import { LoadingSpinner } from '@/components/ui/loading';
import { cn } from '@/lib/utils';

// Lazy load heavy components
const Footer = React.lazy(() => import("@/components/Footer"));

interface OptimizedPageLayoutProps {
  children: React.ReactNode;
  variant?: 'main' | 'portal';
  className?: string;
  loading?: boolean;
  showFooter?: boolean;
}

export const OptimizedPageLayout = memo<OptimizedPageLayoutProps>(({ 
  children, 
  variant = 'main',
  className,
  loading = false,
  showFooter = true
}) => {
  const isMobile = useIsMobile();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background flex flex-col">
        {/* Unified Navigation */}
        <UnifiedNavigation variant={variant} />
        
        {/* Main Content */}
        <main className={cn("flex-1", className)}>
          <Suspense fallback={<LoadingSpinner />}>
            {children}
          </Suspense>
        </main>
        
        {/* Footer - Lazy loaded */}
        {showFooter && (
          <Suspense fallback={<div className="h-16 bg-muted/20" />}>
            <Footer />
          </Suspense>
        )}
        
        {/* Global Toast Container */}
        <Toaster />
      </div>
    </ErrorBoundary>
  );
});

OptimizedPageLayout.displayName = 'OptimizedPageLayout';