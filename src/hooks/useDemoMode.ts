import { useState, useCallback } from 'react';
import { CONFIG } from '@/lib/config';

export const useDemoMode = () => {
  const [showDemoNotification, setShowDemoNotification] = useState(false);

  const handleDemoAction = useCallback((action: string = 'action') => {
    if (CONFIG.DEMO_MODE) {
      setShowDemoNotification(true);
      return false; // Action blocked
    }
    return true; // Action allowed
  }, []);

  const closeDemoNotification = useCallback(() => {
    setShowDemoNotification(false);
  }, []);

  const isDemoDisabled = useCallback((feature: keyof typeof CONFIG.DEMO_DISABLED_FEATURES) => {
    return CONFIG.DEMO_MODE && CONFIG.DEMO_DISABLED_FEATURES[feature];
  }, []);

  return {
    isDemoMode: CONFIG.DEMO_MODE,
    showDemoNotification,
    handleDemoAction,
    closeDemoNotification,
    isDemoDisabled,
  };
};