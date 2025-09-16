import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { FlaskConical, Flame, Zap, Fish, Leaf, Droplet, Mountain, Sun } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const sectors = [
  { 
    id: 'ferment', 
    label: 'FERMENT', 
    icon: FlaskConical, 
    description: 'Live cultures and fermented flavors',
    color: 'hsl(var(--primary))',
    bgColor: 'bg-emerald-500',
    experiences: ['Kombucha Tasting', 'Kimchi Making', 'Fermented Sauce Bar']
  },
  { 
    id: 'smoke', 
    label: 'SMOKE', 
    icon: Flame, 
    description: 'Ancient fire cooking traditions',
    color: 'hsl(var(--destructive))',
    bgColor: 'bg-orange-500',
    experiences: ['BBQ Station', 'Wood-fired Pizza', 'Smoked Fish']
  },
  { 
    id: 'spice', 
    label: 'SPICE', 
    icon: Zap, 
    description: 'Spice route exploration',
    color: 'hsl(var(--warning))',
    bgColor: 'bg-red-500',
    experiences: ['Spice Blending', 'Heat Challenge', 'Curry Workshop']
  },
  { 
    id: 'umami', 
    label: 'UMAMI', 
    icon: Fish, 
    description: 'Fifth taste discovery',
    color: 'hsl(var(--secondary))',
    bgColor: 'bg-blue-500',
    experiences: ['Dashi Tasting', 'Mushroom Lab', 'Aged Cheese']
  },
  { 
    id: 'herb', 
    label: 'HERB', 
    icon: Leaf, 
    description: 'Fresh garden aromatics',
    color: 'hsl(var(--success))',
    bgColor: 'bg-green-500',
    experiences: ['Herb Garden Tour', 'Tea Blending', 'Essential Oils']
  },
  { 
    id: 'sweet', 
    label: 'SWEET', 
    icon: Sun, 
    description: 'Natural sweetness journey',
    color: 'hsl(var(--accent))',
    bgColor: 'bg-yellow-500',
    experiences: ['Honey Tasting', 'Raw Desserts', 'Fruit Laboratory']
  },
  { 
    id: 'salt', 
    label: 'SALT', 
    icon: Mountain, 
    description: 'Mineral and volcanic salts',
    color: 'hsl(var(--muted-foreground))',
    bgColor: 'bg-gray-500',
    experiences: ['Salt Tasting', 'Mineral Water', 'Curing Station']
  },
  { 
    id: 'sour', 
    label: 'SOUR', 
    icon: Droplet, 
    description: 'Acidic and citrus exploration',
    color: 'hsl(var(--info))',
    bgColor: 'bg-lime-500',
    experiences: ['Citrus Bar', 'Vinegar Lab', 'Fermented Fruits']
  },
];

const TasteCompassInteractive = () => {
  const [activeSectors, setActiveSectors] = useState<string[]>([]);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [questStarted, setQuestStarted] = useState(false);
  const { toast } = useToast();

  const toggleSector = (id: string) => {
    setActiveSectors(prev => {
      const newActive = prev.includes(id) 
        ? prev.filter(s => s !== id)
        : [...prev, id];
      
      if (!prev.includes(id)) {
        const sector = sectors.find(s => s.id === id);
        toast({
          title: `${sector?.label} Sector Activated!`,
          description: `Discover ${sector?.description}`,
        });
      }
      
      return newActive;
    });
  };

  const progress = (activeSectors.length / sectors.length) * 100;
  const isQuestComplete = activeSectors.length === sectors.length;

  useEffect(() => {
    if (isQuestComplete && questStarted) {
      toast({
        title: "🎉 Quest Complete!",
        description: "You've unlocked the Chef's Table experience!",
      });
    }
  }, [isQuestComplete, questStarted, toast]);

  const startQuest = () => {
    setQuestStarted(true);
    setActiveSectors([]);
    toast({
      title: "Taste Quest Started!",
      description: "Explore all 8 sectors to unlock rewards",
    });
  };

  const resetQuest = () => {
    setActiveSectors([]);
    setSelectedSector(null);
    setQuestStarted(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Interactive Taste Compass
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Click on sectors to explore different flavor profiles and unlock exclusive experiences
        </p>
      </div>

      {/* Progress Bar */}
      {questStarted && (
        <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">Quest Progress</span>
                <span className="text-sm text-muted-foreground">
                  {activeSectors.length}/{sectors.length} sectors
                </span>
              </div>
              <Progress value={progress} className="h-3" />
              <div className="text-center text-sm">
                {Math.round(progress)}% Complete
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sectors Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {sectors.map(sector => {
          const IconComponent = sector.icon;
          const isActive = activeSectors.includes(sector.id);
          const isSelected = selectedSector === sector.id;
          
          return (
            <Card 
              key={sector.id}
              className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                isActive ? 'ring-2 ring-primary shadow-lg' : ''
              } ${isSelected ? 'bg-primary/5' : ''}`}
              onClick={() => {
                toggleSector(sector.id);
                setSelectedSector(isSelected ? null : sector.id);
              }}
            >
              <CardContent className="p-6 text-center space-y-3">
                <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
                  isActive ? sector.bgColor : 'bg-muted'
                } transition-colors duration-300`}>
                  <IconComponent 
                    size={28} 
                    className={isActive ? 'text-white' : 'text-muted-foreground'} 
                  />
                </div>
                <div>
                  <h3 className="font-bold text-sm">{sector.label}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {sector.description}
                  </p>
                </div>
                {isActive && (
                  <Badge variant="secondary" className="text-xs">
                    Explored
                  </Badge>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Selected Sector Details */}
      {selectedSector && (
        <Card className="border-primary/20">
          {(() => {
            const sector = sectors.find(s => s.id === selectedSector);
            if (!sector) return null;
            
            return (
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <sector.icon className="h-6 w-6" style={{ color: sector.color }} />
                  {sector.label} Sector
                </CardTitle>
                <div className="space-y-3">
                  <p className="text-muted-foreground">{sector.description}</p>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Available Experiences:</h4>
                    <div className="flex flex-wrap gap-2">
                      {sector.experiences.map((exp, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {exp}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardHeader>
            );
          })()}
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        {!questStarted ? (
          <Button onClick={startQuest} size="lg" className="bg-primary hover:bg-primary/90">
            Start Taste Quest
          </Button>
        ) : (
          <Button onClick={resetQuest} variant="outline" size="lg">
            Reset Quest
          </Button>
        )}
      </div>

      {/* Completion Reward */}
      {isQuestComplete && questStarted && (
        <Card className="border-primary bg-gradient-to-r from-primary/10 to-secondary/10">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="text-4xl">🎉</div>
            <h3 className="text-xl font-bold text-primary">
              Congratulations! Quest Complete!
            </h3>
            <p className="text-muted-foreground">
              You've explored all flavor profiles. You've unlocked exclusive access to our Chef's Table experience.
            </p>
            <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
              Book Chef's Table Experience
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TasteCompassInteractive;