
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Suspense } from "react-router-dom";
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
import { SEOHead } from "@/components/SEO/SEOHead";



import { ConversionTracker } from "@/components/analytics/ConversionTracker";

import { ABTestProvider } from "@/components/ABTestProvider";
import { AuthProvider } from "@/hooks/useAuth";

import { CrossSystemNotifications } from "@/components/integration/CrossSystemNotifications";
import { DataSynchronization } from "@/components/integration/DataSynchronization";
import Index from "./pages/Index";
import Events from "./pages/Events";
import Menu from "./pages/Menu";
import TasteCompass from "./pages/TasteCompass";
import TasteQuest from "./pages/TasteQuest";
import Demo from "./pages/Demo";
import DemoGuest from "./pages/demo/DemoGuest";
import DemoPartners from "./pages/demo/DemoPartners";
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
import ChefsTable from "./pages/ChefsTable";
import MyBookings from "./pages/MyBookings";
import BookingDetail from "./pages/BookingDetail";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancelled from "./pages/PaymentCancelled";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import PromoteToAdmin from "./pages/admin/PromoteToAdmin";
import ForceUpdateRole from "./pages/admin/ForceUpdateRole";
import CreateTestAdmin from "./pages/admin/CreateTestAdmin";
import DebugAdmin from "./pages/admin/DebugAdmin";
import AdminCredentials from "./pages/admin/AdminCredentials";
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
import "./lib/i18n";

const queryClient = new QueryClient();

function App() {
  const { showDemoNotification, closeDemoNotification } = useDemoMode();

  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <BrowserRouter>
          <TooltipProvider>
            <ErrorBoundary>
              <ChunkRecovery />
              <AuthProvider>
                <ABTestProvider>
                  <Toaster />
                  <Sonner />
                  
                  {/* Demo Mode Notification */}
                  <DemoModeNotification 
                    show={showDemoNotification} 
                    onClose={closeDemoNotification} 
                  />
                  
                  <AdminCheck>
                    <div className="flex min-h-screen bg-background">
                      <PortalNavigation />
                      
                      <main className="flex-1 overflow-auto">
                      <ConversionTracker>
                        <Routes>
                          {/* Home - accessible to all */}
                          <Route path="/" element={<Index />} />
                          
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
                          <Route path="/taste-compass" element={<Navigate to="/guest-demo" replace />} />
                          <Route path="/ode-by-night" element={<Navigate to="/guest-demo" replace />} />
                          <Route path="/events" element={<Navigate to="/guest-demo" replace />} />
                          
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
                          
          <Route path="/demo" element={<Demo />} />
          <Route path="/demo/guest" element={<DemoGuest />} />
          <Route path="/demo/partners" element={<DemoPartners />} />
                          <Route path="/guest-demo/*" element={
                            <RoleProtectedRoute requiredPath="/guest-demo">
                              <div className="p-8">
                                <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 mb-6">
                                  <div className="flex items-center gap-2 text-warning mb-2">
                                    <span className="font-semibold">🚀 DEMO MODE</span>
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    This is a preview of the guest experience. All actions are simulated.
                                  </p>
                                </div>
                                <h1 className="text-3xl font-bold mb-4">Guest Demo Portal</h1>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                  <div className="p-6 border rounded-lg">
                                    <h3 className="font-semibold mb-2">Unified Menu</h3>
                                    <p className="text-sm text-muted-foreground">Browse all vendor menus in one place</p>
                                  </div>
                                  <div className="p-6 border rounded-lg">
                                    <h3 className="font-semibold mb-2">Order Flow</h3>
                                    <p className="text-sm text-muted-foreground">Complete ordering experience</p>
                                  </div>
                                  <div className="p-6 border rounded-lg">
                                    <h3 className="font-semibold mb-2">Payments</h3>
                                    <p className="text-sm text-muted-foreground">Secure payment processing</p>
                                  </div>
                                  <div className="p-6 border rounded-lg">
                                    <h3 className="font-semibold mb-2">Taste Passport</h3>
                                    <p className="text-sm text-muted-foreground">Gamified dining experience</p>
                                  </div>
                                  <div className="p-6 border rounded-lg">
                                    <h3 className="font-semibold mb-2">Taste Compass</h3>
                                    <p className="text-sm text-muted-foreground">Flavor discovery journey</p>
                                  </div>
                                  <div className="p-6 border rounded-lg">
                                    <h3 className="font-semibold mb-2">Mobile App</h3>
                                    <p className="text-sm text-muted-foreground">PWA and native features</p>
                                  </div>
                                </div>
                              </div>
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
                          <Route path="/admin/*" element={
                            <SecureRoute requiredRole="admin">
                              <Admin />
                            </SecureRoute>
                          } />
                          
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
                              <AdminDashboard />
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
                          
                          <Route path="/admin/force-update" element={
                            <ForceUpdateRole />
                          } />
                          
                          <Route path="/admin/create-test" element={
                            <CreateTestAdmin />
                          } />
                          
                          <Route path="/admin/debug" element={
                            <DebugAdmin />
                          } />
                          
                          <Route path="/admin/credentials" element={
                            <AdminCredentials />
                          } />
                          
                          {/* 404 fallback */}
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </ConversionTracker>
                    </main>
                  </div>
                  </AdminCheck>
                  
                  <CrossSystemNotifications />
                  <DataSynchronization />
                  <PerformanceMonitor />
                  <PushNotifications />
                  <OfflineMode />
                  <SupportChat />
                  <SecurityLogger />
                </ABTestProvider>
              </AuthProvider>
            </ErrorBoundary>
          </TooltipProvider>
        </BrowserRouter>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;
