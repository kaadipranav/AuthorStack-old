import * as React from "react";

import { cn } from "@/utils/cn";

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn("text-small font-medium text-ink", className)}
      {...props}
    />
  )
);
Label.displayName = "Label";

export { Label };

