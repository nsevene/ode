import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense } from "react";
import { HelmetProvider } from "react-helmet-async";
import ErrorBoundary from "@/components/ErrorBoundary";
import ChunkRecovery from "@/components/error/ChunkRecovery";
import RoleProtectedRoute from "@/components/RoleProtectedRoute";
import DemoModeNotification from "@/components/DemoModeNotification";
import PortalNavigation from "@/components/layout/PortalNavigation";
import { useDemoMode } from "@/hooks/useDemoMode";
import { CONFIG } from "@/lib/config";

// Lazy loaded pages
import { LazyPages } from "@/pages/LazyPages";

// Loading components
import { LoadingSpinner, FullPageLoading } from "@/components/LoadingStates";

// Accessibility components
import { SkipToMainContent, SkipToNavigation } from "@/components/SkipLink";

// Notification system
import { NotificationProvider } from "@/components/NotificationSystem";

// Performance monitoring
import { PerformanceMonitor } from "@/components/PerformanceMonitor";

// Mobile navigation
import { MobileBottomNav } from "@/components/MobileBottomNav";

// State management
import { useAuthStore } from "@/store/authStore";

// Analytics
import { useAnalytics } from "@/hooks/useAnalytics";

// SEO
import { SEOHead } from "@/components/seo/SEOHead";

// Integrated page component
import { IntegratedPage } from "@/components/IntegratedPage";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

