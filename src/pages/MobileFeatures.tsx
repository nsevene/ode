import React from 'react';
import { TouchOptimized } from '@/components/mobile/TouchOptimized';
import { AppStatusBar } from '@/components/mobile/AppStatusBar';

const MobileFeatures = () => {
  return (
    <>
      <AppStatusBar />
      <TouchOptimized>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Mobile Features</h1>
          <p className="text-muted-foreground">Touch-optimized interface for mobile devices</p>
        </div>
      </TouchOptimized>
    </>
  );
};

export default MobileFeatures;