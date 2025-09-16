import ImprovedNavigation from "@/components/ImprovedNavigation";
import TimeslotBooking from "@/components/TimeslotBooking";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Compass, Globe, Users, Clock, Star, ArrowRight, Gift } from "lucide-react";
import { SEOHead } from "@/components/seo/SEOHead";
import { useSEO } from "@/hooks/useSEO";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";

const TasteCompass = () => {
  const isMobile = useIsMobile();
  const { getPageData } = useSEO();
  const pageData = getPageData('/taste-compass');
  
  const tasteCompassSectors = [
    { name: "Vegan", color: "hsl(120, 50%, 45%)" }, // forest green
    { name: "Serv", color: "hsl(31, 65%, 55%)" }, // terracotta  
    { name: "Sour-Herb", color: "hsl(350, 60%, 35%)" }, // burgundy
    { name: "Sweet", color: "hsl(45, 75%, 55%)" }, // gold accent
    { name: "Umami", color: "hsl(25, 45%, 50%)" }, // earth warm
    { name: "Spicant", color: "hsl(15, 45%, 65%)" }, // dusty rose
    { name: "Spice", color: "hsl(5, 70%, 45%)" } // deep burgundy
  ];

  const eightZones = [
    {
      name: "Smoke",
      icon: "🔥",
      image: "photo-1618160702438-9b02ab6515c9"
    },
    {
      name: "Spice", 
      icon: "🌶️",
      image: "photo-1465146344425-f00d5f5c8f07"
    },
    {
      name: "Ferment",
      icon: "🥒",
      image: "photo-1500375592092-40eb2168fd21"
    },
    {
      name: "Sweet",
      icon: "🍯",
      image: "photo-1482881497185-d4a9ddbe4151"
    },
    {
      name: "Sweet-Salt",
      icon: "🧂",
      image: "photo-1523712999610-f77fbcfc3843"
    },
    {
      name: "Zero-Waste",
      icon: "♻️",
      image: "photo-1500673922987-e212871fec22"
    },
    {
      name: "Local",
      icon: "🌱",
      image: "photo-1465379944081-7f47de8d74ac"
    },
    {
      name: "Herb",
      icon: "🌿",
      image: "photo-1501286353178-1ec881214838"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title={pageData.title}
        description={pageData.description}
        keywords={pageData.keywords}
        image={pageData.image}
        type={pageData.type}
        experienceType="Taste Compass"
        price="Варьируется"
        availability="Ежедневно"
      />
      
      <ImprovedNavigation />
      
      {/* Hero Section */}
      <section className="relative min-h-screen bg-forest-dark">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-forest-dark via-forest-medium to-forest-deep"></div>
        
        <div className="relative z-10 text-center flex flex-col items-center justify-center min-h-screen px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-cream-light">
            Start Your Taste Quest
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-cream-medium">
            Interactive Taste Compass
          </p>
          
          {/* Compass Wheel */}
          <div className="relative mb-16">
            <div className="w-80 h-80 md:w-96 md:h-96 rounded-full border-4 border-gold-accent relative overflow-hidden">
              {tasteCompassSectors.map((sector, index) => {
                const angle = (360 / tasteCompassSectors.length) * index;
                const nextAngle = (360 / tasteCompassSectors.length) * (index + 1);
                return (
                  <div
                    key={sector.name}
                    className="absolute inset-0 flex items-center justify-center text-white font-semibold"
                    style={{
                      background: `conic-gradient(from ${angle}deg, ${sector.color} 0deg, ${sector.color} ${360/tasteCompassSectors.length}deg, transparent ${360/tasteCompassSectors.length}deg)`,
                      clipPath: `polygon(50% 50%, ${50 + 45 * Math.cos((angle - 90) * Math.PI / 180)}% ${50 + 45 * Math.sin((angle - 90) * Math.PI / 180)}%, ${50 + 45 * Math.cos((nextAngle - 90) * Math.PI / 180)}% ${50 + 45 * Math.sin((nextAngle - 90) * Math.PI / 180)}%)`
                    }}
                  >
                    <span 
                      className="text-lg font-bold"
                      style={{
                        transform: `rotate(${angle + (360/tasteCompassSectors.length)/2}deg)`,
                        transformOrigin: 'center'
                      }}
                    >
                      {sector.name}
                    </span>
                  </div>
                );
              })}
            </div>
            
            {/* Compass Label */}
            <div className="absolute -bottom-6 -right-6 bg-cream-light text-forest-dark px-4 py-2 rounded-lg font-semibold">
              Taste compass
            </div>
          </div>

          {/* How It Works */}
          <div className="max-w-4xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-cream-light mb-8">HOW IT WORKS</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gold-accent rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-forest-dark">))</span>
                </div>
                <h3 className="text-xl font-semibold text-cream-light mb-2">Tap NFC passport</h3>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gold-accent rounded-lg flex items-center justify-center mx-auto mb-4">
                  <div className="w-6 h-6 bg-forest-dark transform rotate-45"></div>
                </div>
                <h3 className="text-xl font-semibold text-cream-light mb-2">Collect stamps</h3>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gold-accent rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Gift className="w-8 h-8 text-forest-dark" />
                </div>
                <h3 className="text-xl font-semibold text-cream-light mb-2">Get reward</h3>
              </div>
            </div>
          </div>

          {/* Eight Zones */}
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-cream-light mb-8">Eight Zones</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {eightZones.map((zone, index) => (
                <Card key={index} className="group cursor-pointer bg-forest-medium border-gold-accent/30 hover:border-gold-accent transition-all duration-300">
                  <div className="aspect-square relative overflow-hidden rounded-t-lg">
                    <img 
                      src={`https://images.unsplash.com/${zone.image}?w=300&h=300&fit=crop`}
                      alt={zone.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="bg-cream-light text-forest-dark px-3 py-2 rounded-lg text-center font-semibold">
                      <span className="text-xl mr-2">{zone.icon}</span>
                      {zone.name}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Experience Stats */}
      <section className="py-16 bg-gradient-to-r from-earth-warm/5 to-gold-accent/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <Globe className="h-8 w-8 text-burgundy-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">6</div>
              <div className="text-sm text-muted-foreground">World Sectors</div>
            </div>
            <div>
              <Users className="h-8 w-8 text-burgundy-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">500+</div>
              <div className="text-sm text-muted-foreground">Adventures Daily</div>
            </div>
            <div>
              <Star className="h-8 w-8 text-burgundy-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">4.9</div>
              <div className="text-sm text-muted-foreground">Average Rating</div>
            </div>
            <div>
              <Clock className="h-8 w-8 text-burgundy-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">30min</div>
              <div className="text-sm text-muted-foreground">Per Adventure</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TasteCompass;