
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Share2, Facebook, Twitter, Instagram, Copy, Download, QrCode } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  reward: string;
}

interface SocialSharingProps {
  achievement?: Achievement;
  userStats?: {
    name: string;
    level: number;
    score: number;
    completedSectors: number;
    rank: number;
  };
  questProgress?: {
    completedSteps: number;
    totalSteps: number;
    currentSector: string;
  };
  trigger: React.ReactNode;
}

const SocialSharing = ({ achievement, userStats, questProgress, trigger }: SocialSharingProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<'achievement' | 'progress' | 'completion'>('achievement');

  const generateShareText = () => {
    if (achievement && selectedTemplate === 'achievement') {
      return `🎉 Just unlocked "${achievement.title}" at ODE Food Hall's Taste Alley! ${achievement.description} #TasteAlley #ODEFoodHall #TasteQuest`;
    }
    
    if (userStats && selectedTemplate === 'progress') {
      return `🍜 Level ${userStats.level} at Taste Alley! Rank #${userStats.rank} with ${userStats.score} points and ${userStats.completedSectors} sectors completed! Join the adventure at ODE Food Hall! #TasteAlley #ODEFoodHall`;
    }
    
    if (questProgress && selectedTemplate === 'completion') {
      return `🏆 Completed ${questProgress.completedSteps}/${questProgress.totalSteps} steps in Taste Alley quest! Currently exploring ${questProgress.currentSector}. Amazing culinary journey at ODE Food Hall! #TasteAlley #ODEFoodHall #CulinaryAdventure`;
    }
    
    return `🍜 Having an amazing time at Taste Alley - ODE Food Hall's interactive culinary journey! #TasteAlley #ODEFoodHall`;
  };

  const shareUrl = `https://ode-food-hall.com/taste-alley`;

  const handleShare = async (platform: 'facebook' | 'twitter' | 'instagram' | 'copy') => {
    const text = generateShareText();
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(text)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
        break;
      case 'instagram':
        // Instagram doesn't support direct sharing via URL, so copy to clipboard
        await navigator.clipboard.writeText(`${text}\n\n${shareUrl}`);
        toast({
          title: "Copied to clipboard!",
          description: "Share this on Instagram Stories or Posts",
        });
        break;
      case 'copy':
        await navigator.clipboard.writeText(`${text}\n\n${shareUrl}`);
        toast({
          title: "Copied to clipboard!",
          description: "Share text copied successfully",
        });
        break;
    }
  };

  const generateQRCode = () => {
    // In a real app, this would generate an actual QR code
    toast({
      title: "QR Code Generated!",
      description: "QR code for Taste Alley quest created",
    });
  };

  const downloadShareCard = () => {
    // In a real app, this would generate and download a share card image
    toast({
      title: "Share Card Generated!",
      description: "Your achievement card is ready to download",
    });
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'from-purple-600 to-pink-600';
      case 'epic': return 'from-orange-600 to-red-600';
      case 'rare': return 'from-blue-600 to-indigo-600';
      default: return 'from-gray-600 to-gray-700';
    }
  };

  const templates = [
    {
      id: 'achievement' as const,
      title: 'Achievement',
      description: 'Share your latest achievement',
      available: !!achievement
    },
    {
      id: 'progress' as const,
      title: 'Progress',
      description: 'Show your current stats',
      available: !!userStats
    },
    {
      id: 'completion' as const,
      title: 'Quest Progress',
      description: 'Share quest completion',
      available: !!questProgress
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share Your Achievement
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Template Selection */}
          <div className="space-y-3">
            <h4 className="font-semibold">Choose template:</h4>
            <div className="grid grid-cols-1 gap-2">
              {templates.filter(t => t.available).map((template) => (
                <Button
                  key={template.id}
                  variant={selectedTemplate === template.id ? 'default' : 'outline'}
                  onClick={() => setSelectedTemplate(template.id)}
                  className="justify-start h-auto p-3"
                >
                  <div className="text-left">
                    <div className="font-medium">{template.title}</div>
                    <div className="text-sm text-muted-foreground">{template.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-3">
            <h4 className="font-semibold">Preview:</h4>
            <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
              <CardContent className="p-4">
                {selectedTemplate === 'achievement' && achievement && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-full bg-gradient-to-r ${getRarityColor(achievement.rarity)}`}>
                        <div className="text-white">
                          {achievement.icon}
                        </div>
                      </div>
                      <div>
                        <h5 className="font-semibold">{achievement.title}</h5>
                        <Badge variant="outline">{achievement.rarity}</Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  </div>
                )}
                
                {selectedTemplate === 'progress' && userStats && (
                  <div className="space-y-2">
                    <h5 className="font-semibold">Level {userStats.level} • Rank #{userStats.rank}</h5>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>Score: {userStats.score}</div>
                      <div>Sectors: {userStats.completedSectors}</div>
                    </div>
                  </div>
                )}
                
                {selectedTemplate === 'completion' && questProgress && (
                  <div className="space-y-2">
                    <h5 className="font-semibold">Quest Progress</h5>
                    <div className="text-sm">
                      <div>{questProgress.completedSteps}/{questProgress.totalSteps} steps completed</div>
                      <div>Currently in: {questProgress.currentSector}</div>
                    </div>
                  </div>
                )}
                
                <div className="mt-3 text-xs text-muted-foreground">
                  {generateShareText()}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Share Options */}
          <div className="space-y-3">
            <h4 className="font-semibold">Share on:</h4>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => handleShare('facebook')}
                className="flex items-center gap-2"
              >
                <Facebook className="h-4 w-4 text-blue-600" />
                Facebook
              </Button>
              <Button
                variant="outline"
                onClick={() => handleShare('twitter')}
                className="flex items-center gap-2"
              >
                <Twitter className="h-4 w-4 text-blue-400" />
                Twitter
              </Button>
              <Button
                variant="outline"
                onClick={() => handleShare('instagram')}
                className="flex items-center gap-2"
              >
                <Instagram className="h-4 w-4 text-pink-600" />
                Instagram
              </Button>
              <Button
                variant="outline"
                onClick={() => handleShare('copy')}
                className="flex items-center gap-2"
              >
                <Copy className="h-4 w-4" />
                Copy Link
              </Button>
            </div>
          </div>

          {/* Additional Options */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={downloadShareCard}
              className="flex-1"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Card
            </Button>
            <Button
              variant="outline"
              onClick={generateQRCode}
              className="flex-1"
            >
              <QrCode className="h-4 w-4 mr-2" />
              Generate QR
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SocialSharing;
