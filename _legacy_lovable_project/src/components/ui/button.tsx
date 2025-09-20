import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-burgundy-primary text-pure-white shadow-elegant hover:bg-burgundy hover:shadow-burgundy hover:scale-[1.02] active:scale-[0.98]',
        destructive:
          'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        outline:
          'border-2 border-charcoal/20 bg-pure-white/80 backdrop-blur-sm text-charcoal shadow-soft hover:bg-pure-white hover:border-burgundy-primary/30 hover:shadow-medium hover:scale-[1.02]',
        secondary:
          'bg-sage-blue text-pure-white shadow-soft hover:bg-sage-blue/90 hover:shadow-medium hover:scale-[1.02]',
        ghost:
          'text-charcoal hover:bg-cream-light/50 hover:text-burgundy-primary',
        link: 'text-burgundy-primary underline-offset-4 hover:underline hover:text-burgundy',
        hero: 'bg-gradient-to-r from-burgundy-primary to-burgundy text-pure-white shadow-strong border border-pure-white/20 backdrop-blur-sm hover:shadow-glow hover:scale-[1.05] hover:border-gold-accent/30',
        gold: 'bg-gradient-to-r from-gold-accent to-gold-light text-charcoal shadow-elegant hover:shadow-glow hover:scale-[1.02] font-semibold',
        earth:
          'bg-gradient-to-r from-earth-warm to-terracotta text-pure-white shadow-elegant hover:shadow-strong hover:scale-[1.02]',
        glass:
          'bg-pure-white/40 backdrop-blur-md border border-pure-white/30 text-charcoal shadow-soft hover:bg-pure-white/60 hover:shadow-medium hover:scale-[1.02]',
        elegant:
          'bg-pure-white text-charcoal border border-cream-medium shadow-soft hover:bg-cream-light hover:shadow-medium',
        modern:
          'bg-teal-dark text-pure-white shadow-soft hover:bg-teal-dark/90 hover:shadow-medium hover:scale-[1.02]',
        accent:
          'bg-sage-blue text-pure-white shadow-soft hover:bg-sage-blue/90 hover:shadow-medium hover:scale-[1.02]',
        burgundy:
          'bg-burgundy text-pure-white shadow-elegant hover:bg-burgundy/90 hover:shadow-burgundy hover:scale-[1.02]',
      },
      size: {
        default: 'h-10 px-6 py-2',
        sm: 'h-8 rounded-md px-4 text-xs',
        lg: 'h-12 rounded-xl px-8 text-base',
        xl: 'h-14 rounded-xl px-10 text-lg',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
