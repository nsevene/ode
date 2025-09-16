import React from 'react';
import ImprovedNavigation from '@/components/ImprovedNavigation';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { MapPin, Wine, ChefHat, Users, Calendar } from 'lucide-react';

const Experiences = () => {
  const isMobile = useIsMobile();

  const experiences = [
    {
      id: 'taste-alley',
      title: 'Taste Alley',
      description: '8 секторов кулинарного квеста с NFC-паспортами',
      image: '/lovable-uploads/72f429cb-e3f6-44d1-a685-dd4002161507.png',
      href: '/taste-quest',
      icon: MapPin,
      badge: 'NFC',
      features: ['8 цветных арок', 'NFC-паспорта', 'Скидки на Chef\'s Table', 'VIP-подарки']
    },
    {
      id: 'wine-staircase',
      title: 'Wine Staircase',
      description: 'Арт-инсталляция с винными дегустациями',
      image: '/lovable-uploads/9ca55f6a-7071-45b6-9db4-8adf9147c448.png',
      href: '/wine-staircase',
      icon: Wine,
      features: ['Арт-инсталляция', 'Винные дегустации', '20 м² уникального пространства']
    },
    {
      id: 'chefs-table',
      title: "Chef's Table",
      description: '6-course эксклюзивный кулинарный опыт',
      image: '/lovable-uploads/0978f285-021e-4828-b1fd-747c3759c976.png',
      href: '/chefs-table',
      icon: ChefHat,
      badge: 'VIP',
      features: ['6 блюд', 'Эксклюзивный опыт', 'Время: 17:00-19:30']
    },
    {
      id: 'lounge',
      title: 'Lounge & Hookah',
      description: 'Zero-proof коктейли и кальяны',
      image: '/lovable-uploads/5a02d773-9b89-4a29-ac97-07e8608431ef.png',
      href: '/lounge',
      icon: Users,
      features: ['Zero-proof коктейли', 'Кальяны', '90 м² пространства']
    },
    {
      id: 'live-music',
      title: 'Live Music',
      description: 'Живая музыка в Taste Garden',
      image: '/lovable-uploads/a31197e2-d494-49db-812f-2c7a870c67e6.png',
      href: '/events',
      icon: Calendar,
      features: ['Время: 19:30-22:00', 'Taste Garden', 'Живые выступления']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pure-white via-cream-light to-cream-medium/30">
      <ImprovedNavigation />
      
      <main className={`${isMobile ? 'pb-20' : ''}`}>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-forest-green to-sage-blue text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Culinary Experiences
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
                Погрузитесь в уникальные кулинарные опыты ODE Food Hall
              </p>
            </div>
          </div>
        </section>

        {/* Experiences Grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {experiences.map((experience) => (
                <Card key={experience.id} className="group hover:shadow-xl transition-all duration-300">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img 
                      src={experience.image} 
                      alt={experience.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {experience.badge && (
                      <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
                        {experience.badge}
                      </Badge>
                    )}
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <experience.icon className="w-5 h-5 text-primary" />
                      {experience.title}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      {experience.description}
                    </p>
                    
                    <div className="space-y-2 mb-6">
                      {experience.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                          {feature}
                        </div>
                      ))}
                    </div>
                    
                    <Link to={experience.href}>
                      <Button className="w-full group-hover:bg-primary/90 transition-colors">
                        Узнать больше
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Experiences;