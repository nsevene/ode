import React, { useState } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ImageErrorHandlerProps {
  src: string;
  alt: string;
  className?: string;
  fallbackText?: string;
  showRetry?: boolean;
  onRetry?: () => void;
}

const ImageErrorHandler: React.FC<ImageErrorHandlerProps> = ({
  src,
  alt,
  className = '',
  fallbackText = 'Image unavailable',
  showRetry = true,
  onRetry,
}) => {
  const [hasError, setHasError] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  const handleImageError = () => {
    setHasError(true);
  };

  const handleRetry = () => {
    setIsRetrying(true);
    setHasError(false);
    
    // Force image reload
    const img = new Image();
    img.onload = () => {
      setIsRetrying(false);
      window.location.reload(); // Simple approach to refresh the image
    };
    img.onerror = () => {
      setHasError(true);
      setIsRetrying(false);
    };
    
    // Add timestamp to bypass cache
    img.src = `${src}?t=${new Date().getTime()}`;
    onRetry?.();
  };

  if (hasError) {
    return (
      <Card className={`${className} flex flex-col items-center justify-center p-6 bg-muted/30`}>
        <AlertTriangle className="w-12 h-12 text-muted-foreground mb-3" />
        <p className="text-sm text-muted-foreground text-center mb-4">
          {fallbackText}
        </p>
        {showRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleRetry}
            disabled={isRetrying}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
            {isRetrying ? 'Loading...' : 'Try again'}
          </Button>
        )}
      </Card>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={handleImageError}
      loading="lazy"
    />
  );
};

export default ImageErrorHandler;