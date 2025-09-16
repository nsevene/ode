import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wine, Coffee, Clock, MapPin } from "lucide-react";

const FeaturedBarsSection = () => {
  const bars = [
    {
      name: "Beverage Bar",
      type: "Craft Cocktails & Beer",
      location: "Ground Floor",
      hours: "12:00 - 01:00",
      description: "Artisan cocktails using local ingredients and premium spirits. Happy hour daily 5-7 PM.",
      highlights: ["Signature cocktails", "Local beer selection", "Happy hour specials"],
      image: "photo-1551024506-0bccd828d307",
      badge: "Popular",
      badgeColor: "bg-sage"
    },
    {
      name: "Wine & Bottle Bar", 
      type: "Premium Wine Selection",
      location: "Second Floor",
      hours: "16:00 - 24:00",
      description: "Curated selection of local and international wines. Perfect for intimate gatherings.",
      highlights: ["Wine tastings", "Bottle service", "Sommelier guidance"],
      image: "photo-1510812431401-41d2bd2722f3",
      badge: "Premium",
      badgeColor: "bg-burgundy-primary"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-sage/5 to-burgundy-primary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-charcoal mb-4">
            Featured Bars
          </h2>
          <p className="text-xl text-charcoal/70 max-w-3xl mx-auto">
            Discover our signature beverage experiences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {bars.map((bar, index) => (
            <Card key={index} className="group hover:shadow-tropical transition-all duration-500 overflow-hidden">
              <div className="aspect-[16/10] relative overflow-hidden">
                <img 
                  src={`https://images.unsplash.com/${bar.image}?w=800&h=500&fit=crop`}
                  alt={bar.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-6 left-6">
                  <Badge className={`${bar.badgeColor} text-pure-white`}>
                    {bar.badge}
                  </Badge>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-2xl font-bold text-pure-white mb-2">{bar.name}</h3>
                  <p className="text-pure-white/90">{bar.type}</p>
                </div>
              </div>
              
              <CardContent className="p-8">
                <div className="flex flex-wrap gap-4 mb-6 text-sm text-charcoal/70">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{bar.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{bar.hours}</span>
                  </div>
                </div>
                
                <p className="text-charcoal/70 mb-6 leading-relaxed">
                  {bar.description}
                </p>
                
                <div className="mb-6">
                  <h4 className="font-semibold text-charcoal mb-3">Highlights:</h4>
                  <div className="space-y-2">
                    {bar.highlights.map((highlight, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-sage rounded-full"></div>
                        <span className="text-sm text-charcoal/70">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button className="flex-1 bg-sage hover:bg-sage/90 text-pure-white">
                    Reserve Table
                  </Button>
                  <Button variant="outline" className="flex-1">
                    View Menu
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 bg-pure-white rounded-full px-6 py-3 shadow-soft">
            <Wine className="w-5 h-5 text-sage" />
            <span className="text-charcoal font-medium">Both bars offer</span>
            <Coffee className="w-5 h-5 text-burgundy-primary" />
            <span className="text-charcoal/70">non-alcoholic options</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedBarsSection;