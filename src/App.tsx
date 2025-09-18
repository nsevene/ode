
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
import { useDemoMode } from "@/hooks/useDemoMode";
import { useRoles } from "@/hooks/useRoles";
import { CONFIG } from "@/lib/config";

// Navigation components
import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import LoadingStates from "@/components/navigation/LoadingStates";
import UserFlows from "@/components/flows/UserFlows";

// Cart components
import ShoppingCart from "@/components/cart/ShoppingCart";

// Context providers
import { AppProvider } from "@/contexts/AppContext";

// Lazy loaded pages
import { LazyPages } from "@/pages/LazyPages";

// Loading components
import { LoadingSpinner, FullPageLoading } from "@/components/LoadingStates";

// Accessibility components
import { SkipToMainContent, SkipToNavigation } from "@/components/SkipLink";

// Notification system
import { NotificationProvider } from "@/components/NotificationSystem";

// Performance monitoring
import { SimplePerformanceMonitor } from "@/components/performance/SimplePerformanceMonitor";

// Mobile navigation
import { MobileBottomNav } from "@/components/MobileBottomNav";

// State management
import { useAuthStore } from "@/store/authStore";

// Analytics
import { useAnalytics } from "@/hooks/useAnalytics";

// SEO
import { SEOHead } from "@/components/seo/SEOHead";



import { ConversionTracker } from "@/components/analytics/ConversionTracker";

import { ABTestProvider } from "@/components/ABTestProvider";
import { AuthProvider } from "@/hooks/useAuth";

import { CrossSystemNotifications } from "@/components/integration/CrossSystemNotifications";
import { DataSynchronization } from "@/components/integration/DataSynchronization";
import Index from "./pages/Index";
import Events from "./pages/Events";
import Menu from "./pages/Menu";
import TasteCompass from "./pages/TasteCompass";
import TasteCompassEnhanced from "./pages/TasteCompassEnhanced";
import TasteQuest from "./pages/TasteQuest";
import Experiences from "./pages/Experiences";
import About from "./pages/About";
import DeliveryMenu from "./pages/DeliveryMenu";
import BecomeVendor from "./pages/BecomeVendor";

import EventsPopUp from "./pages/EventsPopUp";

import AboutODE from "./pages/AboutODE";
import Community from "./pages/Community";
import Lounge from "./pages/Lounge";
import SecondFloor from "./pages/SecondFloor";
import VirtualTour from "./pages/VirtualTour";

import WineStaircase from "./pages/WineStaircase";
import VendorsHello from "./pages/VendorsHello";
import MyBookings from "./pages/MyBookings";
import BookingDetail from "./pages/BookingDetail";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancelled from "./pages/PaymentCancelled";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import EnhancedAdminDashboard from "./components/admin/EnhancedAdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import PromoteToAdmin from "./pages/admin/PromoteToAdmin";
import SetupAdminAccount from "./pages/admin/SetupAdminAccount";
import AdminCheck from "./components/AdminCheck";
import GamesAdmin from "./pages/GamesAdmin";
import NotFound from "./pages/NotFound";
import { PhotosPage } from "./pages/PhotosPage";
import DolceItalia from "./pages/vendors/DolceItalia";
import SpicyAsia from "./pages/vendors/SpicyAsia";
import WildBali from "./pages/vendors/WildBali";
import FermentSector from "./pages/vendors/FermentSector";
import SmokeSector from "./pages/vendors/SmokeSector";
import SpiceSector from "./pages/vendors/SpiceSector";

