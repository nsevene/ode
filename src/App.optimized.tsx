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
                        {/* Public Routes */}
                        <Route path="/" element={<LazyPages.Index />} />
                        <Route path="/home" element={<LazyPages.Home />} />
                        <Route path="/auth" element={<LazyPages.Auth />} />
                        <Route path="/privacy-policy" element={<LazyPages.PrivacyPolicy />} />
                        <Route path="/contact" element={<LazyPages.Contact />} />
                        <Route path="/sustainability" element={<LazyPages.Sustainability />} />
                        
                        {/* Guest Experience Routes */}
                        <Route path="/events" element={<LazyPages.Events />} />
                        <Route path="/menu" element={<LazyPages.Menu />} />
                        <Route path="/taste-compass" element={<LazyPages.TasteCompass />} />
                        <Route path="/taste-quest" element={<LazyPages.TasteQuest />} />
                        <Route path="/experiences" element={<LazyPages.Experiences />} />
                        <Route path="/about" element={<LazyPages.About />} />
                        <Route path="/delivery-menu" element={<LazyPages.DeliveryMenu />} />
                        <Route path="/events-popup" element={<LazyPages.EventsPopUp />} />
                        <Route path="/about-ode" element={<LazyPages.AboutODE />} />
                        <Route path="/community" element={<LazyPages.Community />} />
                        <Route path="/lounge" element={<LazyPages.Lounge />} />
                        <Route path="/second-floor" element={<LazyPages.SecondFloor />} />
                        <Route path="/virtual-tour" element={<LazyPages.VirtualTour />} />
                        <Route path="/wine-staircase" element={<LazyPages.WineStaircase />} />
                        <Route path="/chefs-table" element={<LazyPages.ChefsTable />} />
                        <Route path="/my-bookings" element={<LazyPages.MyBookings />} />
                        <Route path="/booking-detail/:id" element={<LazyPages.BookingDetail />} />
                        <Route path="/payment-success" element={<LazyPages.PaymentSuccess />} />
                        <Route path="/payment-cancelled" element={<LazyPages.PaymentCancelled />} />
                        <Route path="/photos" element={<LazyPages.PhotosPage />} />
                        <Route path="/breakfast-for-villas" element={<LazyPages.BreakfastForVillas />} />
                        <Route path="/breakfast" element={<LazyPages.BreakfastPage />} />
                        <Route path="/quick-booking" element={<LazyPages.QuickBookingPage />} />
                        <Route path="/food-ordering" element={<LazyPages.FoodOrdering />} />
                        <Route path="/kitchens" element={<LazyPages.Kitchens />} />
                        <Route path="/kitchen/:id" element={<LazyPages.KitchenDetail />} />
                        <Route path="/spaces" element={<LazyPages.Spaces />} />
                        <Route path="/zone/:id" element={<LazyPages.ZonePage />} />
                        <Route path="/storytelling/*" element={<LazyPages.StorytellingHub />} />
                        
                        {/* Admin & Internal Routes */}
                        <Route path="/admin" element={<RoleProtectedRoute allowedRoles={['admin']}><LazyPages.Admin /></RoleProtectedRoute>} />
                        <Route path="/dashboard" element={<RoleProtectedRoute allowedRoles={['admin', 'internal']}><LazyPages.Dashboard /></RoleProtectedRoute>} />
                        <Route path="/games-admin" element={<RoleProtectedRoute allowedRoles={['admin']}><LazyPages.GamesAdmin /></RoleProtectedRoute>} />
                        <Route path="/ab-test-admin" element={<RoleProtectedRoute allowedRoles={['admin']}><LazyPages.ABTestAdmin /></RoleProtectedRoute>} />
                        <Route path="/chefs-table-admin" element={<RoleProtectedRoute allowedRoles={['admin']}><LazyPages.ChefsTableAdmin /></RoleProtectedRoute>} />
                        <Route path="/business-analytics" element={<RoleProtectedRoute allowedRoles={['admin', 'investor']}><LazyPages.BusinessAnalytics /></RoleProtectedRoute>} />
                        <Route path="/marketing" element={<RoleProtectedRoute allowedRoles={['admin', 'tenant', 'investor']}><LazyPages.Marketing /></RoleProtectedRoute>} />
                        <Route path="/ab-testing" element={<RoleProtectedRoute allowedRoles={['admin']}><LazyPages.ABTesting /></RoleProtectedRoute>} />
                        <Route path="/mobile-features" element={<RoleProtectedRoute allowedRoles={['admin']}><LazyPages.MobileFeatures /></RoleProtectedRoute>} />
                        <Route path="/recipe-management" element={<RoleProtectedRoute allowedRoles={['admin', 'tenant']}><LazyPages.RecipeManagement /></RoleProtectedRoute>} />
                        <Route path="/ode-overview" element={<RoleProtectedRoute allowedRoles={['admin', 'internal']}><LazyPages.ODEOverview /></RoleProtectedRoute>} />
                        <Route path="/performance" element={<RoleProtectedRoute allowedRoles={['admin']}><LazyPages.PerformancePage /></RoleProtectedRoute>} />
                        <Route path="/quality-dashboard" element={<RoleProtectedRoute allowedRoles={['admin']}><LazyPages.QualityDashboard /></RoleProtectedRoute>} />
                        <Route path="/data-room" element={<RoleProtectedRoute allowedRoles={['admin', 'investor']}><LazyPages.DataRoom /></RoleProtectedRoute>} />
                        
                        {/* Tenant Portal Routes */}
                        <Route path="/tenants/*" element={<LazyPages.TenantsPortal />} />
                        <Route path="/tenants/overview" element={<LazyPages.TenantsOverview />} />
                        <Route path="/tenants/long-term" element={<LazyPages.TenantsLongTerm />} />
                        <Route path="/tenants/open-kitchen" element={<LazyPages.TenantsOpenKitchen />} />
                        <Route path="/tenants/rates" element={<LazyPages.TenantsRates />} />
                        <Route path="/tenants/services" element={<LazyPages.TenantsServices />} />
                        <Route path="/tenants/floor-plan" element={<LazyPages.TenantsFloorPlan />} />
                        <Route path="/tenants/faq" element={<LazyPages.TenantsFAQ />} />
                        <Route path="/tenants/team" element={<LazyPages.TenantsTeam />} />
                        <Route path="/tenants/apply" element={<LazyPages.TenantsApply />} />
                        <Route path="/tenants/marketing-budget" element={<LazyPages.TenantsMarketingBudget />} />
                        <Route path="/vendors-hello" element={<LazyPages.VendorsHello />} />
                        <Route path="/dolce-italia" element={<LazyPages.DolceItalia />} />
                        <Route path="/spicy-asia" element={<LazyPages.SpicyAsia />} />
                        <Route path="/wild-bali" element={<LazyPages.WildBali />} />
                        <Route path="/ferment-sector" element={<LazyPages.FermentSector />} />
                        <Route path="/smoke-sector" element={<LazyPages.SmokeSector />} />
                        <Route path="/spice-sector" element={<LazyPages.SpiceSector />} />
                        
                        {/* Investor Portal Routes */}
                        <Route path="/investors/*" element={<RoleProtectedRoute allowedRoles={['investor', 'admin']}><LazyPages.InvestorsPortal /></RoleProtectedRoute>} />
                        <Route path="/investors/intro-call" element={<RoleProtectedRoute allowedRoles={['investor', 'admin']}><LazyPages.InvestorsIntroCall /></RoleProtectedRoute>} />
                        
                        {/* Digital Ecosystem Portal Routes */}
                        <Route path="/digital-ecosystem/*" element={<RoleProtectedRoute allowedRoles={['admin', 'tenant', 'investor']}><LazyPages.DigitalEcosystemPortal /></RoleProtectedRoute>} />
                        
                        {/* 404 Route */}
                        <Route path="*" element={<LazyPages.NotFound />} />
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