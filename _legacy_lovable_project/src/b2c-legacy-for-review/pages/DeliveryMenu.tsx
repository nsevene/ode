import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Filter, Search, ShoppingCart } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const DeliveryMenu = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-sage/20 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-forest mb-4">
            Delivery & Menu
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Order authentic dishes from our eight culinary zones, delivered
            fresh to your location
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Button variant="outline" className="border-sage">
            <Filter className="h-4 w-4 mr-2" />
            Cuisine Type
          </Button>
          <Button variant="outline" className="border-sage">
            Dietary Preferences
          </Button>
          <Button variant="outline" className="border-sage">
            Price Range
          </Button>
          <div className="relative ml-auto">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search dishes..."
              className="pl-10 pr-4 py-2 border border-sage rounded-lg"
            />
          </div>
        </div>

        {/* Menu Grid Placeholder */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Card key={item} className="border-sage/30">
              <CardHeader>
                <div className="aspect-video bg-sage/20 rounded-lg mb-4"></div>
                <CardTitle className="text-forest">Dish Name {item}</CardTitle>
                <div className="flex gap-2">
                  <Badge variant="outline" className="border-sage text-sage">
                    Zone Name
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-terracotta text-terracotta"
                  >
                    Vegan
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Delicious authentic dish from our kitchen...
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-forest">$12.50</span>
                  <Button className="bg-sage hover:bg-sage/90">
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Cart CTA */}
        <div className="fixed bottom-6 right-6">
          <Button
            size="lg"
            className="bg-golden hover:bg-golden/90 text-forest rounded-full shadow-lg"
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            Checkout (0)
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeliveryMenu;
