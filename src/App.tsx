// import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import TenantOpportunitiesPage from './pages/TenantOpportunitiesPage'
import InvestorOpportunitiesPage from './pages/InvestorOpportunitiesPage'
import DemoPage from './pages/DemoPage'
import TenantApplicationPage from './pages/TenantApplicationPage'
import ApplyForTenancyPage from './pages/ApplyForTenancyPage'
import InvestorContactPage from './pages/InvestorContactPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProtectedRoute from './components/auth/ProtectedRoute'
import DashboardPage from './pages/admin/DashboardPage'
import ApplicationsPage from './pages/admin/ApplicationsPage'
import UsersPage from './pages/admin/UsersPage'
import PropertiesPage from './pages/admin/PropertiesPage'
import FinancePage from './pages/admin/FinancePage'
import AnalyticsPage from './pages/admin/AnalyticsPage'
import DocumentsPage from './pages/admin/DocumentsPage'
import SettingsPage from './pages/admin/SettingsPage'
import DataRoomPage from './pages/DataRoomPage'
import GamificationPage from './pages/admin/GamificationPage'
import TenantApplicationsPage from './pages/admin/TenantApplicationsPage'
import LeaseManagementPage from './pages/admin/LeaseManagementPage'
import PropertyInventoryPage from './pages/admin/PropertyInventoryPage'
import AuditLogsPage from './pages/admin/AuditLogsPage'
import UserRolesPage from './pages/admin/UserRolesPage'
import TestApiPage from './pages/TestApiPage'
import TestGamificationPage from './pages/TestGamificationPage'
import TestAdminPage from './pages/TestAdminPage'
import InvestorDashboardPage from './pages/investors/InvestorDashboardPage'
import PortfolioPage from './pages/investors/PortfolioPage'
import MarketplacePage from './pages/investors/MarketplacePage'
import MarketAnalysisPage from './pages/investors/MarketAnalysisPage'
import KYCPage from './pages/investors/KYCPage'
import CommitmentsPage from './pages/investors/CommitmentsPage'
import DocumentSigningPage from './pages/investors/DocumentSigningPage'
import InvestorSettingsPage from './pages/investors/SettingsPage'
import TenantDashboardPage from './pages/tenants/TenantDashboardPage'
import PaymentsPage from './pages/tenants/PaymentsPage'
import MaintenancePage from './pages/tenants/MaintenancePage'
import ApplicationStatusPage from './pages/tenants/ApplicationStatusPage'
import LeaseDetailsPage from './pages/tenants/LeaseDetailsPage'
import BookingPage from './pages/tenants/BookingPage'
import { UserRole } from './types/auth'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="tenant-opportunities" element={<TenantOpportunitiesPage />} />
          <Route path="investor-opportunities" element={<InvestorOpportunitiesPage />} />
          <Route path="demo" element={<DemoPage />} />
          <Route path="tenant-application" element={<TenantApplicationPage />} />
          <Route path="apply" element={<ApplyForTenancyPage />} />
          <Route path="investor-contact" element={<InvestorContactPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          
          {/* Admin Routes */}
          <Route path="dashboard" element={
            <ProtectedRoute requiredRole={UserRole.Admin}>
              <DashboardPage />
            </ProtectedRoute>
          } />
          <Route path="admin/dashboard" element={
            <ProtectedRoute requiredRole={UserRole.Admin}>
              <DashboardPage />
            </ProtectedRoute>
          } />
          <Route path="admin/applications" element={
            <ProtectedRoute requiredRole={UserRole.Admin}>
              <ApplicationsPage />
            </ProtectedRoute>
          } />
          <Route path="admin/users" element={
            <ProtectedRoute requiredRole={UserRole.Admin}>
              <UsersPage />
            </ProtectedRoute>
          } />
          <Route path="admin/properties" element={
            <ProtectedRoute requiredRole={UserRole.Admin}>
              <PropertiesPage />
            </ProtectedRoute>
          } />
          <Route path="admin/finance" element={
            <ProtectedRoute requiredRole={UserRole.Admin}>
              <FinancePage />
            </ProtectedRoute>
          } />
          <Route path="admin/analytics" element={
            <ProtectedRoute requiredRole={UserRole.Admin}>
              <AnalyticsPage />
            </ProtectedRoute>
          } />
          <Route path="admin/documents" element={
            <ProtectedRoute requiredRole={UserRole.Admin}>
              <DocumentsPage />
            </ProtectedRoute>
          } />
          <Route path="admin/settings" element={
            <ProtectedRoute requiredRole={UserRole.Admin}>
              <SettingsPage />
            </ProtectedRoute>
          } />
          <Route path="admin/gamification" element={
            <ProtectedRoute requiredRole={UserRole.Admin}>
              <GamificationPage />
            </ProtectedRoute>
          } />
          <Route path="admin/tenant-applications" element={
            <ProtectedRoute requiredRole={UserRole.Admin}>
              <TenantApplicationsPage />
            </ProtectedRoute>
          } />
          <Route path="admin/lease-management" element={
            <ProtectedRoute requiredRole={UserRole.Admin}>
              <LeaseManagementPage />
            </ProtectedRoute>
          } />
          <Route path="admin/property-inventory" element={
            <ProtectedRoute requiredRole={UserRole.Admin}>
              <PropertyInventoryPage />
            </ProtectedRoute>
          } />
          <Route path="admin/audit-logs" element={
            <ProtectedRoute requiredRole={UserRole.Admin}>
              <AuditLogsPage />
            </ProtectedRoute>
          } />
          <Route path="admin/user-roles" element={
            <ProtectedRoute requiredRole={UserRole.Admin}>
              <UserRolesPage />
            </ProtectedRoute>
          } />
          
          {/* Protected Routes */}
          <Route path="dataroom" element={
            <ProtectedRoute>
              <DataRoomPage />
            </ProtectedRoute>
          } />
          
          {/* Test Routes */}
          <Route path="test-api" element={<TestApiPage />} />
          <Route path="test-gamification" element={<TestGamificationPage />} />
          <Route path="test-admin" element={<TestAdminPage />} />

          {/* Investor Protected Routes */}
          <Route path="investors/dashboard" element={
            <ProtectedRoute requiredRole={UserRole.Investor}>
              <InvestorDashboardPage />
            </ProtectedRoute>
          } />
          <Route path="investors/portfolio" element={
            <ProtectedRoute requiredRole={UserRole.Investor}>
              <PortfolioPage />
            </ProtectedRoute>
          } />
          <Route path="investors/marketplace" element={
            <ProtectedRoute requiredRole={UserRole.Investor}>
              <MarketplacePage />
            </ProtectedRoute>
          } />
          <Route path="investors/market-analysis" element={
            <ProtectedRoute requiredRole={UserRole.Investor}>
              <MarketAnalysisPage />
            </ProtectedRoute>
          } />
        <Route path="investors/kyc" element={
          <ProtectedRoute requiredRole={UserRole.Investor}>
            <KYCPage />
          </ProtectedRoute>
        } />
        <Route path="investors/commitments" element={
          <ProtectedRoute requiredRole={UserRole.Investor}>
            <CommitmentsPage />
          </ProtectedRoute>
        } />
        <Route path="investors/document-signing" element={
          <ProtectedRoute requiredRole={UserRole.Investor}>
            <DocumentSigningPage />
          </ProtectedRoute>
        } />
          <Route path="investors/settings" element={
            <ProtectedRoute requiredRole={UserRole.Investor}>
              <InvestorSettingsPage />
            </ProtectedRoute>
          } />

          {/* Tenant Protected Routes */}
          <Route path="tenants/dashboard" element={
            <ProtectedRoute requiredRole={UserRole.Tenant}>
              <TenantDashboardPage />
            </ProtectedRoute>
          } />
          <Route path="tenants/payments" element={
            <ProtectedRoute requiredRole={UserRole.Tenant}>
              <PaymentsPage />
            </ProtectedRoute>
          } />
        <Route path="tenants/maintenance" element={
          <ProtectedRoute requiredRole={UserRole.Tenant}>
            <MaintenancePage />
          </ProtectedRoute>
        } />
        <Route path="tenants/application-status" element={
          <ProtectedRoute requiredRole={UserRole.Tenant}>
            <ApplicationStatusPage />
          </ProtectedRoute>
        } />
        <Route path="tenants/lease-details" element={
          <ProtectedRoute requiredRole={UserRole.Tenant}>
            <LeaseDetailsPage />
          </ProtectedRoute>
        } />
        <Route path="tenants/booking" element={
          <ProtectedRoute requiredRole={UserRole.Tenant}>
            <BookingPage />
          </ProtectedRoute>
        } />
        </Route>
      </Routes>
    </Router>
  )
}

export default App