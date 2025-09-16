import React, { useState, useRef, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface TouchOptimizedProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onLongPress?: () => void;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
}

export const TouchOptimized = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  onLongPress,
  className = "",
  style,
  disabled = false
}: TouchOptimizedProps) => {
  const isMobile = useIsMobile();
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const [isLongPress, setIsLongPress] = useState(false);

  if (!isMobile || disabled) {
    return <div className={className}>{children}</div>;
  }

  const minSwipeDistance = 50;
  const longPressDelay = 500;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    });
    setIsLongPress(false);

    if (onLongPress) {
      longPressTimer.current = setTimeout(() => {
        setIsLongPress(true);
        onLongPress();
      }, longPressDelay);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    });
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }

    if (!touchStart || !touchEnd || isLongPress) return;

    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    const isLeftSwipe = distanceX > minSwipeDistance;
    const isRightSwipe = distanceX < -minSwipeDistance;
    const isUpSwipe = distanceY > minSwipeDistance;
    const isDownSwipe = distanceY < -minSwipeDistance;

    // Prioritize horizontal swipes over vertical
    if (Math.abs(distanceX) > Math.abs(distanceY)) {
      if (isLeftSwipe && onSwipeLeft) {
        onSwipeLeft();
      } else if (isRightSwipe && onSwipeRight) {
        onSwipeRight();
      }
    } else {
      if (isUpSwipe && onSwipeUp) {
        onSwipeUp();
      } else if (isDownSwipe && onSwipeDown) {
        onSwipeDown();
      }
    }
  };

  useEffect(() => {
    return () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
    };
  }, []);

  return (
    <div
      className={`${className} touch-manipulation select-none`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none',
        ...style
      }}
    >
      {children}
    </div>
  );
};

interface SwipeableCardProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  className?: string;
  leftAction?: React.ReactNode;
  rightAction?: React.ReactNode;
}

export const SwipeableCard = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  className = "",
  leftAction,
  rightAction
}: SwipeableCardProps) => {
  const [translateX, setTranslateX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Background Actions */}
      {leftAction && (
        <div className="absolute inset-y-0 left-0 flex items-center justify-start bg-destructive text-destructive-foreground px-4">
          {leftAction}
        </div>
      )}
      {rightAction && (
        <div className="absolute inset-y-0 right-0 flex items-center justify-end bg-green-500 text-white px-4">
          {rightAction}
        </div>
      )}

      {/* Main Content */}
      <TouchOptimized
        className={`transition-transform duration-200 ${isDragging ? '' : 'ease-out'}`}
        style={{ transform: `translateX(${translateX}px)` }}
        onSwipeLeft={() => {
          setTranslateX(-80);
          setTimeout(() => {
            onSwipeLeft?.();
            setTranslateX(0);
          }, 200);
        }}
        onSwipeRight={() => {
          setTranslateX(80);
          setTimeout(() => {
            onSwipeRight?.();
            setTranslateX(0);
          }, 200);
        }}
      >
        {children}
      </TouchOptimized>
    </div>
  );
};