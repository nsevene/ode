import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Filter, Phone, Utensils, QrCode, Compass } from 'lucide-react';
import QRCodeGenerator from './QRCodeGenerator';

import tasteCompassImage from '@/assets/taste-compass-2.0.png';

const FoodCornersSection = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const filters = [
    { id: 'all', label: 'All Sectors' },
    { id: 'ferment', label: '🧪 FERMENT' },
    { id: 'smoke', label: '🔥 SMOKE' },
    { id: 'spice', label: '🌶️ SPICE' },
    { id: 'umami', label: '🐟 UMAMI' },
    { id: 'sweet-salt', label: '🍭 SWEET-SALT' },
    { id: 'zero-waste', label: '♻️ ZERO-WASTE' },
    { id: 'local', label: '🏡 LOCAL' },
    { id: 'sour-herb', label: '🌿 SOUR-HERB' },
  ];

  const tasteSectors = [
    {
      id: 1,
      name: '🧪 FERMENT',
      slogan: 'Origine Taste. Origine Feels.',
      category: 'ferment',
      description:
        'Living cultures and fermented flavors that restore connection to origins',
      specialties: [
        'Kombucha Lab',
        'Kimchi & Tempeh',
        'Fermented Sauces',
        'Living Cultures',
      ],
      experiences: ['Fermentation', 'Probiotics'],
      qrUrl: `${window.location.origin}/sector/ferment`,
      sectorUrl: '/sector/ferment',
      bgColor: 'bg-gradient-to-br from-amber-400 to-orange-500',
    },
    {
      id: 2,
      name: '🔥 SMOKE',
      slogan: 'Back to Origin. Forward to Yourself.',
      category: 'smoke',
      description:
        'Ancient fire cooking uniting traditions from different continents',
      specialties: [
        'Neapolitan Pizza',
        'BBQ Station',
        'Smoked Meats',
        'Fire Cooking',
      ],
      experiences: ['Fire Cooking', 'Smoking'],
      qrUrl: `${window.location.origin}/sector/smoke`,
      sectorUrl: '/sector/smoke',
      bgColor: 'bg-gradient-to-br from-red-500 to-orange-600',
    },
    {
      id: 3,
      name: '🌶️ SPICE',
      slogan: 'Taste the Journey',
      category: 'spice',
      description:
        'Journey along the Great Silk Road through spices and seasonings',
      specialties: [
        'Indian Curries',
        'Thai Pastes',
        'Moroccan Blends',
        'Spice Route',
      ],
      experiences: ['Spiciness', 'Exotic Spices'],
      qrUrl: `${window.location.origin}/sector/spice`,
      sectorUrl: '/sector/spice',
      bgColor: 'bg-gradient-to-br from-red-400 to-pink-500',
    },
    {
      id: 4,
      name: '🐟 UMAMI',
      slogan: 'Where food is a journey',
      category: 'umami',
      description:
        'The fifth taste - deep, rich, uniting ocean and earth treasures',
      specialties: [
        'Miso & Dashi',
        'Sushi Station',
        'Fermented Sauces',
        'Umami Bombs',
      ],
      experiences: ['Japanese Cuisine', 'Seafood'],
      qrUrl: `${window.location.origin}/sector/umami`,
      sectorUrl: '/sector/umami',
      bgColor: 'bg-gradient-to-br from-blue-400 to-teal-500',
    },
    {
      id: 5,
      name: '🍭 SWEET-SALT',
      slogan: 'Every dish begins with Origin',
      category: 'sweet-salt',
      description: "Balance of opposites: sweet and salty in nature's harmony",
      specialties: [
        'Salted Caramel',
        'Sea Salt Desserts',
        'Tropical Fruits + Chili',
        'Sweet-Savory Balance',
      ],
      experiences: ['Desserts', 'Taste Contrasts'],
      qrUrl: `${window.location.origin}/sector/sweet-salt`,
      sectorUrl: '/sector/sweet-salt',
      bgColor: 'bg-gradient-to-br from-pink-400 to-purple-500',
    },
    {
      id: 6,
      name: '♻️ ZERO-WASTE',
      slogan: "Return to what's real",
      category: 'zero-waste',
      description:
        'Philosophy of sustainability: from root to stem, from seed to fruit',
      specialties: [
        'Composting Demo',
        'Upcycled Ingredients',
        'Root-to-Stem Cooking',
        'Waste = Resource',
      ],
      experiences: ['Eco-Cooking', 'Sustainability'],
      qrUrl: `${window.location.origin}/sector/zero-waste`,
      sectorUrl: '/sector/zero-waste',
      bgColor: 'bg-gradient-to-br from-green-400 to-emerald-500',
    },
    {
      id: 7,
      name: '🏡 LOCAL',
      slogan: 'Ode to Bali',
      category: 'local',
      description:
        'Deep immersion in Balinese culture through authentic flavors',
      specialties: [
        'Balinese Dishes',
        '70%+ Local Ingredients',
        'Traditional Techniques',
        'Tri Hita Karana',
      ],
      experiences: ['Balinese Cuisine', 'Local Products'],
      qrUrl: `${window.location.origin}/sector/local`,
      sectorUrl: '/sector/local',
      bgColor: 'bg-gradient-to-br from-yellow-400 to-lime-500',
    },
    {
      id: 8,
      name: '🌿 SOUR-HERB',
      slogan: 'Nothing artificial. Just ODE.',
      category: 'sour-herb',
      description:
        'Living herb garden and sour notes creating refreshing balance',
      specialties: [
        'Fresh Herb Garden',
        'Botanical Cocktails',
        'Citrus & Herbs',
        'Garden-to-Glass',
      ],
      experiences: ['Herbal Drinks', 'Freshness'],
      qrUrl: `${window.location.origin}/sector/sour-herb`,
      sectorUrl: '/sector/sour-herb',
      bgColor: 'bg-gradient-to-br from-lime-400 to-green-500',
    },
  ];

  const filteredSectors =
    activeFilter === 'all'
      ? tasteSectors
      : tasteSectors.filter((sector) => sector.category === activeFilter);

  return (
    <section
      id="food-corners"
      className="py-20 bg-gradient-to-b from-cream/20 to-sage-blue/15"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-charcoal mb-6">
            Food{' '}
            <span className="bg-gradient-to-r from-burgundy to-terracotta bg-clip-text text-transparent">
              Corners
            </span>
          </h2>
          <p className="text-xl text-charcoal/80 max-w-3xl mx-auto mb-8">
            Discover the world of flavors in our 12 unique culinary corners
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          <Filter className="h-5 w-5 text-muted-foreground mr-2 mt-2" />
          {filters.map((filter) => (
            <Button
              key={filter.id}
              variant={activeFilter === filter.id ? 'burgundy' : 'outline'}
              size="sm"
              onClick={() => setActiveFilter(filter.id)}
              className="mb-2"
            >
              {filter.label}
            </Button>
          ))}
        </div>

        {/* Taste Sectors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSectors.map((sector) => (
            <Card
              key={sector.id}
              className="group hover:shadow-[var(--shadow-tropical)] transition-all duration-500 bg-card border-gold-accent/20 overflow-hidden"
            >
              <div
                className={`relative h-48 overflow-hidden ${sector.bgColor}`}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-burgundy-primary/80 to-transparent opacity-60"></div>

                {/* QR Code - Top Right */}
                <div className="absolute top-2 right-2 bg-cream-light p-2 rounded-lg shadow-elegant hover:shadow-glow transition-all duration-300 border border-gold-accent/30">
                  <div className="w-16 h-16 bg-charcoal rounded flex items-center justify-center">
                    <QrCode className="h-8 w-8 text-gold-accent" />
                  </div>
                  <div className="text-center mt-1">
                    <span className="text-xs text-charcoal font-medium">
                      QR Menu
                    </span>
                  </div>
                </div>

                <div className="absolute top-4 left-4">
                  <Badge
                    variant="secondary"
                    className="bg-cream-light/90 text-charcoal text-lg"
                  >
                    {sector.name}
                  </Badge>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold text-cream-light mb-1">
                    {sector.name}
                  </h3>
                  <p className="text-cream-light/90 text-sm italic">
                    "{sector.slogan}"
                  </p>
                </div>
              </div>

              <CardContent className="p-6">
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {sector.description}
                </p>

                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-foreground mb-2">
                    Specialties:
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {sector.specialties.map((specialty) => (
                      <Badge
                        key={specialty}
                        variant="outline"
                        className="text-xs border-gold-accent/30"
                      >
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-foreground mb-2">
                    Experience:
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {sector.experiences.map((experience) => (
                      <Badge
                        key={experience}
                        variant="secondary"
                        className="text-xs bg-earth-warm/20 text-earth-warm"
                      >
                        {experience}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="burgundy"
                    size="sm"
                    className="flex-1"
                    onClick={() => window.open(sector.sectorUrl, '_blank')}
                  >
                    <Utensils className="h-4 w-4" />
                    Explore Sector
                  </Button>
                  <Button variant="earth" size="sm" className="flex-1">
                    <Phone className="h-4 w-4" />
                    NFC Passport
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FoodCornersSection;
