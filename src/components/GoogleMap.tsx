/// <reference types="google.maps" />
import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';

interface GoogleMapProps {
  apiKey?: string;
}

const GoogleMap = ({ apiKey }: GoogleMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [userApiKey, setUserApiKey] = useState(apiKey || '');
  const [showApiKeyInput, setShowApiKeyInput] = useState(!apiKey);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ODE Food Hall coordinates (updated to match provided coordinates)
  const odeLocation = {
    lat: -8.5105485,
    lng: 115.2620352
  };

  const loadMap = async (googleMapsApiKey: string) => {
    if (!mapRef.current || !googleMapsApiKey) return;

    setLoading(true);
    setError(null);

    try {
      // Add timeout and better error handling for Google Maps API
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Google Maps API loading timeout')), 10000)
      );

      const loader = new Loader({
        apiKey: googleMapsApiKey,
        version: 'weekly',
        libraries: ['places']
      });

      const google = await Promise.race([loader.load(), timeoutPromise]) as typeof window.google;
      
      const mapInstance = new google.maps.Map(mapRef.current, {
        center: odeLocation,
        zoom: 17,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          },
          {
            featureType: 'transit',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ],
        disableDefaultUI: false,
        zoomControl: true,
        streetViewControl: true,
        fullscreenControl: true,
      });

      // Add marker for ODE Food Hall
      const marker = new google.maps.Marker({
        position: odeLocation,
        map: mapInstance,
        title: 'ODE Food Hall',
        icon: {
          url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
          scaledSize: new google.maps.Size(40, 40),
        },
      });

      // Add info window
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 10px; max-width: 250px;">
            <h3 style="margin: 0 0 8px 0; color: #8B1538; font-weight: bold;">ODE Food Hall</h3>
            <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">
              Jl. Monkey Forest No.15<br>
              Ubud, Bali 80571<br>
              Indonesia
            </p>
            <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">
              <strong>Hours:</strong> 07:00 - 23:00 Daily
            </p>
            <p style="margin: 0; color: #666; font-size: 14px;">
              <strong>Phone:</strong> +62 819 432 863 95
            </p>
          </div>
        `,
      });

      marker.addListener('click', () => {
        infoWindow.open(mapInstance, marker);
      });

      // Open info window by default
      infoWindow.open(mapInstance, marker);

      setMap(mapInstance);
      setShowApiKeyInput(false);
    } catch (err) {
      console.error('Error loading Google Maps:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      if (errorMessage.includes('timeout') || errorMessage.includes('Loading chunk')) {
        setError('Map loading failed. Please refresh the page and try again.');
      } else if (errorMessage.includes('API key')) {
        setError('Invalid API key. Please check your Google Maps API key.');
      } else {
        setError('Failed to load Google Maps. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApiKeySubmit = () => {
    if (userApiKey.trim()) {
      loadMap(userApiKey.trim());
    }
  };

  const openInGoogleMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${odeLocation.lat},${odeLocation.lng}&query_place_id=ODE+Food+Hall`;
    window.open(url, '_blank');
  };

  const getDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${odeLocation.lat},${odeLocation.lng}&destination_place_id=ODE+Food+Hall`;
    window.open(url, '_blank');
  };

  useEffect(() => {
    if (apiKey) {
      loadMap(apiKey);
    }
  }, [apiKey]);

  if (showApiKeyInput) {
    return (
      <Card className="border-none shadow-warm bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-burgundy-primary">
            <MapPin className="h-6 w-6 text-gold-accent" />
            Location Map
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            To display the interactive map, please enter your Google Maps API key:
          </p>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter Google Maps API key"
              value={userApiKey}
              onChange={(e) => setUserApiKey(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleApiKeySubmit} disabled={!userApiKey.trim() || loading}>
              {loading ? 'Loading...' : 'Load Map'}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Get your API key from the{' '}
            <a 
              href="https://console.cloud.google.com/google/maps-apis" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gold-accent hover:underline"
            >
              Google Cloud Console
            </a>
          </p>
          
          {/* Fallback buttons */}
          <div className="flex gap-2 pt-4">
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
  }

  return (
    <Card className="border-none shadow-warm bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-burgundy-primary">
          <MapPin className="h-6 w-6 text-gold-accent" />
          Find Us
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
            <Button 
              variant="link" 
              size="sm" 
              onClick={() => setShowApiKeyInput(true)}
              className="p-0 h-auto text-red-600 hover:text-red-700"
            >
              Try different API key
            </Button>
          </div>
        )}
        
        <div 
          ref={mapRef} 
          className="w-full h-64 rounded-lg bg-gray-100 flex items-center justify-center"
        >
          {loading && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-burgundy-primary mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Loading map...</p>
            </div>
          )}
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

export default GoogleMap;