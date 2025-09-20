import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  useCartStore,
  useCartActions,
  useCartTotalFormatted,
  useCartItemCount,
} from '@/store/cartStore';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface ShoppingCartProps {
  className?: string;
}

export const ShoppingCart: React.FC<ShoppingCartProps> = ({ className }) => {
  const { items, isOpen, isEmpty, totalItems, totalPrice } = useCartStore();
  const {
    removeItem,
    updateQuantity,
    clearCart,
    closeCart,
    incrementItem,
    decrementItem,
  } = useCartActions();
  const totalPriceFormatted = useCartTotalFormatted();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/checkout');
    closeCart();
  };

  const handleClearCart = () => {
    if (confirm('Are you sure you want to clear your cart?')) {
      clearCart();
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        'fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4',
        className
      )}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          closeCart();
        }
      }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold">Shopping Cart</h2>
            {totalItems > 0 && (
              <Badge variant="secondary">{totalItems} items</Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={closeCart}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex flex-col h-full max-h-[60vh]">
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <ShoppingBag className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Your cart is empty
              </h3>
              <p className="text-gray-500 text-center mb-6">
                Add some delicious items from our menu to get started!
              </p>
              <Button onClick={closeCart} variant="outline">
                Continue Shopping
              </Button>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex items-center space-x-3"
                    >
                      {/* Item Image */}
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <ShoppingBag className="h-6 w-6 text-gray-400" />
                        )}
                      </div>

                      {/* Item Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {item.name}
                        </h4>
                        {item.category && (
                          <p className="text-xs text-gray-500">
                            {item.category}
                          </p>
                        )}
                        {item.kitchen && (
                          <p className="text-xs text-blue-600">
                            {item.kitchen}
                          </p>
                        )}
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-sm font-semibold text-gray-900">
                            {new Intl.NumberFormat('ru-RU', {
                              style: 'currency',
                              currency: 'RUB',
                              minimumFractionDigits: 0,
                            }).format(item.price)}
                          </span>
                          {item.isVegetarian && (
                            <Badge variant="outline" className="text-xs">
                              Veg
                            </Badge>
                          )}
                          {item.isVegan && (
                            <Badge variant="outline" className="text-xs">
                              Vegan
                            </Badge>
                          )}
                          {item.isGlutenFree && (
                            <Badge variant="outline" className="text-xs">
                              GF
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => decrementItem(item.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium w-8 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => incrementItem(item.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      {/* Remove Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="border-t p-4 space-y-4">
                {/* Summary */}
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-lg font-bold text-blue-600">
                    {totalPriceFormatted}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={handleClearCart}
                    className="flex-1"
                  >
                    Clear Cart
                  </Button>
                  <Button
                    onClick={handleCheckout}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Checkout
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ShoppingCart;
