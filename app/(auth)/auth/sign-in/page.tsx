import { SignInForm } from "@/components/forms/sign-in-form";
import GoogleSignInButton from "@/components/auth/google-signin-button";

export const metadata = {
  title: "Sign in to AuthorStack",
  description: "Access your AuthorStack dashboard",
};

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <SignInForm />
        <div className="flex items-center justify-center">
          <GoogleSignInButton />
        </div>
      </div>
    </div>
  );
}