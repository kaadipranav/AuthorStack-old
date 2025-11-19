import Link from "next/link";
import type { Metadata } from "next";

import { SignInForm } from "@/components/forms/sign-in-form";

export const metadata: Metadata = {
  title: "Sign in to AuthorStack",
  description: "Access your AuthorStack dashboard to manage your book launches, sales tracking, and publishing operations.",
};

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-paper flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 rounded-lg bg-burgundy flex items-center justify-center mb-6">
            <span className="text-surface text-2xl font-bold">A</span>
          </div>
          <h1 className="text-3xl font-bold text-ink mb-2">Welcome back</h1>
          <p className="text-charcoal">
            Sign in to your AuthorStack account
          </p>
        </div>

        <div className="bg-surface border border-stroke rounded-xl p-6">
          <SignInForm />
        </div>

        <div className="text-center text-sm text-charcoal">
          <Link href="/auth/forgot-password" className="text-burgundy hover:underline">
            Forgot your password?
          </Link>
        </div>

        <div className="text-center text-sm text-charcoal">
          Don't have an account?{' '}
          <Link href="/auth/sign-up" className="text-burgundy font-medium hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}