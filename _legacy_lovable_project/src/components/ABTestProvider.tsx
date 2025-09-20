import React, { createContext, useContext, ReactNode } from 'react';
import { useABTesting, ABVariant } from '@/hooks/useABTesting';

interface ABTestContextType {
  getVariant: (testId: string) => ABVariant;
  trackTestEvent: (
    testId: string,
    eventType: 'view' | 'conversion',
    metadata?: any
  ) => void;
}

const ABTestContext = createContext<ABTestContextType | undefined>(undefined);

interface ABTestProviderProps {
  children: ReactNode;
}

export const ABTestProvider = ({ children }: ABTestProviderProps) => {
  const { getVariant, trackTestEvent } = useABTesting();

  return (
    <ABTestContext.Provider value={{ getVariant, trackTestEvent }}>
      {children}
    </ABTestContext.Provider>
  );
};

export const useABTest = () => {
  const context = useContext(ABTestContext);
  if (context === undefined) {
    throw new Error('useABTest must be used within an ABTestProvider');
  }
  return context;
};

// HOC for A/B testing components
export const withABTest = <P extends object>(
  Component: React.ComponentType<P>,
  testId: string,
  trackView: boolean = true
) => {
  return (props: P) => {
    const { getVariant, trackTestEvent } = useABTest();
    const variant = getVariant(testId);

    React.useEffect(() => {
      if (trackView) {
        trackTestEvent(testId, 'view', { component: Component.name });
      }
    }, [trackTestEvent]);

    return <Component {...props} abVariant={variant} />;
  };
};
