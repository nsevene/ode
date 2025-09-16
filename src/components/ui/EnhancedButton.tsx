import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface EnhancedButtonProps extends ButtonProps {
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'gradient' | 'glass';
  size?: 'default' | 'sm' | 'lg' | 'icon' | 'xl';
  animation?: 'none' | 'pulse' | 'bounce' | 'shake' | 'glow';
}

const EnhancedButton = React.forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  ({ 
    className, 
    loading = false, 
    icon, 
    iconPosition = 'left',
    variant = 'default',
    size = 'default',
    animation = 'none',
    children, 
    disabled,
    ...props 
  }, ref) => {
    const baseClasses = cn(
      // Base styles
      "relative overflow-hidden transition-all duration-300",
      
      // Animation styles
      {
        'animate-pulse': animation === 'pulse',
        'animate-bounce': animation === 'bounce',
        'hover:animate-pulse': animation === 'shake',
        'shadow-lg hover:shadow-xl': animation === 'glow',
      },
      
      // Variant styles
      {
        'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70': variant === 'gradient',
        'bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20': variant === 'glass',
      },
      
      // Size styles
      {
        'h-8 px-3 text-xs': size === 'sm',
        'h-10 px-4 py-2': size === 'default',
        'h-12 px-8 text-lg': size === 'lg',
        'h-14 px-10 text-xl': size === 'xl',
        'h-10 w-10': size === 'icon',
      },
      
      className
    );

    return (
      <Button
        ref={ref}
        className={baseClasses}
        disabled={disabled || loading}
        variant={variant === 'gradient' || variant === 'glass' ? 'default' : variant}
        size={size === 'xl' ? 'lg' : size}
        {...props}
      >
        {loading && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        
        {!loading && icon && iconPosition === 'left' && (
          <span className="mr-2">{icon}</span>
        )}
        
        {children}
        
        {!loading && icon && iconPosition === 'right' && (
          <span className="ml-2">{icon}</span>
        )}
      </Button>
    );
  }
);

EnhancedButton.displayName = 'EnhancedButton';

export { EnhancedButton };
