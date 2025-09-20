import React from 'react';
import ImprovedNavigation from '@/components/ImprovedNavigation';
import FoodOrderingSystem from '@/components/food-ordering/FoodOrderingSystem';
import { useIsMobile } from '@/hooks/use-mobile';

const FoodOrdering = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pure-white via-cream-light to-cream-medium/30">
      <ImprovedNavigation />

      <main className={`${isMobile ? 'pb-20' : ''}`}>
        <FoodOrderingSystem />
      </main>
    </div>
  );
};

export default FoodOrdering;
