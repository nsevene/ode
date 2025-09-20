import React, { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';

interface CartBarProps {
  itemCount: number;
  onCheckout?: () => void;
}

const KitchenCartBar: React.FC<CartBarProps> = ({ itemCount, onCheckout }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400 || itemCount > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [itemCount]);

  if (!isVisible && itemCount === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '.5rem',
        padding: '.75rem 1rem',
        background: '#fff',
        borderTop: '1px solid #eee',
        boxShadow: '0 -4px 12px rgba(0,0,0,.08)',
        borderRadius: '1rem 1rem 0 0',
        transition: '.3s',
        transform: isVisible ? 'translateY(0)' : 'translateY(110%)',
        cursor: 'pointer',
      }}
      onClick={onCheckout}
    >
      <ShoppingCart className="w-5 h-5" />
      <span>Checkout ({itemCount})</span>
    </div>
  );
};

export default KitchenCartBar;
