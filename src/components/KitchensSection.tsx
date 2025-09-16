import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ChefHat, ArrowRight } from "lucide-react";

const KitchensSection = () => {
  const kitchenCorners = [
    { 
      emoji: "🍕", 
      name: "Pizza Corner", 
      subtitle: "Wood-fired Neapolitan pizza with premium toppings", 
      capacity: "20-25 guests",
      area: "17.9m²",
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    { 
      emoji: "🌿", 
      name: "Vegetarian Corner", 
      subtitle: "Creative plant-based dishes and vegan innovations", 
      capacity: "18-22 guests",
      area: "16.5m²",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    { 
      emoji: "🌶️", 
      name: "Spice Asia", 
      subtitle: "Authentic Asian heat and traditional spices", 
      capacity: "20-25 guests",
      area: "18.2m²",
      image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    { 
      emoji: "🔥", 
      name: "Smoke BBQ", 
      subtitle: "Charcoal & wood fire slow-cooked meats", 
      capacity: "22-28 guests",
      area: "19.8m²",
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    { 
      emoji: "🧀", 
      name: "Ferment Lab", 
      subtitle: "Living cultures and fermented specialties", 
      capacity: "15-20 guests",
      area: "14.3m²",
      image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    { 
      emoji: "🥖", 
      name: "Bread Corner", 
      subtitle: "Fresh daily baked artisan breads", 
      capacity: "12-16 guests",
      area: "12.7m²",
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    { 
      emoji: "🍜", 
      name: "Noodle Bar", 
      subtitle: "Handmade pasta & authentic ramen", 
      capacity: "16-20 guests",
      area: "15.6m²",
      image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    { 
      emoji: "🥩", 
      name: "Grill Station", 
      subtitle: "Premium cuts and live cooking", 
      capacity: "20-24 guests",
      area: "18.9m²",
      image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    { 
      emoji: "🐟", 
      name: "Ocean Fresh", 
      subtitle: "Daily catch and seafood specialties", 
      capacity: "18-22 guests",
      area: "17.1m²",
      image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    { 
      emoji: "🍛", 
      name: "Rice Bowl", 
      subtitle: "Indonesian heritage and rice dishes", 
      capacity: "20-25 guests",
      area: "17.5m²",
      image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    { 
      emoji: "🧊", 
      name: "Raw Bar", 
      subtitle: "Ceviches, tartares and fresh preparations", 
      capacity: "14-18 guests",
      area: "13.8m²",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    { 
      emoji: "🍯", 
      name: "Sweet Lab", 
      subtitle: "Dessert innovations and honey specialties", 
      capacity: "16-20 guests",
      area: "15.2m²",
      image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    { 
      emoji: "☕", 
      name: "Coffee Corner", 
      subtitle: "Specialty coffee & local Balinese beans", 
      capacity: "12-16 guests",
      area: "11.4m²",
      image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    { 
      emoji: "🥗", 
      name: "Salad Bar", 
      subtitle: "Fresh organic greens and healthy bowls", 
      capacity: "14-18 guests",
      area: "13.5m²",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    { 
      emoji: "🍨", 
      name: "Gelato Corner", 
      subtitle: "Artisanal gelato and frozen delights", 
      capacity: "10-15 guests",
      area: "12.0m²",
      image: "/lovable-uploads/8aa079e0-9644-475a-b008-47b5aa2afe39.png"
    }
  ];

  return (
    <section id="food-corners" className="py-16 bg-gradient-to-b from-background via-muted/5 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
            <ChefHat className="w-4 h-4 mr-2" />
            15 Kitchen Corners
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Food Corners
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            15 unique gastronomic spaces on the 1st floor. From classics to experiments — everyone will find their taste.
          </p>
        </header>

        {/* Kitchen Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {kitchenCorners.map((kitchen, index) => (
            <Card 
              key={index} 
              className="group hover:scale-105 transition-all duration-300 cursor-pointer border-muted/20 hover:border-primary/20 overflow-hidden"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={kitchen.image} 
                  alt={kitchen.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
                
                {/* Area Badge */}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium text-gray-800">
                  {kitchen.area}
                </div>
                
                {/* Emoji Overlay */}
                <div className="absolute bottom-3 left-3 text-3xl group-hover:scale-110 transition-transform duration-300">
                  {kitchen.emoji}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors text-lg">
                  {kitchen.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                  {kitchen.subtitle}
                </p>
                <p className="text-xs text-muted-foreground/70 flex items-center gap-1">
                  <span>👥</span>
                  {kitchen.capacity}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link to="/kitchens">
            <Button size="lg" className="rounded-full hover:scale-105 transition-all duration-300">
              View Full Menu
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default KitchensSection;