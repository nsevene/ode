import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Shield, Settings } from 'lucide-react';

const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      // Show consent after a small delay
      setTimeout(() => setShowConsent(true), 2000);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setShowConsent(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'false');
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 lg:left-auto lg:right-4 lg:max-w-md">
      <Card className="shadow-xl border-primary/20 bg-white/95 backdrop-blur-md">
        <CardContent className="p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-2">We value your privacy</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We use cookies to enhance your experience, analyze site traffic,
                and personalize content.
                <a
                  href="/privacy"
                  className="text-primary hover:underline ml-1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Learn more
                </a>
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDecline}
              className="flex-shrink-0 h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDecline}
              className="flex-1"
            >
              <Settings className="h-4 w-4 mr-2" />
              Manage
            </Button>
            <Button onClick={handleAccept} size="sm" className="flex-1">
              Accept All
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CookieConsent;
