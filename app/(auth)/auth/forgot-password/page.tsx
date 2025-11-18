import Link from "next/link";

import { PasswordResetForm } from "@/components/forms/password-reset-form";

export const metadata = {
  title: "Reset password",
};

export default function ForgotPasswordPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-3 text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">Password reset</p>
        <h1 className="text-3xl font-semibold text-foreground">Recover your studio access</h1>
        <p className="text-sm text-muted-foreground">
          Enter the email associated with your AuthorStack workspace. We&apos;ll trigger a Resend-powered reset link—no matter
          the subscription tier.
        </p>
      </header>

      <PasswordResetForm />

      <div className="rounded-lg border border-primary/10 bg-card/80 px-4 py-3 text-sm text-muted-foreground">
        <p>
          Remembered your credentials? <Link href="/auth/sign-in" className="font-semibold text-primary">Return to
          sign in</Link>.
        </p>
      </div>
    </div>
  );
}

