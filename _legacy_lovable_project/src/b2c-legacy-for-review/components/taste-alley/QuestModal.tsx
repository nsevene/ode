import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QrCode, Award, Map, Trophy, Calendar } from 'lucide-react';
import QuestStepsCard from './QuestStepsCard';
import QuestProgressBar from './QuestProgressBar';
import InteractiveSectorCards from './InteractiveSectorCards';
import TasteAlleyBooking from './TasteAlleyBooking';
import { useState } from 'react';

interface QuestStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  completed?: boolean;
  current?: boolean;
}

interface QuestModalProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  questSteps: QuestStep[];
}

const QuestModal = ({ isOpen, onClose, questSteps }: QuestModalProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(0);

  const sectors = [
    {
      id: 'ferment',
      title: 'FERMENT Sector',
      emoji: '🧪',
      description:
        'Discover the ancient art of fermentation with interactive displays and taste experiences.',
      color: 'from-emerald-500 to-teal-600',
      experiences: [
        'Kombucha Station',
        'Fermented Foods Tasting',
        'Microbe Microscopy',
        'Traditional Techniques',
      ],
      isUnlocked: true,
      isCompleted: completedSteps > 0,
    },
    {
      id: 'smoke',
      title: 'SMOKE Sector',
      emoji: '🔥',
      description:
        'Experience traditional smoking techniques and their aromatic journey through time.',
      color: 'from-orange-500 to-red-600',
      experiences: [
        'Smoke Chamber',
        'Aromatic Journey',
        'Traditional Tools',
        'Flavor Profiles',
      ],
      isUnlocked: completedSteps >= 1,
      isCompleted: completedSteps > 1,
    },
    {
      id: 'spice',
      title: 'SPICE Sector',
      emoji: '🌶️',
      description:
        'Navigate the historic spice routes with AR-guided storytelling and sensory experiences.',
      color: 'from-red-500 to-pink-600',
      experiences: [
        'Spice Route AR',
        'Sensory Garden',
        'Historical Timeline',
        'Grinding Station',
      ],
      isUnlocked: completedSteps >= 2,
      isCompleted: completedSteps > 2,
    },
    {
      id: 'umami',
      title: 'UMAMI Sector',
      emoji: '🐟',
      description:
        'Unlock the secrets of the fifth taste through interactive culinary demonstrations.',
      color: 'from-blue-500 to-purple-600',
      experiences: [
        'Taste Laboratory',
        'Umami Foods',
        'Molecular Gastronomy',
        'Chef Demonstration',
      ],
      isUnlocked: completedSteps >= 3,
      isCompleted: completedSteps > 3,
    },
  ];

  const handleSectorClick = (sectorId: string) => {
    console.log(`Clicked sector: ${sectorId}`);
    // Here you would handle the sector interaction
  };

  const handleBookingComplete = (bookingData: any) => {
    console.log('Booking completed:', bookingData);
    // You could close the modal or show a success message
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Taste Quest Journey
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Map className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="sectors" className="flex items-center gap-2">
              <QrCode className="h-4 w-4" />
              Sectors
            </TabsTrigger>
            <TabsTrigger value="booking" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Booking
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Progress
            </TabsTrigger>
            <TabsTrigger value="rewards" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              Rewards
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quest Overview */}
            <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-emerald-600 rounded-full">
                    <QrCode className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-emerald-800">
                      Interactive Passport System
                    </h3>
                    <p className="text-emerald-600">
                      Collect stamps, earn rewards, unlock experiences
                    </p>
                  </div>
                </div>
                <p className="text-sm text-emerald-700">
                  Navigate through 4 unique zones, each offering distinct
                  flavors, stories, and interactive elements. Complete your
                  journey to unlock exclusive dining experiences and prizes.
                </p>
              </CardContent>
            </Card>

            {/* Quest Steps */}
            <QuestStepsCard questSteps={questSteps} />
          </TabsContent>

          <TabsContent value="sectors">
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">Interactive Sectors</h3>
                <p className="text-muted-foreground">
                  Explore each sector to unlock unique experiences
                </p>
              </div>
              <InteractiveSectorCards
                sectors={sectors}
                onSectorClick={handleSectorClick}
              />
            </div>
          </TabsContent>

          <TabsContent value="booking">
            <TasteAlleyBooking onBookingComplete={handleBookingComplete} />
          </TabsContent>

          <TabsContent value="progress">
            <QuestProgressBar
              questSteps={questSteps.map((step, index) => ({
                ...step,
                completed: index < completedSteps,
                current: index === currentStep,
              }))}
              currentStep={currentStep}
              completedSteps={completedSteps}
            />
          </TabsContent>

          <TabsContent value="rewards">
            {/* Completion Reward */}
            <Card className="bg-gradient-to-r from-gold-accent/20 to-burgundy-primary/20 border-gold-accent/30">
              <CardContent className="p-6 text-center">
                <Award className="h-12 w-12 text-gold-accent mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">
                  Quest Completion Reward
                </h3>
                <p className="text-muted-foreground mb-4">
                  Complete all 4 steps to unlock exclusive dining experiences,
                  special discounts, and collector's items at ODE Food Hall!
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="p-4 bg-white rounded-lg border">
                    <h4 className="font-semibold mb-2">🎁 Exclusive Access</h4>
                    <p className="text-sm text-muted-foreground">
                      Priority booking for special events
                    </p>
                  </div>
                  <div className="p-4 bg-white rounded-lg border">
                    <h4 className="font-semibold mb-2">💰 Special Discounts</h4>
                    <p className="text-sm text-muted-foreground">
                      20% off your next dining experience
                    </p>
                  </div>
                  <div className="p-4 bg-white rounded-lg border">
                    <h4 className="font-semibold mb-2">🏆 Collector's Items</h4>
                    <p className="text-sm text-muted-foreground">
                      Limited edition Taste Alley merchandise
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default QuestModal;
