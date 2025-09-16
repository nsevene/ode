
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wine, MapPin, Calendar, Users } from "lucide-react";
import { SEOHead } from "@/components/seo/SEOHead";
import { useSEO } from "@/hooks/useSEO";
import ImprovedNavigation from "@/components/ImprovedNavigation";
import TimeslotBooking from "@/components/TimeslotBooking";
import PolicyBadges from "@/components/PolicyBadges";
import AgeGate21 from "@/components/AgeGate21";
import Price from "@/components/Price";

import { useIsMobile } from "@/hooks/use-mobile";

const WineStaircase = () => {
  const { t } = useTranslation();
  const [showUpsell, setShowUpsell] = useState(false);
  const [upsellItems, setUpsellItems] = useState<any[]>([]);
  const isMobile = useIsMobile();
  const { getPageData } = useSEO();
  const pageData = getPageData('/wine-staircase');

  const handleBookingClick = () => {
    setShowUpsell(true);
  };

  const handleUpsellAdd = (item: any) => {
    setUpsellItems(prev => [...prev, item]);
  };
  
  const features = [
    {
      icon: <Wine className="h-8 w-8 text-gold-accent" />,
      title: "Терруарное сравнение",
      description: "На каждом пролёте — полка с бутылками двух терруаров (например, «Сицилия vs Атакама»). Поднимаешься — сравниваешь стили, чувствуешь разницу климата и почв."
    },
    {
      icon: <MapPin className="h-8 w-8 text-gold-accent" />,
      title: "Цена себестоимости",
      description: "Цена — себестоимость бутылки + небольшой corkage-fee за сервис сомелье. Честное ценообразование для истинных ценителей вина."
    },
    {
      icon: <Users className="h-8 w-8 text-gold-accent" />,
      title: "Приватные дегустации",
      description: "Захотелось приват? Забронируй целый марш и собери вертикальную дегустацию от молодого Sauvignon до выдержанного Sauternes."
    },
    {
      icon: <Calendar className="h-8 w-8 text-gold-accent" />,
      title: "Винтажные коллекции",
      description: "Специальные тематические вечера с редкими винтажами и авторскими парингами от наших сомелье."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <AgeGate21 />
      <SEOHead 
        title={pageData.title}
        description={pageData.description}
        keywords={pageData.keywords}
        image={pageData.image}
        type={pageData.type}
        experienceType="Wine Staircase"
        price="Себестоимость + corkage"
        availability="Ежедневно 17:00-23:00"
      />
      
      <ImprovedNavigation />
      
      {/* Hero Section */}
      <section className={`relative ${isMobile ? 'min-h-screen pt-20 pb-20' : 'h-screen'} flex items-center justify-center overflow-hidden`}>
        <div className="absolute inset-0 z-0">
          <div 
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('/lovable-uploads/72f429cb-e3f6-44d1-a685-dd4002161507.png')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-burgundy-primary/70 to-earth-warm/50"></div>
        </div>
        
        <div className={`relative z-10 text-center text-white max-w-4xl mx-auto px-4 ${isMobile ? 'pb-16' : ''}`}>
          <h1 className={`${isMobile ? 'text-3xl' : 'text-5xl md:text-7xl'} font-bold mb-4 md:mb-6 leading-tight`}>
            Wine Staircase
          </h1>
          <div className="mb-6">
            <PolicyBadges bottlesOnly noRetail noBYO age21 serviceFee5 />
          </div>
          <p className={`${isMobile ? 'text-lg' : 'text-2xl md:text-3xl'} mb-6 md:mb-8 font-light`}>
            винная лестница открытий
          </p>
          <p className={`${isMobile ? 'text-base' : 'text-xl'} mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed opacity-90`}>
            Мы превратили дегустацию в восхождение: на каждом пролёте винтовой лестницы — 
            полка с бутылками двух терруаров. Поднимаешься — сравниваешь стили, 
            чувствуешь разницу климата и почв.
          </p>
          <div className={`flex ${isMobile ? 'flex-col' : 'flex-col sm:flex-row'} gap-4 justify-center ${isMobile ? 'w-full' : 'max-w-lg mx-auto'}`} onClick={handleBookingClick}>
            <TimeslotBooking 
              experienceType="wine-staircase"
              experienceTitle="Wine Staircase Tasting"
              maxGuests={6}
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={`${isMobile ? 'py-12 pb-20' : 'py-20'} bg-gradient-to-b from-background to-earth-light/20`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center ${isMobile ? 'mb-8' : 'mb-16'}`}>
            <h2 className={`${isMobile ? 'text-2xl' : 'text-4xl md:text-5xl'} font-bold text-foreground mb-4 md:mb-6`}>
              Уникальный <span className="bg-gradient-to-r from-burgundy-primary to-gold-accent bg-clip-text text-transparent">винный опыт</span>
            </h2>
            <p className={`${isMobile ? 'text-base' : 'text-xl'} text-muted-foreground max-w-3xl mx-auto leading-relaxed`}>
              Каждый пролёт лестницы — это новое открытие, новый терруар, новый вкус. 
              Поднимайтесь по ступеням винного познания в атмосфере джунглей Бали.
            </p>
          </div>

          <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-1 md:grid-cols-2 gap-8'} ${isMobile ? 'mb-8' : 'mb-16'}`}>
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-[var(--shadow-tropical)] transition-all duration-500 bg-card border-gold-accent/20">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-burgundy-primary transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Wine Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div 
              className="relative h-96 bg-cover bg-center bg-no-repeat rounded-2xl overflow-hidden"
              style={{
                backgroundImage: `url('/lovable-uploads/9ca55f6a-7071-45b6-9db4-8adf9147c448.png')`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-xl font-bold mb-2">Винная стена</h3>
                <p className="text-sm opacity-90">Терруарные коллекции с QR-кодами</p>
              </div>
            </div>
            
            <div 
              className="relative h-96 bg-cover bg-center bg-no-repeat rounded-2xl overflow-hidden"
              style={{
                backgroundImage: `url('/lovable-uploads/eb0ecf72-72e4-4040-9c75-dbf57409f27d.png')`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-xl font-bold mb-2">Балийская атмосфера</h3>
                <p className="text-sm opacity-90">Аутентичный декор и винные коллекции</p>
              </div>
            </div>
          </div>

          {/* Wine Experience Details */}
          <div className="bg-gradient-to-r from-burgundy-primary/10 to-earth-warm/10 rounded-2xl p-8 border border-gold-accent/20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Как это работает?
                </h3>
                <div className="space-y-4 text-muted-foreground">
                  <p className="flex items-start space-x-3">
                    <span className="text-gold-accent font-bold">1.</span>
                    <span>Выберите пролёт лестницы с интересующим вас сравнением терруаров</span>
                  </p>
                  <p className="flex items-start space-x-3">
                    <span className="text-gold-accent font-bold">2.</span>
                    <span>Наш сомелье проведёт дегустацию и расскажет о различиях</span>
                  </p>
                  <p className="flex items-start space-x-3">
                    <span className="text-gold-accent font-bold">3.</span>
                    <span>Поднимайтесь выше для новых открытий или останьтесь на понравившемся уровне</span>
                  </p>
                  <p className="flex items-start space-x-3">
                    <span className="text-gold-accent font-bold">4.</span>
                    <span>Забронируйте целый марш для приватной вертикальной дегустации</span>
                  </p>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-burgundy-primary/20 rounded-xl p-6 border border-gold-accent/30">
                  <Wine className="h-16 w-16 text-gold-accent mx-auto mb-4" />
                  <h4 className="text-xl font-bold text-foreground mb-2">
                    Честная цена
                  </h4>
                  <p className="text-muted-foreground mb-4">
                    Себестоимость + corkage-fee
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="text-sm">
                      Примерная стоимость: <Price value={350000} showWords />
                    </div>
                  </div>
                  <Button variant="hero" size="lg" className="w-full">
                    Узнать цены
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default WineStaircase;
