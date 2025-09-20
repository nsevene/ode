import { useState, useEffect } from 'react';
import { useAnalytics } from './useAnalytics';

export type ABVariant = 'A' | 'B' | 'C';

interface ABTest {
  id: string;
  name: string;
  variants: {
    [key in ABVariant]?: {
      name: string;
      traffic: number; // percentage 0-100
      component?: string;
    };
  };
  isActive: boolean;
  startDate: Date;
  endDate?: Date;
}

interface ABTestResult {
  variant: ABVariant;
  conversions: number;
  visits: number;
  conversionRate: number;
}

export const useABTesting = () => {
  const { track } = useAnalytics();
  const [currentTests, setCurrentTests] = useState<ABTest[]>([]);
  const [userVariants, setUserVariants] = useState<Record<string, ABVariant>>(
    {}
  );

  // Load active tests
  useEffect(() => {
    const savedTests = localStorage.getItem('ab_tests');
    if (savedTests) {
      setCurrentTests(JSON.parse(savedTests));
    } else {
      // Default booking flow test
      const defaultTest: ABTest = {
        id: 'booking_flow_test',
        name: 'Booking Flow Optimization',
        variants: {
          A: { name: 'Quick Booking', traffic: 40, component: 'quick' },
          B: { name: 'One Step Booking', traffic: 40, component: 'one-step' },
          C: { name: 'Enhanced Booking', traffic: 20, component: 'enhanced' },
        },
        isActive: true,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      };
      setCurrentTests([defaultTest]);
      localStorage.setItem('ab_tests', JSON.stringify([defaultTest]));
    }
  }, []);

  // Load user variants
  useEffect(() => {
    const savedVariants = localStorage.getItem('user_ab_variants');
    if (savedVariants) {
      setUserVariants(JSON.parse(savedVariants));
    }
  }, []);

  const getVariant = (testId: string): ABVariant => {
    // Check if user already has a variant for this test
    if (userVariants[testId]) {
      return userVariants[testId];
    }

    const test = currentTests.find((t) => t.id === testId && t.isActive);
    if (!test) return 'A';

    // Assign variant based on traffic distribution
    const random = Math.random() * 100;
    let cumulative = 0;

    for (const [variant, config] of Object.entries(test.variants)) {
      cumulative += config?.traffic || 0;
      if (random <= cumulative) {
        const assignedVariant = variant as ABVariant;

        // Save variant assignment
        const newVariants = { ...userVariants, [testId]: assignedVariant };
        setUserVariants(newVariants);
        localStorage.setItem('user_ab_variants', JSON.stringify(newVariants));

        // Track assignment
        track('ab_test_assigned', {
          test_id: testId,
          variant: assignedVariant,
          test_name: test.name,
        });

        return assignedVariant;
      }
    }

    return 'A';
  };

  const trackTestEvent = (
    testId: string,
    eventType: 'view' | 'conversion',
    metadata?: any
  ) => {
    const variant = userVariants[testId] || getVariant(testId);

    track('ab_test_event', {
      test_id: testId,
      variant,
      event_type: eventType,
      ...metadata,
    });
  };

  const getTestResults = (testId: string): ABTestResult[] => {
    // In a real app, this would fetch from analytics database
    // For now, return mock data based on localStorage analytics
    const analyticsData = localStorage.getItem('analytics_events');
    if (!analyticsData) return [];

    const events = JSON.parse(analyticsData);
    const testEvents = events.filter(
      (e: any) =>
        e.event_name === 'ab_test_event' && e.properties?.test_id === testId
    );

    const results: Record<ABVariant, { visits: number; conversions: number }> =
      {
        A: { visits: 0, conversions: 0 },
        B: { visits: 0, conversions: 0 },
        C: { visits: 0, conversions: 0 },
      };

    testEvents.forEach((event: any) => {
      const variant = event.properties.variant;
      if (event.properties.event_type === 'view') {
        results[variant].visits++;
      } else if (event.properties.event_type === 'conversion') {
        results[variant].conversions++;
      }
    });

    return Object.entries(results).map(([variant, data]) => ({
      variant: variant as ABVariant,
      visits: data.visits,
      conversions: data.conversions,
      conversionRate:
        data.visits > 0 ? (data.conversions / data.visits) * 100 : 0,
    }));
  };

  const createTest = (test: Omit<ABTest, 'id'>) => {
    const newTest: ABTest = {
      ...test,
      id: `test_${Date.now()}`,
    };

    const updatedTests = [...currentTests, newTest];
    setCurrentTests(updatedTests);
    localStorage.setItem('ab_tests', JSON.stringify(updatedTests));

    track('ab_test_created', {
      test_id: newTest.id,
      test_name: newTest.name,
    });
  };

  const stopTest = (testId: string) => {
    const updatedTests = currentTests.map((test) =>
      test.id === testId
        ? { ...test, isActive: false, endDate: new Date() }
        : test
    );

    setCurrentTests(updatedTests);
    localStorage.setItem('ab_tests', JSON.stringify(updatedTests));

    track('ab_test_stopped', { test_id: testId });
  };

  const getWinningVariant = (testId: string): ABVariant | null => {
    const results = getTestResults(testId);
    if (results.length === 0) return null;

    return results.reduce((winner, current) =>
      current.conversionRate > winner.conversionRate ? current : winner
    ).variant;
  };

  return {
    currentTests,
    getVariant,
    trackTestEvent,
    getTestResults,
    createTest,
    stopTest,
    getWinningVariant,
    userVariants,
  };
};
