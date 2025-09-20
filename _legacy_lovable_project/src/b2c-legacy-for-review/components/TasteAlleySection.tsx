import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  ArrowRight,
  Map,
  QrCode,
  Trophy,
  Sparkles,
  MapPin,
  Users,
  Calendar,
  Gift,
} from 'lucide-react';
import TasteAlleyHero from './taste-alley/TasteAlleyHero';
import InteractiveTasteAlley from './taste-alley/InteractiveTasteAlley';
import QuestModal from './taste-alley/QuestModal';

const TasteAlleySection = () => {
  const [showQuestModal, setShowQuestModal] = useState(false);

  const questSteps = [
    {
      id: 1,
      title: 'NFC Check-In',
      description:
        'Tap your NFC passport at the entrance to begin your journey',
      icon: <QrCode className="h-5 w-5" />,
      color: 'from-sage-blue to-teal-dark',
    },
    {
      id: 2,
      title: 'Explore Sectors',
      description:
        'Visit all 4 interactive sectors and complete their challenges',
      icon: <Map className="h-5 w-5" />,
      color: 'from-forest-green to-sage-blue',
    },
    {
      id: 3,
      title: 'Collect Stamps',
      description: 'Earn digital stamps by completing sector activities',
      icon: <Trophy className="h-5 w-5" />,
      color: 'from-gold-accent to-terracotta',
    },
    {
      id: 4,
      title: 'Unlock Rewards',
      description:
        "Complete all sectors to unlock exclusive Chef's Table access",
      icon: <Sparkles className="h-5 w-5" />,
      color: 'from-burgundy-primary to-dusty-rose',
    },
  ];

  const features = [
    {
      title: 'NFC Passport',
      description:
        'Smart tracking system that records your progress through each sector',
      icon: <QrCode className="h-6 w-6 text-sage-blue" />,
    },
    {
      title: 'Interactive AR',
      description:
        'Augmented reality experiences that bring the spice route to life',
      icon: <Sparkles className="h-6 w-6 text-burgundy-primary" />,
    },
    {
      title: 'Multi-Sensory',
      description: 'Engage all your senses with taste, smell, sound, and touch',
      icon: <Map className="h-6 w-6 text-forest-green" />,
    },
    {
      title: "Chef's Table",
      description:
        'Exclusive access to private dining experience upon completion',
      icon: <Trophy className="h-6 w-6 text-gold-accent" />,
    },
  ];

  return (
    <section
      id="taste-alley"
      aria-label="Taste Alley interactive experience"
      className="py-20 bg-gradient-subtle"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section with Atmospheric Images */}
        <TasteAlleyHero onStartQuest={() => setShowQuestModal(true)} />

        {/* Interactive Component */}
        <InteractiveTasteAlley />

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="group hover:shadow-elegant transition-all duration-300 bg-pure-white/90 backdrop-blur-sm border-cream-medium"
            >
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-gradient-light rounded-full group-hover:bg-gradient-accent transition-all duration-300">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-charcoal">
                  {feature.title}
                </h3>
                <p className="text-sm text-charcoal/70">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-20 text-center">
          <Card className="bg-gradient-primary text-white border-0 shadow-elegant">
            <CardContent className="p-8">
              <div className="max-w-2xl mx-auto">
                <Gift className="h-16 w-16 mx-auto mb-4 opacity-90" />
                <h3 className="text-3xl font-bold mb-4">
                  Complete Your Quest, Unlock Exclusive Rewards
                </h3>
                <p className="text-cream-light mb-6 text-lg">
                  Master all 4 sectors to earn your place at our exclusive
                  Chef's Table, complete with wine pairings and personalized
                  tasting menu.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    className="bg-pure-white text-burgundy-primary hover:bg-cream-light"
                    onClick={() => setShowQuestModal(true)}
                  >
                    <Trophy className="h-5 w-5 mr-2" />
                    View Quest Details
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-pure-white text-pure-white hover:bg-pure-white/10"
                  >
                    <Users className="h-5 w-5 mr-2" />
                    Join 1,247 Adventurers
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quest Modal */}
      <QuestModal
        isOpen={showQuestModal}
        onClose={setShowQuestModal}
        questSteps={questSteps}
      />
    </section>
  );
};

export default TasteAlleySection;
