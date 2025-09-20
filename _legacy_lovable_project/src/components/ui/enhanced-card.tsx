import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './card';
import { cn } from '@/lib/utils';
import { Skeleton } from './skeleton';

export interface EnhancedCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'filled' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  hover?: boolean;
  loading?: boolean;
  interactive?: boolean;
}

const EnhancedCard = React.forwardRef<HTMLDivElement, EnhancedCardProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      hover = false,
      loading = false,
      interactive = false,
      children,
      ...props
    },
    ref
  ) => {
    const cardVariants = {
      default: 'bg-card text-card-foreground border',
      elevated: 'bg-card text-card-foreground shadow-elegant border-0',
      outlined: 'bg-transparent border-2 border-primary/20',
      filled: 'bg-primary/5 text-card-foreground border-primary/10',
      glass: 'bg-card/50 backdrop-blur-sm border border-white/20',
    };

    const cardSizes = {
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    const hoverEffects = hover
      ? 'hover:shadow-medium hover:scale-[1.02] transition-all duration-300'
      : '';
    const interactiveEffects = interactive
      ? 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20'
      : '';

    if (loading) {
      return (
        <Card
          ref={ref}
          className={cn(cardVariants[variant], cardSizes[size], className)}
          {...props}
        >
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>
      );
    }

    return (
      <Card
        ref={ref}
        className={cn(
          cardVariants[variant],
          cardSizes[size],
          hoverEffects,
          interactiveEffects,
          className
        )}
        {...props}
      >
        {children}
      </Card>
    );
  }
);

EnhancedCard.displayName = 'EnhancedCard';

// Enhanced Card Components with built-in optimizations
const EnhancedCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { compact?: boolean }
>(({ className, compact = false, ...props }, ref) => (
  <CardHeader
    ref={ref}
    className={cn(compact ? 'pb-3' : 'pb-6', className)}
    {...props}
  />
));
EnhancedCardHeader.displayName = 'EnhancedCardHeader';

const EnhancedCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement> & {
    level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    truncate?: boolean;
  }
>(({ className, level = 'h3', truncate = false, children, ...props }, ref) => {
  const Component = level;

  return (
    <Component
      ref={ref}
      className={cn(
        'font-semibold leading-none tracking-tight',
        truncate && 'truncate',
        level === 'h1' && 'text-3xl',
        level === 'h2' && 'text-2xl',
        level === 'h3' && 'text-xl',
        level === 'h4' && 'text-lg',
        level === 'h5' && 'text-base',
        level === 'h6' && 'text-sm',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
});
EnhancedCardTitle.displayName = 'EnhancedCardTitle';

const EnhancedCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & { lines?: number }
>(({ className, lines, children, ...props }, ref) => (
  <CardDescription
    ref={ref}
    className={cn(
      'text-muted-foreground',
      lines && `line-clamp-${lines}`,
      className
    )}
    {...props}
  >
    {children}
  </CardDescription>
));
EnhancedCardDescription.displayName = 'EnhancedCardDescription';

const EnhancedCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    spacing?: 'none' | 'sm' | 'md' | 'lg';
  }
>(({ className, spacing = 'md', ...props }, ref) => {
  const spacingClasses = {
    none: '',
    sm: 'space-y-2',
    md: 'space-y-4',
    lg: 'space-y-6',
  };

  return (
    <CardContent
      ref={ref}
      className={cn(spacingClasses[spacing], className)}
      {...props}
    />
  );
});
EnhancedCardContent.displayName = 'EnhancedCardContent';

const EnhancedCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    justify?: 'start' | 'center' | 'end' | 'between';
  }
>(({ className, justify = 'start', ...props }, ref) => {
  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
  };

  return (
    <CardFooter
      ref={ref}
      className={cn('flex items-center', justifyClasses[justify], className)}
      {...props}
    />
  );
});
EnhancedCardFooter.displayName = 'EnhancedCardFooter';

export {
  EnhancedCard,
  EnhancedCardHeader,
  EnhancedCardTitle,
  EnhancedCardDescription,
  EnhancedCardContent,
  EnhancedCardFooter,
};
