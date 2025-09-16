import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-sage-blue/20 bg-cream/50 px-3 py-2 text-base text-charcoal ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-charcoal placeholder:text-charcoal/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-blue focus-visible:ring-offset-2 focus-visible:border-sage-blue disabled:cursor-not-allowed disabled:opacity-50 md:text-sm transition-colors",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
