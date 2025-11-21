import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-small font-medium transition-all duration-200 ease-[cubic-bezier(.2,.9,.2,1)] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-burgundy focus-visible:ring-burgundy/40 focus-visible:ring-[3px] aria-invalid:ring-danger/20 dark:aria-invalid:ring-danger/40 aria-invalid:border-danger hover:-translate-y-0.5 hover:scale-[1.02] shadow-soft",
  {
    variants: {
      variant: {
        default: "bg-burgundy text-surface hover:bg-burgundy/90 border border-burgundy/80 hover:shadow-lg",
        destructive:
          "bg-danger text-surface hover:bg-danger/90 border border-danger/80 hover:shadow-lg",
        outline:
          "border border-stroke bg-surface text-ink hover:bg-glass hover:shadow-lg",
        secondary:
          "bg-glass text-ink border border-stroke hover:bg-burgundy/10 hover:shadow-lg",
        ghost:
          "hover:bg-glass text-ink hover:shadow-lg",
        link: "text-burgundy underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5 py-2.5 has-[>svg]:px-4",
        sm: "h-9 rounded-md gap-1.5 px-3.5 has-[>svg]:px-3",
        lg: "h-12 rounded-lg px-6 has-[>svg]:px-5 text-body",
        icon: "size-10",
        "icon-sm": "size-8",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };