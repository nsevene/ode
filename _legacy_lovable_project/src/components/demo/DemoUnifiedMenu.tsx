import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Filter, Star, Clock, MapPin } from 'lucide-react';
import { track } from '@/lib/analytics';

const DemoUnifiedMenu = () => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const demoKitchens = [
    {
      id: 1,
      name: 'Warung Spice Asia',
      cuisine: 'Thai & Vietnamese',
      rating: 4.8,
      prepTime: '12-18 min',
      specialties: ['Pad Thai Authentic', 'Pho Bo', 'Green Curry'],
      tags: ['Spicy', 'Vegan Options', 'Gluten-Free', 'Quick Service'],
      image: '/lovable-uploads/614f7b79-d13c-4774-9cfa-e18cf97a80ba.png',
      zone: 'Spice Sector',
      description: 'Authentic Southeast Asian flavors with modern presentation',
    },
    {
      id: 2,
      name: 'Casa Italiana',
      cuisine: 'Italian Artisan',
      rating: 4.9,
      prepTime: '15-22 min',
      specialties: [
        'Truffle Carbonara',
        'Wood-fired Pizza',
        'Gelato Artigianale',
      ],
      tags: ['Vegetarian', 'Kids Menu', 'Wine Pairing', 'Artisan'],
      image: '/lovable-uploads/7183ec12-e263-49ad-bcf4-46b29c2e0c53.png',
      zone: 'Ferment Sector',
      description:
        'Traditional Italian recipes with locally sourced ingredients',
    },
    {
      id: 3,
      name: 'Bali Heritage Kitchen',
      cuisine: 'Indonesian Traditional',
      rating: 4.7,
      prepTime: '18-25 min',
      specialties: ['Bebek Betutu', 'Nasi Campur Bali', 'Gado-Gado'],
      tags: ['Local', 'Halal', 'Traditional', 'Authentic'],
      image: '/lovable-uploads/9661fa44-47b8-4375-9a53-04abf298479f.png',
      zone: 'Umami Sector',
      description: 'Celebrating Balinese culinary heritage with family recipes',
    },
    {
      id: 4,
      name: 'Smoke & Fire',
      cuisine: 'American BBQ',
      rating: 4.6,
      prepTime: '20-30 min',
      specialties: ['24hr Brisket', 'Smoked Ribs', 'Pulled Pork'],
      tags: ['BBQ', 'Large Portions', 'Beer Pairing', 'Smoky'],
      image: '/lovable-uploads/a6143ebd-fe6e-4b6b-8452-baa56f5278ec.png',
      zone: 'Smoke Sector',
      description: 'Low & slow BBQ with house-made sauces and rubs',
    },
    {
      id: 5,
      name: 'Ramen Master Koji',
      cuisine: 'Japanese Ramen',
      rating: 4.8,
      prepTime: '10-15 min',
      specialties: ['Tonkotsu Ramen', 'Miso Tare', 'Gyoza'],
      tags: ['Japanese', 'Quick Service', 'Comfort Food', 'Authentic'],
      image: '/lovable-uploads/c249dca9-bfb0-49e1-89cc-41abfb0c64ad.png',
      zone: 'Umami Sector',
      description: 'Rich, creamy broths simmered for 18 hours daily',
    },
    {
      id: 6,
      name: 'Farm to Bowl',
      cuisine: 'Healthy Bowls',
      rating: 4.5,
      prepTime: '8-12 min',
      specialties: ['Quinoa Power Bowl', 'Açaí Bowl', 'Raw Salads'],
      tags: [
        'Vegan Options',
        'Healthy',
        'Organic',
        'Quick Service',
        'Gluten-Free',
      ],
      image: '/lovable-uploads/3150407f-e53f-49d6-afbe-64288de5aeaa.png',
      zone: 'Garden Zone',
      description: 'Fresh, organic ingredients sourced from local Ubud farms',
    },
    {
      id: 7,
      name: 'Taco Libre',
      cuisine: 'Mexican Street Food',
      rating: 4.4,
      prepTime: '8-14 min',
      specialties: ['Fish Tacos', 'Elote', 'Churros'],
      tags: ['Street Food', 'Spicy', 'Quick Service', 'Vegetarian'],
      image: '/lovable-uploads/bd3a71c1-e62b-465c-9acc-74398d478797.png',
      zone: 'Spice Sector',
      description: 'Vibrant Mexican street food with local tropical twists',
    },
    {
      id: 8,
      name: 'Le Petit Bistro',
      cuisine: 'French Bistro',
      rating: 4.7,
      prepTime: '20-28 min',
      specialties: ['Coq au Vin', 'Ratatouille', 'Crème Brûlée'],
      tags: ['French', 'Wine Pairing', 'Romantic', 'Classic'],
      image: '/lovable-uploads/ac54db01-aed6-4579-9a66-5ea3579c5cb2.png',
      zone: 'Ferment Sector',
      description: 'Classic French bistro fare with Indonesian wine pairings',
    },
    {
      id: 9,
      name: 'Dessert Alchemy',
      cuisine: 'Artisan Desserts',
      rating: 4.9,
      prepTime: '5-10 min',
      specialties: [
        'Chocolate Lava Cake',
        'Tropical Sorbet',
        'Coffee Tiramisu',
      ],
      tags: ['Desserts', 'Coffee', 'Sweet', 'Artisan'],
      image: '/lovable-uploads/f41aad56-be6e-42c6-b101-46d8f2520a51.png',
      zone: 'Sweet Corner',
      description:
        'Handcrafted desserts using Indonesian chocolate and tropical fruits',
    },
    {
      id: 10,
      name: 'Nasi Ibu Traditional',
      cuisine: 'Javanese Home Cooking',
      rating: 4.6,
      prepTime: '12-18 min',
      specialties: ['Gudeg Yogya', 'Rendang Sapi', 'Sambal Oelek'],
      tags: ['Local', 'Halal', 'Traditional', 'Comfort Food'],
      image: '/lovable-uploads/2109f2a7-74ec-4216-b0a3-322a7bdd5ebb.png',
      zone: 'Umami Sector',
      description:
        'Authentic Javanese home cooking passed down through generations',
    },
  ];

  const filterOptions = [
    'Vegan Options',
    'Vegetarian',
    'Gluten-Free',
    'Halal',
    'Kids Menu',
    'Spicy',
    'Local',
    'Quick Service',
    'Healthy',
    'Traditional',
    'Artisan',
    'BBQ',
    'Street Food',
    'Desserts',
  ];

  const handleFilterToggle = (filter: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
    track('menu_filter_toggle', {
      filter,
      action: selectedFilters.includes(filter) ? 'remove' : 'add',
    });
  };

  const handleKitchenSelect = (kitchen: any) => {
    track('kitchen_select', { kitchen_name: kitchen.name, zone: kitchen.zone });
  };

  const filteredKitchens = demoKitchens.filter((kitchen) => {
    const matchesSearch =
      kitchen.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      kitchen.cuisine.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilters =
      selectedFilters.length === 0 ||
      selectedFilters.some((filter) => kitchen.tags.includes(filter));
    return matchesSearch && matchesFilters;
  });

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-charcoal-dark mb-3">
          Unified Menu Experience
        </h2>
        <p className="text-charcoal-medium max-w-2xl mx-auto">
          Browse our curated selection of local kitchens. Each partner maintains
          their unique identity while being part of our integrated ordering
          system.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-charcoal-medium w-4 h-4" />
          <Input
            placeholder="Search kitchens or cuisine..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          {filterOptions.map((filter) => (
            <Button
              key={filter}
              variant={selectedFilters.includes(filter) ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleFilterToggle(filter)}
              className="text-xs"
            >
              <Filter className="w-3 h-3 mr-1" />
              {filter}
            </Button>
          ))}
        </div>
      </div>

      {/* Kitchen Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredKitchens.map((kitchen) => (
          <Card
            key={kitchen.id}
            className="bg-pure-white/80 backdrop-blur border border-cream-medium hover:border-burgundy-primary/30 transition-colors cursor-pointer"
            onClick={() => handleKitchenSelect(kitchen)}
          >
            <CardContent className="p-0">
              <div className="aspect-video bg-gradient-to-br from-cream-light to-cream-medium rounded-t-lg flex items-center justify-center">
                <img
                  src={kitchen.image}
                  alt={kitchen.name}
                  className="w-full h-full object-cover rounded-t-lg"
                />
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-charcoal-dark">
                      {kitchen.name}
                    </h3>
                    <p className="text-sm text-charcoal-medium">
                      {kitchen.cuisine}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="w-4 h-4 fill-mustard-accent text-mustard-accent" />
                    <span className="font-medium">{kitchen.rating}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-charcoal-medium mb-3">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {kitchen.prepTime}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {kitchen.zone}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {kitchen.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="text-xs text-charcoal-medium">
                  Popular: {kitchen.specialties.join(', ')}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Demo Actions */}
      <div className="text-center bg-cream-light/50 rounded-lg p-6">
        <h4 className="font-semibold text-charcoal-dark mb-2">Demo Features</h4>
        <p className="text-sm text-charcoal-medium mb-4">
          In the real system: Real-time availability, live pricing, allergen
          warnings, nutritional info, and integrated payment processing.
        </p>
        <Button className="bg-burgundy-primary hover:bg-burgundy-dark text-pure-white">
          Continue to Order Flow Demo →
        </Button>
      </div>
    </div>
  );
};

export default DemoUnifiedMenu;
