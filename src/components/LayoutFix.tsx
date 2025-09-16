import { useEffect } from 'react';

export const LayoutFix = () => {
  useEffect(() => {
    // Throttled fix for extreme transform values
    let isRunning = false;
    
    const fixExtremeTransforms = () => {
      if (isRunning) return;
      isRunning = true;
      
      requestAnimationFrame(() => {
        try {
          // Only check elements with inline styles to reduce DOM queries
          const elementsWithStyles = document.querySelectorAll('[style*="translateX"]');
          
          elementsWithStyles.forEach((element) => {
            const style = (element as HTMLElement).style.transform;
            
            if (style && style.includes('translateX')) {
              const translateXMatch = style.match(/translateX\((-?\d+(?:\.\d+)?)(?:px|%)\)/);
              if (translateXMatch) {
                const value = parseFloat(translateXMatch[1]);
                // If translateX value is greater than 1000% or less than -1000%, reset it
                if (Math.abs(value) > 1000) {
                  console.warn('Extreme transform detected and fixed:', element, style);
                  (element as HTMLElement).style.transform = style.replace(/translateX\([^)]*\)/, 'translateX(0)');
                }
              }
            }
          });
        } catch (error) {
          console.warn('LayoutFix error:', error);
        }
        
        isRunning = false;
      });
    };

    // Run the fix after initial render
    const timeoutId = setTimeout(fixExtremeTransforms, 100);

    // Throttled mutation observer
    let observerTimeout: NodeJS.Timeout;
    const observer = new MutationObserver(() => {
      clearTimeout(observerTimeout);
      observerTimeout = setTimeout(fixExtremeTransforms, 250);
    });

    observer.observe(document.body, {
      attributes: true,
      subtree: true,
      attributeFilter: ['style'],
      attributeOldValue: false
    });

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(observerTimeout);
      observer.disconnect();
    };
  }, []);

  return null;
};