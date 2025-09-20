import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  animation?: 'fade' | 'slide' | 'scale' | 'flip' | 'glow';
  delay?: number;
  duration?: number;
  interactive?: boolean;
  gradient?: boolean;
  glass?: boolean;
}

const AnimatedCard = React.forwardRef<HTMLDivElement, AnimatedCardProps>(
  (
    {
      children,
      className,
      hover = true,
      animation = 'fade',
      delay = 0,
      duration = 0.3,
      interactive = false,
      gradient = false,
      glass = false,
      ...props
    },
    ref
  ) => {
    const [isHovered, setIsHovered] = useState(false);

    const animationVariants = {
      fade: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      },
      slide: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
      },
      scale: {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.9 },
      },
      flip: {
        initial: { opacity: 0, rotateY: -90 },
        animate: { opacity: 1, rotateY: 0 },
        exit: { opacity: 0, rotateY: 90 },
      },
      glow: {
        initial: { opacity: 0, boxShadow: '0 0 0 rgba(0,0,0,0)' },
        animate: {
          opacity: 1,
          boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)',
        },
        exit: { opacity: 0, boxShadow: '0 0 0 rgba(0,0,0,0)' },
      },
    };

    const hoverVariants = {
      hover: {
        scale: 1.02,
        y: -4,
        boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
        transition: { duration: 0.2 },
      },
      tap: {
        scale: 0.98,
        transition: { duration: 0.1 },
      },
    };

    return (
      <motion.div
        ref={ref}
        initial={animationVariants[animation].initial}
        animate={animationVariants[animation].animate}
        exit={animationVariants[animation].exit}
        transition={{
          duration,
          delay,
          ease: 'easeOut',
        }}
        whileHover={hover ? hoverVariants.hover : undefined}
        whileTap={interactive ? hoverVariants.tap : undefined}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className={cn(
          'relative overflow-hidden',
          {
            'cursor-pointer': interactive,
            'bg-gradient-to-br from-white to-gray-50': gradient,
            'bg-white/10 backdrop-blur-md border border-white/20': glass,
          },
          className
        )}
        {...props}
      >
        <Card
          className={cn('h-full transition-all duration-300', {
            'bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20':
              gradient,
            'bg-white/10 backdrop-blur-md border-white/20': glass,
            'shadow-lg': isHovered,
          })}
        >
          {children}
        </Card>

        {/* Animated background overlay */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none"
            />
          )}
        </AnimatePresence>
      </motion.div>
    );
  }
);

AnimatedCard.displayName = 'AnimatedCard';

export { AnimatedCard };
