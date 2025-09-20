import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Share2,
  Facebook,
  Twitter,
  Instagram,
  Copy,
  Download,
  QrCode,
  Camera,
  Heart,
  MessageCircle,
  Users,
  Sparkles,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface SocialTemplate {
  id: string;
  name: string;
  description: string;
  preview: React.ReactNode;
  hashtags: string[];
}

interface EnhancedSocialSharingProps {
  achievement?: any;
  userStats?: any;
  questProgress?: any;
  trigger: React.ReactNode;
}

const EnhancedSocialSharing = ({
  achievement,
  userStats,
  questProgress,
  trigger,
}: EnhancedSocialSharingProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('achievement');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');

  const socialTemplates: SocialTemplate[] = [
    {
      id: 'achievement',
      name: 'Achievement Card',
      description: 'Share your latest achievement with a beautiful card',
      preview: (
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-lg text-white">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5" />
            <span className="font-bold">Achievement Unlocked!</span>
          </div>
          <p className="text-sm opacity-90">
            Just completed my Taste Alley quest!
          </p>
        </div>
      ),
      hashtags: [
        '#TasteAlley',
        '#Achievement',
        '#ODEFoodHall',
        '#CulinaryQuest',
      ],
    },
    {
      id: 'progress',
      name: 'Progress Update',
      description: 'Show your current level and stats',
      preview: (
        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-4 rounded-lg text-white">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-5 w-5" />
            <span className="font-bold">Level Up!</span>
          </div>
          <p className="text-sm opacity-90">
            Now level {userStats?.level || 1} at Taste Alley
          </p>
        </div>
      ),
      hashtags: ['#TasteAlley', '#LevelUp', '#FoodieLife', '#ODEFoodHall'],
    },
    {
      id: 'leaderboard',
      name: 'Leaderboard Rank',
      description: 'Showcase your ranking position',
      preview: (
        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 rounded-lg text-white">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="h-5 w-5" />
            <span className="font-bold">Top Performer!</span>
          </div>
          <p className="text-sm opacity-90">
            Ranked #{userStats?.rank || 1} in Taste Alley
          </p>
        </div>
      ),
      hashtags: [
        '#TasteAlley',
        '#Leaderboard',
        '#TopPerformer',
        '#ODEFoodHall',
      ],
    },
  ];

  const platforms = [
    {
      id: 'instagram',
      name: 'Instagram',
      icon: <Instagram className="h-4 w-4" />,
      color: 'bg-pink-500',
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: <Facebook className="h-4 w-4" />,
      color: 'bg-blue-600',
    },
    {
      id: 'twitter',
      name: 'Twitter',
      icon: <Twitter className="h-4 w-4" />,
      color: 'bg-blue-400',
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      icon: <MessageCircle className="h-4 w-4" />,
      color: 'bg-black',
    },
  ];

  const generateShareText = () => {
    const template = socialTemplates.find((t) => t.id === selectedTemplate);
    if (!template) return '';

    let baseText = '';

    switch (selectedTemplate) {
      case 'achievement':
        baseText = `🎉 Just unlocked "${achievement?.title || 'New Achievement'}" at Taste Alley! ${achievement?.description || 'Amazing culinary journey continues!'} 🍜`;
        break;
      case 'progress':
        baseText = `🚀 Level ${userStats?.level || 1} achieved at Taste Alley! ${userStats?.completedSectors || 0} sectors conquered and counting! 🏆`;
        break;
      case 'leaderboard':
        baseText = `🔥 Currently ranked #${userStats?.rank || 1} on the Taste Alley leaderboard! The competition is fierce! 💪`;
        break;
    }

    return `${baseText}\n\n${template.hashtags.join(' ')}\n\n📍 ODE Food Hall, Ubud`;
  };

  const handleShare = async (platform: string) => {
    const text = generateShareText();
    const url = 'https://ode-food-hall.com/taste-alley';

    setSelectedPlatform(platform);

    switch (platform) {
      case 'instagram':
        // Instagram doesn't support direct URL sharing, copy to clipboard
        await navigator.clipboard.writeText(text);
        toast({
          title: 'Content copied!',
          description: 'Open Instagram and paste this in your story or post',
        });
        break;
      case 'facebook':
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`,
          '_blank'
        );
        break;
      case 'twitter':
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
          '_blank'
        );
        break;
      case 'tiktok':
        await navigator.clipboard.writeText(text);
        toast({
          title: 'Content copied!',
          description: 'Open TikTok and paste this in your video description',
        });
        break;
    }
  };

  const downloadShareCard = () => {
    // Mock download functionality
    toast({
      title: 'Share card generated!',
      description: 'Your custom share card is ready to download',
    });
  };

  const generateQRCode = () => {
    toast({
      title: 'QR Code generated!',
      description: 'QR code for your Taste Alley profile created',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share Your Achievement
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="templates" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="platforms">Platforms</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {socialTemplates.map((template) => (
                <Card
                  key={template.id}
                  className={`cursor-pointer transition-all ${
                    selectedTemplate === template.id
                      ? 'ring-2 ring-emerald-500'
                      : ''
                  }`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">{template.preview}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{template.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {template.description}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {template.hashtags.map((hashtag) => (
                            <Badge
                              key={hashtag}
                              variant="outline"
                              className="text-xs"
                            >
                              {hashtag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="platforms" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {platforms.map((platform) => (
                <Button
                  key={platform.id}
                  variant="outline"
                  className={`h-20 flex-col gap-2 ${
                    selectedPlatform === platform.id
                      ? 'ring-2 ring-emerald-500'
                      : ''
                  }`}
                  onClick={() => handleShare(platform.id)}
                >
                  <div
                    className={`p-2 rounded-full ${platform.color} text-white`}
                  >
                    {platform.icon}
                  </div>
                  <span className="text-sm">{platform.name}</span>
                </Button>
              ))}
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold mb-2">Preview:</h4>
              <Card className="bg-gray-50">
                <CardContent className="p-4">
                  <pre className="text-sm whitespace-pre-wrap text-muted-foreground">
                    {generateShareText()}
                  </pre>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={downloadShareCard}
                className="h-20 flex-col gap-2"
              >
                <Download className="h-6 w-6" />
                <span>Download Share Card</span>
              </Button>

              <Button
                variant="outline"
                onClick={generateQRCode}
                className="h-20 flex-col gap-2"
              >
                <QrCode className="h-6 w-6" />
                <span>Generate QR Code</span>
              </Button>

              <Button
                variant="outline"
                onClick={() => handleShare('copy')}
                className="h-20 flex-col gap-2"
              >
                <Copy className="h-6 w-6" />
                <span>Copy Link</span>
              </Button>

              <Button variant="outline" className="h-20 flex-col gap-2">
                <Camera className="h-6 w-6" />
                <span>Take Photo</span>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedSocialSharing;
