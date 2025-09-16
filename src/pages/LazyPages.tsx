import { lazy } from 'react';

// Lazy load all pages for better performance
export const LazyPages = {
  // Main pages
  Home: lazy(() => import('./Home')),
  Index: lazy(() => import('./Index')),
  About: lazy(() => import('./About')),
  Contact: lazy(() => import('./Contact')),
  
  // Authentication
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
  TenantsMarketingBudget: lazy(() => import('./tenants/TenantsMarketingBudget')),
  
  // Investor pages
  InvestorsPortal: lazy(() => import('./investors/InvestorsPortal')),
  InvestorsIntroCall: lazy(() => import('./investors/InvestorsIntroCall')),
  DataRoom: lazy(() => import('./DataRoom')),
  
  // Marketing pages
  MarketingPortal: lazy(() => import('./marketing/MarketingPortal')),
  
  // Digital ecosystem pages
  DigitalEcosystemPortal: lazy(() => import('./digital-ecosystem/DigitalEcosystemPortal')),
  
  // Storytelling pages
  StorytellingHub: lazy(() => import('./storytelling/StorytellingHub')),
  
  // Zone pages
  ZonePage: lazy(() => import('./zones/ZonePage')),
  
  // Demo pages
  Demo: lazy(() => import('./Demo')),
  DemoGuest: lazy(() => import('./demo/DemoGuest')),
  DemoPartners: lazy(() => import('./demo/DemoPartners')),
  
  // Feature pages
  Events: lazy(() => import('./Events')),
  Menu: lazy(() => import('./Menu')),
  TasteCompass: lazy(() => import('./TasteCompass')),
  TasteQuest: lazy(() => import('./TasteQuest')),
  Experiences: lazy(() => import('./Experiences')),
  DeliveryMenu: lazy(() => import('./DeliveryMenu')),
  BecomeVendor: lazy(() => import('./BecomeVendor')),
  EventsPopUp: lazy(() => import('./EventsPopUp')),
  AboutODE: lazy(() => import('./AboutODE')),
  Community: lazy(() => import('./Community')),
  Lounge: lazy(() => import('./Lounge')),
  SecondFloor: lazy(() => import('./SecondFloor')),
  VirtualTour: lazy(() => import('./VirtualTour')),
  WineStaircase: lazy(() => import('./WineStaircase')),
  VendorsHello: lazy(() => import('./VendorsHello')),
  ChefsTable: lazy(() => import('./ChefsTable')),
  MyBookings: lazy(() => import('./MyBookings')),
  BookingDetail: lazy(() => import('./BookingDetail')),
  PaymentSuccess: lazy(() => import('./PaymentSuccess')),
  PaymentCancelled: lazy(() => import('./PaymentCancelled')),
  PhotosPage: lazy(() => import('./PhotosPage')),
  BreakfastForVillas: lazy(() => import('./BreakfastForVillas')),
  BreakfastPage: lazy(() => import('./BreakfastPage')),
  PerformancePage: lazy(() => import('./Performance')),
  QuickBookingPage: lazy(() => import('./QuickBooking')),
  Kitchens: lazy(() => import('./Kitchens')),
  KitchenDetail: lazy(() => import('./KitchenDetail')),
  Spaces: lazy(() => import('./Spaces')),
  Sustainability: lazy(() => import('./Sustainability')),
  MobileFeatures: lazy(() => import('./MobileFeatures')),
  ODEOverview: lazy(() => import('./ODEOverview')),
  NewPhilosophy: lazy(() => import('./NewPhilosophy')),
  PrivacyPolicy: lazy(() => import('./PrivacyPolicy')),
  FoodOrdering: lazy(() => import('./FoodOrdering')),
  
  // Vendor pages
  DolceItalia: lazy(() => import('./vendors/DolceItalia')),
  SpicyAsia: lazy(() => import('./vendors/SpicyAsia')),
  WildBali: lazy(() => import('./vendors/WildBali')),
  FermentSector: lazy(() => import('./vendors/FermentSector')),
  SmokeSector: lazy(() => import('./vendors/SmokeSector')),
  SpiceSector: lazy(() => import('./vendors/SpiceSector')),
  
  // Error pages
  NotFound: lazy(() => import('./NotFound')),
};
