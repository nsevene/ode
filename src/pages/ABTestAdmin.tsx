import React from 'react';
import { ABTestDashboard } from '@/components/admin/ABTestDashboard';

const ABTestAdmin = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <ABTestDashboard />
      </div>
    </div>
  );
};

export default ABTestAdmin;