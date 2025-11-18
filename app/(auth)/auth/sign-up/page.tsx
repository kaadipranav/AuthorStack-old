import Link from "next/link";
import type { Metadata } from "next";

import { SignUpForm } from "@/components/forms/sign-up-form";

export const metadata: Metadata = {
  title: "Create AuthorStack Account",
  description: "Join AuthorStack to manage your book launches, sales tracking, and publishing operations. Start your free trial today.",
};

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-paper flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-10">
        <div className="text-center space-y-6">
          <div className="mx-auto w-20 h-20 rounded-xl bg-burgundy flex items-center justify-center transition-transform duration-300 hover:scale-110">
            <span className="text-surface text-3xl font-bold">A</span>
          </div>
          <div className="space-y-3">
            <h1 className="text-4xl font-bold text-ink leading-tight">Create your account</h1>
            <p className="text-lg text-charcoal max-w-md mx-auto transition-colors duration-300 hover:text-charcoal/80">
              Join AuthorStack to manage your book launches and sales.
            </p>
          </div>
        </div>

        <div className="bg-surface border border-stroke rounded-2xl p-8 shadow-lg transition-all duration-300 hover:shadow-xl">
          <SignUpForm />
        </div>

        <div className="text-center text-sm text-charcoal transition-colors duration-300 hover:text-charcoal/80">
          Already have an account?{' '}
          <Link href="/auth/sign-in" className="text-burgundy font-medium hover:underline transition-all duration-300 hover:text-burgundy/80">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}