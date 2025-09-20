import ImprovedNavigation from '@/components/ImprovedNavigation';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, Star, Utensils, Heart } from 'lucide-react';

const DolceItalia = () => {
  const { t } = useTranslation();

  const menuItems = [
    {
      name: 'Truffle Risotto',
      price: '$22',
      description:
        'Creamy Arborio rice with Italian black truffle and Parmesan',
      category: 'Primo',
    },
    {
      name: 'Osso Buco Milanese',
      price: '$28',
      description: 'Braised veal shanks with saffron risotto and gremolata',
      category: 'Secondo',
    },
    {
      name: 'Burrata Caprese',
      price: '$16',
      description: 'Fresh burrata with heirloom tomatoes and basil oil',
      category: 'Antipasti',
    },
    {
      name: 'Tiramisu della Casa',
      price: '$10',
      description: 'Classic tiramisu made with espresso and mascarpone',
      category: 'Dolci',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <ImprovedNavigation />

      {/* QR Code Corner - Top Right */}
      <div className="fixed top-20 right-4 z-40">
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gold-accent/20">
          <div className="w-28 h-28 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-500 text-center">
            QR Code
            <br />
            Dolce Italia
            <br />
            Menu
          </div>
        </div>
      </div>

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-red-900/20 to-green-900/20 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center mb-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Food Hall
              </Button>
            </div>

            <div className="text-center">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-green-600 bg-clip-text text-transparent mb-4">
                🇮🇹 Dolce Italia Corner
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Authentic Italian flavors from the heart of Sicily and Tuscany
              </p>

              <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Open 11:00 - 23:00
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  4.9/5 Rating
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Made with Amore
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Menu Section */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">
              La Nostra Cucina
            </h2>

            <div className="grid gap-6">
              {menuItems.map((item, index) => (
                <div
                  key={index}
                  className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-foreground">
                          {item.name}
                        </h3>
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-burgundy-primary mb-2">
                        {item.price}
                      </div>
                      <Button variant="earth" size="sm">
                        Ordina Ora
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Button variant="hero" size="lg">
                Menu Completo
              </Button>
            </div>
          </div>
        </section>

        {/* Italian Experience */}
        <section className="py-16 bg-gradient-to-r from-red-50 to-green-50 dark:from-red-950/20 dark:to-green-950/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-8">🍝 Esperienza Italiana</h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-card/80 backdrop-blur-sm border border-border rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Wine Pairing</h3>
                <p className="text-muted-foreground mb-4">
                  Perfect Italian wines selected by our sommelier for each dish
                </p>
                <Button variant="outline">Discover Pairings</Button>
              </div>

              <div className="bg-card/80 backdrop-blur-sm border border-border rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">
                  Taste Passport Stamp
                </h3>
                <p className="text-muted-foreground mb-4">
                  Savor our signature Truffle Risotto and earn your Italia
                  stamp!
                </p>
                <Button variant="hero">Get Stamp</Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default DolceItalia;
