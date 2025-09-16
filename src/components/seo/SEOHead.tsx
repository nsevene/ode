import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { SocialMediaMeta } from './SocialMediaMeta';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile' | 'experience';
  experienceType?: string;
  price?: string;
  availability?: string;
}

export const SEOHead = ({ 
  title, 
  description, 
  keywords,
  image = '/lovable-uploads/f87f7680-1120-438b-9064-7951f566be15.png',
  url,
  type = 'website',
  experienceType,
  price,
  availability
}: SEOHeadProps) => {
  const location = useLocation();
  const currentUrl = url || `https://ode-food-hall.lovable.app${location.pathname}`;
  
  const defaultTitle = 'ODE Food Hall - Gastro Village Ubud | Уникальные гастрономические впечатления';
  const defaultDescription = 'Welcome to ODE Food Hall - an innovative gastronomic complex in Ubud. 8 unique kitchens, Taste Compass, Wine Staircase, Chef\'s Table and much more. Book an unforgettable culinary experience!';
  const defaultKeywords = 'ODE Food Hall, Ubud, gastronomy, restaurant, Taste Compass, Wine Staircase, Chef\'s Table, culinary experience, booking, Bali, food';

  const finalTitle = title ? `${title} | ODE Food Hall` : defaultTitle;
  const finalDescription = description || defaultDescription;
  const finalKeywords = keywords ? `${keywords}, ${defaultKeywords}` : defaultKeywords;

  // Структурированные данные для Google
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": "ODE Food Hall",
    "description": finalDescription,
    "url": currentUrl,
    "image": image,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Ubud, Bali",
      "addressLocality": "Ubud",
      "addressRegion": "Bali",
      "addressCountry": "ID"
    },
    "telephone": "+62-XXX-XXX-XXXX",
    "openingHours": [
      "Mo-Su 11:00-23:00"
    ],
    "priceRange": "$$",
    "servesCuisine": [
      "International",
      "Asian",
      "Mediterranean",
      "Italian",
      "Balinese"
    ],
    "hasMenu": currentUrl + "/menu",
    "acceptsReservations": true,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "127"
    }
  };

  // Дополнительные структурированные данные для опытов
  const experienceData = experienceType ? {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    "name": `${experienceType} Experience at ODE Food Hall`,
    "description": `Unique ${experienceType} culinary experience in Ubud`,
    "url": currentUrl,
    "image": image,
    "location": {
      "@type": "Place",
      "name": "ODE Food Hall",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Ubud",
        "addressRegion": "Bali",
        "addressCountry": "ID"
      }
    },
    ...(price && {
      "offers": {
        "@type": "Offer",
        "price": price,
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock",
        "description": availability || "Доступно для бронирования"
      }
    })
  } : null;

  return (
    <Helmet>
      {/* Основные мета-теги */}
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />
      <meta name="robots" content="index, follow" />
      <meta name="author" content="ODE Food Hall" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={currentUrl} />
      
      {/* Open Graph (Facebook) */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:site_name" content="ODE Food Hall" />
      <meta property="og:locale" content="ru_RU" />
      <meta property="og:locale:alternate" content="en_US" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@ODE_FoodHall" />
      
      {/* Дополнительные мета-теги для мобильных */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#8B5CF6" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="ODE Food Hall" />
      
      {/* Favicons */}
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      
      {/* Структурированные данные JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
      
      {experienceData && (
        <script type="application/ld+json">
          {JSON.stringify(experienceData)}
        </script>
      )}
      
      {/* Дополнительные мета-теги для поиска */}
      <meta name="geo.region" content="ID-BA" />
      <meta name="geo.placename" content="Ubud" />
      <meta name="geo.position" content="-8.5069;115.2625" />
      <meta name="ICBM" content="-8.5069, 115.2625" />
      
      {/* Language tags */}
      <meta httpEquiv="content-language" content="ru" />
      <link rel="alternate" hrefLang="en" href={currentUrl.replace('ru', 'en')} />
      <link rel="alternate" hrefLang="ru" href={currentUrl} />
      <link rel="alternate" hrefLang="x-default" href={currentUrl} />
    </Helmet>
  );
};