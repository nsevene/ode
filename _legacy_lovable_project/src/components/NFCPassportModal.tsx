import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Smartphone, Nfc, Zap, Trophy, X } from 'lucide-react';

interface NFCPassportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NFCPassportModal = ({ isOpen, onClose }: NFCPassportModalProps) => {
  const [isActivated, setIsActivated] = useState(false);

  const handleActivateNFC = () => {
    setIsActivated(true);
    // Simulate NFC activation
    setTimeout(() => {
      alert('NFC activated! Start collecting stamps at each sector.');
      onClose();
      setIsActivated(false);
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Nfc className="h-6 w-6 text-primary" />
            NFC Passport Activation
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mb-4">
              <Smartphone className="h-10 w-10 text-primary" />
            </div>
            <p className="text-muted-foreground">
              Hold your phone near the NFC tag at each sector to collect stamps!
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Zap className="h-5 w-5 text-orange-500" />
              <span className="text-sm">Tap NFC tags at each sector</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <span className="text-sm">
                Collect digital stamps automatically
              </span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Badge className="h-5 w-5 text-green-500" />
              <span className="text-sm">Unlock rewards when complete</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleActivateNFC}
              disabled={isActivated}
              className="flex-1"
            >
              {isActivated ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Activating...
                </div>
              ) : (
                <>
                  <Nfc className="h-4 w-4 mr-2" />
                  Activate NFC
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NFCPassportModal;
