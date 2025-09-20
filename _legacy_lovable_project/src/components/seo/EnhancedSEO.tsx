import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
}

interface EnhancedSEOProps {
  data: SEOData;
  structuredData?: any;
  canonical?: string;
  noindex?: boolean;
  nofollow?: boolean;
}

export const EnhancedSEO: React.FC<EnhancedSEOProps> = ({
  data,
  structuredData,
  canonical,
  noindex = false,
  nofollow = false,
}) => {
  const location = useLocation();
  const currentUrl =
    canonical || `${window.location.origin}${location.pathname}`;
  const fullImageUrl = data.image?.startsWith('http')
    ? data.image
    : `${window.location.origin}${data.image}`;

  const defaultStructuredData = {
    '@context': 'https://schema.org',
    '@type': data.type === 'article' ? 'Article' : 'WebSite',
    name: data.title,
    description: data.description,
    url: currentUrl,
    image: fullImageUrl,
    author: data.author
      ? {
          '@type': 'Person',
          name: data.author,
        }
      : undefined,
    datePublished: data.publishedTime,
    dateModified: data.modifiedTime,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': currentUrl,
    },
  };

  const mergedStructuredData = structuredData
    ? { ...defaultStructuredData, ...structuredData }
    : defaultStructuredData;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{data.title}</title>
      <meta name="description" content={data.description} />
      <meta name="keywords" content={data.keywords.join(', ')} />
      <meta name="author" content={data.author || 'ODE Food Hall'} />

      {/* Canonical URL */}
      <link rel="canonical" href={currentUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={data.title} />
      <meta property="og:description" content={data.description} />
      <meta property="og:type" content={data.type || 'website'} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:site_name" content="ODE Food Hall" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={data.title} />
      <meta name="twitter:description" content={data.description} />
      <meta name="twitter:image" content={fullImageUrl} />

      {/* Article specific */}
      {data.type === 'article' && (
        <>
          <meta property="article:author" content={data.author} />
          <meta
            property="article:published_time"
            content={data.publishedTime}
          />
          <meta property="article:modified_time" content={data.modifiedTime} />
          <meta property="article:section" content={data.section} />
          {data.tags?.map((tag) => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Robots */}
      <meta
        name="robots"
        content={`${noindex ? 'noindex' : 'index'}, ${nofollow ? 'nofollow' : 'follow'}`}
      />

      {/* Additional SEO */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#8B1538" />
      <meta name="msapplication-TileColor" content="#8B1538" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(mergedStructuredData)}
      </script>

      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link rel="preconnect" href="https://cdn.jsdelivr.net" />

      {/* DNS Prefetch */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//cdn.jsdelivr.net" />
    </Helmet>
  );
};

// SEO data for different pages
export const seoData = {
  home: {
    title:
      'ODE Food Hall - Gastro Village Ubud | Authentic Culinary Experience',
    description:
      'Experience authentic Balinese cuisine at ODE Food Hall in Ubud. 8 taste sectors, local ingredients, and immersive culinary journey. Opening December 2025.',
    keywords: [
      'ODE Food Hall',
      'Ubud restaurant',
      'Balinese cuisine',
      'food hall',
      'gastro village',
      'authentic food',
      'local ingredients',
      'culinary experience',
      'Bali food',
      'taste compass',
    ],
    image: '/assets/hero-food-hall.jpg',
    type: 'website' as const,
  },

  tenants: {
    title:
      'Tenants Portal - Join ODE Food Hall | Culinary Business Opportunities',
    description:
      "Join ODE Food Hall as a tenant. Explore kitchen spaces, rates, and business opportunities in Ubud's premier food hall. Apply now.",
    keywords: [
      'tenant application',
      'kitchen rental',
      'food business',
      'Ubud restaurant',
      'culinary business',
      'food hall tenant',
      'kitchen space',
      'restaurant opportunity',
    ],
    image: '/assets/tenants-portal.jpg',
    type: 'website' as const,
  },

  investors: {
    title: 'Investors Portal - ODE Food Hall Investment Opportunities',
    description:
      "Invest in ODE Food Hall, Ubud's premier gastro village. Access financial models, business plans, and investment opportunities.",
    keywords: [
      'investment opportunity',
      'food hall investment',
      'Ubud business',
      'restaurant investment',
      'gastro village',
      'culinary business',
      'Bali investment',
      'food industry',
    ],
    image: '/assets/investors-portal.jpg',
    type: 'website' as const,
  },

  philosophy: {
    title: 'Philosophy - Tri Hita Karana | ODE Food Hall Ubud',
    description:
      'Discover our philosophy of Tri Hita Karana - harmony with nature, spiritual world, and community at ODE Food Hall.',
    keywords: [
      'Tri Hita Karana',
      'Balinese philosophy',
      'harmony with nature',
      'spiritual connection',
      'community values',
      'sustainable food',
      'authentic experience',
      'cultural heritage',
    ],
    image: '/assets/philosophy.jpg',
    type: 'article' as const,
    author: 'ODE Food Hall Team',
  },
};

// Hook for dynamic SEO
export const useSEO = (
  page: keyof typeof seoData,
  customData?: Partial<SEOData>
) => {
  const baseData = seoData[page];
  const mergedData = { ...baseData, ...customData };

  return {
    data: mergedData,
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'ODE Food Hall',
      url: 'https://odefoodhall.com',
      logo: 'https://odefoodhall.com/assets/ode-logo.png',
      description:
        'Premier food hall in Ubud, Bali offering authentic culinary experiences',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Ubud, Bali',
        addressCountry: 'ID',
      },
      sameAs: [
        'https://instagram.com/odefoodhall',
        'https://facebook.com/odefoodhall',
      ],
    },
  };
};
