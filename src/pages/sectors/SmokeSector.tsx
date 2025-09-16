import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flame, Users, Star, MapPin } from 'lucide-react';

const SmokeSector = () => {
  const { t } = useTranslation();

  const vendors = [
    {
      name: "Smoke & Fire",
      specialty: "BBQ Ribs & Brisket",
      rating: 4.9,
      image: "/lovable-uploads/26a9fd15-1f32-4ed5-bf51-3d6ffd018a48.png"
    },
    {
      name: "Balinese Smoked",
      specialty: "Traditional Bebek Betutu",
      rating: 4.8,
      image: "/lovable-uploads/72f429cb-e3f6-44d1-a685-dd4002161507.png"
    },
    {
      name: "Artisan Smokehouse",
      specialty: "Smoked Salmon & Fish",
      rating: 4.7,
      image: "/lovable-uploads/eb0ecf72-72e4-4040-9c75-dbf57409f27d.png"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pure-white via-cream-light to-cream-medium/30">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🔥</div>
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4">
            Smoke Sector
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience the rich, complex flavors of traditional smoking techniques from around the world
          </p>
        </div>

        {/* Sector Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <Card className="p-6 text-center">
            <Flame className="w-8 h-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">12h+</div>
            <div className="text-sm text-muted-foreground">Smoking Time</div>
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
            <div className="text-2xl font-bold">Zone B</div>
            <div className="text-sm text-muted-foreground">Location</div>
          </Card>
        </div>

        {/* Vendors Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {vendors.map((vendor, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                <div className="text-4xl">🔥</div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{vendor.name}</h3>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{vendor.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{vendor.specialty}</p>
                <div className="flex gap-2 mb-4">
                  <Badge variant="secondary">Smoked</Badge>
                  <Badge variant="outline">BBQ</Badge>
                </div>
                <Button className="w-full">View Menu</Button>
              </div>
            </Card>
          ))}
        </div>

        {/* About Smoking */}
        <Card className="p-8 mb-12">
          <h2 className="text-2xl font-bold mb-4">About Smoking</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-2">Smoking Techniques</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Cold smoking for delicate flavors</li>
                <li>• Hot smoking for tender textures</li>
                <li>• Traditional wood chip varieties</li>
                <li>• Low and slow cooking methods</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Signature Dishes</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Hickory smoked brisket</li>
                <li>• Cedar plank salmon</li>
                <li>• Applewood bacon</li>
                <li>• Smoked cheese platters</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* CTA */}
        <Card className="p-8 text-center bg-orange-50">
          <h2 className="text-2xl font-bold mb-4">Fire Up Your Taste Buds</h2>
          <p className="text-muted-foreground mb-6">
            Experience the ancient art of smoking in every bite
          </p>
          <Button size="lg">Explore Smoke Sector</Button>
        </Card>
      </div>
    </div>
  );
};

export default SmokeSector;