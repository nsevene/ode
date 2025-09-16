import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { linkToStamp, trackZoneClick } from "@/lib/deeplinks";
import { ExternalLink, Zap } from "lucide-react";

interface ZoneCTAProps {
  zone: string;
  guestId?: string;
  variant?: 'default' | 'card' | 'minimal';
  showBadge?: boolean;
}

const zoneEmojis: Record<string, string> = {
  'ferment': '🧪',
  'smoke': '🔥', 
  'spice': '🌶️',
  'umami': '🌊',
  'sweet-salt': '🍯',
  'sour-herb': '🌿',
  'zero-waste': '♻️'
};

export default function ZoneCTA({ zone, guestId, variant = 'default', showBadge = true }: ZoneCTAProps) {
  const href = linkToStamp(zone, guestId, 'web');
  const emoji = zoneEmojis[zone] || '🏷️';
  
  const handleClick = () => {
    trackZoneClick(zone);
  };

  if (variant === 'minimal') {
    return (
      <Button 
        asChild 
        variant="outline" 
        size="sm"
        onClick={handleClick}
        className="hover-scale transition-all duration-300"
      >
        <a href={href} target="_blank" rel="noopener noreferrer">
          {emoji} Получить штамп
          <ExternalLink className="w-3 h-3 ml-2" />
        </a>
      </Button>
    );
  }

  if (variant === 'card') {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
        {showBadge && (
          <Badge variant="secondary" className="mb-3 bg-mustard-accent text-charcoal-dark">
            <Zap className="w-3 h-3 mr-1" />
            NFC Ready
          </Badge>
        )}
        <div className="text-2xl mb-2">{emoji}</div>
        <h4 className="font-semibold text-cream-light mb-2 uppercase">{zone}</h4>
        <Button 
          asChild 
          size="sm"
          onClick={handleClick}
          className="bg-gradient-to-r from-mustard-accent to-gold-accent hover:from-gold-accent hover:to-mustard-accent text-charcoal-dark font-semibold rounded-full w-full"
        >
          <a href={href} target="_blank" rel="noopener noreferrer">
            Получить штамп →
          </a>
        </Button>
      </div>
    );
  }

  return (
    <Button 
      asChild 
      size="lg"
      onClick={handleClick}
      className="bg-gradient-to-r from-primary to-primary-variant hover:from-primary-variant hover:to-primary text-primary-foreground font-semibold px-6 py-3 rounded-full transition-all duration-300 hover-scale shadow-lg"
    >
      <a href={href} target="_blank" rel="noopener noreferrer">
        {emoji} Получить штамп в PWA
        <ExternalLink className="w-4 h-4 ml-2" />
      </a>
    </Button>
  );
}