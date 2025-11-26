"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    const handleCallback = async () => {
      // Check for error in URL params
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const searchParams = new URLSearchParams(window.location.search);
      
      const errorParam = searchParams.get("error") || hashParams.get("error");
      const errorDescription = searchParams.get("error_description") || hashParams.get("error_description");

      if (errorParam) {
        console.error("[Auth Callback] OAuth error:", errorParam, errorDescription);
        setError(errorDescription || errorParam);
        return;
      }

      // For OAuth, Supabase handles token extraction automatically
      // when the client detects auth params in the URL
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        console.error("[Auth Callback] Session error:", sessionError);
        setError(sessionError.message);
        return;
      }

      if (session) {
        console.log("[Auth Callback] Session established for:", session.user.email);
        router.replace("/dashboard");
        return;
      }

      // Set up a listener to catch when auth completes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        console.log("[Auth Callback] Auth state change:", event);
        if (event === "SIGNED_IN" && session) {
          console.log("[Auth Callback] Signed in:", session.user.email);
          subscription.unsubscribe();
          router.replace("/dashboard");
        }
      });

      // Give it a moment to process the URL
      setTimeout(async () => {
        const { data: { session: retrySession } } = await supabase.auth.getSession();
        if (retrySession) {
          subscription.unsubscribe();
          router.replace("/dashboard");
        } else {
          subscription.unsubscribe();
          setError("Authentication timed out. Please try again.");
        }
      }, 5000);
    };

    handleCallback();
  }, [router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-red-600">Authentication Error</h1>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => router.push("/auth/sign-in")}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="text-gray-600">Completing sign in...</p>
      </div>
    </div>
  );
}
