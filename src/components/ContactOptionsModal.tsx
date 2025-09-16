import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Phone, MessageCircle, Send } from 'lucide-react';

interface ContactOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  phoneNumber: string;
}

export const ContactOptionsModal: React.FC<ContactOptionsModalProps> = ({
  isOpen,
  onClose,
  phoneNumber,
}) => {
  const formatPhoneNumber = (phone: string) => {
    return phone.replace(/\D/g, '');
  };

  const handleWhatsApp = () => {
    const formattedPhone = formatPhoneNumber(phoneNumber);
    const message = encodeURIComponent('Hello! I would like to learn more about ODE Food Hall.');
    window.open(`https://wa.me/${formattedPhone}?text=${message}`, '_blank');
    onClose();
  };

  const handleTelegram = () => {
    const message = encodeURIComponent('Hello! I would like to learn more about ODE Food Hall.');
    window.open(`https://t.me/+${formatPhoneNumber(phoneNumber)}?text=${message}`, '_blank');
    onClose();
  };

  const handleDirectCall = () => {
    window.open(`tel:${phoneNumber}`, '_self');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Choose Contact Method</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <Button
            onClick={handleWhatsApp}
            className="w-full flex items-center justify-center gap-3 h-12 bg-forest-green hover:bg-forest-green/90 text-cream-light"
          >
            <MessageCircle className="h-5 w-5" />
            WhatsApp
          </Button>
          
          <Button
            onClick={handleTelegram}
            className="w-full flex items-center justify-center gap-3 h-12 bg-sage-blue hover:bg-sage-blue/90 text-cream-light"
          >
            <Send className="h-5 w-5" />
            Telegram
          </Button>
          
          <Button
            onClick={handleDirectCall}
            variant="outline"
            className="w-full flex items-center justify-center gap-3 h-12"
          >
            <Phone className="h-5 w-5" />
            Call Directly
          </Button>
        </div>
        
        <div className="text-center pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            {phoneNumber}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};