import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Clock, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Price from '@/components/Price';

const ExperiencesSection = () => {
  const experiences = [
    {
      name: 'Wine Staircase',
      duration: '90 minutes',
      capacity: 'Up to 20 guests',
      price: 450000,
      description:
        'Intimate wine journey through our cellar with expert sommelier guidance',
      features: ['5-course wine tasting', 'Cheese pairings', 'Private setting'],
      image: 'photo-1510812431401-41d2bd2722f3',
      badge: 'Premium',
      rating: 4.9,
      link: '/wine-staircase',
    },
    {
      name: 'VIP Lounge',
      duration: '3 hours',
      capacity: 'Up to 50 guests',
      price: 300000,
      description:
        'Exclusive second-floor experience with live entertainment and premium service',
      features: ['Live music', 'Private bar', 'Panoramic views'],
      image: 'photo-1578662996442-48f60103fc96',
      badge: 'Popular',
      rating: 4.8,
      link: '/lounge',
    },
    {
      name: "Chef's Table",
      duration: '2.5 hours',
      capacity: '12 guests max',
      price: 650000,
      description:
        'Exclusive multi-course dining experience with chef interaction',
      features: ['7-course tasting', 'Wine pairing', 'Chef interaction'],
      image: 'photo-1414235077428-338989a2e8c0',
      badge: 'Exclusive',
      rating: 5.0,
      link: '/chefs-table',
    },
    {
      name: 'Live DJ Sessions',
      duration: '4 hours',
      capacity: '100+ guests',
      price: 'Entry included',
      description: 'Weekend entertainment with local and international DJs',
      features: ['Weekend events', 'Dance floor', 'Special cocktails'],
      image: 'photo-1493225457124-a3eb161ffa5f',
      badge: 'Weekend',
      rating: 4.7,
      link: '/events',
    },
  ];

  return (
    <section className="py-16 bg-pure-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-charcoal mb-4">
            Signature Experiences
          </h2>
          <p className="text-xl text-charcoal/70 max-w-3xl mx-auto">
            Curated moments that go beyond dining
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {experiences.map((experience, index) => (
            <Card
              key={index}
              className="group hover:shadow-soft transition-all duration-300 overflow-hidden h-full flex flex-col"
            >
              <div className="aspect-[4/3] relative overflow-hidden">
                <img
                  src={`https://images.unsplash.com/${experience.image}?w=400&h=300&fit=crop`}
                  alt={experience.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-sage text-pure-white">
                    {experience.badge}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <div className="flex items-center gap-1 bg-pure-white/90 rounded-full px-2 py-1">
                    <Star className="w-3 h-3 fill-golden text-golden" />
                    <span className="text-xs font-medium text-charcoal">
                      {experience.rating}
                    </span>
                  </div>
                </div>
              </div>

              <CardContent className="p-6 flex-1 flex flex-col">
                <div className="mb-4">
                  <h3 className="font-bold text-charcoal mb-2 text-lg">
                    {experience.name}
                  </h3>
                  <p className="text-sm text-charcoal/70 leading-relaxed">
                    {experience.description}
                  </p>
                </div>

                <div className="space-y-3 mb-4 text-sm text-charcoal/70">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{experience.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{experience.capacity}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="space-y-1">
                    {experience.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-sage rounded-full"></div>
                        <span className="text-xs text-charcoal/70">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-auto">
                  <div className="flex justify-between items-center mb-4">
                    {typeof experience.price === 'number' ? (
                      <>
                        <span className="text-xs text-charcoal/70">От</span>
                        <Price
                          value={experience.price}
                          showWords
                          className="font-semibold text-charcoal"
                        />
                      </>
                    ) : (
                      <span className="font-semibold text-charcoal">
                        {experience.price}
                      </span>
                    )}
                    <span className="text-xs text-charcoal/70">per person</span>
                  </div>
                  <Button
                    asChild
                    className="w-full bg-sage hover:bg-sage/90 text-pure-white"
                    size="sm"
                  >
                    <Link to={experience.link}>
                      Book Now
                      <ArrowRight className="w-3 h-3 ml-2" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild variant="outline" size="lg">
            <Link to="/experiences">
              View All Experiences
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ExperiencesSection;
