import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Smartphone, Trophy, Zap } from "lucide-react";
import ZoneCTA from "@/components/ZoneCTA";
import PWAPrompt from "@/components/PWAPrompt";
import FooterPolicy from "@/components/FooterPolicy";
import { ZONES } from "@/lib/brand";

const TasteCompassCTA = () => {
  const zones = [
    { name: "FERMENT", emoji: "🧪", color: "bg-sage-blue", slug: "ferment" },
    { name: "SMOKE", emoji: "🔥", color: "bg-terracotta", slug: "smoke" },
    { name: "SPICE", emoji: "🌶️", color: "bg-burgundy-primary", slug: "spice" },
    { name: "UMAMI", emoji: "🌊", color: "bg-forest-green", slug: "umami" },
    { name: "SWEET-SALT", emoji: "🍯", color: "bg-gold-accent", slug: "sweet-salt" },
    { name: "SOUR-HERB", emoji: "🌿", color: "bg-teal-dark", slug: "sour-herb" },
    { name: "ZERO-WASTE", emoji: "♻️", color: "bg-deep-green", slug: "zero-waste" }
  ];

  const features = [
    {
      icon: <MapPin className="w-5 h-5" />,
      title: "7 вкусовых зон",
      description: "Исследуйте уникальные тематические пространства"
    },
    {
      icon: <Smartphone className="w-5 h-5" />,
      title: "NFC-технологии",
      description: "Просто поднесите телефон к стикеру"
    },
    {
      icon: <Trophy className="w-5 h-5" />,
      title: "Эксклюзивные награды",
      description: "VIP-доступ и специальные предложения"
    }
  ];

  return (
    <section id="taste-compass-cta" className="py-20 px-5 bg-gradient-to-br from-burgundy-primary via-charcoal to-burgundy-light">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center text-cream-light mb-12 animate-fade-in">
          <Badge variant="secondary" className="mb-4 bg-mustard-accent text-charcoal-dark">
            <Zap className="w-4 h-4 mr-2" />
            Новая технология
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-mustard-accent to-gold-light bg-clip-text text-transparent">
            Начните свой Taste Quest
          </h2>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8 opacity-90">
            Сканируйте NFC-стикеры в зонах, собирайте штампы и открывайте новые вкусы Бали
          </p>
        </div>

        {/* Zone Pills with CTA */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-12 animate-scale-in">
          {zones.map((zone, index) => (
            <div key={zone.name} style={{ animationDelay: `${index * 0.1}s` }}>
              <ZoneCTA zone={zone.slug} variant="card" />
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card key={feature.title} className="bg-white/10 border-white/20 backdrop-blur-sm hover-scale animate-fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
              <CardContent className="p-6 text-center text-cream-light">
                <div className="w-12 h-12 mx-auto mb-4 bg-mustard-accent rounded-full flex items-center justify-center text-charcoal-dark">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm opacity-80">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* PWA Prompt */}
        <PWAPrompt />

        {/* Footer Policy */}
        <div className="mt-12">
          <FooterPolicy />
        </div>
      </div>
    </section>
  );
};

export default TasteCompassCTA;