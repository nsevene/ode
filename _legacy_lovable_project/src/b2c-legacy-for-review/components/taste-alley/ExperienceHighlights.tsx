import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

const ExperienceHighlights = () => {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-6 w-6" />
          The Journey Experience
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="font-semibold text-emerald-700">
              🧪 FERMENT Sector
            </h4>
            <p className="text-sm text-muted-foreground">
              Discover the ancient art of fermentation with interactive displays
              and taste experiences.
            </p>
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold text-orange-700">🔥 SMOKE Sector</h4>
            <p className="text-sm text-muted-foreground">
              Experience traditional smoking techniques and their aromatic
              journey through time.
            </p>
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold text-red-700">🌶️ SPICE Sector</h4>
            <p className="text-sm text-muted-foreground">
              Navigate the historic spice routes with AR-guided storytelling and
              sensory experiences.
            </p>
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold text-blue-700">🐟 UMAMI Sector</h4>
            <p className="text-sm text-muted-foreground">
              Unlock the secrets of the fifth taste through interactive culinary
              demonstrations.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExperienceHighlights;
