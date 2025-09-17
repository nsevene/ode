import React, { Suspense } from 'react';
import { usePageTracking, useInteractionTracking } from '@/hooks/useAnalyticsIntegration';
import { useAuthStore } from '@/store/authStore';
import { useNotificationHelpers } from '@/components/NotificationSystem';
import { LoadingSpinner, FullPageLoading } from '@/components/LoadingStates';
import { PageSEO } from '@/components/seo/PageSEO';

interface IntegratedPageProps {
  children: React.ReactNode;
  seo?: {
    title: string;
    description: string;
    keywords?: string;
    image?: string;
    url?: string;
    type?: string;
    author?: string;
    publishedTime?: string;
    modifiedTime?: string;
    section?: string;
    tags?: string[];
    noindex?: boolean;
    nofollow?: boolean;
    canonical?: string;
    alternate?: { hreflang: string; href: string }[];
    structuredData?: any;
  };
  loading?: boolean;
  error?: string | null;
  className?: string;
}

export const IntegratedPage: React.FC<IntegratedPageProps> = ({
  children,
  seo,
  loading = false,
  error = null,
  className
}) => {
  // Initialize tracking
  usePageTracking();
  const { trackClick } = useInteractionTracking();
  const { showError, showSuccess } = useNotificationHelpers();
  const { isAuthenticated, user } = useAuthStore();

  // Handle errors
  React.useEffect(() => {
    if (error) {
      showError('Page Error', error);
    }
  }, [error, showError]);

  // Handle successful page load
  React.useEffect(() => {
    if (!loading && !error) {
      showSuccess('Page Loaded', 'Content loaded successfully');
    }
  }, [loading, error, showSuccess]);

  // Track user authentication status
  React.useEffect(() => {
    if (isAuthenticated && user) {
      trackClick('user_authenticated', {
        user_id: user.id,
        user_role: user.user_metadata?.role || 'guest',
        timestamp: new Date().toISOString(),
      });
    }
  }, [isAuthenticated, user, trackClick]);

  if (loading) {
    return <FullPageLoading message="Loading page..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* SEO Head */}
      {seo && <PageSEO {...seo} />}
      
      {/* Main Content */}
      <div className={className}>
        <Suspense fallback={<LoadingSpinner size="lg" />}>
          {children}
        </Suspense>
      </div>
    </>
  );
};

// Higher-order component for easy integration
export const withIntegratedPage = <P extends object>(
  Component: React.ComponentType<P>,
  seo?: IntegratedPageProps['seo']
) => {
  return (props: P) => (
    <IntegratedPage seo={seo}>
      <Component {...props} />
    </IntegratedPage>
  );
};

// Hook for page-level analytics
export const usePageAnalytics = () => {
  const { trackPageView, trackButtonClick, trackFormSubmit } = useAnalyticsIntegration();
  const { user, isAuthenticated } = useAuthStore();

  const trackPageEvent = (eventName: string, properties?: Record<string, any>) => {
    trackPageView(eventName, {
      ...properties,
      user_id: user?.id,
      is_authenticated: isAuthenticated,
      timestamp: new Date().toISOString(),
    });
  };

  const trackButtonEvent = (buttonName: string, properties?: Record<string, any>) => {
    trackButtonClick(buttonName, {
      ...properties,
      user_id: user?.id,
      is_authenticated: isAuthenticated,
    });
  };

  const trackFormEvent = (formName: string, properties?: Record<string, any>) => {
    trackFormSubmit(formName, {
      ...properties,
      user_id: user?.id,
      is_authenticated: isAuthenticated,
    });
  };

  return {
    trackPageEvent,
    trackButtonEvent,
    trackFormEvent,
  };
};
