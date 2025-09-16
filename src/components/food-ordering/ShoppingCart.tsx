import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Plus, Minus, Trash2, ShoppingCartIcon, CreditCard } from 'lucide-react';
import { MenuItem, CartItem } from '@/types/common';

interface ShoppingCartProps {
  cartItems: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onUpdateSpecialRequests: (itemId: string, requests: string) => void;
  onCheckout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onUpdateSpecialRequests,
  onCheckout,
  isOpen,
  onClose
}) => {
  const [orderType, setOrderType] = useState<'pickup' | 'delivery' | 'dine_in'>('pickup');

  const formatPrice = (priceInCents: number) => {
    return `$${(priceInCents / 100).toFixed(2)}`;
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.price_usd * item.quantity);
    }, 0);
  };

  const calculateTax = (subtotal: number) => {
    return Math.round(subtotal * 0.1); // 10% налог
  };

  const calculateDeliveryFee = () => {
    return orderType === 'delivery' ? 300 : 0; // $3.00 для доставки
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax(subtotal);
    const deliveryFee = calculateDeliveryFee();
    return subtotal + tax + deliveryFee;
  };

  const getTotalPrepTime = () => {
    return Math.max(...cartItems.map(item => item.prep_time_minutes || 0));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
      <div className="bg-white w-full max-w-md h-full overflow-y-auto shadow-xl">
        <div className="sticky top-0 bg-white border-b border-border p-4 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-charcoal flex items-center gap-2">
              <ShoppingCartIcon className="w-5 h-5" />
              Корзина ({cartItems.length} {cartItems.length === 1 ? 'товар' : cartItems.length < 5 ? 'товара' : 'товаров'})
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>
        </div>

        <div className="p-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCartIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg text-muted-foreground mb-2">Корзина пуста</p>
              <p className="text-sm text-muted-foreground">
                Добавьте блюда из меню, чтобы сделать заказ
              </p>
            </div>
          ) : (
            <>
              {/* Order Type Selection */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Тип заказа</h3>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={orderType === 'pickup' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setOrderType('pickup')}
                    className="text-xs"
                  >
                    Самовывоз
                  </Button>
                  <Button
                    variant={orderType === 'dine_in' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setOrderType('dine_in')}
                    className="text-xs"
                  >
                    В зале
                  </Button>
                  <Button
                    variant={orderType === 'delivery' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setOrderType('delivery')}
                    className="text-xs"
                  >
                    Доставка
                  </Button>
                </div>
              </div>

              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <Card key={item.id} className="p-4">
                    <div className="flex gap-3">
                      <img
                        src={item.image_url || '/lovable-uploads/3f00f862-daaa-4d2d-b462-b7347e9e5cdb.png'}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-charcoal truncate">
                          {item.name}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {item.vendor_name}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="font-semibold text-forest-green">
                            {formatPrice(item.price_usd)}
                          </span>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="text-sm font-medium w-8 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-500 hover:text-red-700"
                              onClick={() => onRemoveItem(item.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        
                        {/* Special Requests */}
                        <div className="mt-3">
                          <Textarea
                            placeholder="Особые пожелания..."
                            value={item.specialRequests || ''}
                            onChange={(e) => onUpdateSpecialRequests(item.id, e.target.value)}
                            className="text-xs"
                            rows={2}
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Order Summary */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">Итог заказа</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Стоимость блюд:</span>
                    <span>{formatPrice(calculateSubtotal())}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Налог (10%):</span>
                    <span>{formatPrice(calculateTax(calculateSubtotal()))}</span>
                  </div>
                  {orderType === 'delivery' && (
                    <div className="flex justify-between text-sm">
                      <span>Доставка:</span>
                      <span>{formatPrice(calculateDeliveryFee())}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Итого:</span>
                    <span className="text-forest-green">{formatPrice(calculateTotal())}</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Время приготовления:</span>
                    <span>{getTotalPrepTime()} мин</span>
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Address */}
              {orderType === 'delivery' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    Адрес доставки
                  </label>
                  <Textarea
                    placeholder="Введите адрес доставки..."
                    rows={3}
                  />
                </div>
              )}

              {/* Checkout Button */}
              <Button
                onClick={onCheckout}
                className="w-full bg-gradient-to-r from-forest-green to-sage-blue hover:from-forest-green/90 hover:to-sage-blue/90 text-white py-6 text-lg"
              >
                <CreditCard className="w-5 h-5 mr-2" />
                Оформить заказ
              </Button>

              <p className="text-xs text-muted-foreground text-center mt-3">
                После оформления заказа с вами свяжутся для подтверждения
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;