import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, MapPin, Trophy, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TastePassportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TastePassportModal = ({ isOpen, onClose }: TastePassportModalProps) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Generate unique NFC passport ID 
      const passportId = 'ODE' + Math.random().toString(36).substr(2, 8).toUpperCase();
      
      // Simulate API call to create passport
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Store passport info in localStorage for demo
      const passportData = {
        id: passportId,
        name,
        email,
        createdAt: new Date().toISOString(),
        sectorsCompleted: [],
        totalPoints: 0,
        level: 1
      };
      
      localStorage.setItem('nfc-passport', JSON.stringify(passportData));
      
      toast({
        title: "🎫 NFC Passport Created!",
        description: `Your ID: ${passportId}. Come to ODE Food Hall for activation!`,
      });
      
      onClose();
      setEmail('');
      setName('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Get Your Taste Passport
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="text-center space-y-3">
            <div className="flex justify-center space-x-6">
              <div className="flex flex-col items-center space-y-1">
                <MapPin className="h-8 w-8 text-primary" />
                <span className="text-xs font-medium">12 corners</span>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <Trophy className="h-8 w-8 text-accent" />
                <span className="text-xs font-medium">Quests</span>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <Star className="h-8 w-8 text-primary" />
                <span className="text-xs font-medium">Rewards</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Explore all flavors, collect achievements, and get exclusive bonuses!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="bg-accent/10 p-3 rounded-lg text-sm">
              <strong>What you'll get:</strong>
              <ul className="mt-1 space-y-1 text-muted-foreground">
                <li>• Digital passport for collecting achievements</li>
                <li>• Exclusive offers from chefs</li>
                <li>• Early bird discounts before opening</li>
                <li>• Invitations to private events</li>
              </ul>
            </div>

            <div className="flex space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Later
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? 'Creating...' : 'Get Passport'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};