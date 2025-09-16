import React from 'react';
import { SEOHead } from './SEOHead';

interface PageSEOProps {
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
}

export const PageSEO: React.FC<PageSEOProps> = (props) => {
  return <SEOHead {...props} />;
};

// Predefined SEO configurations for different page types
export const HomePageSEO: React.FC = () => (
  <PageSEO
    title="ODE Food Hall — Gastro Village Ubud | Opening December 2025"
    description="ODE Food Hall Ubud - innovative gastro village with 12 food corners, Wine Staircase tastings, Chef's Table experiences & Taste Compass quests. Grand opening December 1, 2025."
    keywords="ODE Food Hall Ubud, gastro village Bali, Wine Staircase Ubud, Chef's Table experiences, Taste Compass quests, commercial kitchen rental Ubud, food entrepreneur Bali, restaurant space rental, culinary business Ubud, halal dining Bali, family restaurants Ubud"
    type="website"
    structuredData={{
      "@context": "https://schema.org",
      "@type": "Restaurant",
      "name": "ODE Food Hall",
      "description": "Innovative gastro village with 12 food corners, Wine Staircase tastings, Chef's Table experiences & commercial kitchen rental for restaurants",
      "url": "https://odefoodhall.com",
      "logo": "https://odefoodhall.com/lovable-uploads/3f00f862-daaa-4d2d-b462-b7347e9e5cdb.png",
      "image": "https://odefoodhall.com/lovable-uploads/3f00f862-daaa-4d2d-b462-b7347e9e5cdb.png",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Ubud",
        "addressRegion": "Bali",
        "addressCountry": "Indonesia"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "-8.5069",
        "longitude": "115.2625"
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        "opens": "10:00",
        "closes": "23:00"
      },
      "priceRange": "$$",
      "servesCuisine": ["International", "Asian", "Indonesian", "Balinese"],
      "acceptsReservations": "True",
      "hasMenu": "https://odefoodhall.com/#menu",
      "telephone": "+62-XXX-XXXX-XXXX",
      "email": "info@odefoodhall.com",
      "sameAs": [
        "https://instagram.com/odefoodhall",
        "https://facebook.com/odefoodhall"
      ]
    }}
  />
);

export const MenuPageSEO: React.FC = () => (
  <PageSEO
    title="Menu — ODE Food Hall Ubud | 12 Food Corners & Wine Staircase"
    description="Explore our diverse menu featuring 12 food corners, Wine Staircase tastings, and Chef's Table experiences at ODE Food Hall Ubud."
    keywords="ODE Food Hall menu, Ubud restaurant menu, food corners Bali, Wine Staircase Ubud, Chef's Table menu, international cuisine Bali, Asian fusion Ubud"
    type="website"
  />
);

export const BookingPageSEO: React.FC = () => (
  <PageSEO
    title="Book Your Experience — ODE Food Hall Ubud"
    description="Book your table at ODE Food Hall Ubud. Experience our Wine Staircase, Chef's Table, and Taste Compass quests. Opening December 2025."
    keywords="book ODE Food Hall, Ubud restaurant booking, Wine Staircase booking, Chef's Table reservation, Taste Compass booking, ODE Food Hall reservation"
    type="website"
  />
);

export const TenantsPageSEO: React.FC = () => (
  <PageSEO
    title="Tenant Portal — ODE Food Hall Ubud | Commercial Kitchen Rental"
    description="Join ODE Food Hall as a tenant. Commercial kitchen rental, prime location, marketing support. Apply now for your food business in Ubud, Bali."
    keywords="ODE Food Hall tenant, commercial kitchen rental Ubud, restaurant space rental Bali, food business Ubud, kitchen rental Bali, food entrepreneur Ubud"
    type="website"
  />
);

export const InvestorsPageSEO: React.FC = () => (
  <PageSEO
    title="Investor Portal — ODE Food Hall Ubud | Investment Opportunity"
    description="Invest in ODE Food Hall Ubud. Innovative gastro village with 12 food corners, Wine Staircase, and Chef's Table experiences. View our investment deck."
    keywords="ODE Food Hall investment, Ubud restaurant investment, gastro village investment, food hall investment Bali, restaurant investment opportunity"
    type="website"
  />
);
