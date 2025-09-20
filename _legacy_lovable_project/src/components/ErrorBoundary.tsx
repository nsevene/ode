import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  retry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return (
          <FallbackComponent error={this.state.error!} retry={this.retry} />
        );
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <CardTitle className="text-xl font-semibold">
                Произошла ошибка
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                Что-то пошло не так. Пожалуйста, попробуйте еще раз.
              </p>
              {this.state.error && (
                <details className="text-left">
                  <summary className="text-sm font-medium cursor-pointer text-muted-foreground hover:text-foreground">
                    Детали ошибки
                  </summary>
                  <pre className="mt-2 text-xs bg-muted p-3 rounded-md overflow-auto">
                    {this.state.error.message}
                  </pre>
                </details>
              )}
              <div className="flex gap-3 justify-center">
                <Button onClick={this.retry} variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Попробовать снова
                </Button>
                <Button onClick={() => window.location.reload()}>
                  Обновить страницу
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook для обработки async ошибок
export const useErrorHandler = () => {
  const handleError = (error: Error | unknown, context?: string) => {
    const errorMessage =
      error instanceof Error ? error.message : 'Неизвестная ошибка';
    console.error(`Error in ${context || 'unknown context'}:`, error);

    // Можно добавить отправку ошибок в систему мониторинга
    // Например, Sentry, LogRocket, etc.
  };

  return { handleError };
};

export default ErrorBoundary;
