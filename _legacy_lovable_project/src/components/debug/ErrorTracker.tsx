import React, { useEffect, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorLog {
  id: string;
  message: string;
  stack?: string;
  timestamp: Date;
  url: string;
  userAgent: string;
  severity: 'low' | 'medium' | 'high';
}

export const ErrorTracker: React.FC = () => {
  const [errors, setErrors] = useState<ErrorLog[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      const error: ErrorLog = {
        id: Date.now().toString(),
        message: event.message,
        stack: event.error?.stack,
        timestamp: new Date(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        severity: event.error?.name === 'ChunkLoadError' ? 'high' : 'medium',
      };

      setErrors((prev) => [error, ...prev.slice(0, 9)]); // Keep last 10 errors

      // Send to analytics if available
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'exception', {
          description: event.message,
          fatal: false,
        });
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error: ErrorLog = {
        id: Date.now().toString(),
        message: `Unhandled Promise Rejection: ${event.reason}`,
        timestamp: new Date(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        severity: 'high',
      };

      setErrors((prev) => [error, ...prev.slice(0, 9)]);

      if (typeof window.gtag === 'function') {
        window.gtag('event', 'exception', {
          description: `Promise rejection: ${event.reason}`,
          fatal: false,
        });
      }
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener(
        'unhandledrejection',
        handleUnhandledRejection
      );
    };
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'secondary';
      case 'low':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const clearErrors = () => setErrors([]);

  if (errors.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      {!isVisible ? (
        <Button
          variant="destructive"
          size="sm"
          onClick={() => setIsVisible(true)}
          className="animate-pulse"
        >
          <AlertTriangle className="h-4 w-4 mr-2" />
          {errors.length} Error{errors.length > 1 ? 's' : ''}
        </Button>
      ) : (
        <Card className="bg-card border-destructive">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center justify-between">
              <span className="flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2 text-destructive" />
                Error Log
              </span>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={clearErrors}>
                  <RefreshCw className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsVisible(false)}
                >
                  ×
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="max-h-60 overflow-y-auto space-y-2">
            {errors.map((error) => (
              <Alert key={error.id} className="p-2">
                <AlertDescription className="text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <Badge
                      variant={getSeverityColor(error.severity)}
                      className="text-xs"
                    >
                      {error.severity}
                    </Badge>
                    <span className="text-muted-foreground">
                      {error.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="font-mono break-all">{error.message}</p>
                </AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
