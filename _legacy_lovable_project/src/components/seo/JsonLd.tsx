import { Helmet } from 'react-helmet-async';

interface JsonLdProps {
  data: Record<string, any>;
}

export const JsonLd = ({ data }: JsonLdProps) => {
  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(data)}</script>
    </Helmet>
  );
};

// Готовые схемы для разных типов контента
export const RestaurantSchema = (props: {
  name: string;
  description: string;
  address: string;
  phone: string;
  priceRange: string;
  rating?: number;
  reviewCount?: number;
}) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: props.name,
    description: props.description,
    address: {
      '@type': 'PostalAddress',
      streetAddress: props.address,
      addressLocality: 'Ubud',
      addressRegion: 'Bali',
      addressCountry: 'ID',
    },
    telephone: props.phone,
    priceRange: props.priceRange,
    servesCuisine: ['International', 'Asian', 'Mediterranean'],
    acceptsReservations: true,
    ...(props.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: props.rating.toString(),
        reviewCount: props.reviewCount?.toString() || '1',
      },
    }),
  };

  return <JsonLd data={schema} />;
};

export const EventSchema = (props: {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  price?: number;
  url?: string;
}) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: props.name,
    description: props.description,
    startDate: props.startDate,
    endDate: props.endDate,
    location: {
      '@type': 'Place',
      name: props.location,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Ubud',
        addressRegion: 'Bali',
        addressCountry: 'ID',
      },
    },
    ...(props.price && {
      offers: {
        '@type': 'Offer',
        price: props.price,
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
      },
    }),
    ...(props.url && { url: props.url }),
  };

  return <JsonLd data={schema} />;
};

export const BreadcrumbSchema = (
  items: Array<{ name: string; url: string }>
) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return <JsonLd data={schema} />;
};
