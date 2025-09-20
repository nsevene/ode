import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Users, Utensils, Sofa, Music } from 'lucide-react';
import { Link } from 'react-router-dom';

const SpacesSection = () => {
  const firstFloorSpaces = [
    {
      name: 'Food Hall',
      capacity: '300 seats',
      description: 'Open dining with 12 vendor corners',
      features: ['Family-friendly', 'Air conditioned', 'Free WiFi'],
      icon: <Utensils className="w-5 h-5" />,
      image: 'photo-1517248135467-4c7edcad34c4',
    },
    {
      name: 'Central Bar',
      capacity: '40 seats',
      description: 'Craft cocktails & beer selection',
      features: ['Happy hour', 'Live bartending', 'Premium spirits'],
      icon: <Sofa className="w-5 h-5" />,
      image: 'photo-1514933651103-005eec06c04b',
    },
    {
      name: 'Kids Area',
      capacity: '15 children',
      description: 'Safe play zone for little ones',
      features: ['Supervised', 'Educational toys', 'Parent seating'],
      icon: <Users className="w-5 h-5" />,
      image: 'photo-1587654780291-39c9404d746b',
    },
  ];

  const secondFloorSpaces = [
    {
      name: 'Wine Staircase',
      capacity: '20 guests',
      description: 'Intimate wine tasting experience',
      features: ['Wine pairings', 'Sommelier guided', 'Private events'],
      icon: <Sofa className="w-5 h-5" />,
      image: 'photo-1510812431401-41d2bd2722f3',
    },
    {
      name: 'VIP Lounge',
      capacity: '50 guests',
      description: 'Premium dining & entertainment',
      features: ['Live music', 'Private bar', 'Panoramic views'],
      icon: <Music className="w-5 h-5" />,
      image: 'photo-1578662996442-48f60103fc96',
    },
    {
      name: "Chef's Table",
      capacity: '12 guests',
      description: 'Exclusive culinary experience',
      features: ['Multi-course tasting', 'Chef interaction', 'Wine pairing'],
      icon: <Utensils className="w-5 h-5" />,
      image: 'photo-1414235077428-338989a2e8c0',
    },
  ];

  return (
    <section
      id="spaces"
      aria-label="Dining spaces and floor layouts"
      className="py-16 bg-pure-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Image */}
        <div className="mb-16">
          <div className="h-[60vh] overflow-hidden rounded-2xl mb-8 relative">
            <img
              src="/lovable-uploads/7b7fb405-6ab9-43d3-bfc3-32705341e97d.png"
              alt="ODE Food Hall staircase with wine displays"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8 text-white">
              <h2 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
                Our Spaces
              </h2>
              <p className="text-xl md:text-2xl max-w-2xl drop-shadow-sm">
                Two floors of unique dining and entertainment experiences
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="first-floor" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
            <TabsTrigger value="first-floor" className="text-base">
              First Floor
            </TabsTrigger>
            <TabsTrigger value="second-floor" className="text-base">
              Second Floor
            </TabsTrigger>
          </TabsList>

          <TabsContent value="first-floor" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {firstFloorSpaces.map((space, index) => (
                <Card
                  key={index}
                  className="group hover:shadow-soft transition-all duration-300 overflow-hidden"
                >
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <img
                      src={`https://images.unsplash.com/${space.image}?w=600&h=450&fit=crop`}
                      alt={space.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge
                        variant="secondary"
                        className="bg-sage text-pure-white"
                      >
                        Ground Floor
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-sage/10 rounded-lg">
                        {space.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-charcoal">
                          {space.name}
                        </h3>
                        <p className="text-sm text-charcoal/70">
                          {space.capacity}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-charcoal/70 mb-4">
                      {space.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      {space.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-sage rounded-full"></div>
                          <span className="text-xs text-charcoal/70">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>

                    <Button variant="outline" size="sm" className="w-full">
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="second-floor" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {secondFloorSpaces.map((space, index) => (
                <Card
                  key={index}
                  className="group hover:shadow-soft transition-all duration-300 overflow-hidden"
                >
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <img
                      src={`https://images.unsplash.com/${space.image}?w=600&h=450&fit=crop`}
                      alt={space.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge
                        variant="secondary"
                        className="bg-burgundy-primary text-pure-white"
                      >
                        Second Floor
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-burgundy-primary/10 rounded-lg">
                        {space.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-charcoal">
                          {space.name}
                        </h3>
                        <p className="text-sm text-charcoal/70">
                          {space.capacity}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-charcoal/70 mb-4">
                      {space.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      {space.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-burgundy-primary rounded-full"></div>
                          <span className="text-xs text-charcoal/70">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>

                    <Button variant="outline" size="sm" className="w-full">
                      Book Experience
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="text-center mt-12">
          <Button
            asChild
            size="lg"
            className="bg-sage hover:bg-sage/90 text-pure-white"
          >
            <Link to="/spaces">Explore All Spaces</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SpacesSection;
