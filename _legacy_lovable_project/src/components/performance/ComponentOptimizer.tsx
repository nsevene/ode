import React, { memo, useMemo, Suspense, lazy } from 'react';
import { LoadingSpinner } from '@/components/ui/loading';

// Performance optimized component wrapper
export const OptimizedComponent = memo(
  ({
    children,
    className,
    dependencies = [],
  }: {
    children: React.ReactNode;
    className?: string;
    dependencies?: any[];
  }) => {
    const memoizedContent = useMemo(() => children, dependencies);

    return (
      <div className={className}>
        <Suspense fallback={<LoadingSpinner />}>{memoizedContent}</Suspense>
      </div>
    );
  }
);

OptimizedComponent.displayName = 'OptimizedComponent';

// Lazy loading helper
export const createLazyComponent = (importFn: () => Promise<any>) => {
  return lazy(() =>
    importFn().catch(() => ({
      default: () => <div>Failed to load component</div>,
    }))
  );
};

// Virtual scrolling for large lists
export const VirtualList = memo(
  ({
    items,
    renderItem,
    itemHeight = 50,
    containerHeight = 400,
    className,
  }: {
    items: any[];
    renderItem: (item: any, index: number) => React.ReactNode;
    itemHeight?: number;
    containerHeight?: number;
    className?: string;
  }) => {
    const [scrollTop, setScrollTop] = React.useState(0);

    const visibleItems = useMemo(() => {
      const startIndex = Math.floor(scrollTop / itemHeight);
      const endIndex = Math.min(
        startIndex + Math.ceil(containerHeight / itemHeight) + 1,
        items.length
      );

      return items.slice(startIndex, endIndex).map((item, index) => ({
        item,
        index: startIndex + index,
      }));
    }, [items, scrollTop, itemHeight, containerHeight]);

    return (
      <div
        className={className}
        style={{ height: containerHeight, overflow: 'auto' }}
        onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
      >
        <div
          style={{ height: items.length * itemHeight, position: 'relative' }}
        >
          {visibleItems.map(({ item, index }) => (
            <div
              key={index}
              style={{
                position: 'absolute',
                top: index * itemHeight,
                height: itemHeight,
                width: '100%',
              }}
            >
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      </div>
    );
  }
);

VirtualList.displayName = 'VirtualList';

// Intersection Observer hook for lazy loading
export const useIntersectionObserver = (
  ref: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) => {
  const [isIntersecting, setIsIntersecting] = React.useState(false);

  React.useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      options
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [ref, options]);

  return isIntersecting;
};

// Debounced input component
export const DebouncedInput = memo(
  ({
    value,
    onChange,
    delay = 300,
    ...props
  }: {
    value: string;
    onChange: (value: string) => void;
    delay?: number;
    [key: string]: any;
  }) => {
    const [localValue, setLocalValue] = React.useState(value);

    React.useEffect(() => {
      setLocalValue(value);
    }, [value]);

    React.useEffect(() => {
      const timer = setTimeout(() => {
        onChange(localValue);
      }, delay);

      return () => clearTimeout(timer);
    }, [localValue, onChange, delay]);

    return (
      <input
        {...props}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
      />
    );
  }
);

DebouncedInput.displayName = 'DebouncedInput';
