import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Smartphone, 
  Camera, 
  MapPin, 
  Bell, 
  Nfc, 
  QrCode,
  Wifi,
  Battery,
  Share2,
  Download,
  Star,
  Users
} from 'lucide-react';
import { mobileAPI } from '@/lib/mobile-api';

const MobileAppFeatures = () => {
  const [deviceInfo, setDeviceInfo] = useState<any>(null);
  const [isNativeApp, setIsNativeApp] = useState(false);
  const [nfcAvailable, setNfcAvailable] = useState(false);
  const [locationPermission, setLocationPermission] = useState(false);

  useEffect(() => {
    checkMobileCapabilities();
  }, []);

  const checkMobileCapabilities = async () => {
    // Check if running in native app
    if (typeof window !== 'undefined' && (window as any).Capacitor) {
      setIsNativeApp(true);
      
      try {
        // Check NFC availability
        const { NFC } = await import('@capacitor-community/nfc');
        const isAvailable = await NFC.isAvailable();
        setNfcAvailable(isAvailable);
      } catch (error) {
        console.log('NFC not available');
      }

      try {
        // Check location permission
        const { Geolocation } = await import('@capacitor/geolocation');
        const permissions = await Geolocation.checkPermissions();
        setLocationPermission(permissions.location === 'granted');
      } catch (error) {
        console.log('Geolocation not available');
      }
    }
  };

  const mobileFeatures = [
    {
      title: "NFC Taste Compass",
      description: "Scan NFC tags at each taste zone to unlock experiences and earn points",
      icon: Nfc,
      available: nfcAvailable,
      features: ["Zone detection", "Experience unlocking", "Points earning", "Progress tracking"]
    },
    {
      title: "QR Code Scanner",
      description: "Scan QR codes for instant menu access, payments, and special offers",
      icon: QrCode,
      available: true,
      features: ["Menu scanning", "Payment processing", "Special offers", "Order tracking"]
    },
    {
      title: "Location Services",
      description: "Auto-detect your zone for location-based missions and personalized offers",
      icon: MapPin,
      available: locationPermission,
      features: ["Zone detection", "Nearby offers", "Navigation", "Geofencing"]
    },
    {
      title: "Push Notifications",
      description: "Get notified about order status, special offers, and new missions",
      icon: Bell,
      available: true,
      features: ["Order updates", "Special offers", "Mission alerts", "Event notifications"]
    },
    {
      title: "Camera Integration",
      description: "Take photos of your food for social sharing and reviews",
      icon: Camera,
      available: true,
      features: ["Food photography", "Social sharing", "Review system", "Photo gallery"]
    },
    {
      title: "Offline Mode",
      description: "Access your taste passport and order history even without internet",
      icon: Wifi,
      available: true,
      features: ["Offline passport", "Cached menus", "Order history", "Sync when online"]
    }
  ];

  const appBenefits = [
    {
      title: "Seamless Ordering",
      description: "Order from any kitchen corner with just a few taps",
      icon: Smartphone
    },
    {
      title: "Gamification",
      description: "Complete missions and earn rewards as you explore different cuisines",
      icon: Star
    },
    {
      title: "Social Features",
      description: "Share your culinary journey with friends and family",
      icon: Users
    },
    {
      title: "Personalized Experience",
      description: "Get recommendations based on your taste preferences",
      icon: Share2
    }
  ];

  return (
    <div className="space-y-8">
      {/* App Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            Mobile App Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <Badge variant={isNativeApp ? "default" : "secondary"} className="mb-2">
                {isNativeApp ? "Native App" : "Web App"}
              </Badge>
              <p className="text-sm text-charcoal/70">App Type</p>
            </div>
            <div className="text-center">
              <Badge variant={nfcAvailable ? "default" : "secondary"} className="mb-2">
                {nfcAvailable ? "Available" : "Not Available"}
              </Badge>
              <p className="text-sm text-charcoal/70">NFC Support</p>
            </div>
            <div className="text-center">
              <Badge variant={locationPermission ? "default" : "secondary"} className="mb-2">
                {locationPermission ? "Granted" : "Not Granted"}
              </Badge>
              <p className="text-sm text-charcoal/70">Location Access</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Features */}
      <div>
        <h3 className="text-xl font-bold text-charcoal mb-6">Mobile App Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mobileFeatures.map((feature, index) => (
            <Card key={index} className="group hover:shadow-elegant transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-light rounded-lg">
                      <feature.icon className="w-5 h-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                  <Badge variant={feature.available ? "default" : "secondary"}>
                    {feature.available ? "Available" : "Not Available"}
                  </Badge>
                </div>
                <p className="text-sm text-charcoal/70">{feature.description}</p>
              </CardHeader>
              <CardContent>
                <ul className="text-xs text-charcoal/60 space-y-1 mb-4">
                  {feature.features.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-primary rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
                {feature.available && (
                  <Button variant="outline" size="sm" className="w-full">
                    Try Feature
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* App Benefits */}
      <div>
        <h3 className="text-xl font-bold text-charcoal mb-6">Why Download the App?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {appBenefits.map((benefit, index) => (
            <Card key={index} className="group hover:shadow-elegant transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-gradient-light rounded-lg">
                    <benefit.icon className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{benefit.title}</CardTitle>
                </div>
                <p className="text-sm text-charcoal/70">{benefit.description}</p>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      {/* Download Buttons */}
      <Card className="bg-gradient-light">
        <CardContent className="p-8 text-center">
          <h3 className="text-2xl font-bold text-charcoal mb-4">
            Download ODE Food Hall App
          </h3>
          <p className="text-charcoal/70 mb-6">
            Get the full experience with our native mobile app
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="w-full sm:w-auto">
              <Download className="w-4 h-4 mr-2" />
              Download for iOS
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              <Download className="w-4 h-4 mr-2" />
              Download for Android
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MobileAppFeatures;
