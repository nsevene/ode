import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import ErrorBoundary from '@/components/ErrorBoundary';
import ChunkRecovery from '@/components/error/ChunkRecovery';
import RoleProtectedRoute from '@/components/RoleProtectedRoute';
import DemoModeNotification from '@/components/DemoModeNotification';
import { useDemoMode } from '@/hooks/useDemoMode';
import { useRoles } from '@/hooks/useRoles';
import { CONFIG } from '@/lib/config';

// Navigation components
import Breadcrumbs from '@/components/navigation/Breadcrumbs';
import LoadingStates from '@/components/navigation/LoadingStates';
import UserFlows from '@/components/flows/UserFlows';

// Cart components
// import ShoppingCart from '@/components/cart/ShoppingCart';

// Context providers
import { AppProvider } from '@/contexts/AppContext';

// Lazy loaded pages
import { LazyPages } from '@/pages/LazyPages';

// Layout
import MainLayout from '@/components/layout/MainLayout';

// Main pages - using LazyPages for better performance
const {
  MyBookings,
  Dashboard,
  BusinessAnalytics,
  Marketing,
  GamesAdmin,
  RecipeManagement,
  ABTestAdmin,
  DataRoom,
  TodoPage,
  Auth,
} = LazyPages;

// Portal components
const {
  TenantsPortal,
  TenantsOverview,
  TenantsLongTerm,
  TenantsOpenKitchen,
  TenantsRates,
  TenantsServices,
  TenantsFloorPlan,
  TenantsFAQ,
  TenantsTeam,
  TenantsApply,
  TenantsMarketingBudget,
  InvestorsPortal,
  InvestorsIntroCall,
  MarketingPortal,
  DigitalEcosystemPortal,
  StorytellingHub,
} = LazyPages;

// Profile components
import ProfileLayout from '@/pages/profile/ProfileLayout';
import ProfileDetailsPage from '@/pages/profile/ProfileDetailsPage';
import OrderHistoryPage from '@/pages/profile/OrderHistoryPage';
import BookingHistoryPage from '@/pages/profile/BookingHistoryPage';
import FavoritesPage from '@/pages/profile/FavoritesPage';
import AddressesPage from '@/pages/profile/AddressesPage';
import PaymentMethodsPage from '@/pages/profile/PaymentMethodsPage';
import NotificationsPage from '@/pages/profile/NotificationsPage';

// Admin components
import EnhancedAdminDashboard from '@/pages/admin/AdminDashboard';
import UserManagement from '@/pages/admin/UserManagement';
import PromoteToAdmin from '@/pages/admin/PromoteToAdmin';
import SetupAdminAccount from '@/pages/admin/SetupAdminAccount';
import ChefsTableAdmin from '@/pages/admin/ChefsTableAdmin';

// System components
import SecureRoute from '@/components/SecureRoute';
import { ConversionTracker } from '@/components/analytics/ConversionTracker';
import { CrossSystemNotifications } from '@/components/integration/CrossSystemNotifications';
import { DataSynchronization } from '@/components/integration/DataSynchronization';
import { PushNotifications } from '@/components/integration/PushNotifications';
import { OfflineMode } from '@/components/integration/OfflineMode';

// Loading components
import { LoadingSpinner, FullPageLoading } from '@/components/LoadingStates';

// Accessibility components
import { SkipToMainContent, SkipToNavigation } from '@/components/SkipLink';

// Notification system
import { NotificationProvider } from '@/components/NotificationSystem';

// Performance monitoring
import { SimplePerformanceMonitor } from '@/components/performance/SimplePerformanceMonitor';

// Mobile navigation
import { MobileBottomNav } from '@/components/MobileBottomNav';

// State management
import { useAuthStore } from '@/store/authStore';

// Analytics
import { useAnalytics } from '@/hooks/useAnalytics';

// SEO
import { SEOHead } from '@/components/seo/SEOHead';

// AB Testing
import { ABTestProvider } from '@/components/ABTestProvider';
import { AuthProvider } from '@/hooks/useAuth';

// Create query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