import BreakfastForVillas from "./pages/BreakfastForVillas";
import BreakfastPage from "./pages/BreakfastPage";
import PerformancePage from "./pages/Performance";
import QuickBookingPage from "./pages/QuickBooking";
import ABTestAdmin from "./pages/ABTestAdmin";
import ChefsTableAdmin from "./pages/admin/ChefsTableAdmin";
import { CommunityHub } from "@/components/social/CommunityHub";
import ProtectedRoute from "@/components/ProtectedRoute";
import { SecureRoute } from "@/components/security/SecureRoute";
import { PushNotifications } from "@/components/mobile/PushNotifications";
import { OfflineMode } from "@/components/mobile/OfflineMode";
import FoodOrdering from "./pages/FoodOrdering";
// import Quest from "./pages/Quest";
import Kitchens from "./pages/Kitchens";
import KitchenDetail from "./pages/KitchenDetail";
import Spaces from "./pages/Spaces";
// import Delivery from "./pages/Delivery";
import Sustainability from "./pages/Sustainability";
import Contact from "./pages/Contact";
import { SupportChat } from "@/components/support/SupportChat";
import { SecurityLogger } from "@/components/security/SecurityLogger";
import BusinessAnalytics from "./pages/BusinessAnalytics";
import Marketing from "./pages/Marketing";
import ABTesting from "./pages/ABTesting";
import MobileFeatures from "./pages/MobileFeatures";
import RecipeManagement from "./pages/RecipeManagement";
import ODEOverview from "./pages/ODEOverview";
import Home from "./pages/Home";
import NewPhilosophy from "./pages/NewPhilosophy";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import { LayoutFix } from "@/components/LayoutFix";
import QualityDashboard from "@/components/debug/QualityDashboard";
import ZonePage from "./pages/zones/ZonePage";
import StorytellingHub from "./pages/storytelling/StorytellingHub";
import TenantsPortal from "./pages/tenants/TenantsPortal";
import TenantsOverview from "./pages/tenants/TenantsOverview";
import TenantsLongTerm from "./pages/tenants/TenantsLongTerm";
import TenantsOpenKitchen from "./pages/tenants/TenantsOpenKitchen";
import TenantsRates from "./pages/tenants/TenantsRates";
import TenantsServices from "./pages/tenants/TenantsServices";
import TenantsFloorPlan from "./pages/tenants/TenantsFloorPlan";
import TenantsFAQ from "./pages/tenants/TenantsFAQ";
import TenantsTeam from "./pages/tenants/TenantsTeam";
import TenantsApply from "./pages/tenants/TenantsApply";
import TenantsMarketingBudget from "./pages/tenants/TenantsMarketingBudget";
import DataRoom from "./pages/DataRoom";
import InvestorsPortal from "./pages/investors/InvestorsPortal";
import InvestorsIntroCall from "./pages/investors/InvestorsIntroCall";
import MarketingPortal from "./pages/marketing/MarketingPortal";
import DigitalEcosystemPortal from "./pages/digital-ecosystem/DigitalEcosystemPortal";
import UserFlowDemo from "./pages/UserFlowDemo";
import { GuestDemo } from "./pages/guest-demo";
import VendorsPage from "./pages/VendorsPage";
import VendorDetailPage from "./pages/VendorDetailPage";
import EventDetailPage from "./pages/EventDetailPage";
import CheckoutPage from "./pages/CheckoutPage";
import ProfileLayout from "./pages/profile/ProfileLayout";
import ProfileDetailsPage from "./pages/profile/ProfileDetailsPage";
import OrderHistoryPage from "./pages/profile/OrderHistoryPage";
import BookingHistoryPage from "./pages/profile/BookingHistoryPage";
import FavoritesPage from "./pages/profile/FavoritesPage";
import AddressesPage from "./pages/profile/AddressesPage";
import PaymentMethodsPage from "./pages/profile/PaymentMethodsPage";
import NotificationsPage from "./pages/profile/NotificationsPage";

// New pages
import Philosophy from "./pages/Philosophy";
import Breakfast from "./pages/Breakfast";
import Delivery from "./pages/Delivery";
import Vendors from "./pages/Vendors";
import ChefsTable from "./pages/ChefsTable";
import "./lib/i18n";

