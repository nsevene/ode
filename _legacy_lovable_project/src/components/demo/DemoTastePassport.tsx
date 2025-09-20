import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Award, Star, CheckCircle, Lock, QrCode } from 'lucide-react';
import { track } from '@/lib/analytics';

const DemoTastePassport = () => {
  const [completedMissions, setCompletedMissions] = useState<string[]>([]);
  const [collectedBadges, setCollectedBadges] = useState<string[]>([]);

  const demoMissions = [
    {
      id: 'spice-explorer',
      title: 'Spice Zone Explorer',
      description:
        "Visit the Spice Sector and try a dish with 'Medium' or higher spice level",
      zone: 'Spice Sector',
      reward: 'Fire Walker Badge',
      points: 50,
      difficulty: 'Easy',
      instructions:
        'Order any dish from Spicy Asia Corner with Medium+ spice level',
      completed: false,
    },
    {
      id: 'fermentation-finder',
      title: 'Fermentation Finder',
      description: 'Discover fermented foods in our Ferment Sector',
      zone: 'Ferment Sector',
      reward: 'Culture Curator Badge',
      points: 75,
      difficulty: 'Medium',
      instructions:
        'Try kimchi, kombucha, or aged cheese from participating vendors',
      completed: false,
    },
    {
      id: 'secret-menu',
      title: 'Hidden Menu Master',
      description: 'Unlock the secret menu by completing 2+ missions',
      zone: 'All Zones',
      reward: 'VIP Access Badge + 20% Off',
      points: 100,
      difficulty: 'Challenge',
      instructions: 'Complete 2 other missions to unlock exclusive dishes',
      completed: false,
      locked: true,
    },
  ];

  const handleMissionComplete = (missionId: string) => {
    if (!completedMissions.includes(missionId)) {
      const mission = demoMissions.find((m) => m.id === missionId);
      setCompletedMissions([...completedMissions, missionId]);
      if (mission) {
        setCollectedBadges([...collectedBadges, mission.reward]);
        track('taste_passport_mission_complete', {
          mission_id: missionId,
          mission_title: mission.title,
          points: mission.points,
        });
      }

      // Auto-unlock secret mission if 2+ missions completed
      if (completedMissions.length >= 1) {
        // Will be 2 after this completion
        setTimeout(() => {
          setCompletedMissions((prev) => [...prev, 'secret-menu']);
          setCollectedBadges((prev) => [...prev, 'VIP Access Badge + 20% Off']);
        }, 1500);
      }
    }
  };

  const getTotalPoints = () => {
    return demoMissions
      .filter((mission) => completedMissions.includes(mission.id))
      .reduce((total, mission) => total + mission.points, 0);
  };

  const getProgressPercentage = () => {
    return (completedMissions.length / demoMissions.length) * 100;
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-charcoal-dark mb-3">
          Taste Passport Demo
        </h2>
        <p className="text-charcoal-medium max-w-2xl mx-auto">
          Complete culinary missions across our taste zones to earn badges and
          unlock exclusive rewards. This is a gamified dining experience that
          encourages exploration.
        </p>
      </div>

      {/* Progress Overview */}
      <Card className="bg-gradient-to-r from-burgundy-primary to-burgundy-dark text-pure-white">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">Your Progress</h3>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div>
                <div className="text-2xl font-bold">
                  {completedMissions.length}
                </div>
                <div className="text-sm text-burgundy-light">
                  Missions Complete
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold">{getTotalPoints()}</div>
                <div className="text-sm text-burgundy-light">Points Earned</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {collectedBadges.length}
                </div>
                <div className="text-sm text-burgundy-light">
                  Badges Collected
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="w-full bg-burgundy-dark rounded-full h-2">
                <div
                  className="bg-mustard-accent h-2 rounded-full transition-all duration-500"
                  style={{ width: `${getProgressPercentage()}%` }}
                />
              </div>
              <div className="text-sm text-burgundy-light mt-1">
                {Math.round(getProgressPercentage())}% Complete
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Missions Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {demoMissions.map((mission) => {
          const isCompleted = completedMissions.includes(mission.id);
          const isLocked = mission.locked && completedMissions.length < 2;

          return (
            <Card
              key={mission.id}
              className={`bg-pure-white/80 backdrop-blur border transition-all ${
                isCompleted
                  ? 'border-green-300 bg-green-50/80'
                  : isLocked
                    ? 'border-gray-200 opacity-60'
                    : 'border-cream-medium hover:border-burgundy-primary/30'
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : isLocked ? (
                      <Lock className="w-5 h-5 text-gray-400" />
                    ) : (
                      <MapPin className="w-5 h-5 text-burgundy-primary" />
                    )}
                    <Badge
                      variant={
                        mission.difficulty === 'Easy'
                          ? 'secondary'
                          : mission.difficulty === 'Medium'
                            ? 'default'
                            : 'destructive'
                      }
                      className="text-xs"
                    >
                      {mission.difficulty}
                    </Badge>
                  </div>
                  <div className="text-sm font-bold text-burgundy-primary">
                    +{mission.points} pts
                  </div>
                </div>

                <h4 className="font-semibold text-charcoal-dark mb-2">
                  {mission.title}
                </h4>
                <p className="text-sm text-charcoal-medium mb-3">
                  {mission.description}
                </p>

                <div className="flex items-center gap-2 text-xs text-charcoal-medium mb-3">
                  <MapPin className="w-3 h-3" />
                  {mission.zone}
                </div>

                <div className="bg-cream-light/50 rounded-lg p-3 mb-4">
                  <div className="text-xs font-medium text-charcoal-dark mb-1">
                    Instructions:
                  </div>
                  <div className="text-xs text-charcoal-medium">
                    {mission.instructions}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-mustard-dark">
                    <Award className="w-3 h-3" />
                    {mission.reward}
                  </div>

                  {!isCompleted && !isLocked && (
                    <Button
                      size="sm"
                      onClick={() => handleMissionComplete(mission.id)}
                      className="bg-burgundy-primary hover:bg-burgundy-dark text-pure-white"
                    >
                      <QrCode className="w-3 h-3 mr-1" />
                      Complete
                    </Button>
                  )}

                  {isCompleted && (
                    <Badge className="bg-green-100 text-green-700">
                      Completed ✓
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Collected Badges */}
      {collectedBadges.length > 0 && (
        <Card className="bg-mustard-accent/10 border-mustard-accent/30">
          <CardContent className="p-6">
            <h4 className="font-semibold text-charcoal-dark mb-4 text-center">
              Your Collected Badges
            </h4>
            <div className="flex flex-wrap gap-3 justify-center">
              {collectedBadges.map((badge, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-mustard-accent text-charcoal-dark px-4 py-2 rounded-full font-medium"
                >
                  <Star className="w-4 h-4" />
                  {badge}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Demo Features */}
      <div className="text-center bg-cream-light/50 rounded-lg p-6">
        <h4 className="font-semibold text-charcoal-dark mb-2">
          Real Implementation Features
        </h4>
        <p className="text-sm text-charcoal-medium mb-4">
          NFC tag scanning, GPS location verification, social sharing, loyalty
          integration, seasonal missions, and exclusive partner rewards.
        </p>
        <Button className="bg-burgundy-primary hover:bg-burgundy-dark text-pure-white">
          Continue to PWA Demo →
        </Button>
      </div>
    </div>
  );
};

export default DemoTastePassport;
