"use client";

import { useMemo, useState } from "react";

import { FormSubmit } from "@/components/forms/form-submit";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ActionResponse } from "@/lib/auth/actions";
import { signUpAction } from "@/lib/auth/actions";
import { cn } from "@/utils/cn";

type FeedbackStatus = "success" | "error" | "info";

type Feedback = {
  status: FeedbackStatus;
  message: string;
};

export function SignUpForm() {
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
    const result = await signUpAction(formData);
    if (!result) {
      setFeedback(null);
      return;
    }

    const typed = result as ActionResponse;
    const status: FeedbackStatus = typed.success ? "success" : "error";
    const message = typed.message ?? (typed.success ? "Account created." : "Unable to create account.");

    setFeedback({ status, message });
  }

  return (
    <form action={clientAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full name</Label>
        <Input id="fullName" name="fullName" required autoComplete="name" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required autoComplete="email" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="new-password"
          minLength={8}
        />
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
      <FormSubmit pendingLabel="Creating account..." className="w-full">
        Create account
      </FormSubmit>
    </form>
  );
}

