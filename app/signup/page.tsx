import { SignUpForm } from "@/components/forms/sign-up-form";
import GoogleSignInButton from "@/components/auth/google-signin-button";
import Link from "next/link";

export const metadata = {
  title: "Sign Up - AuthorStack",
  description: "Create your AuthorStack account",
};

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-auth-bg flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6 rounded-2xl border border-burgundy/10 bg-surface p-8 shadow-xl">
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
  );
}

