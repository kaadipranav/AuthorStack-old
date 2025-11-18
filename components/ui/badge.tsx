import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/cn";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-mini font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-burgundy text-surface",
        secondary: "border border-stroke bg-glass text-ink",
        outline: "border border-stroke bg-transparent text-ink",
        muted: "border-transparent bg-glass text-charcoal",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
