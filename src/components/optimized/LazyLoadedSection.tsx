import React, { useState, useRef } from 'react';
import { useIntersectionObserver } from '@/hooks/useOptimizedRendering';
import { LoadingSpinner } from '@/components/ui/loading';
import { cn } from '@/lib/utils';

interface LazyLoadedSectionProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
  minHeight?: string;
}

export const LazyLoadedSection: React.FC<LazyLoadedSectionProps> = ({
  children,
  fallback = <LoadingSpinner />,
  className,
  threshold = 0.1,
  rootMargin = '50px',
  once = true,
  minHeight = '200px'
}) => {
  const [hasLoaded, setHasLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const isIntersecting = useIntersectionObserver(
    ref,
    { threshold, rootMargin },
    (intersecting) => {
      if (intersecting && !hasLoaded) {
        setHasLoaded(true);
      }
    }
  );

  const shouldRender = once ? hasLoaded : isIntersecting;

  return (
    <div 
      ref={ref} 
      className={cn("w-full", className)}
      style={{ minHeight: shouldRender ? 'auto' : minHeight }}
    >
      {shouldRender ? children : (
        <div className="flex items-center justify-center" style={{ minHeight }}>
          {fallback}
        </div>
      )}
    </div>
  );
};

// Lazy loaded image component
interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallback?: string;
  className?: string;
  containerClassName?: string;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  fallback = '/placeholder.svg',
  className,
  containerClassName,
  ...props
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const isIntersecting = useIntersectionObserver(ref, {
    threshold: 0.1,
    rootMargin: '50px'
  });

  const handleLoad = () => setLoaded(true);
  const handleError = () => setError(true);

  return (
    <div ref={ref} className={cn("relative overflow-hidden", containerClassName)}>
      {isIntersecting && (
        <>
          <img
            src={error ? fallback : src}
            alt={alt}
            className={cn(
              "transition-opacity duration-300",
              loaded ? "opacity-100" : "opacity-0",
              className
            )}
            onLoad={handleLoad}
            onError={handleError}
            {...props}
          />
          {!loaded && (
            <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
              <LoadingSpinner size="sm" />
            </div>
          )}
        </>
      )}
    </div>
  );
};