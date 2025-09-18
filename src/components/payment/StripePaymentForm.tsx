import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  CreditCard, 
  Lock, 
  CheckCircle, 
  AlertCircle,
  Loader2
} from 'lucide-react';
import { 
  getStripe, 
  createPaymentIntent, 
  confirmPayment,
  formatAmountForStripe,
  STRIPE_CONFIG,
  type CreatePaymentIntentRequest
} from '@/lib/stripe';
import { useToast } from '@/hooks/use-toast';

interface StripePaymentFormProps {
  amount: number;
  currency?: string;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
  metadata?: Record<string, string>;
  customerEmail?: string;
  description?: string;
}

const StripePaymentForm: React.FC<StripePaymentFormProps> = ({
  amount,
  currency = 'rub',
  onSuccess,
  onError,
  metadata = {},
  customerEmail,
  description
}) => {
  const { toast } = useToast();
  const [stripe, setStripe] = useState<any>(null);
  const [elements, setElements] = useState<any>(null);
  const [cardElement, setCardElement] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeStripe();
  }, []);

  const initializeStripe = async () => {
    try {
      const stripeInstance = await getStripe();
      if (!stripeInstance) {
        throw new Error('Stripe не инициализирован');
      }
      
      setStripe(stripeInstance);
      
      // Create elements instance
      const elementsInstance = stripeInstance.elements({
        appearance: STRIPE_CONFIG.appearance,
        locale: STRIPE_CONFIG.locale,
      });
      
      setElements(elementsInstance);
      
      // Create card element
      const cardElementInstance = elementsInstance.create('card', {
        style: {
          base: {
            fontSize: '16px',
            color: '#1f2937',
            '::placeholder': {
              color: '#9ca3af',
            },
          },
        },
      });
      
      setCardElement(cardElementInstance);
      
    } catch (err) {
      console.error('Error initializing Stripe:', err);
      onError('Ошибка инициализации платежной системы');
    }
  };

  const createPaymentIntentHandler = async () => {
    try {
      setLoading(true);
      setError(null);

      const request: CreatePaymentIntentRequest = {
        amount: formatAmountForStripe(amount),
        currency,
        metadata: {
          ...metadata,
          source: 'ode_food_hall_web',
        },
        customer_email: customerEmail,
        description: description || `Заказ в ODE Food Hall на ${amount} ₽`,
      };

      const response = await createPaymentIntent(request);
      setClientSecret(response.client_secret);
      
      toast({
        title: "Платеж подготовлен",
        description: "Введите данные карты для завершения оплаты",
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка создания платежа';
      setError(errorMessage);
      onError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!stripe || !elements || !cardElement || !clientSecret) {
      onError('Платежная система не готова');
      return;
    }

    try {
      setProcessing(true);
      setError(null);

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              email: customerEmail,
            },
          },
        }
      );

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      if (paymentIntent.status === 'succeeded') {
        onSuccess(paymentIntent.id);
        
        toast({
          title: "Платеж успешен",
          description: "Ваш заказ оплачен и будет обработан",
        });
      } else {
        throw new Error(`Неожиданный статус платежа: ${paymentIntent.status}`);
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка обработки платежа';
      setError(errorMessage);
      onError(errorMessage);
    } finally {
      setProcessing(false);
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="h-5 w-5 mr-2" />
          Оплата картой
        </CardTitle>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">
            {formatAmount(amount)}
          </p>
          <p className="text-sm text-gray-600">
            Безопасная оплата через Stripe
          </p>
        </div>
      </CardHeader>
      
      <CardContent>
        {!clientSecret ? (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                Нажмите кнопку ниже для подготовки платежа
              </p>
              <Button
                onClick={createPaymentIntentHandler}
                disabled={loading}
                className="w-full bg-orange-600 hover:bg-orange-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Подготавливаем платеж...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Подготовить платеж
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="card-element">Данные карты</Label>
              <div 
                id="card-element" 
                className="p-3 border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-orange-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Введите данные вашей карты для безопасной оплаты
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            )}

            <Separator />

            <div className="flex items-center text-sm text-gray-600">
              <Lock className="h-4 w-4 mr-2" />
              <span>Ваши данные защищены SSL-шифрованием</span>
            </div>

            <Button
              type="submit"
              disabled={processing || !stripe}
              className="w-full bg-orange-600 hover:bg-orange-700"
            >
              {processing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Обрабатываем платеж...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Оплатить {formatAmount(amount)}
                </>
              )}
            </Button>
          </form>
        )}

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Принимаем карты Visa, Mastercard, МИР
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StripePaymentForm;
