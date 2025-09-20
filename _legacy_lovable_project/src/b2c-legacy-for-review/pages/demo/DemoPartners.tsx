import React from 'react';
import ImprovedNavigation from '@/components/ImprovedNavigation';

const DemoPartners = () => {
  return (
    <div className="min-h-screen bg-background">
      <ImprovedNavigation />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Demo Partners</h1>
            <p className="text-xl text-muted-foreground">
              Демо-страница для партнеров
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DemoPartners;
