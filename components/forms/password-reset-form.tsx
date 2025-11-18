"use client";

import { useMemo, useState } from "react";

import { FormSubmit } from "@/components/forms/form-submit";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ActionResponse } from "@/lib/auth/actions";
import { requestPasswordResetAction } from "@/lib/auth/actions";
import { cn } from "@/utils/cn";

type FeedbackStatus = "success" | "error" | "info";

type Feedback = {
  status: FeedbackStatus;
  message: string;
};

export function PasswordResetForm() {
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const statusStyles = useMemo<Record<FeedbackStatus, string>>(
    () => ({
      success: "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/60 dark:text-emerald-200",
      error: "border-destructive/20 bg-destructive/10 text-destructive dark:border-destructive/40 dark:bg-destructive/15 dark:text-destructive-foreground",
      info: "border-primary/20 bg-primary/10 text-primary dark:border-primary/20 dark:bg-primary/10 dark:text-primary-foreground",
    }),
    []
  );

  async function clientAction(formData: FormData) {
    const result = await requestPasswordResetAction(formData);

    const typed = result as ActionResponse;
    const status: FeedbackStatus = typed.success ? "success" : "error";
    const message = typed.message ?? (typed.success ? "Reset email sent." : "Unable to send reset email.");

    setFeedback({ status, message });
  }

  return (
    <form action={clientAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Account email</Label>
        <Input id="email" name="email" type="email" required />
      </div>
      {feedback ? (
        <div
          role="status"
          className={cn(
            "rounded-xl border px-3 py-2 text-sm shadow-sm",
            statusStyles[feedback.status]
          )}
        >
          {feedback.message}
        </div>
      ) : null}
      <FormSubmit pendingLabel="Sending email..." className="w-full">
        Send reset link
      </FormSubmit>
    </form>
  );
}