function AppContent() {
  const { showDemoNotification, closeDemoNotification } = useDemoMode();
  const { userRole } = useRoles();

  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <BrowserRouter>
          <TooltipProvider>
            <ErrorBoundary>
              <ChunkRecovery />
              <AppProvider>
                <ABTestProvider>
                  <Toaster />
                  <Sonner />

                  {/* Demo Mode Notification */}
                  <DemoModeNotification
                    show={showDemoNotification}
                    onClose={closeDemoNotification}
                  />

                            <LoadingStates>
                              <UserFlows>
                                <div className="min-h-screen bg-gray-50">
                                  <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                                    <ConversionTracker>
                                      <Suspense fallback={<div className="flex items-center justify-center h-64">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                                      </div>}>
                                        <Routes>
                              {/* Public pages with MainLayout */}
                              <Route element={<MainLayout />}>
                                <Route path="/auth" element={<Auth />} />
                                
                                <Route
                                  path="/my-bookings"
                                  element={<MyBookings />}
                                />
                                <Route path="/todos" element={<TodoPage />} />
                                
                                {/* Test dashboard access */}
                                <Route path="/test-dashboard" element={<Dashboard />} />

                                {/* Profile */}
                                <Route
                                  path="/profile"
                                  element={<ProfileLayout />}
                                >
                                  <Route
                                    index
                                    element={<Navigate to="details" replace />}
                                  />
                                  <Route
                                    path="details"
                                    element={<ProfileDetailsPage />}
                                  />
                                  <Route
                                    path="orders"
                                    element={<OrderHistoryPage />}
                                  />
                                  <Route
                                    path="bookings"
                                    element={<BookingHistoryPage />}
                                  />
                                  <Route
                                    path="favorites"
                                    element={<FavoritesPage />}
                                  />
                                  <Route
                                    path="addresses"
                                    element={<AddressesPage />}
                                  />
                                  <Route
                                    path="payments"
                                    element={<PaymentMethodsPage />}
                                  />
                                  <Route
                                    path="notifications"
                                    element={<NotificationsPage />}
                                  />
                                </Route>
                              </Route>

                              <Route path="/" element={<Auth />} />

                              {/* Pages without MainLayout (e.g., portals, demo) */}
                              {/* B2C route to be removed. */}
                              {/* <Route
                                path="/demo-flows"
                                element={<UserFlowDemo />}
                              /> */}
                              {/* B2C route to be removed. */}
                              {/* <Route
                                path="/guest-demo"
                                element={<GuestDemo />}
                              /> */}
                              {/* B2C route to be removed. */}
                              {/* <Route
                                path="/checkout"
                                element={<CheckoutPage />}
                              /> */}

                              {/* User Flow Demo */}
                              {/* B2C route to be removed. */}
                              {/* <Route
                                path="/demo-flows"
                                element={<UserFlowDemo />}
                              /> */}

                              {/* Guest Demo - Main Demo Page */}
                              {/* B2C route to be removed. */}
                              {/* <Route
                                path="/guest-demo"
                                element={<GuestDemo />}
                              /> */}

                              {/* Guest Demo Redirects - 301 redirects */}
                              {/* B2C route to be removed. */}
                              {/* <Route
                                path="/order"
                                element={<Navigate to="/guest-demo" replace />}
                              /> */}
                              {/* B2C route to be removed. */}
                              {/* <Route
                                path="/order-now"
                                element={<Navigate to="/guest-demo" replace />}
                              /> */}
                              {/* B2C route to be removed. */}
                              {/* <Route
                                path="/book"
                                element={<Navigate to="/guest-demo" replace />}
                              /> */}
                              {/* B2C route to be removed. */}
                              {/* <Route
                                path="/book-table"
                                element={<Navigate to="/guest-demo" replace />}
                              /> */}
                              {/* B2C route to be removed. */}
                              {/* <Route
                                path="/checkout-redirect"
                                element={<Navigate to="/guest-demo" replace />}
                              /> */}
                              {/* <Route path="/menu" element={<Navigate to="/guest-demo" replace />} /> */}
                              {/* B2C route to be removed. */}
                              {/* <Route
                                path="/pwa"
                                element={<Navigate to="/guest-demo" replace />}
                              /> */}
                              {/* B2C route to be removed. */}
                              {/* <Route
                                path="/download-app"
                                element={<Navigate to="/guest-demo" replace />}
                              /> */}
                              {/* B2C route to be removed. */}
                              {/* <Route
                                path="/order/payment"
                                element={<Navigate to="/guest-demo" replace />}
                              /> */}
                              {/* B2C route to be removed. */}
                              {/* <Route
                                path="/passport"
                                element={<Navigate to="/guest-demo" replace />}
                              /> */}
                              {/* B2C route to be removed. */}
                              {/* <Route
                                path="/compass"
                                element={<Navigate to="/guest-demo" replace />}
                              /> */}
                              {/* B2C route to be removed. */}
                              {/* <Route
                                path="/taste-passport"
                                element={<Navigate to="/guest-demo" replace />}
                              /> */}
                              {/* <Route path="/taste-compass" element={<TasteCompassEnhanced />} /> */}
                              {/* B2C route to be removed. */}
                              {/* <Route
                                path="/ode-by-night"
                                element={<Navigate to="/guest-demo" replace />}
                              /> */}
                              {/* <Route path="/events" element={<Events />} /> */}
                              {/* <Route path="/events/:id" element={<EventDetailPage />} /> */}

                              {/* Philosophy */}
                              {/* <Route path="/philosophy" element={<Philosophy />} /> */}

                              {/* Vendors */}
                              {/* <Route path="/vendors" element={<VendorsPage />} /> */}
                              {/* <Route path="/vendors/:id" element={<VendorDetailPage />} /> */}

                              {/* Additional Pages */}
                              {/* <Route path="/breakfast" element={<Breakfast />} /> */}
                              {/* <Route path="/delivery" element={<Delivery />} /> */}
                              {/* <Route path="/become-vendor" element={<Vendors />} /> */}
                              {/* <Route path="/chefs-table" element={<ChefsTable />} /> */}

                              {/* Main Navigation Pages */}
                              {/* <Route path="/kitchens" element={<Kitchens />} /> */}
                              {/* <Route path="/spaces" element={<Spaces />} /> */}
                              {/* <Route path="/about" element={<About />} /> */}
                              {/* <Route path="/taste-quest" element={<TasteQuest />} /> */}
                              {/* <Route path="/experiences" element={<Experiences />} /> */}
                              {/* <Route path="/sustainability" element={<Sustainability />} /> */}
                              {/* <Route path="/my-bookings" element={<MyBookings />} /> */}

                              {/* Checkout */}
                              {/* <Route path="/checkout" element={<CheckoutPage />} /> */}

                              {/* Profile */}
                              {/* <Route path="/profile" element={<ProfileLayout />}>
                                  <Route index element={<ProfileDetailsPage />} />
                                  <Route path="details" element={<ProfileDetailsPage />} />
                                  <Route path="orders" element={<OrderHistoryPage />} />
                                  <Route path="bookings" element={<BookingHistoryPage />} />
                                  <Route path="favorites" element={<FavoritesPage />} />
                                  <Route path="addresses" element={<AddressesPage />} />
                                  <Route path="payments" element={<PaymentMethodsPage />} />
                                  <Route path="notifications" element={<NotificationsPage />} />
                                </Route> */}

                              {/* Storytelling - accessible to all */}
                              <Route
                                path="/storytelling"
                                element={
                                  <RoleProtectedRoute requiredPath="/storytelling">
                                    <StorytellingHub />
                                  </RoleProtectedRoute>
                                }
                              />
                              <Route
                                path="/storytelling/:story"
                                element={
                                  <RoleProtectedRoute requiredPath="/storytelling">
                                    <StorytellingHub />
                                  </RoleProtectedRoute>
                                }
                              />

                              {/* Tenants - tenant, internal only - specific routes first */}
                              <Route
                                path="/tenants/overview"
                                element={
                                  <RoleProtectedRoute requiredPath="/tenants/overview">
                                    <TenantsOverview />
                                  </RoleProtectedRoute>
                                }
                              />
                              <Route
                                path="/tenants/long-term"
                                element={
                                  <RoleProtectedRoute requiredPath="/tenants/long-term">
                                    <TenantsLongTerm />
                                  </RoleProtectedRoute>
                                }
                              />
                              <Route
                                path="/tenants/open-kitchen"
                                element={
                                  <RoleProtectedRoute requiredPath="/tenants/open-kitchen">
                                    <TenantsOpenKitchen />
                                  </RoleProtectedRoute>
                                }
                              />
                              <Route
                                path="/tenants/rates"
                                element={
                                  <RoleProtectedRoute requiredPath="/tenants/rates">
                                    <TenantsRates />
                                  </RoleProtectedRoute>
                                }
                              />
                              <Route
                                path="/tenants/services"
                                element={
                                  <RoleProtectedRoute requiredPath="/tenants/services">
                                    <TenantsServices />
                                  </RoleProtectedRoute>
                                }
                              />
                              <Route
                                path="/tenants/floor-plan"
                                element={
                                  <RoleProtectedRoute requiredPath="/tenants/floor-plan">
                                    <TenantsFloorPlan />
                                  </RoleProtectedRoute>
                                }
                              />
                              <Route
                                path="/tenants/faq"
                                element={
                                  <RoleProtectedRoute requiredPath="/tenants/faq">
                                    <TenantsFAQ />
                                  </RoleProtectedRoute>
                                }
                              />
                              <Route
                                path="/tenants/team"
                                element={
                                  <RoleProtectedRoute requiredPath="/tenants/team">
                                    <TenantsTeam />
                                  </RoleProtectedRoute>
                                }
                              />
                              <Route
                                path="/tenants/apply"
                                element={
                                  <RoleProtectedRoute requiredPath="/tenants/apply">
                                    <TenantsApply />
                                  </RoleProtectedRoute>
                                }
                              />
                              <Route
                                path="/tenants/marketing-budget"
                                element={
                                  <RoleProtectedRoute requiredPath="/tenants/marketing-budget">
                                    <TenantsMarketingBudget />
                                  </RoleProtectedRoute>
                                }
                              />
                              {/* Portal routes last - dynamic params */}
                              <Route
                                path="/tenants/:section"
                                element={
                                  <RoleProtectedRoute requiredPath="/tenants">
                                    <TenantsPortal />
                                  </RoleProtectedRoute>
                                }
                              />
                              <Route
                                path="/tenants"
                                element={
                                  <RoleProtectedRoute requiredPath="/tenants">
                                    <Navigate to="/tenants/overview" replace />
                                  </RoleProtectedRoute>
                                }
                              />

                              {/* Investors - investor, internal only */}
                              <Route
                                path="/investors/intro-call"
                                element={
                                  <RoleProtectedRoute requiredPath="/investors/intro-call">
                                    <InvestorsIntroCall />
                                  </RoleProtectedRoute>
                                }
                              />
                              <Route
                                path="/investors/:section"
                                element={
                                  <RoleProtectedRoute requiredPath="/investors">
                                    <InvestorsPortal />
                                  </RoleProtectedRoute>
                                }
                              />
                              <Route
                                path="/investors"
                                element={
                                  <RoleProtectedRoute requiredPath="/investors">
                                    <Navigate to="/investors/deck" replace />
                                  </RoleProtectedRoute>
                                }
                              />

                              {/* Marketing - tenant, investor, internal */}
                              <Route
                                path="/marketing/:section"
                                element={
                                  <RoleProtectedRoute requiredPath="/marketing">
                                    <MarketingPortal />
                                  </RoleProtectedRoute>
                                }
                              />
                              <Route
                                path="/marketing"
                                element={
                                  <RoleProtectedRoute requiredPath="/marketing">
                                    <Navigate
                                      to="/marketing/taste-alley"
                                      replace
                                    />
                                  </RoleProtectedRoute>
                                }
                              />

                              {/* Digital Ecosystem - tenant, investor, internal */}
                              <Route
                                path="/digital-ecosystem/:section"
                                element={
                                  <RoleProtectedRoute requiredPath="/digital-ecosystem">
                                    <DigitalEcosystemPortal />
                                  </RoleProtectedRoute>
                                }
                              />
                              <Route
                                path="/digital-ecosystem"
                                element={
                                  <RoleProtectedRoute requiredPath="/digital-ecosystem">
                                    <Navigate
                                      to="/digital-ecosystem/compass"
                                      replace
                                    />
                                  </RoleProtectedRoute>
                                }
                              />

                              {/* Data Room - investor, internal */}
                              <Route
                                path="/data-room"
                                element={
                                  <RoleProtectedRoute requiredPath="/data-room">
                                    <DataRoom />
                                  </RoleProtectedRoute>
                                }
                              />
                              <Route
                                path="/data-room/:section"
                                element={
                                  <RoleProtectedRoute requiredPath="/data-room">
                                    <DataRoom />
                                  </RoleProtectedRoute>
                                }
                              />

                              {/* Authentication */}
                              {/* <Route path="/auth" element={<Auth />} /> */}

                              {/* Protected Admin Routes */}

                              <Route
                                path="/admin/chefs-table"
                                element={
                                  <SecureRoute requiredRole="admin">
                                    <ChefsTableAdmin />
                                  </SecureRoute>
                                }
                              />

                              <Route
                                path="/ab-test-admin"
                                element={
                                  <SecureRoute requiredRole="admin">
                                    <ABTestAdmin />
                                  </SecureRoute>
                                }
                              />

                              <Route
                                path="/dashboard"
                                element={
                                  <SecureRoute requiredRole="admin">
                                    <Dashboard />
                                  </SecureRoute>
                                }
                              />

                              <Route
                                path="/business-analytics"
                                element={
                                  <SecureRoute requiredRole="admin">
                                    <BusinessAnalytics />
                                  </SecureRoute>
                                }
                              />

                              <Route
                                path="/marketing-admin"
                                element={
                                  <SecureRoute requiredRole="admin">
                                    <Marketing />
                                  </SecureRoute>
                                }
                              />

                              {/* CMS Dashboard */}
                              <Route
                                path="/cms-dashboard"
                                element={
                                  <SecureRoute requiredRole="admin">
                                    <LazyPages.CMSDashboard />
                                  </SecureRoute>
                                }
                              />

                              <Route
                                path="/games-admin"
                                element={
                                  <SecureRoute requiredRole="admin">
                                    <GamesAdmin />
                                  </SecureRoute>
                                }
                              />

                              <Route
                                path="/recipe-management"
                                element={
                                  <SecureRoute requiredRole="admin">
                                    <RecipeManagement />
                                  </SecureRoute>
                                }
                              />

                              {/* Admin Dashboard Routes */}
                              <Route
                                path="/admin"
                                element={
                                  <SecureRoute requiredRole="admin">
                                    <EnhancedAdminDashboard />
                                  </SecureRoute>
                                }
                              />

                              <Route
                                path="/admin/users"
                                element={
                                  <SecureRoute requiredRole="admin">
                                    <UserManagement />
                                  </SecureRoute>
                                }
                              />

                              <Route
                                path="/admin/promote"
                                element={<PromoteToAdmin />}
                              />

                              <Route
                                path="/admin/setup"
                                element={<SetupAdminAccount />}
                              />

                              {/* 404 fallback */}
                              {/* B2C route to be removed. */}
                              {/* <Route path="*" element={<NotFound />} /> */}
                            </Routes>
                          </Suspense>
                        </ConversionTracker>
                      </main>
                    </div>
                  </UserFlows>
                </LoadingStates>

                {/* <ShoppingCart /> */}

                {/* Admin-only components */}
                {userRole === 'admin' && (
                  <>
                    <CrossSystemNotifications />
                    <DataSynchronization />
                    <SimplePerformanceMonitor />
                    <PushNotifications />
                    <OfflineMode />
                  </>
                )}

                <MobileBottomNav />
              </ABTestProvider>
            </AppProvider>
          </ErrorBoundary>
        </TooltipProvider>
      </BrowserRouter>
    </HelmetProvider>
  </QueryClientProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
