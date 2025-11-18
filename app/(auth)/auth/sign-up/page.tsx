import Link from "next/link";

import { SignUpForm } from "@/components/forms/sign-up-form";

export const metadata = {
  title: "Create account",
};

export default function SignUpPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-3 text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">Early access</p>
        <h1 className="text-3xl font-semibold text-foreground">Launch studio onboarding</h1>
        <p className="text-sm text-muted-foreground">
          Your AuthorStack credentials power Supabase Auth, Whop membership syncing, and all ingestion permissions. Fill
          in the details below to activate your workspace.
        </p>
      </header>

      <SignUpForm />

      <div className="rounded-lg border border-primary/10 bg-card/80 px-4 py-3 text-sm text-muted-foreground">
        <p>
          Already verified? <Link href="/auth/sign-in" className="font-semibold text-primary">Sign in</Link> with your
          existing workspace credentials.
        </p>
      </div>
    </div>
  );
}

