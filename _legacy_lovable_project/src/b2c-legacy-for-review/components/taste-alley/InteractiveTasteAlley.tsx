import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  MapPin,
  Trophy,
  Compass,
  Play,
  Users,
  Clock,
  Star,
  Target,
  HelpCircle,
  Share2,
  Gift,
} from 'lucide-react';
import GamifiedQuestProgress from './GamifiedQuestProgress';
import AnimatedSectorCard from './AnimatedSectorCard';
import InteractiveMap from './InteractiveMap';
import TutorialModal from './TutorialModal';
import FloatingActionButton from './FloatingActionButton';
import AnimatedCounter from './AnimatedCounter';
import AnimatedProgressBar from './AnimatedProgressBar';
import { useTutorial } from '@/hooks/useTutorial';

const InteractiveTasteAlley = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [activeTab, setActiveTab] = useState('quest');
  const {
    showTutorial,
    tutorialCompleted,
    startTutorial,
    closeTutorial,
    completeTutorial,
  } = useTutorial();

  const sectors = [
    {
      id: 'ferment',
      title: 'FERMENT',
      emoji: '🧪',
      description:
        'Discover the ancient art of fermentation through interactive displays and taste experiences.',
      experiences: [
        'Kombucha Station',
        'Fermented Foods',
        'Microbe Microscopy',
        'Traditional Techniques',
      ],
      isUnlocked: true,
      isCompleted: true,
      isActive: false,
    },
    {
      id: 'smoke',
      title: 'SMOKE',
      emoji: '🔥',
      description:
        'Experience traditional smoking techniques and their aromatic journey through time.',
      experiences: [
        'Smoke Chamber',
        'Aromatic Journey',
        'Traditional Tools',
        'Flavor Profiles',
      ],
      isUnlocked: true,
      isCompleted: false,
      isActive: true,
    },
    {
      id: 'spice',
      title: 'SPICE',
      emoji: '🌶️',
      description:
        'Navigate the historic spice routes with AR-guided storytelling.',
      experiences: [
        'Spice Route AR',
        'Sensory Garden',
        'Historical Timeline',
        'Grinding Station',
      ],
      isUnlocked: false,
      isCompleted: false,
      isActive: false,
    },
    {
      id: 'umami',
      title: 'UMAMI',
      emoji: '🐟',
      description:
        'Unlock the secrets of the fifth taste through interactive demonstrations.',
      experiences: [
        'Taste Laboratory',
        'Umami Foods',
        'Molecular Gastronomy',
        'Chef Demo',
      ],
      isUnlocked: false,
      isCompleted: false,
      isActive: false,
    },
  ];

  const mapSectors = sectors.map((sector, index) => ({
    id: sector.id,
    name: sector.title,
    position: {
      x: 60 + index * 80,
      y: 100 + Math.sin(index * 0.8) * 30,
    },
    status: (sector.isCompleted
      ? 'completed'
      : sector.isActive
        ? 'active'
        : sector.isUnlocked
          ? 'unlocked'
          : 'locked') as 'completed' | 'active' | 'unlocked' | 'locked',
    emoji: sector.emoji,
  }));

  const handleSectorClick = (sectorId: string) => {
    console.log('Sector clicked:', sectorId);
    // Handle sector interaction
  };

  const handleMapSectorClick = (sectorId: string) => {
    console.log('Map sector clicked:', sectorId);
    // Handle map sector interaction
  };

  const handleShareClick = () => {
    setActiveTab('quest');
    // Additional share logic if needed
  };

  const handleRewardsClick = () => {
    setActiveTab('quest');
    // Additional rewards logic if needed
  };

  return (
    <div className="space-y-8 relative">
      {/* Tutorial Modal */}
      <TutorialModal
        isOpen={showTutorial}
        onClose={closeTutorial}
        onComplete={completeTutorial}
      />

      {/* Header with Enhanced Animation */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-4 mb-4">
          <h2 className="text-3xl font-bold transition-all duration-300 hover:scale-105">
            Interactive{' '}
            <span className="bg-gradient-to-r from-burgundy-primary to-terracotta bg-clip-text text-transparent">
              Taste Quest
            </span>
          </h2>

          {tutorialCompleted && (
            <Button
              variant="outline"
              size="sm"
              onClick={startTutorial}
              className="flex items-center gap-2 transition-all duration-300 hover:scale-105"
            >
              <HelpCircle className="h-4 w-4" />
              Помощь
            </Button>
          )}
        </div>

        <p className="text-muted-foreground max-w-2xl mx-auto transition-all duration-300">
          Experience an immersive journey through 4 interactive sectors, each
          offering unique flavors, stories, and challenges that will unlock
          exclusive rewards and achievements.
        </p>
      </div>

      {/* Progress Overview */}
      <div className="max-w-2xl mx-auto">
        <AnimatedProgressBar
          value={sectors.filter((s) => s.isCompleted).length}
          max={sectors.length}
          label="Quest Progress"
          className="mb-4"
        />
      </div>

      {/* Interactive Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger
            value="quest"
            className="flex items-center gap-2 transition-all duration-300"
          >
            <Trophy className="h-4 w-4" />
            Gamified Quest
          </TabsTrigger>
          <TabsTrigger
            value="sectors"
            className="flex items-center gap-2 transition-all duration-300"
          >
            <Play className="h-4 w-4" />
            Sectors
          </TabsTrigger>
          <TabsTrigger
            value="map"
            className="flex items-center gap-2 transition-all duration-300"
          >
            <MapPin className="h-4 w-4" />
            Interactive Map
          </TabsTrigger>
        </TabsList>

        <TabsContent value="quest" className="space-y-6 animate-fade-in">
          <GamifiedQuestProgress />
        </TabsContent>

        <TabsContent value="sectors" className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sectors.map((sector, index) => (
              <div
                key={sector.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <AnimatedSectorCard
                  id={sector.id}
                  title={sector.title}
                  emoji={sector.emoji}
                  description={sector.description}
                  experiences={sector.experiences}
                  isUnlocked={sector.isUnlocked}
                  isCompleted={sector.isCompleted}
                  isActive={sector.isActive}
                  onClick={() => handleSectorClick(sector.id)}
                />
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="map" className="space-y-6 animate-fade-in">
          <InteractiveMap
            sectors={mapSectors}
            onSectorClick={handleMapSectorClick}
          />
        </TabsContent>
      </Tabs>

      {/* Enhanced Stats Bar */}
      <Card className="bg-gradient-light border-cream-medium transition-all duration-300 hover:shadow-elegant">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-center">
            <div className="space-y-2 group">
              <div className="flex items-center justify-center gap-1 transition-all duration-300 group-hover:scale-110">
                <Users className="h-5 w-5 text-forest-green" />
                <AnimatedCounter
                  value={1247}
                  className="text-2xl text-forest-green"
                />
              </div>
              <p className="text-sm text-charcoal/70">Adventurers</p>
            </div>
            <div className="space-y-2 group">
              <div className="flex items-center justify-center gap-1 transition-all duration-300 group-hover:scale-110">
                <Trophy className="h-5 w-5 text-gold-accent" />
                <AnimatedCounter
                  value={4}
                  className="text-2xl text-gold-accent"
                />
              </div>
              <p className="text-sm text-charcoal/70">Sectors</p>
            </div>
            <div className="space-y-2 group">
              <div className="flex items-center justify-center gap-1 transition-all duration-300 group-hover:scale-110">
                <Clock className="h-5 w-5 text-sage-blue" />
                <AnimatedCounter
                  value={45}
                  className="text-2xl text-sage-blue"
                />
              </div>
              <p className="text-sm text-charcoal/70">Minutes</p>
            </div>
            <div className="space-y-2 group">
              <div className="flex items-center justify-center gap-1 transition-all duration-300 group-hover:scale-110">
                <Target className="h-5 w-5 text-burgundy-primary" />
                <AnimatedCounter
                  value={8}
                  className="text-2xl text-burgundy-primary"
                />
              </div>
              <p className="text-sm text-charcoal/70">Challenges</p>
            </div>
            <div className="space-y-2 group">
              <div className="flex items-center justify-center gap-1 transition-all duration-300 group-hover:scale-110">
                <Star className="h-5 w-5 text-terracotta" />
                <AnimatedCounter
                  value={92}
                  className="text-2xl text-terracotta"
                />
                <span className="text-2xl font-bold text-terracotta">%</span>
              </div>
              <p className="text-sm text-charcoal/70">Completion</p>
            </div>
            <div className="space-y-2 group">
              <div className="flex items-center justify-center gap-1 transition-all duration-300 group-hover:scale-110">
                <Compass className="h-5 w-5 text-dusty-rose" />
                <AnimatedCounter
                  value={15000}
                  className="text-2xl text-dusty-rose"
                />
              </div>
              <p className="text-sm text-charcoal/70">Points Earned</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InteractiveTasteAlley;
