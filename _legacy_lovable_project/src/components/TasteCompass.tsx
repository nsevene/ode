import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { FlaskConical, Flame, Zap, Fish } from 'lucide-react';

const sectors = [
  {
    id: 'ferment',
    label: 'FERMENT',
    icon: FlaskConical,
    description: 'Live cultures and fermented flavors',
    color: 'hsl(var(--primary))',
  },
  {
    id: 'smoke',
    label: 'SMOKE',
    icon: Flame,
    description: 'Ancient fire cooking traditions',
    color: 'hsl(var(--destructive))',
  },
  {
    id: 'spice',
    label: 'SPICE',
    icon: Zap,
    description: 'Spice route exploration',
    color: 'hsl(var(--warning))',
  },
  {
    id: 'umami',
    label: 'UMAMI',
    icon: Fish,
    description: 'Japanese-inspired flavors',
    color: 'hsl(var(--secondary))',
  },
];

const TasteCompass = () => {
  const [activeSectors, setActiveSectors] = useState<string[]>([]);

  const toggleSector = (id: string) => {
    setActiveSectors((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const progress = (activeSectors.length / sectors.length) * 100;

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Taste Compass 2.0</CardTitle>
        <p className="text-muted-foreground">
          Explore different flavor profiles
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {sectors.map((sector) => {
            const IconComponent = sector.icon;
            const isActive = activeSectors.includes(sector.id);

            return (
              <Button
                key={sector.id}
                variant={isActive ? 'default' : 'outline'}
                onClick={() => toggleSector(sector.id)}
                className="h-auto p-4 flex flex-col items-center space-y-2 transition-all duration-300 hover:scale-105"
                style={{
                  backgroundColor: isActive ? sector.color : 'transparent',
                  borderColor: sector.color,
                  color: isActive ? 'white' : sector.color,
                }}
              >
                <IconComponent size={32} className="mb-1" />
                <span className="font-semibold">{sector.label}</span>
                <span className="text-xs text-center opacity-80">
                  {sector.description}
                </span>
              </Button>
            );
          })}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-muted-foreground">
              {Math.round(progress)}%
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {progress === 100 && (
          <div className="text-center p-4 bg-primary/10 rounded-lg">
            <h3 className="text-lg font-semibold text-primary mb-2">
              🎉 Chef's Table Unlocked!
            </h3>
            <p className="text-muted-foreground mb-3">
              You've explored all flavor profiles. Book your exclusive
              experience now.
            </p>
            <Button>Book Chef's Table</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TasteCompass;
