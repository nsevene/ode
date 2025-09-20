import { useState, useEffect, useRef, ReactNode } from 'react';

interface VirtualScrollProps {
  items: any[];
  renderItem: (item: any, index: number) => ReactNode;
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

export const VirtualScrolling = ({
  items,
  renderItem,
  itemHeight,
  containerHeight,
  overscan = 5,
}: VirtualScrollProps) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const visibleStart = Math.max(
    0,
    Math.floor(scrollTop / itemHeight) - overscan
  );
  const visibleEnd = Math.min(
    items.length,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const visibleItems = items.slice(visibleStart, visibleEnd);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  return (
    <div
      ref={containerRef}
      style={{ height: containerHeight, overflow: 'auto' }}
      onScroll={handleScroll}
    >
      <div style={{ height: items.length * itemHeight, position: 'relative' }}>
        <div
          style={{
            transform: `translateY(${visibleStart * itemHeight}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
          }}
        >
          {visibleItems.map((item, index) =>
            renderItem(item, visibleStart + index)
          )}
        </div>
      </div>
    </div>
  );
};
