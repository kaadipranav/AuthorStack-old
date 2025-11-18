"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";

type FormSubmitProps = {
  children: ReactNode;
  pendingLabel?: string;
  variant?: React.ComponentProps<typeof Button>["variant"];
  className?: string;
};

export function FormSubmit({
  children,
  pendingLabel = "Submitting...",
  variant,
  className,
}: FormSubmitProps) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" variant={variant} disabled={pending} className={className}>
      {pending ? pendingLabel : children}
    </Button>
  );
}

