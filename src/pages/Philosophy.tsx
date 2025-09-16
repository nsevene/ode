import { useEffect } from 'react';
import PhilosophySection from '@/components/PhilosophySection';

const Philosophy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen" key="philosophy-page-new">
      <PhilosophySection key="philosophy-section-updated" />
    </div>
  );
};

export default Philosophy;