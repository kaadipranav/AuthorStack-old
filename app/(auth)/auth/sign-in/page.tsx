import Link from "next/link";
import type { Metadata } from "next";

import { SignInForm } from "@/components/forms/sign-in-form";
import { siteConfig } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "Sign in to AuthorStack",
  description: "Access your AuthorStack dashboard to manage your book launches, sales tracking, and publishing operations.",
};

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-paper flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-10">
        <div className="text-center space-y-6">
          <div className="mx-auto w-20 h-20 rounded-xl bg-burgundy flex items-center justify-center transition-transform duration-300 hover:scale-110">
            <span className="text-surface text-3xl font-bold">A</span>
          </div>
          <div className="space-y-3">
            <h1 className="text-4xl font-bold text-ink leading-tight">Welcome back</h1>
            <p className="text-lg text-charcoal max-w-md mx-auto transition-colors duration-300 hover:text-charcoal/80">
              Sign in to your AuthorStack account to access your dashboard.
            </p>
          </div>
        </div>

        <div className="bg-surface border border-stroke rounded-2xl p-8 shadow-lg transition-all duration-300 hover:shadow-xl">
          <SignInForm />
        </div>

        <div className="text-center text-sm text-charcoal transition-colors duration-300 hover:text-charcoal/80">
          <Link href="/auth/forgot-password" className="text-burgundy font-medium hover:underline transition-all duration-300 hover:text-burgundy/80">
            Forgot your password?
          </Link>
        </div>

        <div className="text-center text-sm text-charcoal transition-colors duration-300 hover:text-charcoal/80">
          Don't have an account?{' '}
          <Link href="/auth/sign-up" className="text-burgundy font-medium hover:underline transition-all duration-300 hover:text-burgundy/80">
            Create one
          </Link>
        </div>
      </div>
    </div>
  );
}