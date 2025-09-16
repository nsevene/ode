import { BookingOptimizer } from '@/components/booking/BookingOptimizer';
import { SEOHead } from '@/components/seo/SEOHead';
import { PerformanceMonitor } from '@/components/performance/PerformanceMonitor';
import { CoreWebVitals } from '@/components/performance/CoreWebVitals';
import { useNavigate } from 'react-router-dom';

const QuickBookingPage = () => {
  const navigate = useNavigate();

  const handleBookingComplete = (data: any) => {
    console.log('Booking completed:', data);
    // Redirect to success page or dashboard
    navigate('/dashboard');
  };

  const handleClose = () => {
    navigate('/');
  };

  return (
    <>
      <SEOHead 
        title="Quick Booking | ODE Ubud Bazaar"
        description="Book a table at ODE Ubud Bazaar in just a few clicks. Fast, simple, convenient."
        keywords="booking, quick booking, ODE Ubud Bazaar, restaurant, table"
      />
      
      <div className="min-h-screen bg-background py-8 px-4">
        <div className="container mx-auto space-y-6">
          {/* Performance Monitoring */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <PerformanceMonitor />
            <CoreWebVitals />
          </div>
          
          <BookingOptimizer 
            onBookingComplete={handleBookingComplete}
            onClose={handleClose}
          />
        </div>
      </div>
    </>
  );
};

export default QuickBookingPage;