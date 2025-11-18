import Link from "next/link";

import { SignInForm } from "@/components/forms/sign-in-form";
import { siteConfig } from "@/lib/config/site";

export const metadata = {
  title: "Sign in",
};

export default function SignInPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-3 text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">{siteConfig.name}</p>
        <h1 className="text-3xl font-semibold text-foreground">Welcome back to Launch Studio</h1>
        <p className="text-sm text-muted-foreground">
          Securely access real-time royalties, launch checklists, ingestion queues, and subscriber health. Two-factor
          enforcement is handled through Supabase—only verified devices can sign in.
        </p>
      </header>

      <SignInForm />

      <div className="grid gap-4 text-sm text-muted-foreground">
        <Link
          href="/auth/forgot-password"
          className="rounded-lg border border-primary/10 bg-primary/5 px-4 py-3 text-primary transition hover:border-primary/20 hover:bg-primary/10"
        >
          Forgot your password? We&apos;ll dispatch a Resend-backed reset link.
        </Link>
        <div className="rounded-lg border border-primary/10 bg-card/80 px-4 py-3">
          <p>
            New to AuthorStack? <Link href="/auth/sign-up" className="font-semibold text-primary">Create an account</Link>
            . You&apos;ll need your launch team&apos;s invite or a Whop subscription.
          </p>
        </div>
      </div>
    </div>
  );
}

