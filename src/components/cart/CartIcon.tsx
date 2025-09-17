import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore, useCartActions, useCartItemCount, useCartTotalFormatted } from '@/store/cartStore';
import { cn } from '@/lib/utils';

interface CartIconProps {
  className?: string;
  variant?: 'icon' | 'button' | 'full';
  showTotal?: boolean;
  showCount?: boolean;
}

export const CartIcon: React.FC<CartIconProps> = ({ 
  className,
  variant = 'button',
  showTotal = false,
  showCount = true
}) => {
  const { isOpen, totalItems, totalPrice } = useCartStore();
  const { openCart, toggleCart } = useCartActions();
  const totalPriceFormatted = useCartTotalFormatted();

  const handleClick = () => {
    if (isOpen) {
      toggleCart();
    } else {
      openCart();
    }
  };

  if (variant === 'icon') {
    return (
      <div className={cn("relative", className)}>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClick}
          className="relative"
        >
          <ShoppingCart className="h-5 w-5" />
          {showCount && totalItems > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1"
            >
              <Badge 
                variant="destructive" 
                className="h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {totalItems}
              </Badge>
            </motion.div>
          )}
        </Button>
      </div>
    );
  }

  if (variant === 'button') {
    return (
      <Button
        variant="outline"
        onClick={handleClick}
        className={cn("relative", className)}
      >
        <ShoppingCart className="h-4 w-4 mr-2" />
        Cart
        {showCount && totalItems > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="ml-2"
          >
            <Badge variant="secondary" className="text-xs">
              {totalItems}
            </Badge>
          </motion.div>
        )}
      </Button>
    );
  }

  if (variant === 'full') {
    return (
      <div className={cn("flex items-center space-x-2", className)}>
        <Button
          variant="outline"
          onClick={handleClick}
          className="flex items-center space-x-2"
        >
          <ShoppingBag className="h-4 w-4" />
          <span>Cart</span>
          {showCount && totalItems > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              <Badge variant="secondary" className="text-xs">
                {totalItems}
              </Badge>
            </motion.div>
          )}
        </Button>
        
        {showTotal && totalPrice > 0 && (
          <div className="text-sm font-medium text-gray-900">
            {totalPriceFormatted}
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default CartIcon;
