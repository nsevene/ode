import React from 'react';
import { useDemoMode } from '@/hooks/useDemoMode';
import DemoModeNotification from '@/components/DemoModeNotification';

interface DemoModeWrapperProps {
  children: React.ReactNode;
  action?: string;
  className?: string;
}

const DemoModeWrapper: React.FC<DemoModeWrapperProps> = ({
  children,
  action = 'action',
  className = '',
}) => {
  const {
    isDemoMode,
    handleDemoAction,
    showDemoNotification,
    closeDemoNotification,
  } = useDemoMode();

  const handleClick = (e: React.MouseEvent) => {
    if (isDemoMode) {
      e.preventDefault();
      e.stopPropagation();
      handleDemoAction(action);
    }
  };

  return (
    <>
      <div
        className={`${className} ${isDemoMode ? 'cursor-not-allowed opacity-75' : ''}`}
        onClick={handleClick}
      >
        {children}
      </div>

      <DemoModeNotification
        show={showDemoNotification}
        onClose={closeDemoNotification}
        action={action}
      />
    </>
  );
};

export default DemoModeWrapper;
