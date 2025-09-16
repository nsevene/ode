import { JsonLd } from './JsonLd';

interface LocalBusinessSchemaProps {
  reviews?: Array<{
    author: string;
    rating: number;
    text: string;
    date?: string;
  }>;
  averageRating?: number;
  reviewCount?: number;
}

export const LocalBusinessSchema = ({ 
  reviews = [], 
  averageRating = 4.8, 
  reviewCount = 127 
}: LocalBusinessSchemaProps) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Restaurant", 
    "name": "ODE Food Hall",
    "alternateName": "ODE Ubud",
    "description": "ODE Food Hall in Ubud - a unique gastronomic complex of 1,800 m² with 8 culinary sectors, Chef's Table, Wine Staircase and interactive experiences. Opening December 1, 2025.",
    "url": "https://ode-food-hall.lovable.app",
    "identifier": {
      "@type": "PropertyValue",
      "name": "Business ID",
      "value": "ODE-FOOD-HALL-UBUD"
    },
    
    "image": [
      "https://ode-food-hall.lovable.app/src/assets/hero-food-hall.jpg",
      "https://ode-food-hall.lovable.app/src/assets/food-hall-interior.jpg",
      "https://ode-food-hall.lovable.app/src/assets/chefs-table.jpg"
    ],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Jl. Monkey Forest Rd",
      "addressLocality": "Ubud",
      "addressRegion": "Bali",
      "postalCode": "80571",
      "addressCountry": "ID"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -8.5069,
      "longitude": 115.2625
    },
    "telephone": "+62-819-43286395",
    "email": "selena@odefoodhall.com",
    "priceRange": "$$-$$$",
    "currenciesAccepted": "USD, IDR",
    "paymentAccepted": "Cash, Credit Card, Mobile Payment",
    "servesCuisine": [
      "International",
      "Asian Fusion", 
      "Italian",
      "Mediterranean",
      "Thai",
      "Vietnamese",
      "Balinese",
      "Nordic",
      "Middle Eastern",
      "American BBQ"
    ],
    "hasMenu": "https://ode-food-hall.lovable.app/menu",
    "acceptsReservations": true,
    "openingHours": [
      "Mo-Su 11:00-23:00"
    ],
    "specialOpeningHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
        ],
        "opens": "19:00",
        "closes": "22:00",
        "validFrom": "2024-01-01",
        "validThrough": "2024-12-31"
      }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": averageRating.toString(),
      "reviewCount": reviewCount.toString(),
      "bestRating": "5",
      "worstRating": "1"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "ODE Food Hall Experiences",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Chef's Table Experience",
            "description": "Exclusive 5-course tasting dinner for 30 guests"
          },
          "price": "55.00",
          "priceCurrency": "USD"
        },
        {
          "@type": "Offer", 
          "itemOffered": {
            "@type": "Service",
            "name": "Taste Compass Adventure",
            "description": "Interactive culinary journey through 6 world sectors"
          },
          "price": "Variable",
          "priceCurrency": "USD"
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service", 
            "name": "Wine Staircase Tasting",
            "description": "Terroir wine tasting on spiral staircase"
          },
          "price": "Cost + Corkage",
          "priceCurrency": "USD"
        }
      ]
    },
    "potentialAction": [
      {
        "@type": "ReserveAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://ode-food-hall.lovable.app/chefs-table",
          "actionPlatform": [
            "http://schema.org/DesktopWebPlatform",
            "http://schema.org/MobileWebPlatform"
          ]
        },
        "result": {
          "@type": "Reservation",
          "name": "Reservation at ODE Food Hall"
        }
      }
    ],
    "sameAs": [
      "https://www.instagram.com/ode_food_hall",
      "https://www.facebook.com/ode.food.hall",
      "https://www.tripadvisor.com/ode-food-hall"
    ]
  };

  return <JsonLd data={schema} />;
};