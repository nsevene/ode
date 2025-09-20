import { useState, useEffect, useRef, memo } from 'react';

interface VirtualizedListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
}

export const VirtualizedList = memo(
  <T,>({
    items,
    itemHeight,
    containerHeight,
    renderItem,
    className = '',
  }: VirtualizedListProps<T>) => {
    const [startIndex, setStartIndex] = useState(0);
    const [endIndex, setEndIndex] = useState(0);
    const scrollElementRef = useRef<HTMLDivElement>(null);

    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const totalHeight = items.length * itemHeight;

    useEffect(() => {
      const calculateVisibleItems = () => {
        if (scrollElementRef.current) {
          const scrollTop = scrollElementRef.current.scrollTop;
          const start = Math.floor(scrollTop / itemHeight);
          const end = Math.min(start + visibleCount + 1, items.length - 1);

          setStartIndex(start);
          setEndIndex(end);
        }
      };

      calculateVisibleItems();

      const handleScroll = () => calculateVisibleItems();
      const scrollElement = scrollElementRef.current;

      if (scrollElement) {
        scrollElement.addEventListener('scroll', handleScroll);
        return () => scrollElement.removeEventListener('scroll', handleScroll);
      }
    }, [items.length, itemHeight, visibleCount]);

    const visibleItems = items.slice(startIndex, endIndex + 1);

    return (
      <div
        ref={scrollElementRef}
        className={`overflow-auto ${className}`}
        style={{ height: containerHeight }}
      >
        <div style={{ height: totalHeight, position: 'relative' }}>
          <div
            style={{
              transform: `translateY(${startIndex * itemHeight}px)`,
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
            }}
          >
            {visibleItems.map((item, index) => (
              <div key={startIndex + index} style={{ height: itemHeight }}>
                {renderItem(item, startIndex + index)}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
);
