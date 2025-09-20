import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Loader2, ChefHat, Utensils, Wine, Star } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'dots' | 'pulse' | 'wave' | 'food' | 'gradient';
  text?: string;
  className?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
};

const textSizeClasses = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
  xl: 'text-lg',
};

export const EnhancedLoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'default',
  text,
  className,
}) => {
  const renderSpinner = () => {
    switch (variant) {
      case 'dots':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-primary rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        );

      case 'pulse':
        return (
          <motion.div
            className={cn('bg-primary rounded-full', sizeClasses[size])}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
            }}
          />
        );

      case 'wave':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className="w-1 bg-primary rounded-full"
                animate={{
                  height: ['8px', '20px', '8px'],
                }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              />
            ))}
          </div>
        );

      case 'food':
        return (
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="relative"
            >
              <ChefHat className={cn('text-primary', sizeClasses[size])} />
            </motion.div>
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: 0.5,
              }}
              className="absolute -top-1 -right-1"
            >
              <Star className="w-3 h-3 text-yellow-500" />
            </motion.div>
          </div>
        );

      case 'gradient':
        return (
          <motion.div
            className={cn(
              'rounded-full bg-gradient-to-r from-primary via-secondary to-primary',
              sizeClasses[size]
            )}
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{
              backgroundSize: '200% 200%',
            }}
          />
        );

      default:
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <Loader2 className={cn('text-primary', sizeClasses[size])} />
          </motion.div>
        );
    }
  };

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center space-y-2',
        className
      )}
    >
      {renderSpinner()}
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={cn(
            'text-muted-foreground font-medium',
            textSizeClasses[size]
          )}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

// Full page loading
interface FullPageLoadingProps {
  text?: string;
  variant?: LoadingSpinnerProps['variant'];
  showProgress?: boolean;
  progress?: number;
}

export const FullPageLoading: React.FC<FullPageLoadingProps> = ({
  text = 'Loading...',
  variant = 'food',
  showProgress = false,
  progress = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <div className="text-center space-y-6">
        <EnhancedLoadingSpinner size="xl" variant={variant} text={text} />

        {showProgress && (
          <div className="w-64 mx-auto">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Loading</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <motion.div
                className="bg-primary h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Skeleton loading
interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular' | 'card';
  lines?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'rectangular',
  lines = 1,
}) => {
  const renderSkeleton = () => {
    switch (variant) {
      case 'text':
        return (
          <div className="space-y-2">
            {Array.from({ length: lines }).map((_, i) => (
              <motion.div
                key={i}
                className={cn(
                  'h-4 bg-muted rounded',
                  i === lines - 1 && 'w-3/4',
                  className
                )}
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              />
            ))}
          </div>
        );

      case 'circular':
        return (
          <motion.div
            className={cn('bg-muted rounded-full', className)}
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
            }}
          />
        );

      case 'card':
        return (
          <motion.div
            className={cn('bg-muted rounded-lg p-4 space-y-3', className)}
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
            }}
          >
            <div className="h-4 bg-background/50 rounded w-3/4" />
            <div className="h-3 bg-background/50 rounded w-1/2" />
            <div className="h-3 bg-background/50 rounded w-2/3" />
          </motion.div>
        );

      default:
        return (
          <motion.div
            className={cn('bg-muted rounded', className)}
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
            }}
          />
        );
    }
  };

  return renderSkeleton();
};
