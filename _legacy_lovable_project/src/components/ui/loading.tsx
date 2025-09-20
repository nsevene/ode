import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  text,
  className,
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-2',
        className
      )}
    >
      <Loader2 className={cn('animate-spin text-primary', sizeClasses[size])} />
      {text && (
        <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
      )}
    </div>
  );
};

interface LoadingStateProps {
  isLoading: boolean;
  error?: Error | null;
  children: React.ReactNode;
  loadingText?: string;
  errorText?: string;
  onRetry?: () => void;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  isLoading,
  error,
  children,
  loadingText = 'Загрузка...',
  errorText = 'Произошла ошибка',
  onRetry,
}) => {
  if (isLoading) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <LoadingSpinner text={loadingText} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[200px] flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <p className="text-destructive font-medium">{errorText}</p>
          <p className="text-sm text-muted-foreground">{error.message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="text-primary hover:underline text-sm font-medium"
            >
              Попробовать снова
            </button>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