const queryClient = new QueryClient();

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
                              <Routes>
                          {/* Home - accessible to all */}
                          <Route path="/" element={<Index />} />
                          
                          {/* User Flow Demo */}
                          <Route path="/demo-flows" element={<UserFlowDemo />} />
                          
                          {/* Guest Demo - Main Demo Page */}
                          <Route path="/guest-demo" element={<GuestDemo />} />
                          
                          {/* Guest Demo Redirects - 301 redirects */}
                          <Route path="/order" element={<Navigate to="/guest-demo" replace />} />
                          <Route path="/order-now" element={<Navigate to="/guest-demo" replace />} />
                          <Route path="/book" element={<Navigate to="/guest-demo" replace />} />
                          <Route path="/book-table" element={<Navigate to="/guest-demo" replace />} />
                          <Route path="/checkout" element={<Navigate to="/guest-demo" replace />} />
                          <Route path="/menu" element={<Navigate to="/guest-demo" replace />} />
                          <Route path="/pwa" element={<Navigate to="/guest-demo" replace />} />
                          <Route path="/download-app" element={<Navigate to="/guest-demo" replace />} />
                          <Route path="/order/payment" element={<Navigate to="/guest-demo" replace />} />
                          <Route path="/passport" element={<Navigate to="/guest-demo" replace />} />
                          <Route path="/compass" element={<Navigate to="/guest-demo" replace />} />
                          <Route path="/taste-passport" element={<Navigate to="/guest-demo" replace />} />
                          <Route path="/taste-compass" element={<TasteCompassEnhanced />} />
                          <Route path="/ode-by-night" element={<Navigate to="/guest-demo" replace />} />
                          <Route path="/events" element={<Events />} />
                          <Route path="/events/:id" element={<EventDetailPage />} />
                          
                          {/* Philosophy */}
                          <Route path="/philosophy" element={<Philosophy />} />
                          
                          {/* Vendors */}
                          <Route path="/vendors" element={<VendorsPage />} />
                          <Route path="/vendors/:id" element={<VendorDetailPage />} />
                          
                          {/* Additional Pages */}
                          <Route path="/breakfast" element={<Breakfast />} />
                          <Route path="/delivery" element={<Delivery />} />
                          <Route path="/become-vendor" element={<Vendors />} />
                          <Route path="/chefs-table" element={<ChefsTable />} />
                          
                          {/* Checkout */}
                          <Route path="/checkout" element={<CheckoutPage />} />
                          
                          {/* Profile */}
            <Route path="/profile" element={<ProfileLayout />}>
              <Route index element={<ProfileDetailsPage />} />
              <Route path="details" element={<ProfileDetailsPage />} />
              <Route path="orders" element={<OrderHistoryPage />} />
              <Route path="bookings" element={<BookingHistoryPage />} />
              <Route path="favorites" element={<FavoritesPage />} />
              <Route path="addresses" element={<AddressesPage />} />
              <Route path="payments" element={<PaymentMethodsPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
            </Route>
                          
          {/* Storytelling - accessible to all */}
          <Route path="/storytelling" element={
            <RoleProtectedRoute requiredPath="/storytelling">
              <StorytellingHub />
            </RoleProtectedRoute>
          } />
          <Route path="/storytelling/:story" element={
            <RoleProtectedRoute requiredPath="/storytelling">
              <StorytellingHub />
            </RoleProtectedRoute>
          } />
                          
          {/* Tenants - tenant, internal only - specific routes first */}
          <Route path="/tenants/overview" element={
            <RoleProtectedRoute requiredPath="/tenants/overview">
              <TenantsOverview />
            </RoleProtectedRoute>
          } />
          <Route path="/tenants/long-term" element={
            <RoleProtectedRoute requiredPath="/tenants/long-term">
              <TenantsLongTerm />
            </RoleProtectedRoute>
          } />
          <Route path="/tenants/open-kitchen" element={
            <RoleProtectedRoute requiredPath="/tenants/open-kitchen">
              <TenantsOpenKitchen />
            </RoleProtectedRoute>
          } />
          <Route path="/tenants/rates" element={
            <RoleProtectedRoute requiredPath="/tenants/rates">
              <TenantsRates />
            </RoleProtectedRoute>
          } />
          <Route path="/tenants/services" element={
            <RoleProtectedRoute requiredPath="/tenants/services">
              <TenantsServices />
            </RoleProtectedRoute>
          } />
          <Route path="/tenants/floor-plan" element={
            <RoleProtectedRoute requiredPath="/tenants/floor-plan">
              <TenantsFloorPlan />
            </RoleProtectedRoute>
          } />
          <Route path="/tenants/faq" element={
            <RoleProtectedRoute requiredPath="/tenants/faq">
              <TenantsFAQ />
            </RoleProtectedRoute>
          } />
          <Route path="/tenants/team" element={
            <RoleProtectedRoute requiredPath="/tenants/team">
              <TenantsTeam />
            </RoleProtectedRoute>
          } />
          <Route path="/tenants/apply" element={
            <RoleProtectedRoute requiredPath="/tenants/apply">
              <TenantsApply />
            </RoleProtectedRoute>
          } />
          <Route path="/tenants/marketing-budget" element={
            <RoleProtectedRoute requiredPath="/tenants/marketing-budget">
              <TenantsMarketingBudget />
            </RoleProtectedRoute>
          } />
          {/* Portal routes last - dynamic params */}
          <Route path="/tenants/:section" element={
            <RoleProtectedRoute requiredPath="/tenants">
              <TenantsPortal />
            </RoleProtectedRoute>
          } />
          <Route path="/tenants" element={
            <RoleProtectedRoute requiredPath="/tenants">
              <Navigate to="/tenants/overview" replace />
            </RoleProtectedRoute>
          } />
                          
                          {/* Investors - investor, internal only */}
                          <Route path="/investors/intro-call" element={
                            <RoleProtectedRoute requiredPath="/investors/intro-call">
                              <InvestorsIntroCall />
                            </RoleProtectedRoute>
                          } />
                          <Route path="/investors/:section" element={
                            <RoleProtectedRoute requiredPath="/investors">
                              <InvestorsPortal />
                            </RoleProtectedRoute>
                          } />
                          <Route path="/investors" element={
                            <RoleProtectedRoute requiredPath="/investors">
                              <Navigate to="/investors/deck" replace />
                            </RoleProtectedRoute>
                          } />
                          
                          {/* Marketing - tenant, investor, internal */}
                          <Route path="/marketing/:section" element={
                            <RoleProtectedRoute requiredPath="/marketing">
                              <MarketingPortal />
                            </RoleProtectedRoute>
                          } />
                          <Route path="/marketing" element={
                            <RoleProtectedRoute requiredPath="/marketing">
                              <Navigate to="/marketing/taste-alley" replace />
                            </RoleProtectedRoute>
                          } />
                          
                          {/* Digital Ecosystem - tenant, investor, internal */}
                          <Route path="/digital-ecosystem/:section" element={
                            <RoleProtectedRoute requiredPath="/digital-ecosystem">
                              <DigitalEcosystemPortal />
                            </RoleProtectedRoute>
                          } />
                          <Route path="/digital-ecosystem" element={
                            <RoleProtectedRoute requiredPath="/digital-ecosystem">
                              <Navigate to="/digital-ecosystem/compass" replace />
                            </RoleProtectedRoute>
                          } />
                          
                          
          {/* Data Room - investor, internal */}
          <Route path="/data-room" element={
            <RoleProtectedRoute requiredPath="/data-room">
              <DataRoom />
            </RoleProtectedRoute>
          } />
          <Route path="/data-room/:section" element={
            <RoleProtectedRoute requiredPath="/data-room">
              <DataRoom />
            </RoleProtectedRoute>
          } />
                          
                          {/* Authentication */}
                          <Route path="/auth" element={<Auth />} />
                          
                          {/* Protected Admin Routes */}
                          
                          <Route path="/admin/chefs-table" element={
                            <SecureRoute requiredRole="admin">
                              <ChefsTableAdmin />
                            </SecureRoute>
                          } />
                          
                          <Route path="/ab-test-admin" element={
                            <SecureRoute requiredRole="admin">
                              <ABTestAdmin />
                            </SecureRoute>
                          } />
                          
                          <Route path="/dashboard" element={
                            <SecureRoute requiredRole="admin">
                              <Dashboard />
                            </SecureRoute>
                          } />
                          
                          <Route path="/business-analytics" element={
                            <SecureRoute requiredRole="admin">
                              <BusinessAnalytics />
                            </SecureRoute>
                          } />
                          
                          <Route path="/marketing" element={
                            <SecureRoute requiredRole="admin">
                              <Marketing />
                            </SecureRoute>
                          } />
                          
                          <Route path="/games-admin" element={
                            <SecureRoute requiredRole="admin">
                              <GamesAdmin />
                            </SecureRoute>
                          } />
                          
                          <Route path="/recipe-management" element={
                            <SecureRoute requiredRole="admin">
                              <RecipeManagement />
                            </SecureRoute>
                          } />
                          
                          {/* Admin Dashboard Routes */}
                          <Route path="/admin" element={
                            <SecureRoute requiredRole="admin">
                              <EnhancedAdminDashboard />
                            </SecureRoute>
                          } />
                          
                          <Route path="/admin/users" element={
                            <SecureRoute requiredRole="admin">
                              <UserManagement />
                            </SecureRoute>
                          } />
                          
                          <Route path="/admin/promote" element={
                            <PromoteToAdmin />
                          } />
                          
                          <Route path="/admin/setup" element={
                            <SetupAdminAccount />
                          } />
                          
                          {/* 404 fallback */}
                          <Route path="*" element={<NotFound />} />
                              </Routes>
                            </ConversionTracker>
                          </main>
                        </div>
                      </UserFlows>
                    </LoadingStates>
                
                <ShoppingCart />
                
                {/* Admin-only components */}
                {userRole === 'admin' && (
                  <>
                    <CrossSystemNotifications />
                    <DataSynchronization />
                    <SimplePerformanceMonitor />
                    <PushNotifications />
                    <OfflineMode />
                    <SupportChat />
                    <SecurityLogger />
                  </>
                )}
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
