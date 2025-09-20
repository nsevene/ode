import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PWA_BASE_URL } from '@/lib/brand';
import { trackZoneClick } from '@/lib/analytics';
import { Smartphone, Zap, ExternalLink } from 'lucide-react';

interface PWAPromptProps {
  title?: string;
  description?: string;
  showInstructions?: boolean;
}

export default function PWAPrompt({
  title = 'Откройте приложение Taste Compass',
  description = 'Превратите свой визит в увлекательное приключение с технологией NFC',
  showInstructions = true,
}: PWAPromptProps) {
  const handleClick = () => {
    trackZoneClick('app_open', 'web');
  };

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20 max-w-2xl mx-auto">
      <CardContent className="p-8 text-center">
        <Badge
          variant="secondary"
          className="mb-4 bg-mustard-accent text-charcoal-dark"
        >
          <Zap className="w-4 h-4 mr-2" />
          Новая технология
        </Badge>

        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-mustard-accent to-gold-light rounded-full flex items-center justify-center text-2xl">
          <Smartphone className="w-8 h-8 text-charcoal-dark" />
        </div>

        <h3 className="text-2xl font-bold text-cream-light mb-2">{title}</h3>
        <p className="text-cream-light/80 mb-6">{description}</p>

        <Button
          asChild
          size="lg"
          onClick={handleClick}
          className="bg-gradient-to-r from-mustard-accent to-gold-accent hover:from-gold-accent hover:to-mustard-accent text-charcoal-dark font-semibold px-8 py-4 rounded-full text-lg transition-all duration-300 hover-scale shadow-lg"
        >
          <a href={PWA_BASE_URL} target="_blank" rel="noopener noreferrer">
            🚀 Открыть приложение
            <ExternalLink className="w-4 h-4 ml-2" />
          </a>
        </Button>

        <p className="text-xs text-cream-light/60 mt-4">
          Работает на всех современных смартфонах с NFC
        </p>

        {showInstructions && (
          <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
            <div className="text-2xl mb-2">📲</div>
            <h4 className="text-sm font-semibold text-cream-light mb-2">
              Как использовать NFC
            </h4>
            <ol className="text-xs text-cream-light/80 text-left space-y-1 max-w-xs mx-auto">
              <li>1. Найдите NFC-стикер в зоне</li>
              <li>2. Поднесите телефон к стикеру</li>
              <li>3. Откройте ссылку в браузере</li>
              <li>4. Получите штамп в приложении</li>
            </ol>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
