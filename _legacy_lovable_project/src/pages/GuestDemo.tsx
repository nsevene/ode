import React from 'react';
import ImprovedNavigation from '@/components/ImprovedNavigation';

const GuestDemo = () => {
  return (
    <div className="min-h-screen bg-background">
      <ImprovedNavigation />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Guest Demo</h1>
            <p className="text-xl text-muted-foreground">
              Демо-страница для гостей
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GuestDemo;
