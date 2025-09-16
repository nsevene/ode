import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { LoadingSpinner } from "./loading";

const enhancedButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // Enhanced variants
        gradient: "bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:shadow-xl hover:scale-105",
        glass: "bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20",
        elevated: "bg-primary text-primary-foreground shadow-elegant hover:shadow-strong hover:translate-y-[-2px]",
        premium: "bg-gradient-to-r from-burgundy-primary to-gold-accent text-white shadow-burgundy hover:shadow-glow",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        xl: "h-12 rounded-lg px-10 text-base",
        icon: "h-9 w-9",
      },
      animation: {
        none: "",
        bounce: "animate-bounce",
        pulse: "animate-pulse",
        glow: "animate-glow-pulse",
        float: "animate-float",
      },
      state: {
        default: "",
        loading: "cursor-wait",
        success: "bg-success text-success-foreground",
        error: "bg-destructive text-destructive-foreground",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      animation: "none",
      state: "default",
    },
  }
);

export interface EnhancedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof enhancedButtonVariants> {
  asChild?: boolean;
  loading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  tooltip?: string;
}

const EnhancedButton = React.forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  ({
    className,
    variant,
    size,
    animation,
    state,
    asChild = false,
    loading = false,
    loadingText,
    icon,
    iconPosition = 'left',
    fullWidth = false,
    tooltip,
    children,
    disabled,
    ...props
  }, ref) => {
    const Comp = asChild ? Slot : "button";
    
    const isDisabled = disabled || loading;
    const currentState = loading ? 'loading' : state;
    
    const buttonContent = (
      <>
        {loading && <LoadingSpinner className="w-4 h-4" />}
        {!loading && icon && iconPosition === 'left' && icon}
        <span>{loading && loadingText ? loadingText : children}</span>
        {!loading && icon && iconPosition === 'right' && icon}
      </>
    );

    const button = (
      <Comp
        className={cn(
          enhancedButtonVariants({ variant, size, animation, state: currentState }),
          fullWidth && "w-full",
          className
        )}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {buttonContent}
      </Comp>
    );

    if (tooltip) {
      return (
        <div className="group relative">
          {button}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
            {tooltip}
          </div>
        </div>
      );
    }

    return button;
  }
);

EnhancedButton.displayName = "EnhancedButton";

// Button Group Component
interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  size?: VariantProps<typeof enhancedButtonVariants>['size'];
  variant?: VariantProps<typeof enhancedButtonVariants>['variant'];
}

const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ className, orientation = 'horizontal', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex",
          orientation === 'horizontal' ? "flex-row [&>*:not(:last-child)]:rounded-r-none [&>*:not(:first-child)]:rounded-l-none [&>*:not(:first-child)]:-ml-px" : "flex-col [&>*:not(:last-child)]:rounded-b-none [&>*:not(:first-child)]:rounded-t-none [&>*:not(:first-child)]:-mt-px",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ButtonGroup.displayName = "ButtonGroup";

// Icon Button Component
interface IconButtonProps extends Omit<EnhancedButtonProps, 'children'> {
  icon: React.ReactNode;
  label: string;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, label, size = "icon", variant = "ghost", ...props }, ref) => {
    return (
      <EnhancedButton
        ref={ref}
        size={size}
        variant={variant}
        tooltip={label}
        aria-label={label}
        {...props}
      >
        {icon}
      </EnhancedButton>
    );
  }
);

IconButton.displayName = "IconButton";

export { EnhancedButton, enhancedButtonVariants, ButtonGroup, IconButton };