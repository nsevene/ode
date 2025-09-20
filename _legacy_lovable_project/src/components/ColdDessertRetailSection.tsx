import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, Coffee, Gift } from 'lucide-react';
import Price from '@/components/Price';

const ColdDessertRetailSection = () => {
  const desserts = [
    {
      name: 'Artisan Gelato',
      description: 'Locally sourced flavors',
      price: 85000,
      image: 'photo-1560008511-11c63416e52d',
    },
    {
      name: 'Cold Brew Float',
      description: 'House blend with vanilla',
      price: 95000,
      image: 'photo-1461023058943-07fcbe16d735',
    },
    {
      name: 'Tropical Smoothie',
      description: 'Fresh fruit & coconut',
      price: 75000,
      image: 'photo-1570197788417-0e82375c9371',
    },
  ];

  const retailItems = [
    {
      name: 'ODE Merch',
      description: 'T-shirts, totes & more',
      icon: <Gift className="w-5 h-5" />,
    },
    {
      name: 'Local Artisan',
      description: 'Handcrafted souvenirs',
      icon: <ShoppingBag className="w-5 h-5" />,
    },
    {
      name: 'Coffee Beans',
      description: 'Take our blends home',
      icon: <Coffee className="w-5 h-5" />,
    },
  ];

  return (
    <section className="py-16 bg-golden/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Wide Banner */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden h-full bg-gradient-to-r from-golden/20 to-amber/20 border-golden/30">
              <div className="flex flex-col md:flex-row h-full">
                <div className="md:w-1/2 p-8 flex flex-col justify-center">
                  <Badge className="w-fit mb-4 bg-golden text-pure-white">
                    Sweet Endings
                  </Badge>
                  <h2 className="text-3xl font-bold text-charcoal mb-4">
                    Cold Dessert & Juice Bar
                  </h2>
                  <p className="text-charcoal/70 mb-6 leading-relaxed">
                    Cool down with our artisan gelato, fresh juices, and
                    signature cold brews. Made with locally sourced ingredients
                    and love.
                  </p>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-golden rounded-full"></div>
                      <span className="text-sm text-charcoal/70">
                        15+ artisan gelato flavors
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-golden rounded-full"></div>
                      <span className="text-sm text-charcoal/70">
                        Fresh cold-pressed juices
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-golden rounded-full"></div>
                      <span className="text-sm text-charcoal/70">
                        Specialty coffee & retail
                      </span>
                    </div>
                  </div>
                  <Button className="w-fit bg-golden hover:bg-golden/90 text-pure-white">
                    View Menu
                  </Button>
                </div>

                <div className="md:w-1/2 relative min-h-[300px]">
                  <img
                    src="https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&h=400&fit=crop"
                    alt="Cold desserts and drinks"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Mini Cards Column */}
          <div className="space-y-6">
            {/* Dessert Mini Cards */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-charcoal">
                Popular Treats
              </h3>
              {desserts.map((dessert, index) => (
                <Card
                  key={index}
                  className="group hover:shadow-soft transition-all duration-300"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={`https://images.unsplash.com/${dessert.image}?w=128&h=128&fit=crop`}
                          alt={dessert.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-charcoal">
                          {dessert.name}
                        </h4>
                        <p className="text-sm text-charcoal/70">
                          {dessert.description}
                        </p>
                        <Price
                          value={dessert.price}
                          className="text-sm font-semibold text-golden"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Retail Section */}
            <div className="bg-pure-white rounded-xl p-6 border border-golden/20">
              <h3 className="text-xl font-semibold text-charcoal mb-4">
                Take Home
              </h3>
              <div className="space-y-3">
                {retailItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="p-2 bg-golden/10 rounded-lg">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-medium text-charcoal text-sm">
                        {item.name}
                      </h4>
                      <p className="text-xs text-charcoal/70">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-4 border-golden text-golden hover:bg-golden/10"
              >
                Browse Retail
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ColdDessertRetailSection;
