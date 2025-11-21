import Link from "next/link";
import type { Metadata } from "next";

import { SignUpForm } from "@/components/forms/sign-up-form";

export const metadata: Metadata = {
  title: "Create AuthorStack Account",
  description: "Join AuthorStack to manage your book launches, sales tracking, and publishing operations. Start your free trial today.",
};

export default function SignUpPage() {
  return (
    <div className="w-full space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold text-ink">Create your account</h1>
        <p className="text-sm text-charcoal">
          Join AuthorStack to manage your book launches and sales.
        </p>
      </div>

      <SignUpForm />

      <div className="text-center text-sm text-charcoal">
        Already have an account?{' '}
        <Link href="/auth/sign-in" className="text-burgundy font-medium hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}