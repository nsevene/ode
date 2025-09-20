import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import FoodMenu from './FoodMenu';
import ShoppingCart from './ShoppingCart';
import { ShoppingCartIcon } from 'lucide-react';
import { MenuItem, CartItem } from '@/types/common';

const FoodOrderingSystem: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { toast } = useToast();

  const handleAddToCart = (newItem: CartItem) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.id === newItem.id
      );

      if (existingItemIndex >= 0) {
        // Если товар уже есть в корзине, обновляем количество
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: newItem.quantity,
        };
        return updatedItems;
      } else {
        // Если товара нет в корзине, добавляем его
        return [...prevItems, newItem];
      }
    });
  };

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(itemId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const handleUpdateSpecialRequests = (itemId: string, requests: string) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, specialRequests: requests } : item
      )
    );
  };

  const handleCheckout = () => {
    // Simulate checkout process
    toast({
      title: 'Checkout initiated',
      description: 'Redirecting to Stripe payment gateway...',
    });

    // In production, this would redirect to payment processor
    setTimeout(() => {
      toast({
        title: 'Order placed successfully!',
        description: 'You will receive confirmation email shortly.',
      });
      setCartItems([]); // Clear cart after successful order
    }, 2000);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      return total + item.price_usd * item.quantity;
    }, 0);
  };

  const formatPrice = (priceInCents: number) => {
    return `$${(priceInCents / 100).toFixed(2)}`;
  };

  return (
    <div className="relative">
      {/* Fixed cart button */}
      <div className="fixed bottom-4 right-4 z-40">
        <Button
          onClick={() => setIsCartOpen(true)}
          className="bg-forest-green hover:bg-forest-green/90 text-white rounded-full shadow-lg p-3"
          size="lg"
        >
          <ShoppingCartIcon className="w-5 h-5 mr-2" />
          <span className="font-semibold">
            {getTotalItems()} · {formatPrice(getTotalPrice())}
          </span>
          {getTotalItems() > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {getTotalItems()}
            </Badge>
          )}
        </Button>
      </div>

      {/* Food Menu */}
      <FoodMenu onAddToCart={handleAddToCart} cartItems={cartItems} />

      {/* Shopping Cart */}
      <ShoppingCart
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onUpdateSpecialRequests={handleUpdateSpecialRequests}
        onCheckout={handleCheckout}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </div>
  );
};

export default FoodOrderingSystem;
