"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BooksError({
  error,
  reset,
}: {
  error: Error & { digest?: string; code?: string; hint?: string; details?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Books page error:", error);
  }, [error]);

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-danger/50 bg-danger/10 p-4">
        <div className="flex items-center gap-3">
          <AlertCircle className="size-5 text-danger" />
          <div>
            <h3 className="font-semibold">Failed to load books</h3>
            <p className="text-sm text-charcoal mt-1">
              {error.message || "An error occurred while loading your books."}
            </p>
            {error.code && (
              <p className="text-sm text-charcoal mt-1">
                Error code: {error.code}
              </p>
            )}
            {error.hint && (
              <p className="text-sm text-charcoal mt-1">
                Hint: {error.hint}
              </p>
            )}
            {error.details && (
              <p className="text-sm text-charcoal mt-1">
                Details: {error.details}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={reset} variant="default" size="sm" className="gap-2">
          <RefreshCw className="size-4" />
          Try again
        </Button>
      </div>
    </div>
  );
}