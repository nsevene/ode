import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Smartphone,
  Wifi,
  CheckCircle,
  XCircle,
  Radio,
  Zap,
  MapPin,
  Clock,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface NFCSector {
  id: string;
  name: string;
  description: string;
  nfcTag: string;
  isActive: boolean;
  visitCount: number;
  lastVisit?: string;
}

const NFCIntegration = () => {
  const { user } = useAuth();
  const [isNFCSupported, setIsNFCSupported] = useState(false);
  const [isNFCEnabled, setIsNFCEnabled] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [sectors, setSectors] = useState<NFCSector[]>([]);
  const [recentScans, setRecentScans] = useState<
    Array<{
      sector: string;
      timestamp: string;
      points: number;
    }>
  >([]);

  useEffect(() => {
    checkNFCSupport();
    loadSectorData();
  }, []);

  const checkNFCSupport = async () => {
    if ('NDEFReader' in window) {
      setIsNFCSupported(true);
      try {
        const ndef = new (window as any).NDEFReader();
        await ndef.scan();
        setIsNFCEnabled(true);
      } catch (error) {
        console.log('NFC not enabled:', error);
      }
    }
  };

  const loadSectorData = () => {
    // Mock NFC sector data
    const mockSectors: NFCSector[] = [
      {
        id: '1',
        name: 'Spicy Asia',
        description: 'Thai & Vietnamese flavors',
        nfcTag: 'spicy-asia-001',
        isActive: true,
        visitCount: 0,
      },
      {
        id: '2',
        name: 'Wild Bali',
        description: 'Authentic Balinese cuisine',
        nfcTag: 'wild-bali-002',
        isActive: true,
        visitCount: 0,
      },
      {
        id: '3',
        name: 'Dolce Italia',
        description: 'Sicilian & Tuscan specialties',
        nfcTag: 'dolce-italia-003',
        isActive: true,
        visitCount: 0,
      },
      {
        id: '4',
        name: 'Fresh Nordic',
        description: 'Scandinavian flavors',
        nfcTag: 'fresh-nordic-004',
        isActive: true,
        visitCount: 0,
      },
    ];

    setSectors(mockSectors);
  };

  const startNFCScanning = async () => {
    if (!isNFCSupported) {
      toast({
        title: 'NFC not supported',
        description: "Your device doesn't support NFC scanning",
        variant: 'destructive',
      });
      return;
    }

    setIsScanning(true);

    try {
      const ndef = new (window as any).NDEFReader();

      ndef.addEventListener('reading', ({ message }: any) => {
        const textDecoder = new TextDecoder();

        for (const record of message.records) {
          if (record.recordType === 'text') {
            const sectorTag = textDecoder.decode(record.data);
            handleNFCTag(sectorTag);
          }
        }
      });

      await ndef.scan();

      toast({
        title: 'NFC scanning started',
        description: 'Hold your phone near an NFC tag at any sector',
      });

      // Auto-stop scanning after 30 seconds
      setTimeout(() => {
        setIsScanning(false);
      }, 30000);
    } catch (error) {
      console.error('NFC scanning error:', error);
      setIsScanning(false);
      toast({
        title: 'Scanning failed',
        description: 'Could not start NFC scanning. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleNFCTag = async (tagData: string) => {
    const sector = sectors.find((s) => s.nfcTag === tagData);

    if (!sector) {
      toast({
        title: 'Unknown tag',
        description: 'This NFC tag is not recognized',
        variant: 'destructive',
      });
      return;
    }

    if (!user) {
      toast({
        title: 'Login required',
        description: 'Please login to track your progress',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Record the NFC interaction
      const { error } = await supabase.rpc('track_nfc_interaction', {
        p_user_id: user.id,
        p_sector_name: sector.name,
      });

      if (error) {
        throw error;
      }

      // Update local state
      setSectors((prev) =>
        prev.map((s) =>
          s.id === sector.id
            ? {
                ...s,
                visitCount: s.visitCount + 1,
                lastVisit: new Date().toISOString(),
              }
            : s
        )
      );

      // Add to recent scans
      setRecentScans((prev) => [
        {
          sector: sector.name,
          timestamp: new Date().toISOString(),
          points: 25,
        },
        ...prev.slice(0, 4),
      ]);

      toast({
        title: 'Sector visited!',
        description: `Welcome to ${sector.name}! +25 points earned`,
      });

      setIsScanning(false);
    } catch (error) {
      console.error('Error tracking NFC interaction:', error);
      toast({
        title: 'Error',
        description: 'Could not record your visit. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const simulateNFCTap = (sectorTag: string) => {
    // For demo purposes - simulate NFC tap
    handleNFCTag(sectorTag);
  };

  return (
    <div className="space-y-6">
      {/* NFC Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            NFC Passport Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              {isNFCSupported ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <span className="text-sm">
                NFC {isNFCSupported ? 'Supported' : 'Not Supported'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {isNFCEnabled ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <span className="text-sm">
                NFC {isNFCEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {isScanning ? (
                <Radio className="h-5 w-5 text-blue-600 animate-pulse" />
              ) : (
                <Wifi className="h-5 w-5 text-gray-400" />
              )}
              <span className="text-sm">
                {isScanning ? 'Scanning...' : 'Ready to scan'}
              </span>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <Button
              onClick={startNFCScanning}
              disabled={!isNFCSupported || isScanning}
              className="flex items-center gap-2"
            >
              <Zap className="h-4 w-4" />
              {isScanning ? 'Scanning...' : 'Start NFC Scan'}
            </Button>

            {!isNFCSupported && (
              <Button variant="outline" size="sm">
                Use QR Code Instead
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Sector Status */}
      <Card>
        <CardHeader>
          <CardTitle>Available Sectors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sectors.map((sector) => (
              <div
                key={sector.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-emerald-600" />
                  <div>
                    <h4 className="font-medium">{sector.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {sector.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant={sector.isActive ? 'default' : 'secondary'}>
                    {sector.visitCount} visits
                  </Badge>
                  {import.meta.env.DEV && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => simulateNFCTap(sector.nfcTag)}
                    >
                      Simulate
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Scans */}
      {recentScans.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentScans.map((scan, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-emerald-50 rounded"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm">{scan.sector}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">+{scan.points} pts</Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(scan.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NFCIntegration;
