
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Filter, Users, Square, Clock, Star } from "lucide-react";

const PopUpCornersSection = () => {
  const corners = [
    { name: "LOUNGE BAR", emoji: "🍹", specialty: "Craft Cocktails", rating: "★★★★★", status: "Open" },
    { name: "VEGETARIAN CORNER", emoji: "🌱", specialty: "Balinese Plant-Based", rating: "★★★★☆", status: "Open" },
    { name: "INDIAN SPICE LAB", emoji: "🌶️", specialty: "7-Spice Curry", rating: "★★★★★", status: "Open" },
    { name: "THAI STREET FOOD", emoji: "🍜", specialty: "Authentic Pad Thai", rating: "★★★★★", status: "Open" },
    { name: "JAPANESE RAMEN", emoji: "🍲", specialty: "Tokyo-Style Ramen", rating: "★★★★☆", status: "Open" },
    { name: "KOREAN BBQ", emoji: "🥩", specialty: "Seoul Bulgogi", rating: "★★★★★", status: "Open" },
    { name: "PIZZA NAPOLETANA", emoji: "🍕", specialty: "Wood-Fired Pizza", rating: "★★★★★", status: "Open" },
    { name: "FRENCH BISTRO", emoji: "🥖", specialty: "Classic Croissants", rating: "★★★★☆", status: "Open" },
    { name: "MEXICAN CANTINA", emoji: "🌮", specialty: "Street Tacos", rating: "★★★★★", status: "Open" },
    { name: "SEAFOOD DOCK", emoji: "🦐", specialty: "Fresh Catch Daily", rating: "★★★★☆", status: "Open" },
    { name: "DESSERT FACTORY", emoji: "🍰", specialty: "Artisan Sweets", rating: "★★★★★", status: "Open" },
    { name: "COFFEE ROASTERY", emoji: "☕", specialty: "Single Origin", rating: "★★★★☆", status: "Open" }
  ];

  return (
    <section className="py-20 px-5 text-center font-system">
      <h2 className="text-4xl mb-5 text-burgundy-primary">POP-UP GASTRO STAGE</h2>
      <p className="text-xl max-w-4xl mx-auto mb-10">
        12 rotating pop-up kitchens by chefs from Tokyo, Seoul, Bangkok, and Mumbai
      </p>

      {/* Grid 3×4 */}
      <div className="max-w-4xl mx-auto grid grid-cols-3 gap-5">
        {corners.map((corner, index) => (
          <div 
            key={index} 
            className="bg-secondary/10 p-5 rounded-xl shadow-lg text-center border border-gold-accent/20"
          >
            <h3 className="m-0 mb-2 text-foreground text-xl font-bold">
              {corner.name}
            </h3>
            <p className="my-1 text-lg">{corner.emoji} {corner.specialty}</p>
            <p className="my-1 text-lg">{corner.rating}</p>
            <p className="my-1 text-lg"><strong>{corner.status}</strong></p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PopUpCornersSection;
