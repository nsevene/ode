import React from 'react';
import { cn } from '@/lib/utils';

interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export const SkipLink: React.FC<SkipLinkProps> = ({
  href,
  children,
  className,
}) => {
  return (
    <a
      href={href}
      className={cn(
        'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4',
        'bg-primary text-primary-foreground px-4 py-2 rounded-md shadow-lg z-50',
        'transition-all duration-200 ease-in-out',
        'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        className
      )}
    >
      {children}
    </a>
  );
};

export const SkipToMainContent: React.FC = () => {
  return <SkipLink href="#main-content">Skip to main content</SkipLink>;
};

export const SkipToNavigation: React.FC = () => {
  return <SkipLink href="#navigation">Skip to navigation</SkipLink>;
};

export const SkipToFooter: React.FC = () => {
  return <SkipLink href="#footer">Skip to footer</SkipLink>;
};
