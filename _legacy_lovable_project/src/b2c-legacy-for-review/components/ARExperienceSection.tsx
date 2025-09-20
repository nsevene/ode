import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera, Smartphone, Scan, Play, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ARExperienceSection = () => {
  const [isARActive, setIsARActive] = useState(false);
  const { toast } = useToast();

  const handleStartAR = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        setIsARActive(true);

        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });

        toast({
          title: 'AR Camera Activated! 📱',
          description:
            'Point your camera at markers around the hall to discover hidden content.',
        });

        // Stop camera after demo
        setTimeout(() => {
          stream.getTracks().forEach((track) => track.stop());
          setIsARActive(false);
        }, 3000);
      } else {
        throw new Error('Camera not supported');
      }
    } catch (error) {
      toast({
        title: 'Camera Access Required',
        description: 'Please allow camera access to use AR features.',
        variant: 'destructive',
      });
    }
  };

  const arFeatures = [
    {
      icon: <Scan className="h-5 w-5" />,
      title: '3D Spice Route',
      description:
        'Scan QR codes to explore the historic spice trade routes in 3D',
    },
    {
      icon: <Camera className="h-5 w-5" />,
      title: 'Interactive Markers',
      description:
        'Point your camera at sector markers for immersive storytelling',
    },
    {
      icon: <Play className="h-5 w-5" />,
      title: 'Recipe Videos',
      description: 'Watch chef demonstrations appear right on your table',
    },
  ];

  return (
    <section
      id="ar-experience"
      className="py-16 bg-gradient-to-b from-muted/20 to-background"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            <Smartphone className="w-4 h-4 mr-2" />
            AR Technology
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Augmented Reality Experience
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Immerse yourself in the spice route journey with cutting-edge AR
            technology
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-12">
          {/* AR Preview */}
          <Card className="overflow-hidden relative">
            <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                {isARActive ? (
                  <div className="text-center">
                    <div className="animate-pulse mb-4">
                      <Camera className="h-16 w-16 mx-auto text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      AR Camera Active
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto bg-white/80 rounded-full flex items-center justify-center mb-4">
                      <Scan className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">
                      Scan with your phone camera
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Discover the spice route in 3D!
                    </p>
                  </div>
                )}
              </div>

              {/* AR Overlay UI Elements */}
              <div className="absolute top-4 left-4">
                <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 text-xs font-medium">
                  AR MODE
                </div>
              </div>

              <div className="absolute bottom-4 right-4">
                <Button
                  onClick={handleStartAR}
                  disabled={isARActive}
                  size="lg"
                  className="rounded-full"
                >
                  {isARActive ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Active
                    </div>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Start AR
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>

          {/* Features List */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold">AR Features</h3>

            {arFeatures.map((feature, index) => (
              <Card key={index} className="border-none shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Device Compatibility */}
            <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <span className="text-sm text-amber-800">
                Requires modern smartphone with camera access
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ARExperienceSection;
