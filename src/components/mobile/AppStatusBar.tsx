import React, { useEffect } from 'react';

export const AppStatusBar = () => {
  useEffect(() => {
    const initStatusBar = async () => {
      try {
        if (typeof window !== 'undefined' && (window as any).Capacitor) {
          const { StatusBar, Style } = await import('@capacitor/status-bar');
          
          // Set status bar style to dark content on light background
          await StatusBar.setStyle({ style: Style.Dark });
          
          // Set background color to match app theme
          await StatusBar.setBackgroundColor({ color: '#ffffff' });
          
          // Show status bar if hidden
          await StatusBar.show();
        }
      } catch (error) {
        console.log('StatusBar API not available');
      }
    };

    initStatusBar();
  }, []);

  // This component doesn't render anything visible
  return null;
};