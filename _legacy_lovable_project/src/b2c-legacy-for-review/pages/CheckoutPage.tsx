import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  CreditCard,
  ShoppingBag,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import StripePaymentForm from '@/components/payment/StripePaymentForm';
import {
  sendOrderConfirmation,
  type OrderConfirmationEmail,
} from '@/lib/email';
import { useStripePayment } from '@/hooks/useStripePayment';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const {
    stripe,
    clientSecret,
    isLoading: isPaymentLoading,
    error: paymentError,
  } = useStripePayment();

  const [loading, setLoading] = useState(false);
  const [appError, setAppError] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const [formData, setFormData] = useState({
    firstName: user?.user_metadata?.full_name?.split(' ')[0] || '',
    lastName: user?.user_metadata?.full_name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: user?.user_metadata?.phone || '',
    address: '',
    city: '',
    zipCode: '',
    specialInstructions: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card');

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (items.length === 0) {
      navigate('/vendors');
      return;
    }
  }, [user, items, navigate]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    const required = [
      'firstName',
      'lastName',
      'email',
      'phone',
      'address',
      'city',
    ];
    const missing = required.filter(
      (field) => !formData[field as keyof typeof formData]
    );

    if (missing.length > 0) {
      setAppError(`Пожалуйста, заполните: ${missing.join(', ')}`);
      return false;
    }

    return true;
  };

  const handleSubmitOrder = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      setAppError(null);

      const orderPayload = {
        orderDetails: {
          totalAmount: totalPrice,
          deliveryAddress: `${formData.address}, ${formData.city}`,
          customerName: `${formData.firstName} ${formData.lastName}`,
          phone: formData.phone,
          specialInstructions: formData.specialInstructions,
        },
        cartItems: items.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        userId: user!.id,
      };

      const { error } = await supabase.functions.invoke('create-order', {
        body: orderPayload,
      });

      if (error) throw new Error(error.message);

      // Отправляем email подтверждение
      if (user?.email) {
        const orderData: OrderConfirmationEmail = {
          customerName: formData.firstName + ' ' + formData.lastName,
          orderNumber: `ODE-${Date.now()}`,
          orderDate: new Date().toLocaleDateString('ru-RU'),
          totalAmount: totalPrice,
          items: items.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            vendorName: item.kitchen,
          })),
          deliveryAddress: `${formData.address}, ${formData.city}`,
          estimatedDelivery: new Date(
            Date.now() + 60 * 60 * 1000
          ).toLocaleString('ru-RU'),
        };

        await sendOrderConfirmation(user.email, orderData);
      }

      setOrderSuccess(true);
      clearCart();
    } catch (err) {
      setAppError('Ошибка при оформлении заказа. Попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    try {
      setLoading(true);
      setAppError(null);

      // Здесь будет создание заказа с payment_intent_id
      console.log('Payment successful:', paymentIntentId);

      const orderPayload = {
        orderDetails: {
          totalAmount: totalPrice,
          deliveryAddress: `${formData.address}, ${formData.city}`,
          customerName: `${formData.firstName} ${formData.lastName}`,
          phone: formData.phone,
          specialInstructions: formData.specialInstructions,
        },
        cartItems: items.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        userId: user!.id,
        paymentIntentId: paymentIntentId,
      };

      const { error } = await supabase.functions.invoke('create-order', {
        body: orderPayload,
      });

      if (error) throw new Error(error.message);

      // Отправляем email подтверждение
      if (user?.email) {
        const orderData: OrderConfirmationEmail = {
          customerName: formData.firstName + ' ' + formData.lastName,
          orderNumber: `ODE-${Date.now()}`,
          orderDate: new Date().toLocaleDateString('ru-RU'),
          totalAmount: totalPrice,
          items: items.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            vendorName: item.kitchen,
          })),
          deliveryAddress: `${formData.address}, ${formData.city}`,
          estimatedDelivery: new Date(
            Date.now() + 60 * 60 * 1000
          ).toLocaleString('ru-RU'),
        };

        await sendOrderConfirmation(user.email, orderData);
      }

      setOrderSuccess(true);
      clearCart();
    } catch (err) {
      setAppError('Ошибка при обработке платежа. Попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentError = (errorMsg: string) => {
    setAppError(errorMsg);
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Заказ оформлен!
            </h2>
            <p className="text-gray-600 mb-6">
              Ваш заказ успешно принят. Мы свяжемся с вами для подтверждения.
            </p>
            <div className="space-y-2">
              <Button onClick={() => navigate('/vendors')} className="w-full">
                Продолжить покупки
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/profile')}
                className="w-full"
              >
                Мой профиль
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">
              Оформление заказа
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Ваш заказ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-600">
                          {item.vendor.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {item.quantity} шт.
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {(item.price * item.quantity).toFixed(0)} ₽
                        </p>
                      </div>
                    </div>
                  ))}

                  <Separator />

                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Итого:</span>
                    <span>{totalPrice.toFixed(0)} ₽</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Детали заказа</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {appError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                      <p className="text-red-700">{appError}</p>
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Личная информация
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Имя *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) =>
                          handleInputChange('firstName', e.target.value)
                        }
                        placeholder="Ваше имя"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Фамилия *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) =>
                          handleInputChange('lastName', e.target.value)
                        }
                        placeholder="Ваша фамилия"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange('email', e.target.value)
                        }
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Телефон *</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) =>
                          handleInputChange('phone', e.target.value)
                        }
                        placeholder="+7 (999) 123-45-67"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Адрес доставки
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="address">Адрес *</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) =>
                          handleInputChange('address', e.target.value)
                        }
                        placeholder="Улица, дом, квартира"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">Город *</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) =>
                            handleInputChange('city', e.target.value)
                          }
                          placeholder="Москва"
                        />
                      </div>
                      <div>
                        <Label htmlFor="zipCode">Индекс</Label>
                        <Input
                          id="zipCode"
                          value={formData.zipCode}
                          onChange={(e) =>
                            handleInputChange('zipCode', e.target.value)
                          }
                          placeholder="123456"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Способ оплаты
                  </h3>
                  <div className="space-y-3">
                    <div
                      className={`border rounded-lg p-4 cursor-pointer ${
                        paymentMethod === 'card'
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200'
                      }`}
                      onClick={() => setPaymentMethod('card')}
                    >
                      <div className="flex items-center">
                        <CreditCard className="h-5 w-5 mr-3" />
                        <div>
                          <p className="font-medium">Банковская карта</p>
                          <p className="text-sm text-gray-600">
                            Visa, Mastercard, МИР
                          </p>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`border rounded-lg p-4 cursor-pointer ${
                        paymentMethod === 'cash'
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200'
                      }`}
                      onClick={() => setPaymentMethod('cash')}
                    >
                      <div className="flex items-center">
                        <div className="h-5 w-5 mr-3 flex items-center justify-center">
                          💵
                        </div>
                        <div>
                          <p className="font-medium">Наличными при получении</p>
                          <p className="text-sm text-gray-600">
                            Оплата курьеру
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stripe Payment Form */}
                {paymentMethod === 'card' && (
                  <div className="mt-6">
                    {isPaymentLoading && (
                      <div className="space-y-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    )}
                    {paymentError && (
                      <p className="text-red-500 text-sm">{paymentError}</p>
                    )}
                    {stripe && clientSecret && (
                      <StripePaymentForm
                        stripe={stripe}
                        clientSecret={clientSecret}
                        onSuccess={handlePaymentSuccess}
                        onError={handlePaymentError}
                      />
                    )}
                  </div>
                )}

                <Separator />

                <div>
                  <Label htmlFor="specialInstructions">Особые пожелания</Label>
                  <textarea
                    id="specialInstructions"
                    value={formData.specialInstructions}
                    onChange={(e) =>
                      handleInputChange('specialInstructions', e.target.value)
                    }
                    placeholder="Дополнительные инструкции для курьера..."
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    rows={3}
                  />
                </div>

                {paymentMethod === 'cash' && (
                  <Button
                    onClick={handleSubmitOrder}
                    disabled={loading}
                    className="w-full bg-orange-600 hover:bg-orange-700"
                    size="lg"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Оформляем заказ...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4 mr-2" />
                        Оформить заказ за {totalPrice.toFixed(0)} ₽
                      </>
                    )}
                  </Button>
                )}

                {paymentMethod === 'card' && (
                  <div className="text-center text-sm text-gray-600">
                    <p>Используйте форму оплаты картой выше</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
