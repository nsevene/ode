import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useAppStore } from '@/store/appStore';
import { LoadingSpinner } from '@/components/LoadingStates';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LoadingStatesProps {
  children: React.ReactNode;
}

export const LoadingStates: React.FC<LoadingStatesProps> = ({ children }) => {
  const { loading: authLoading } = useAuth();
  const { isLoading, error, setError } = useAppStore();
  const navigate = useNavigate();

  // Show loading spinner for authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-lg font-semibold text-gray-600">
            Проверка аутентификации...
          </p>
        </div>
      </div>
    );
  }

  // Show loading spinner for app loading
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-lg font-semibold text-gray-600">
            Загрузка...
          </p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-6">
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Произошла ошибка
            </h1>
            <p className="text-gray-600 mb-6">
              {error}
            </p>
          </div>
          
          <div className="space-y-3">
            <Button
              onClick={() => {
                setError(null);
                window.location.reload();
              }}
              className="w-full"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Попробовать снова
            </Button>
            
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="w-full"
            >
              <Home className="h-4 w-4 mr-2" />
              На главную
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default LoadingStates;
