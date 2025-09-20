import { JsonLd } from './JsonLd';

interface EventItem {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  location?: string;
  price?: number;
  maxAttendees?: number;
  image?: string;
  instructor?: string;
  category?: string;
}

interface EventSchemaProps {
  events: EventItem[];
}

export const EventSchema = ({ events = [] }: EventSchemaProps) => {
  if (events.length === 0) return null;

  const eventsSchema = events.map((event) => ({
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.name,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate || event.startDate,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: event.location || 'ODE Food Hall',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Jl. Monkey Forest Rd',
        addressLocality: 'Ubud',
        addressRegion: 'Bali',
        postalCode: '80571',
        addressCountry: 'ID',
      },
    },
    image: event.image || '/assets/food-hall-interior.jpg',
    organizer: {
      '@type': 'Organization',
      name: 'ODE Food Hall',
      url: 'https://ode-food-hall.lovable.app',
    },
    performer: event.instructor
      ? {
          '@type': 'Person',
          name: event.instructor,
        }
      : undefined,
    offers: event.price
      ? {
          '@type': 'Offer',
          price: event.price,
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          url: `https://ode-food-hall.lovable.app/events/${event.id}`,
          validFrom: new Date().toISOString(),
        }
      : {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
        },
    maximumAttendeeCapacity: event.maxAttendees || 50,
    audience: {
      '@type': 'Audience',
      audienceType: 'Food enthusiasts',
    },
  }));

  return (
    <>
      {eventsSchema.map((schema, index) => (
        <JsonLd key={index} data={schema} />
      ))}
    </>
  );
};
