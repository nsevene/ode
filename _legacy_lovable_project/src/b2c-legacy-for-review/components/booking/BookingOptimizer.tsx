import { useState, useEffect } from 'react';
import { QuickBooking } from './QuickBooking';
import { OneStepBooking } from './OneStepBooking';
import { EnhancedBookingFlow } from './EnhancedBookingFlow';
import { usePerformance } from '@/hooks/usePerformance';
import { useABTest } from '@/components/ABTestProvider';

type BookingVariant = 'quick' | 'one-step' | 'enhanced';

interface BookingOptimizerProps {
  onBookingComplete?: (data: any) => void;
  onClose?: () => void;
  variant?: BookingVariant;
}

export const BookingOptimizer = ({
  onBookingComplete,
  onClose,
  variant: forcedVariant,
}: BookingOptimizerProps) => {
  const [variant, setVariant] = useState<BookingVariant>('quick');
  const { trackEvent } = usePerformance();
  const { getVariant, trackTestEvent } = useABTest();

  useEffect(() => {
    if (forcedVariant) {
      setVariant(forcedVariant);
    } else {
      // Get A/B test variant
      const abVariant = getVariant('booking_flow_test');
      const variantMap = {
        A: 'quick',
        B: 'one-step',
        C: 'enhanced',
      };
      setVariant(variantMap[abVariant] as BookingVariant);

      // Track view
      trackTestEvent('booking_flow_test', 'view', { variant: abVariant });
    }

    trackEvent('booking_optimizer_load', { variant });
  }, [forcedVariant, trackEvent, getVariant, trackTestEvent]);

  const handleBookingComplete = (data: any) => {
    // Track A/B test conversion
    trackTestEvent('booking_flow_test', 'conversion', {
      variant,
      booking_value: data.totalCost || 0,
    });

    trackEvent('booking_completed', {
      variant,
      conversion_time: Date.now(),
    });
    onBookingComplete?.(data);
  };

  const renderBookingComponent = () => {
    switch (variant) {
      case 'one-step':
        return (
          <OneStepBooking
            onBookingComplete={handleBookingComplete}
            onClose={onClose}
          />
        );
      case 'enhanced':
        return (
          <EnhancedBookingFlow onBookingComplete={handleBookingComplete} />
        );
      case 'quick':
      default:
        return (
          <QuickBooking
            onBookingComplete={handleBookingComplete}
            onClose={onClose}
          />
        );
    }
  };

  return (
    <div className="w-full">
      {/* Development variant switcher - remove in production */}
      {import.meta.env.DEV && (
        <div className="mb-4 p-2 bg-yellow-100 rounded-lg text-sm">
          <strong>Тест вариантов:</strong>
          <div className="flex gap-2 mt-2">
            {(['quick', 'one-step', 'enhanced'] as BookingVariant[]).map(
              (v) => (
                <button
                  key={v}
                  onClick={() => setVariant(v)}
                  className={`px-3 py-1 rounded text-xs ${
                    variant === v ? 'bg-blue-500 text-white' : 'bg-gray-200'
                  }`}
                >
                  {v}
                </button>
              )
            )}
          </div>
        </div>
      )}

      {renderBookingComponent()}
    </div>
  );
};
