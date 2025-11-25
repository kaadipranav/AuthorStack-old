import { SignUpForm } from "@/components/forms/sign-up-form";
import GoogleSignInButton from "@/components/auth/google-signin-button";
import { PublicShell } from "@/components/layout/public-shell";
import Link from "next/link";

export const metadata = {
  title: "Sign Up - AuthorStack",
  description: "Create your AuthorStack account",
};

export default function SignupPage() {
  return (
    <PublicShell hideAuthLinks mainClassName="flex min-h-[calc(100vh-160px)] flex-col justify-center gap-12 pb-24">
      <div className="relative min-h-screen bg-auth-bg bg-cover bg-center flex items-center justify-center">
        {/* Adaptive overlay for readability in both light and dim modes */}
        <div className="absolute inset-0 bg-white/40 dim:bg-charcoal/85" />
        <div className="relative z-10 w-full max-w-lg space-y-6 rounded-2xl border border-burgundy/10 bg-surface/95 backdrop-blur-md p-8 shadow-xl shadow-burgundy/10">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-semibold text-ink">Create your account</h1>
            <p className="text-sm text-charcoal">
              Join AuthorStack to manage your book launches and track your success
            </p>
          </div>
          
          <SignUpForm />
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-surface px-2 text-charcoal">Or continue with</span>
            </div>
          </div>
          
          <div className="flex items-center justify-center">
            <GoogleSignInButton />
          </div>
          
          <p className="text-center text-sm text-charcoal">
            Already have an account?{" "}
            <Link href="/auth/sign-in" className="text-burgundy hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </PublicShell>
  );
}

