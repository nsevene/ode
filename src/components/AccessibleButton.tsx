import React, { forwardRef } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AccessibleButtonProps extends ButtonProps {
  children: React.ReactNode;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  ariaExpanded?: boolean;
  ariaControls?: string;
  ariaPressed?: boolean;
  ariaCurrent?: boolean;
  role?: string;
  tabIndex?: number;
  onKeyDown?: (e: React.KeyboardEvent) => void;
}

export const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  ({ 
    children, 
    ariaLabel, 
    ariaDescribedBy, 
    ariaExpanded,
    ariaControls,
    ariaPressed,
    ariaCurrent,
    role = 'button',
    tabIndex = 0,
    onKeyDown,
    className,
    ...props 
  }, ref) => {
    const handleKeyDown = (e: React.KeyboardEvent) => {
      // Handle Enter and Space key activation
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        props.onClick?.(e as any);
      }
      
      // Handle Escape key for dismissible elements
      if (e.key === 'Escape' && props.onClick) {
        e.preventDefault();
        props.onClick(e as any);
      }
      
      onKeyDown?.(e);
    };

    return (
      <Button
        ref={ref}
        className={cn(
          "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
          "transition-all duration-200",
          className
        )}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        aria-expanded={ariaExpanded}
        aria-controls={ariaControls}
        aria-pressed={ariaPressed}
        aria-current={ariaCurrent}
        role={role}
        tabIndex={tabIndex}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

AccessibleButton.displayName = 'AccessibleButton';
