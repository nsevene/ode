import React from 'react';
import { Loader2, ChefHat } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  variant?: 'default' | 'chef' | 'minimal';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  text = 'Загрузка...', 
  variant = 'default' 
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  if (variant === 'minimal') {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className={`${sizes[size]} animate-spin text-primary`} />
      </div>
    );
  }

  if (variant === 'chef') {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <div className="relative">
          <ChefHat className={`${sizes[size]} text-primary animate-bounce`} />
          <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
        </div>
        <div className="text-center">
          <p className={`${textSizes[size]} font-medium text-charcoal animate-pulse`}>
            {text}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Готовим что-то особенное...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4" role="status" aria-label="Loading">
      <div className="relative">
        <Loader2 className={`${sizes[size]} animate-spin text-primary`} />
        <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-pulse" />
      </div>
      <div className="text-center">
        <p className={`${textSizes[size]} font-medium text-charcoal animate-pulse`}>
          {text}
        </p>
        <div className="flex space-x-1 mt-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;