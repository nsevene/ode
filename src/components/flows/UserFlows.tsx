import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, 
  Calendar, 
  User, 
  ChefHat, 
  Star, 
  CheckCircle,
  ArrowRight,
  Home
} from 'lucide-react';

interface UserFlowProps {
  children: React.ReactNode;
}

export const UserFlows: React.FC<UserFlowProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  const { 
    cart, 
    currentBooking, 
    getCartItemsCount, 
    addNotification 
  } = useAppContext();

  const [currentFlow, setCurrentFlow] = useState<string | null>(null);

  // Detect current user flow based on location and state
  useEffect(() => {
    const path = location.pathname;
    
    if (path.startsWith('/menu') || cart.length > 0) {
      setCurrentFlow('ordering');
    } else if (path.startsWith('/booking') || currentBooking) {
      setCurrentFlow('booking');
    } else if (path.startsWith('/auth')) {
      setCurrentFlow('auth');
    } else if (path.startsWith('/admin')) {
      setCurrentFlow('admin');
    } else {
      setCurrentFlow(null);
    }
  }, [location.pathname, cart.length, currentBooking]);

  // Show flow progress for authenticated users
  if (!isAuthenticated || !currentFlow) {
    return <>{children}</>;
  }

  const getFlowSteps = () => {
    switch (currentFlow) {
      case 'ordering':
        return [
          { id: 'menu', label: 'Меню', completed: location.pathname.startsWith('/menu') },
          { id: 'cart', label: 'Корзина', completed: cart.length > 0 },
          { id: 'checkout', label: 'Оформление', completed: location.pathname.startsWith('/checkout') },
          { id: 'payment', label: 'Оплата', completed: location.pathname.startsWith('/payment') }
        ];
      case 'booking':
        return [
          { id: 'date', label: 'Дата', completed: !!currentBooking?.date },
          { id: 'time', label: 'Время', completed: !!currentBooking?.time },
          { id: 'details', label: 'Детали', completed: !!currentBooking?.name },
          { id: 'confirmation', label: 'Подтверждение', completed: currentBooking?.status === 'confirmed' }
        ];
      case 'auth':
        return [
          { id: 'login', label: 'Вход', completed: location.pathname.includes('login') },
          { id: 'register', label: 'Регистрация', completed: location.pathname.includes('register') },
          { id: 'profile', label: 'Профиль', completed: location.pathname.includes('profile') }
        ];
      default:
        return [];
    }
  };

  const flowSteps = getFlowSteps();
  const currentStepIndex = flowSteps.findIndex(step => !step.completed);
  const progress = flowSteps.length > 0 ? (currentStepIndex / flowSteps.length) * 100 : 0;

  return (
    <div className="relative">
      {/* Flow Progress Bar */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {currentFlow === 'ordering' && <ShoppingCart className="h-5 w-5 text-blue-600" />}
                {currentFlow === 'booking' && <Calendar className="h-5 w-5 text-green-600" />}
                {currentFlow === 'auth' && <User className="h-5 w-5 text-purple-600" />}
                <span className="font-semibold text-gray-900">
                  {currentFlow === 'ordering' && 'Заказ'}
                  {currentFlow === 'booking' && 'Бронирование'}
                  {currentFlow === 'auth' && 'Аутентификация'}
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className="flex-1 max-w-md">
                <div className="bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center space-x-2">
              {currentFlow === 'ordering' && cart.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/cart')}
                  className="flex items-center space-x-1"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>Корзина ({getCartItemsCount()})</span>
                </Button>
              )}
              
              {currentFlow === 'booking' && currentBooking && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/my-bookings')}
                  className="flex items-center space-x-1"
                >
                  <Calendar className="h-4 w-4" />
                  <span>Мои бронирования</span>
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="flex items-center space-x-1"
              >
                <Home className="h-4 w-4" />
                <span>Главная</span>
              </Button>
            </div>
          </div>

          {/* Flow Steps */}
          <div className="flex items-center space-x-4 pb-4">
            {flowSteps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex items-center space-x-2">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                    ${step.completed 
                      ? 'bg-green-100 text-green-600' 
                      : index === currentStepIndex
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-100 text-gray-400'
                    }
                  `}>
                    {step.completed ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span className={`
                    text-sm font-medium
                    ${step.completed 
                      ? 'text-green-600' 
                      : index === currentStepIndex
                        ? 'text-blue-600'
                        : 'text-gray-400'
                    }
                  `}>
                    {step.label}
                  </span>
                </div>
                {index < flowSteps.length - 1 && (
                  <ArrowRight className="h-4 w-4 text-gray-400 mx-2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    </div>
  );
};

export default UserFlows;
