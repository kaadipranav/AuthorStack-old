"use client";

import { useMemo, useState } from "react";
import NextImage from "next/image";

import { FormSubmit } from "@/components/forms/form-submit";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ActionResponse } from "@/lib/auth/actions";
import { signUpAction } from "@/lib/auth/actions";
import { cn } from "@/utils/cn";
import { CheckCircle2 } from "lucide-react";

type FeedbackStatus = "success" | "error" | "info";

type Feedback = {
  status: FeedbackStatus;
  message: string;
};

export function SignUpForm() {
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<"free" | "pro">("free");

  const statusStyles = useMemo<Record<FeedbackStatus, string>>(
    () => ({
      success: "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/60 dark:text-emerald-200",
      error: "border-danger/20 bg-danger/10 text-danger dark:border-danger/40 dark:bg-danger/15 dark:text-surface",
      info: "border-burgundy/20 bg-burgundy/10 text-burgundy dark:border-burgundy/20 dark:bg-burgundy/10 dark:text-surface",
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
      <div className="text-center space-y-4 mb-6">
        <div className="flex justify-center mb-4">
          <div className="relative h-32 w-32 transition-transform duration-300 hover:scale-105">
            <NextImage
              src="/logos/Light_logo.png"
              alt="AuthorStack logo"
              fill
              sizes="128px"
              priority
              className="object-contain"
            />
          </div>
        </div>
        <h1 className="text-3xl font-semibold text-ink">Create your account</h1>
        <p className="text-sm text-charcoal">Join AuthorStack to manage your book launches</p>
      </div>
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
      
      {/* Plan Selection */}
      <div className="space-y-3 pt-2">
        <Label>Choose your plan</Label>
        <input type="hidden" name="plan" value={selectedPlan} />
        <div className="grid gap-3">
          {/* Free Plan */}
          <button
            type="button"
            onClick={() => setSelectedPlan("free")}
            className={cn(
              "relative flex items-start gap-3 rounded-lg border-2 p-4 text-left transition-all",
              selectedPlan === "free"
                ? "border-burgundy bg-burgundy/5"
                : "border-border hover:border-burgundy/50"
            )}
          >
            <div className="flex h-5 items-center">
              <div
                className={cn(
                  "h-4 w-4 rounded-full border-2 transition-colors",
                  selectedPlan === "free"
                    ? "border-burgundy bg-burgundy"
                    : "border-charcoal/30"
                )}
              >
                {selectedPlan === "free" && (
                  <div className="h-full w-full flex items-center justify-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-surface" />
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-ink">Free</span>
                <span className="text-sm text-charcoal">$0/month</span>
              </div>
              <p className="mt-1 text-sm text-charcoal">
                Perfect for getting started. Connect platforms, track launches, and manage your author workflow.
              </p>
            </div>
          </button>
          
          {/* PRO Plan */}
          <button
            type="button"
            onClick={() => setSelectedPlan("pro")}
            className={cn(
              "relative flex items-start gap-3 rounded-lg border-2 p-4 text-left transition-all",
              selectedPlan === "pro"
                ? "border-burgundy bg-burgundy/5"
                : "border-border hover:border-burgundy/50"
            )}
          >
            <div className="flex h-5 items-center">
              <div
                className={cn(
                  "h-4 w-4 rounded-full border-2 transition-colors",
                  selectedPlan === "pro"
                    ? "border-burgundy bg-burgundy"
                    : "border-charcoal/30"
                )}
              >
                {selectedPlan === "pro" && (
                  <div className="h-full w-full flex items-center justify-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-surface" />
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-ink">PRO</span>
                <span className="text-sm text-charcoal">$29/month</span>
                <span className="text-xs bg-burgundy/10 text-burgundy px-2 py-0.5 rounded-full">14-day free trial</span>
              </div>
              <p className="mt-1 text-sm text-charcoal">
                Unlimited AI, revenue forecasting, competitor tracking, A/B testing, and email support.
              </p>
              <div className="mt-2 flex flex-wrap gap-2 text-xs text-charcoal">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-burgundy" />
                  Unlimited AI chat
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-burgundy" />
                  Revenue forecasting
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-burgundy" />
                  A/B testing
                </span>
              </div>
            </div>
          </button>
        </div>
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

