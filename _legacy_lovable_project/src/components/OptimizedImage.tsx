import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  placeholder?: string;
  fallback?: string;
  sizes?: string;
  quality?: number;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className,
  width,
  height,
  priority = false,
  placeholder,
  fallback = '/placeholder.svg',
  sizes = '100vw',
  quality = 75,
  loading = 'lazy',
  onLoad,
  onError,
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [inView, setInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || loading === 'eager') {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px',
        threshold: 0.1,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority, loading]);

  // Generate optimized image URL
  const getOptimizedSrc = (originalSrc: string) => {
    // If it's already an optimized URL, return as is
    if (originalSrc.includes('transform') || originalSrc.includes('resize')) {
      return originalSrc;
    }

    // For Supabase Storage URLs, add optimization parameters
    if (originalSrc.includes('supabase')) {
      const url = new URL(originalSrc);
      url.searchParams.set('width', width?.toString() || '800');
      url.searchParams.set('height', height?.toString() || '600');
      url.searchParams.set('quality', quality.toString());
      url.searchParams.set('format', 'webp');
      return url.toString();
    }

    // For other URLs, you might want to use a service like Cloudinary or ImageKit
    // Example for Cloudinary:
    // return `https://res.cloudinary.com/your-cloud/image/fetch/w_${width || 800},h_${height || 600},q_${quality}/${originalSrc}`;

    return originalSrc;
  };

  const handleLoad = () => {
    setLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setError(true);
    onError?.();
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 1.1 },
    visible: { opacity: 1, scale: 1 },
  };

  const placeholderVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  return (
    <div
      ref={imgRef}
      className={cn('relative overflow-hidden', className)}
      style={{ width, height }}
    >
      {/* Placeholder/Skeleton */}
      <AnimatePresence>
        {!loaded && !error && (
          <motion.div
            variants={placeholderVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute inset-0 bg-gray-200 animate-pulse"
          >
            {placeholder && (
              <img
                src={placeholder}
                alt=""
                className="w-full h-full object-cover opacity-50"
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Image */}
      {inView && !error && (
        <motion.img
          src={getOptimizedSrc(src)}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          loading={loading}
          onLoad={handleLoad}
          onError={handleError}
          variants={imageVariants}
          initial="hidden"
          animate={loaded ? 'visible' : 'hidden'}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-300',
            loaded ? 'opacity-100' : 'opacity-0'
          )}
        />
      )}

      {/* Error Fallback */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-gray-100 flex items-center justify-center"
        >
          <img
            src={fallback}
            alt="Image failed to load"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-gray-500 text-sm">Image unavailable</span>
          </div>
        </motion.div>
      )}

      {/* Loading Indicator */}
      {!loaded && !error && inView && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};

// Hook for image optimization
export const useImageOptimization = () => {
  const [images, setImages] = useState<Map<string, boolean>>(new Map());

  const preloadImage = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (images.get(src)) {
        resolve();
        return;
      }

      const img = new Image();
      img.onload = () => {
        setImages((prev) => new Map(prev.set(src, true)));
        resolve();
      };
      img.onerror = reject;
      img.src = src;
    });
  };

  const preloadImages = async (srcs: string[]): Promise<void> => {
    await Promise.all(srcs.map(preloadImage));
  };

  return { preloadImage, preloadImages, images };
};

// Image Gallery Component
interface ImageGalleryProps {
  images: string[];
  alt: string;
  className?: string;
  onImageClick?: (index: number) => void;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  alt,
  className,
  onImageClick,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className={cn('relative', className)}>
      {/* Main Image */}
      <OptimizedImage
        src={images[currentIndex]}
        alt={`${alt} ${currentIndex + 1}`}
        className="w-full h-64 md:h-96 rounded-lg"
        priority
      />

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-4 overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                'flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors',
                currentIndex === index
                  ? 'border-primary'
                  : 'border-gray-200 hover:border-gray-300'
              )}
            >
              <OptimizedImage
                src={image}
                alt={`${alt} thumbnail ${index + 1}`}
                className="w-full h-full"
                width={64}
                height={64}
              />
            </button>
          ))}
        </div>
      )}

      {/* Navigation */}
      {images.length > 1 && (
        <>
          <button
            onClick={() =>
              setCurrentIndex(
                (prev) => (prev - 1 + images.length) % images.length
              )
            }
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg"
            aria-label="Previous image"
          >
            ←
          </button>
          <button
            onClick={() =>
              setCurrentIndex((prev) => (prev + 1) % images.length)
            }
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg"
            aria-label="Next image"
          >
            →
          </button>
        </>
      )}
    </div>
  );
};
