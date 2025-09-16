import React, { useState, useRef, useEffect, memo } from 'react';
import { cn } from '@/lib/utils';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  fallback?: string;
  placeholder?: string;
  sizes?: string;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
}

const LazyImage: React.FC<LazyImageProps> = memo(({
  src,
  alt,
  className,
  fallback = '/lovable-uploads/3f00f862-daaa-4d2d-b462-b7347e9e5cdb.png',
  placeholder,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  loading = 'lazy',
  onLoad,
  onError,
}) => {
  const [imageSrc, setImageSrc] = useState(placeholder || src);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Generate WebP version for better compression
  const getOptimizedSrc = (originalSrc: string) => {
    if (originalSrc.includes('.webp') || originalSrc.startsWith('http')) {
      return originalSrc;
    }
    return originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  };

  const optimizedSrc = getOptimizedSrc(src);

  useEffect(() => {
    if (!imgRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0.1,
      }
    );

    observer.observe(imgRef.current);

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isInView) return;

    const img = new Image();
    
    img.onload = () => {
      setImageSrc(optimizedSrc);
      setIsLoaded(true);
      onLoad?.();
    };
    
    img.onerror = () => {
      // Fallback to original format if WebP fails
      const fallbackImg = new Image();
      fallbackImg.onload = () => {
        setImageSrc(src);
        setIsLoaded(true);
        onLoad?.();
      };
      fallbackImg.onerror = () => {
        setImageSrc(fallback);
        setHasError(true);
        onError?.();
      };
      fallbackImg.src = src;
    };
    
    img.src = optimizedSrc;
  }, [isInView, optimizedSrc, src, fallback, onLoad, onError]);

  return (
    <div ref={imgRef} className="relative overflow-hidden">
      <img
        src={imageSrc}
        alt={alt}
        className={cn(
          'transition-all duration-500 ease-in-out',
          isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105',
          hasError && 'grayscale',
          className
        )}
        sizes={sizes}
        loading={loading}
        onLoad={() => {
          if (imageSrc !== placeholder) {
            setIsLoaded(true);
            onLoad?.();
          }
        }}
        onError={() => {
          if (!hasError && imageSrc !== fallback) {
            setImageSrc(fallback);
            setHasError(true);
            onError?.();
          }
        }}
      />
      
      {/* Loading placeholder */}
      {!isLoaded && !hasError && (
        <div className={cn(
          'absolute inset-0 bg-gradient-to-br from-sage-blue/10 to-forest-green/5 animate-pulse',
          'flex items-center justify-center'
        )}>
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
});

LazyImage.displayName = 'LazyImage';

export default LazyImage;