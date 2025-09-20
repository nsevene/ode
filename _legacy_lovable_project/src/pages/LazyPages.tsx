import { lazy } from 'react';

// Lazy load all pages for better performance
export const LazyPages = {
  // B2B Pages that remain
  MyBookings: lazy(() => import('./MyBookings')),
  DataRoom: lazy(() => import('./DataRoom')),
  TodoPage: lazy(() => import('./TodoPage')),
  Auth: lazy(() => import('./Auth')),

  // Admin pages
  Admin: lazy(() => import('./Admin')),
  Dashboard: lazy(() => import('./Dashboard')),
  BusinessAnalytics: lazy(() => import('./BusinessAnalytics')),
  Marketing: lazy(() => import('./Marketing')),
  ABTesting: lazy(() => import('./ABTesting')),
  GamesAdmin: lazy(() => import('./GamesAdmin')),
  RecipeManagement: lazy(() => import('./RecipeManagement')),
  ChefsTableAdmin: lazy(() => import('./admin/ChefsTableAdmin')),
  ABTestAdmin: lazy(() => import('./ABTestAdmin')),
  CMSDashboard: lazy(() => import('../components/admin/CMSDashboard')),

  // Portal pages
  TenantsPortal: lazy(() => import('./tenants/TenantsPortal')),
  TenantsOverview: lazy(() => import('./tenants/TenantsOverview')),
  TenantsLongTerm: lazy(() => import('./tenants/TenantsLongTerm')),
  TenantsOpenKitchen: lazy(() => import('./tenants/TenantsOpenKitchen')),
  TenantsRates: lazy(() => import('./tenants/TenantsRates')),
  TenantsServices: lazy(() => import('./tenants/TenantsServices')),
  TenantsFloorPlan: lazy(() => import('./tenants/TenantsFloorPlan')),
  TenantsFAQ: lazy(() => import('./tenants/TenantsFAQ')),
  TenantsTeam: lazy(() => import('./tenants/TenantsTeam')),
  TenantsApply: lazy(() => import('./tenants/TenantsApply')),
  TenantsMarketingBudget: lazy(
    () => import('./tenants/TenantsMarketingBudget')
  ),

  // Investor pages
  InvestorsPortal: lazy(() => import('./investors/InvestorsPortal')),
  InvestorsIntroCall: lazy(() => import('./investors/InvestorsIntroCall')),

  // Marketing pages
  MarketingPortal: lazy(() => import('./marketing/MarketingPortal')),

  // Digital ecosystem pages
  DigitalEcosystemPortal: lazy(
    () => import('./digital-ecosystem/DigitalEcosystemPortal')
  ),

  // Storytelling pages
  StorytellingHub: lazy(() => import('./storytelling/StorytellingHub')),
};
