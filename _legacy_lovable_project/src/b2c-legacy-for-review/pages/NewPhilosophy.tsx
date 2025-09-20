import { useEffect } from 'react';
import PhilosophySection from '@/components/PhilosophySection';

const NewPhilosophy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <PhilosophySection />
    </div>
  );
};

export default NewPhilosophy;
