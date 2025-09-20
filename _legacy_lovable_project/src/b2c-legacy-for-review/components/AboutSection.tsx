import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Compass, TestTube, Music, Baby, Wine, MapPin } from 'lucide-react';
import foodOverview from '@/assets/food-overview.jpg';
import wineStaircase from '@/assets/wine-staircase.jpg';
import kidsArea from '@/assets/kids-area.jpg';

const AboutSection = () => {
  const { t } = useTranslation();

  const concepts = [
    {
      icon: <Compass className="h-8 w-8 text-forest-green" />,
      title: 'Ode to Earth',
      description: t('about.concepts.earth.description'),
      image: foodOverview,
    },
    {
      icon: <MapPin className="h-8 w-8 text-teal-dark" />,
      title: 'Ode to Journey',
      description: t('about.concepts.journey.description'),
      image: foodOverview,
    },
    {
      icon: <Wine className="h-8 w-8 text-burgundy" />,
      title: 'Ode to Night',
      description: t('about.concepts.night.description'),
      image: wineStaircase,
    },
    {
      icon: <TestTube className="h-8 w-8 text-terracotta" />,
      title: 'Ode to Bali',
      description: t('about.concepts.bali.description'),
      image: foodOverview,
    },
    {
      icon: <Compass className="h-8 w-8 text-sage-blue" />,
      title: 'Taste Compass 2.0',
      description: t('about.concepts.compass.description'),
      image: foodOverview,
    },
    {
      icon: <TestTube className="h-8 w-8 text-dusty-rose" />,
      title: 'Botanical Lab Bar',
      description: t('about.concepts.lab.description'),
      image: foodOverview,
    },
  ];

  return (
    <section
      id="about"
      className="py-20 bg-gradient-to-b from-pure-white to-cream-light/30"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-charcoal mb-6">
            {t('about.philosophy')}{' '}
            <span className="bg-gradient-to-r from-forest-green to-teal-dark bg-clip-text text-transparent">
              ODE
            </span>
          </h2>
          <p className="text-xl text-charcoal/70 max-w-3xl mx-auto leading-relaxed mb-12">
            {t('about.description')}
          </p>
        </div>

        {/* Concepts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {concepts.map((concept) => (
            <Card
              key={concept.title}
              className="group hover:shadow-medium transition-all duration-500 bg-pure-white border-cream-medium overflow-hidden"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={concept.image}
                  alt={concept.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent opacity-60"></div>
                <div className="absolute bottom-4 left-4">{concept.icon}</div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-charcoal mb-3 group-hover:text-forest-green transition-colors">
                  {concept.title}
                </h3>
                <p className="text-charcoal/70 leading-relaxed">
                  {concept.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-sage-blue/20 to-cream-medium/30 rounded-2xl p-8 border border-cream-medium">
          <h3 className="text-2xl font-bold text-charcoal mb-4">
            {t('about.cta.title')}
          </h3>
          <p className="text-charcoal/70 mb-6 max-w-2xl mx-auto">
            {t('about.cta.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-forest-green hover:bg-forest-green/90 text-white"
            >
              START YOUR TASTE QUEST
            </Button>
            <Button variant="outline" size="lg">
              Taste Compass 2.0
            </Button>
            <Button variant="outline" size="lg">
              Wine & Light Staircase
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
