import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const EnhancedScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const toggleVisibility = () => {
      if (typeof window === 'undefined') return;
      const scrolled = document.documentElement.scrollTop;
      const maxHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrolled / maxHeight) * 100;

      setScrollProgress(progress);
      setIsVisible(scrolled > 300);
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    if (typeof window === 'undefined') return;
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-32 right-4 z-40 md:bottom-20">
      <div className="relative">
        {/* Progress Ring */}
        <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 44 44">
          <circle
            cx="22"
            cy="22"
            r="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-gray-200"
          />
          <circle
            cx="22"
            cy="22"
            r="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray={`${scrollProgress * 1.13} 113`}
            strokeLinecap="round"
            className="text-primary transition-all duration-300"
          />
        </svg>

        {/* Button */}
        <Button
          onClick={scrollToTop}
          size="sm"
          className="absolute inset-0 m-1 w-10 h-10 rounded-full bg-cream-light/95 backdrop-blur-lg hover:bg-cream-light shadow-elegant hover:shadow-glow text-burgundy-primary hover:text-burgundy border border-burgundy-primary/20 transition-all duration-300 hover:scale-110"
        >
          <ArrowUp className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default EnhancedScrollToTop;
