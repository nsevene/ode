import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Smartphone,
  Download,
  Wifi,
  Bell,
  Camera,
  MapPin,
  Star,
  X,
} from 'lucide-react';
import { track } from '@/lib/analytics';

const DemoPWAPrompt = () => {
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showFeatureDemo, setShowFeatureDemo] = useState<string | null>(null);

  const pwaFeatures = [
    {
      id: 'offline',
      icon: <Wifi className="w-6 h-6" />,
      title: 'Offline Access',
      description:
        'Browse menus and view your Taste Passport even without internet',
      demo: 'Your order history and favorite dishes are cached for offline viewing.',
    },
    {
      id: 'notifications',
      icon: <Bell className="w-6 h-6" />,
      title: 'Push Notifications',
      description:
        'Get notified about order status, special offers, and new missions',
      demo: 'Notification: "Your Pad Thai is ready for pickup! 🍜"',
    },
    {
      id: 'camera',
      icon: <Camera className="w-6 h-6" />,
      title: 'Camera Integration',
      description:
        'Scan QR codes for instant menu access and mission completion',
      demo: 'Camera opens to scan QR codes at each taste zone station.',
    },
    {
      id: 'location',
      icon: <MapPin className="w-6 h-6" />,
      title: 'Location Services',
      description:
        'Auto-detect your zone for location-based missions and offers',
      demo: 'Detected: You are in the Spice Sector - New mission available!',
    },
  ];

  const handleInstallPrompt = () => {
    setShowInstallPrompt(true);
    track('pwa_install_prompt_shown');
  };

  const handleInstallDemo = () => {
    setShowInstallPrompt(false);
    setIsInstalled(true);
    track('pwa_install_demo_completed');
  };

  const handleFeatureDemo = (featureId: string) => {
    setShowFeatureDemo(featureId);
    track('pwa_feature_demo', { feature: featureId });
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-charcoal-dark mb-3">
          PWA Features Demo
        </h2>
        <p className="text-charcoal-medium max-w-2xl mx-auto">
          Experience our Progressive Web App capabilities. Install once, use
          everywhere - with native-like features and offline functionality.
        </p>
      </div>

      {/* Install Section */}
      <Card className="bg-gradient-to-r from-burgundy-primary to-burgundy-dark text-pure-white">
        <CardContent className="p-6">
          <div className="text-center">
            {!isInstalled ? (
              <>
                <div className="w-16 h-16 bg-pure-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Install Ode Food Hall App
                </h3>
                <p className="text-burgundy-light mb-4">
                  Get the full experience with app-like features, offline
                  access, and push notifications.
                </p>
                <Button
                  onClick={handleInstallPrompt}
                  className="bg-pure-white text-burgundy-primary hover:bg-cream-light"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Install App Demo
                </Button>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  App Installed Successfully!
                </h3>
                <p className="text-burgundy-light">
                  The Ode Food Hall app is now available on your home screen.
                </p>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {pwaFeatures.map((feature) => (
          <Card
            key={feature.id}
            className="bg-pure-white/80 backdrop-blur border border-cream-medium cursor-pointer hover:border-burgundy-primary/30 transition-colors"
            onClick={() => handleFeatureDemo(feature.id)}
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-burgundy-primary/10 rounded-lg flex items-center justify-center text-burgundy-primary">
                  {feature.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-charcoal-dark mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-charcoal-medium mb-3">
                    {feature.description}
                  </p>
                  <Button size="sm" variant="outline">
                    Try Demo →
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* App Store Style Mockup */}
      <Card className="bg-pure-white/80 backdrop-blur border border-cream-medium">
        <CardContent className="p-6">
          <h4 className="font-semibold text-charcoal-dark mb-4 text-center">
            App Store Preview
          </h4>
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-burgundy-primary to-burgundy-dark rounded-xl flex items-center justify-center text-pure-white font-bold text-xl">
              ODE
            </div>
            <div className="flex-1">
              <h5 className="font-semibold text-charcoal-dark">
                Ode Food Hall
              </h5>
              <p className="text-sm text-charcoal-medium mb-2">
                Gastro Village Ubud Experience
              </p>
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-mustard-accent text-mustard-accent"
                  />
                ))}
                <span className="text-sm text-charcoal-medium ml-1">
                  4.9 • Food & Drink
                </span>
              </div>
              <div className="flex gap-2">
                <Badge variant="secondary" className="text-xs">
                  Top Rated
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  Editor's Choice
                </Badge>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-cream-medium">
            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div>
                <div className="font-semibold text-charcoal-dark">4.9</div>
                <div className="text-charcoal-medium">Rating</div>
              </div>
              <div>
                <div className="font-semibold text-charcoal-dark">1K+</div>
                <div className="text-charcoal-medium">Reviews</div>
              </div>
              <div>
                <div className="font-semibold text-charcoal-dark">Free</div>
                <div className="text-charcoal-medium">Download</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Install Prompt Modal */}
      {showInstallPrompt && (
        <div className="fixed inset-0 bg-charcoal-dark/80 backdrop-blur-sm z-50 flex items-end justify-center p-4">
          <Card className="w-full max-w-sm bg-pure-white">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-semibold text-charcoal-dark">
                  Add to Home Screen
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowInstallPrompt(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <p className="text-sm text-charcoal-medium mb-4">
                Install the Ode Food Hall app for quick access to menus,
                ordering, and your Taste Passport.
              </p>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowInstallPrompt(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleInstallDemo}
                  className="flex-1 bg-burgundy-primary hover:bg-burgundy-dark text-pure-white"
                >
                  Install
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Feature Demo Modal */}
      {showFeatureDemo && (
        <div className="fixed inset-0 bg-charcoal-dark/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-pure-white">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-semibold text-charcoal-dark">
                  {pwaFeatures.find((f) => f.id === showFeatureDemo)?.title}{' '}
                  Demo
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFeatureDemo(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-burgundy-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 text-burgundy-primary">
                  {pwaFeatures.find((f) => f.id === showFeatureDemo)?.icon}
                </div>
                <p className="text-sm text-charcoal-medium">
                  {pwaFeatures.find((f) => f.id === showFeatureDemo)?.demo}
                </p>
              </div>

              <Button
                onClick={() => setShowFeatureDemo(null)}
                className="w-full bg-burgundy-primary hover:bg-burgundy-dark text-pure-white"
              >
                Got it!
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Demo Summary */}
      <div className="text-center bg-cream-light/50 rounded-lg p-6">
        <h4 className="font-semibold text-charcoal-dark mb-2">
          Complete PWA Experience
        </h4>
        <p className="text-sm text-charcoal-medium mb-4">
          Fast loading, offline functionality, push notifications, camera
          access, location services, and native app-like experience across all
          devices.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-burgundy-primary">
              &lt; 3s
            </div>
            <div className="text-xs text-charcoal-medium">Load Time</div>
          </div>
          <div>
            <div className="text-lg font-bold text-burgundy-primary">98%</div>
            <div className="text-xs text-charcoal-medium">Lighthouse Score</div>
          </div>
          <div>
            <div className="text-lg font-bold text-burgundy-primary">
              Offline
            </div>
            <div className="text-xs text-charcoal-medium">Works Offline</div>
          </div>
          <div>
            <div className="text-lg font-bold text-burgundy-primary">0MB</div>
            <div className="text-xs text-charcoal-medium">App Store Size</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoPWAPrompt;
