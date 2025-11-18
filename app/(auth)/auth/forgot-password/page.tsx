import Link from "next/link";

import { PasswordResetForm } from "@/components/forms/password-reset-form";

export const metadata = {
  title: "Reset Password",
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-paper flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-10">
        <div className="text-center space-y-6">
          <div className="mx-auto w-20 h-20 rounded-xl bg-burgundy flex items-center justify-center transition-transform duration-300 hover:scale-110">
            <span className="text-surface text-3xl font-bold">A</span>
          </div>
          <div className="space-y-3">
            <h1 className="text-4xl font-bold text-ink leading-tight">Reset your password</h1>
            <p className="text-lg text-charcoal max-w-md mx-auto transition-colors duration-300 hover:text-charcoal/80">
              Enter your email and we'll send you a link to reset your password.
            </p>
          </div>
        </div>

        <div className="bg-surface border border-stroke rounded-2xl p-8 shadow-lg transition-all duration-300 hover:shadow-xl">
          <PasswordResetForm />
        </div>

        <div className="text-center text-sm text-charcoal transition-colors duration-300 hover:text-charcoal/80">
          <Link href="/auth/sign-in" className="text-burgundy hover:underline transition-all duration-300 hover:text-burgundy/80">
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}