import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-sage-blue/20 bg-cream/50 px-3 py-2 text-sm text-charcoal ring-offset-background placeholder:text-charcoal/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-blue focus-visible:ring-offset-2 focus-visible:border-sage-blue disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
