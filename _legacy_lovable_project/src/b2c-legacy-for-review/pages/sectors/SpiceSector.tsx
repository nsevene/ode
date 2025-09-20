import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, Users, Star, MapPin } from 'lucide-react';

const SpiceSector = () => {
  const { t } = useTranslation();

  const vendors = [
    {
      name: 'Spicy Asia',
      specialty: 'Authentic Asian Heat',
      rating: 4.9,
      image: '/lovable-uploads/26a9fd15-1f32-4ed5-bf51-3d6ffd018a48.png',
    },
    {
      name: 'Chili Champions',
      specialty: 'Global Spice Fusion',
      rating: 4.8,
      image: '/lovable-uploads/72f429cb-e3f6-44d1-a685-dd4002161507.png',
    },
    {
      name: 'Fire Kitchen',
      specialty: 'Extreme Heat Challenges',
      rating: 4.7,
      image: '/lovable-uploads/eb0ecf72-72e4-4040-9c75-dbf57409f27d.png',
    },
  ];

  const spiceHeatLevels = [
    {
      level: 'Mild',
      icon: '🌶️',
      description: 'Gentle warmth, perfect for beginners',
    },
    {
      level: 'Medium',
      icon: '🌶️🌶️',
      description: 'Noticeable heat with great flavor',
    },
    {
      level: 'Hot',
      icon: '🌶️🌶️🌶️',
      description: 'Serious heat for spice lovers',
    },
    {
      level: 'Extreme',
      icon: '🌶️🌶️🌶️🌶️',
      description: 'Challenge level - proceed with caution!',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pure-white via-cream-light to-cream-medium/30">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🌶️</div>
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4">
            Spice Sector
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ignite your senses with our fiery collection of the world's boldest
            and most flavorful spices
          </p>
        </div>

        {/* Heat Level Guide */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {spiceHeatLevels.map((level, index) => (
            <Card key={index} className="p-4 text-center">
              <div className="text-2xl mb-2">{level.icon}</div>
              <div className="font-semibold text-sm">{level.level}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {level.description}
              </div>
            </Card>
          ))}
        </div>

        {/* Sector Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <Card className="p-6 text-center">
            <Zap className="w-8 h-8 mx-auto mb-2 text-red-500" />
            <div className="text-2xl font-bold">1M+</div>
            <div className="text-sm text-muted-foreground">Scoville Units</div>
          </Card>
          <Card className="p-6 text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">3</div>
            <div className="text-sm text-muted-foreground">Vendors</div>
          </Card>
          <Card className="p-6 text-center">
            <Star className="w-8 h-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">4.8</div>
            <div className="text-sm text-muted-foreground">Avg Rating</div>
          </Card>
          <Card className="p-6 text-center">
            <MapPin className="w-8 h-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">Zone C</div>
            <div className="text-sm text-muted-foreground">Location</div>
          </Card>
        </div>

        {/* Vendors Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {vendors.map((vendor, index) => (
            <Card
              key={index}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="aspect-video bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center">
                <div className="text-4xl">🌶️</div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{vendor.name}</h3>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{vendor.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {vendor.specialty}
                </p>
                <div className="flex gap-2 mb-4">
                  <Badge
                    variant="secondary"
                    className="bg-red-100 text-red-700"
                  >
                    Spicy
                  </Badge>
                  <Badge variant="outline">Hot</Badge>
                </div>
                <Button className="w-full">View Menu</Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Spice Challenge */}
        <Card className="p-8 mb-12 bg-gradient-to-r from-red-50 to-orange-50">
          <h2 className="text-2xl font-bold mb-4 text-center">
            🔥 Spice Challenge 🔥
          </h2>
          <div className="text-center mb-6">
            <p className="text-muted-foreground">
              Think you can handle the heat? Take on our legendary spice
              challenge!
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl mb-2">🏆</div>
              <div className="font-semibold">Hall of Fame</div>
              <div className="text-sm text-muted-foreground">23 Champions</div>
            </div>
            <div>
              <div className="text-3xl mb-2">🌡️</div>
              <div className="font-semibold">Record Heat</div>
              <div className="text-sm text-muted-foreground">1.2M Scoville</div>
            </div>
            <div>
              <div className="text-3xl mb-2">⏱️</div>
              <div className="font-semibold">Time Limit</div>
              <div className="text-sm text-muted-foreground">5 Minutes</div>
            </div>
          </div>
          <div className="text-center mt-6">
            <Button size="lg" className="bg-red-600 hover:bg-red-700">
              Accept Challenge
            </Button>
          </div>
        </Card>

        {/* CTA */}
        <Card className="p-8 text-center bg-primary/5">
          <h2 className="text-2xl font-bold mb-4">
            Ready to Turn Up the Heat?
          </h2>
          <p className="text-muted-foreground mb-6">
            Explore our collection of the world's most exciting spices and
            flavors
          </p>
          <Button size="lg">Explore Spice Sector</Button>
        </Card>
      </div>
    </div>
  );
};

export default SpiceSector;
