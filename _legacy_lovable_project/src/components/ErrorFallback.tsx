import React, { useState, useEffect } from 'react';
import { AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ErrorFallbackProps {
  componentName?: string;
  error?: Error;
  onRetry?: () => void;
  showHomeLink?: boolean;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  componentName = 'Component',
  error,
  onRetry,
  showHomeLink = true,
}) => {
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    setRetryCount((prev) => prev + 1);

    // Add delay to prevent immediate retry spam
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsRetrying(false);
    onRetry?.();
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  useEffect(() => {
    // Log error for monitoring
    if (error) {
      console.error(`Component ${componentName} failed to load:`, error);
    }
  }, [error, componentName]);

  return (
    <div className="flex items-center justify-center min-h-[300px] p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-xl font-semibold text-gray-900">
            Failed to Load {componentName}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-gray-600">
            Something went wrong while loading this content. This might be due
            to a network issue or temporary problem.
          </p>

          {error && (
            <details className="bg-gray-50 p-3 rounded-lg">
              <summary className="cursor-pointer text-sm font-medium text-gray-700">
                Technical Details
              </summary>
              <pre className="mt-2 text-xs text-gray-600 overflow-auto">
                {error.message}
                {error.stack && `\n\n${error.stack}`}
              </pre>
            </details>
          )}

          <div className="flex flex-col gap-2">
            <Button
              onClick={handleRetry}
              disabled={isRetrying || retryCount >= 3}
              className="w-full flex items-center justify-center gap-2"
            >
              <RefreshCw
                className={`h-4 w-4 ${isRetrying ? 'animate-spin' : ''}`}
              />
              {isRetrying
                ? 'Retrying...'
                : retryCount >= 3
                  ? 'Max retries reached'
                  : `Try Again${retryCount > 0 ? ` (${retryCount}/3)` : ''}`}
            </Button>

            {showHomeLink && (
              <Button
                variant="outline"
                onClick={handleGoHome}
                className="w-full flex items-center justify-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Go to Homepage
              </Button>
            )}
          </div>

          {retryCount >= 3 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                If the problem persists, please try refreshing the page or
                contact support.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorFallback;
