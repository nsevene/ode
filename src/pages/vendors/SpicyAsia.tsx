import ImprovedNavigation from "@/components/ImprovedNavigation";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Star, Utensils } from "lucide-react";


const SpicyAsia = () => {
  const { t } = useTranslation();

  const menuItems = [
    {
      name: "Tom Yum Goong",
      price: "$12",
      description: "Spicy Thai shrimp soup with lemongrass and lime leaves",
      spiceLevel: 3
    },
    {
      name: "Pad Thai",
      price: "$14",
      description: "Classic stir-fried rice noodles with tamarind and peanuts",
      spiceLevel: 2
    },
    {
      name: "Green Curry",
      price: "$16",
      description: "Authentic Thai green curry with coconut milk and basil",
      spiceLevel: 4
    },
    {
      name: "Mango Sticky Rice",
      price: "$8",
      description: "Traditional Thai dessert with sweet coconut sauce",
      spiceLevel: 0
    }
  ];

  const renderSpiceLevel = (level: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span 
        key={i} 
        className={`text-sm ${i < level ? 'text-red-500' : 'text-gray-300'}`}
      >
        🌶️
      </span>
    ));
  };

  return (
    <div className="min-h-screen bg-background">
      <ImprovedNavigation />
      
      {/* QR Code Corner - Top Right */}
      <div className="fixed top-20 right-4 z-40">
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gold-accent/20">
          <div className="w-28 h-28 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-500 text-center">
            QR Code<br/>Spicy Asia<br/>Menu
          </div>
        </div>
      </div>

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-red-900/20 to-orange-900/20 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center mb-6">
              <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Food Hall
              </Button>
            </div>
            
            <div className="text-center">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent mb-4">
                🌶️ Spicy Asia Corner
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Authentic Thai & Vietnamese flavors that ignite your taste buds
              </p>
              
              <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Open 11:00 - 22:00
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  4.8/5 Rating
                </div>
                <div className="flex items-center gap-2">
                  <Utensils className="h-4 w-4" />
                  Thai & Vietnamese
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Menu Section */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">
              Today's Special Menu
            </h2>
            
            <div className="grid gap-6">
              {menuItems.map((item, index) => (
                <div 
                  key={index}
                  className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        {item.name}
                      </h3>
                      <p className="text-muted-foreground mb-3">
                        {item.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-muted-foreground">
                          Spice Level:
                        </span>
                        {renderSpiceLevel(item.spiceLevel)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-burgundy-primary mb-2">
                        {item.price}
                      </div>
                      <Button variant="earth" size="sm">
                        Order Now
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Button variant="hero" size="lg">
                View Full Menu
              </Button>
            </div>
          </div>
        </section>

        {/* Special Offers */}
        <section className="py-16 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-8">
              🔥 Today's Fire Deals
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-card/80 backdrop-blur-sm border border-border rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">
                  Spice Challenge
                </h3>
                <p className="text-muted-foreground mb-4">
                  Finish our hottest curry in under 10 minutes - meal is free!
                </p>
                <Button variant="outline">
                  Accept Challenge
                </Button>
              </div>
              
              <div className="bg-card/80 backdrop-blur-sm border border-border rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">
                  Taste Passport Stamp
                </h3>
                <p className="text-muted-foreground mb-4">
                  Order any main dish and get your Spicy Asia stamp!
                </p>
                <Button variant="hero">
                  Get Stamp
                </Button>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};

export default SpicyAsia;