import React from 'react';

interface AdvancedSEOProps {
  title: string;
  description: string;
  keywords: string;
  canonical?: string;
  ogImage?: string;
  structuredData?: any;
}

export const AdvancedSEO: React.FC<AdvancedSEOProps> = ({
  title,
  description,
  keywords,
  canonical,
  ogImage,
  structuredData
}) => {
  return (
    <>
      {/* Basic Meta Tags */}
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={canonical} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="ODE Food Hall" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
      
      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://ejwjrsgkxxrwlyfohdat.supabase.co" />
    </>
  );
};

// Business structured data for ODE Food Hall
export const getBusinessStructuredData = () => ({
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "name": "ODE Food Hall",
  "description": "Premier culinary destination in Ubud, Bali offering authentic flavors from around the world",
  "url": "https://odefoodhall.com",
  "logo": "https://odefoodhall.com/logo.png",
  "image": "https://odefoodhall.com/hero-image.jpg",
  "telephone": "+62-361-123-4567",
  "email": "info@odefoodhall.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Jl. Monkey Forest Road",
    "addressLocality": "Ubud",
    "addressRegion": "Bali",
    "postalCode": "80571",
    "addressCountry": "ID"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "-8.5193",
    "longitude": "115.2633"
  },
  "openingHours": "Mo-Su 08:00-22:00",
  "priceRange": "$$",
  "servesCuisine": ["Indonesian", "Asian", "International"],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "127"
  }
});
