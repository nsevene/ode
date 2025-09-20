import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-sage-blue text-white hover:bg-sage-blue/80',
        secondary:
          'border-transparent bg-dusty-rose text-white hover:bg-dusty-rose/80',
        destructive:
          'border-transparent bg-burgundy text-white hover:bg-burgundy/80',
        outline: 'text-charcoal border-sage-blue/30',
        success:
          'border-transparent bg-forest-green text-white hover:bg-forest-green/80',
        warning:
          'border-transparent bg-terracotta text-white hover:bg-terracotta/80',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
