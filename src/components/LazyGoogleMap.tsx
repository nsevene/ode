import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, ExternalLink, Navigation } from 'lucide-react';

interface LazyGoogleMapProps {
  apiKey?: string;
}

const LazyGoogleMap = ({ apiKey }: LazyGoogleMapProps) => {
  // ODE Food Hall coordinates
  const odeLocation = {
    lat: -8.5105485,
    lng: 115.2620352
  };

  const openInGoogleMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${odeLocation.lat},${odeLocation.lng}&query_place_id=ODE+Food+Hall`;
    window.open(url, '_blank');
  };

  const getDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${odeLocation.lat},${odeLocation.lng}&destination_place_id=ODE+Food+Hall`;
    window.open(url, '_blank');
  };

  return (
    <Card className="border-none shadow-warm bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-burgundy-primary">
          <MapPin className="h-6 w-6 text-gold-accent" />
          Find Us
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="w-full h-64 rounded-lg bg-gray-100 flex items-center justify-center">
          <div className="text-center space-y-4">
            <MapPin className="h-12 w-12 text-burgundy-primary mx-auto" />
            <div>
              <h3 className="font-bold text-burgundy-primary mb-2">ODE Food Hall</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Jl. Monkey Forest No.15<br />
                Ubud, Bali 80571<br />
                Indonesia
              </p>
              <p className="text-sm text-muted-foreground mb-2">
                <strong>Hours:</strong> 07:00 - 23:00 Daily
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>Phone:</strong> +62 819 432 863 95
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={openInGoogleMaps} className="flex-1">
            <ExternalLink className="h-4 w-4 mr-2" />
            Open in Google Maps
          </Button>
          <Button variant="outline" onClick={getDirections} className="flex-1">
            <Navigation className="h-4 w-4 mr-2" />
            Get Directions
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LazyGoogleMap;