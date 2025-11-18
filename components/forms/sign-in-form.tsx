"use client";

import { useMemo, useState } from "react";

import { FormSubmit } from "@/components/forms/form-submit";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ActionResponse } from "@/lib/auth/actions";
import { signInAction } from "@/lib/auth/actions";
import { cn } from "@/utils/cn";

type FeedbackStatus = "success" | "error" | "info";

type Feedback = {
  status: FeedbackStatus;
  message: string;
};

export function SignInForm() {
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const statusStyles = useMemo<Record<FeedbackStatus, string>>(
    () => ({
      success: "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/60 dark:text-emerald-200",
      error: "border-danger/20 bg-danger/10 text-danger dark:border-danger/40 dark:bg-danger/15 dark:text-surface",
      info: "border-burgundy/20 bg-burgundy/10 text-burgundy dark:border-burgundy/20 dark:bg-burgundy/10 dark:text-surface",
    }),
    []
  );

  async function clientAction(formData: FormData) {
    const result = await signInAction(formData);
    if (!result) {
      setFeedback(null);
      return;
    }

    const typed = result as ActionResponse;
    const status: FeedbackStatus = typed.success ? "success" : "error";
    const message = typed.message ?? (typed.success ? "Signed in." : "Unable to sign in.");

    setFeedback({ status, message });
  }

  return (
    <form action={clientAction} className="space-y-4">
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
          autoComplete="current-password"
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
      <FormSubmit pendingLabel="Signing in..." className="w-full">
        Sign in
      </FormSubmit>
    </form>
  );
}
