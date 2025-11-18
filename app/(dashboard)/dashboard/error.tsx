"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper">
      <div className="w-full max-w-md space-y-4 rounded-lg border bg-surface p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <AlertCircle className="size-6 text-danger" />
          <h1 className="text-lg font-semibold">Something went wrong</h1>
        </div>

        <p className="text-sm text-charcoal">
          {error.message || "An unexpected error occurred while loading your dashboard."}
        </p>

        {error.digest && (
          <p className="text-xs text-charcoal">Error ID: {error.digest}</p>
        )}

        <div className="flex gap-2 pt-4">
          <Button onClick={reset} variant="default" className="gap-2">
            <RefreshCw className="size-4" />
            Try again
          </Button>
          <Button variant="outline" asChild>
            <a href="/">Go home</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