// Main App component with full integration
function App() {
  const { isDemoMode } = useDemoMode();
  const { trackPageView } = useAnalytics();

  return (
    <ErrorBoundary>
      <ChunkRecovery>
        <HelmetProvider>
          <QueryClientProvider client={queryClient}>
            <NotificationProvider>
              <BrowserRouter>
                <TooltipProvider>
                  <div className="min-h-screen bg-background">
                    {/* Accessibility Skip Links */}
                    <SkipToMainContent />
                    <SkipToNavigation />
                    
                    {/* Demo Mode Notification */}
                    {isDemoMode && <DemoModeNotification />}
                    
                    {/* Performance Monitor (Development Only) */}
                    {process.env.NODE_ENV === 'development' && <PerformanceMonitor />}
                    
                    {/* Main Content */}
                    <main id="main-content">
                      <Routes>
                        {/* Public Routes with SEO */}
                        <Route 
                          path="/" 
                          element={
                            <IntegratedPage
                              seo={{
                                title: "ODE Food Hall — Gastro Village Ubud | Opening December 2025",
                                description: "ODE Food Hall Ubud - innovative gastro village with 12 food corners, Wine Staircase tastings, Chef's Table experiences & Taste Compass quests. Grand opening December 1, 2025.",
                                keywords: "ODE Food Hall Ubud, gastro village Bali, Wine Staircase Ubud, Chef's Table experiences, Taste Compass quests, commercial kitchen rental Ubud, food entrepreneur Bali, restaurant space rental, culinary business Ubud, halal dining Bali, family restaurants Ubud",
                                type: "website"
                              }}
                            >
                              <LazyPages.Index />
                            </IntegratedPage>
                          } 
                        />
                        <Route 
                          path="/home" 
                          element={
                            <IntegratedPage
                              seo={{
                                title: "Home — ODE Food Hall Ubud",
                                description: "Welcome to ODE Food Hall Ubud - your gateway to culinary excellence in Bali.",
                                type: "website"
                              }}
                            >
                              <LazyPages.Home />
                            </IntegratedPage>
                          } 
                        />
                        <Route 
                          path="/auth" 
                          element={
                            <IntegratedPage
                              seo={{
                                title: "Login — ODE Food Hall Ubud",
                                description: "Sign in to your ODE Food Hall account to access exclusive features and manage your bookings.",
                                type: "website"
                              }}
                            >
                              <LazyPages.Auth />
                            </IntegratedPage>
                          } 
                        />
                        <Route 
                          path="/menu" 
                          element={
                            <IntegratedPage
                              seo={{
                                title: "Menu — ODE Food Hall Ubud | 12 Food Corners & Wine Staircase",
                                description: "Explore our diverse menu featuring 12 food corners, Wine Staircase tastings, and Chef's Table experiences at ODE Food Hall Ubud.",
                                keywords: "ODE Food Hall menu, Ubud restaurant menu, food corners Bali, Wine Staircase Ubud, Chef's Table menu, international cuisine Bali, Asian fusion Ubud",
                                type: "website"
                              }}
                            >
                              <LazyPages.Menu />
                            </IntegratedPage>
                          } 
                        />
                        <Route 
                          path="/bookings" 
                          element={
                            <IntegratedPage
                              seo={{
                                title: "Book Your Experience — ODE Food Hall Ubud",
                                description: "Book your table at ODE Food Hall Ubud. Experience our Wine Staircase, Chef's Table, and Taste Compass quests. Opening December 2025.",
                                keywords: "book ODE Food Hall, Ubud restaurant booking, Wine Staircase booking, Chef's Table reservation, Taste Compass booking, ODE Food Hall reservation",
                                type: "website"
                              }}
                            >
                              <LazyPages.MyBookings />
                            </IntegratedPage>
                          } 
                        />
                        
                        {/* Tenant Portal Routes */}
                        <Route 
                          path="/tenants/*" 
                          element={
                            <IntegratedPage
                              seo={{
                                title: "Tenant Portal — ODE Food Hall Ubud | Commercial Kitchen Rental",
                                description: "Join ODE Food Hall as a tenant. Commercial kitchen rental, prime location, marketing support. Apply now for your food business in Ubud, Bali.",
                                keywords: "ODE Food Hall tenant, commercial kitchen rental Ubud, restaurant space rental Bali, food business Ubud, kitchen rental Bali, food entrepreneur Ubud",
                                type: "website"
                              }}
                            >
                              <LazyPages.TenantsPortal />
                            </IntegratedPage>
                          } 
                        />
                        
                        {/* Investor Portal Routes */}
                        <Route 
                          path="/investors/*" 
                          element={
                            <RoleProtectedRoute allowedRoles={['investor', 'admin']}>
                              <IntegratedPage
                                seo={{
                                  title: "Investor Portal — ODE Food Hall Ubud | Investment Opportunity",
                                  description: "Invest in ODE Food Hall Ubud. Innovative gastro village with 12 food corners, Wine Staircase, and Chef's Table experiences. View our investment deck.",
                                  keywords: "ODE Food Hall investment, Ubud restaurant investment, gastro village investment, food hall investment Bali, restaurant investment opportunity",
                                  type: "website"
                                }}
                              >
                                <LazyPages.InvestorsPortal />
                              </IntegratedPage>
                            </RoleProtectedRoute>
                          } 
                        />
                        
                        {/* Admin Routes */}
                        <Route 
                          path="/admin" 
                          element={
                            <RoleProtectedRoute allowedRoles={['admin']}>
                              <IntegratedPage
                                seo={{
                                  title: "Admin Dashboard — ODE Food Hall Ubud",
                                  description: "Administrative dashboard for ODE Food Hall management.",
                                  noindex: true
                                }}
                              >
                                <LazyPages.Admin />
                              </IntegratedPage>
                            </RoleProtectedRoute>
                          } 
                        />
                        
                        {/* 404 Route */}
                        <Route 
                          path="*" 
                          element={
                            <IntegratedPage
                              seo={{
                                title: "Page Not Found — ODE Food Hall Ubud",
                                description: "The page you're looking for doesn't exist.",
                                noindex: true
                              }}
                            >
                              <LazyPages.NotFound />
                            </IntegratedPage>
                          } 
                        />
                      </Routes>
                    </main>
                    
                    {/* Mobile Bottom Navigation */}
                    <MobileBottomNav />
                    
                    {/* Toast Notifications */}
                    <Toaster />
                    <Sonner />
                  </div>
                </TooltipProvider>
              </BrowserRouter>
            </NotificationProvider>
          </QueryClientProvider>
        </HelmetProvider>
      </ChunkRecovery>
    </ErrorBoundary>
  );
}

export default App;
