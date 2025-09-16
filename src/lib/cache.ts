// Advanced caching system
export class CacheManager {
  private static instance: CacheManager;
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();

  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  // Set cache with TTL
  set(key: string, data: any, ttl: number = 300000) { // 5 minutes default
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  // Get from cache
  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;

    // Check if expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  // Clear cache
  clear() {
    this.cache.clear();
  }

  // Clear expired items
  clearExpired() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
  }

  // Get cache size
  getSize(): number {
    return this.cache.size;
  }
}

// API caching wrapper
export class APICache {
  private static instance: APICache;
  private cacheManager: CacheManager;

  constructor() {
    this.cacheManager = CacheManager.getInstance();
  }

  static getInstance(): APICache {
    if (!APICache.instance) {
      APICache.instance = new APICache();
    }
    return APICache.instance;
  }

  // Cached API call
  async get<T>(key: string, fetcher: () => Promise<T>, ttl?: number): Promise<T> {
    // Try to get from cache first
    const cached = this.cacheManager.get(key);
    if (cached) {
      return cached;
    }

    // Fetch data
    const data = await fetcher();
    
    // Cache the result
    this.cacheManager.set(key, data, ttl);
    
    return data;
  }

  // Invalidate cache
  invalidate(key: string) {
    this.cacheManager.cache.delete(key);
  }

  // Clear all cache
  clear() {
    this.cacheManager.clear();
  }
}

// Image optimization
export class ImageOptimizer {
  private static instance: ImageOptimizer;

  static getInstance(): ImageOptimizer {
    if (!ImageOptimizer.instance) {
      ImageOptimizer.instance = new ImageOptimizer();
    }
    return ImageOptimizer.instance;
  }

  // Optimize image URL
  optimizeImageUrl(url: string, width?: number, height?: number, quality?: number): string {
    if (!url) return url;

    // If it's already optimized, return as is
    if (url.includes('w_') || url.includes('h_') || url.includes('q_')) {
      return url;
    }

    // Add optimization parameters
    const params = new URLSearchParams();
    if (width) params.append('w', width.toString());
    if (height) params.append('h', height.toString());
    if (quality) params.append('q', quality.toString());
    params.append('f', 'auto'); // Auto format

    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}${params.toString()}`;
  }

  // Lazy load image
  lazyLoadImage(img: HTMLImageElement, src: string, placeholder?: string) {
    if (placeholder) {
      img.src = placeholder;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          img.src = src;
          observer.unobserve(img);
        }
      });
    });

    observer.observe(img);
  }
}

// Export instances
export const cacheManager = CacheManager.getInstance();
export const apiCache = APICache.getInstance();
export const imageOptimizer = ImageOptimizer.getInstance();
