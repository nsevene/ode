import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Share2, MapPin, Clock, Users } from 'lucide-react';
import { toast } from 'sonner';

interface InteractiveElementsProps {
  type: 'restaurant' | 'event' | 'experience';
  name: string;
  data?: any;
}

export const InteractiveElements: React.FC<InteractiveElementsProps> = ({
  type,
  name,
  data,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(
    data?.likes || Math.floor(Math.random() * 50) + 10
  );

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));

    // Track analytics
    if (typeof (window as any).odeTracking?.trackEvent === 'function') {
      (window as any).odeTracking.trackEvent('content_like', {
        content_type: type,
        content_name: name,
        liked: !isLiked,
      });
    }

    toast.success(isLiked ? 'Removed from favorites' : 'Added to favorites');
  };

  const handleShare = async () => {
    const shareData = {
      title: `${name} - ODE Food Hall`,
      text: `Check out ${name} at ODE Food Hall Ubud`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      }

      // Track analytics
      if (typeof (window as any).odeTracking?.trackEvent === 'function') {
        (window as any).odeTracking.trackEvent('share', {
          content_type: type,
          content_name: name,
          method: navigator.share ? 'native' : 'clipboard',
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error('Failed to share');
    }
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'restaurant':
        return <MapPin className="h-4 w-4" />;
      case 'event':
        return <Clock className="h-4 w-4" />;
      case 'experience':
        return <Users className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {getTypeIcon()}
            <Badge variant="secondary" className="text-xs">
              {type}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`transition-colors ${
                isLiked
                  ? 'text-red-500 hover:text-red-600'
                  : 'text-muted-foreground hover:text-red-500'
              }`}
              aria-label={
                isLiked ? 'Remove from favorites' : 'Add to favorites'
              }
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
              <span className="ml-1 text-xs">{likeCount}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="text-muted-foreground hover:text-primary"
              aria-label="Share"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
          {name}
        </h3>

        {data?.description && (
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
            {data.description}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
