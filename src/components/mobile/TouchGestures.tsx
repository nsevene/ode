import React, { useRef, useEffect, ReactNode } from 'react';

interface TouchGesturesProps {
  children: ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onPinch?: (scale: number) => void;
  onDoubleTap?: () => void;
  onLongPress?: () => void;
  threshold?: number;
  className?: string;
}

export const TouchGestures: React.FC<TouchGesturesProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  onPinch,
  onDoubleTap,
  onLongPress,
  threshold = 50,
  className = ''
}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const lastTapRef = useRef<number>(0);
  const longPressTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const initialDistanceRef = useRef<number>(0);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now()
      };

      // Обработка долгого нажатия
      if (onLongPress) {
        longPressTimeoutRef.current = setTimeout(() => {
          onLongPress();
        }, 500);
      }

      // Обработка pinch gesture
      if (e.touches.length === 2 && onPinch) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        initialDistanceRef.current = Math.sqrt(
          Math.pow(touch2.clientX - touch1.clientX, 2) +
          Math.pow(touch2.clientY - touch1.clientY, 2)
        );
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      // Отменяем долгое нажатие при движении
      if (longPressTimeoutRef.current) {
        clearTimeout(longPressTimeoutRef.current);
        longPressTimeoutRef.current = null;
      }

      // Обработка pinch gesture
      if (e.touches.length === 2 && onPinch && initialDistanceRef.current > 0) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const currentDistance = Math.sqrt(
          Math.pow(touch2.clientX - touch1.clientX, 2) +
          Math.pow(touch2.clientY - touch1.clientY, 2)
        );
        const scale = currentDistance / initialDistanceRef.current;
        onPinch(scale);
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      // Отменяем долгое нажатие
      if (longPressTimeoutRef.current) {
        clearTimeout(longPressTimeoutRef.current);
        longPressTimeoutRef.current = null;
      }

      if (!touchStartRef.current) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;
      const deltaTime = Date.now() - touchStartRef.current.time;

      // Обработка двойного тапа
      if (onDoubleTap && Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10 && deltaTime < 300) {
        const now = Date.now();
        if (now - lastTapRef.current < 300) {
          onDoubleTap();
        }
        lastTapRef.current = now;
      }

      // Обработка свайпов
      if (deltaTime < 300 && (Math.abs(deltaX) > threshold || Math.abs(deltaY) > threshold)) {
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          // Горизонтальный свайп
          if (deltaX > 0 && onSwipeRight) {
            onSwipeRight();
          } else if (deltaX < 0 && onSwipeLeft) {
            onSwipeLeft();
          }
        } else {
          // Вертикальный свайп
          if (deltaY > 0 && onSwipeDown) {
            onSwipeDown();
          } else if (deltaY < 0 && onSwipeUp) {
            onSwipeUp();
          }
        }
      }

      touchStartRef.current = null;
      initialDistanceRef.current = 0;
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
      
      if (longPressTimeoutRef.current) {
        clearTimeout(longPressTimeoutRef.current);
      }
    };
  }, [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, onPinch, onDoubleTap, onLongPress, threshold]);

  return (
    <div 
      ref={elementRef} 
      className={className}
      style={{ touchAction: 'none' }}
    >
      {children}
    </div>
  );
};

// Хук для использования жестов
export const useSwipeGestures = (callbacks: Partial<TouchGesturesProps>) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Здесь можно добавить логику обработки жестов без компонента-обертки
    // Для простоты используем компонент TouchGestures
  }, [callbacks]);

  return ref;
};

// Пример использования:
// <TouchGestures
//   onSwipeLeft={() => console.log('Swipe left')}
//   onSwipeRight={() => console.log('Swipe right')}
//   onDoubleTap={() => console.log('Double tap')}
//   onLongPress={() => console.log('Long press')}
// >
//   <YourContent />
// </TouchGestures>