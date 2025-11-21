"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
      
      <Card className="border-stroke bg-surface">
        <CardHeader>
          <CardTitle className="text-heading-2 text-ink">Troubleshooting Steps</CardTitle>
          <CardDescription className="text-body text-charcoal">
            Try these solutions to resolve the issue:
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-semibold text-ink">1. Check Database Migration</h4>
            <p className="text-sm text-charcoal">
              Run the database reset command to ensure your schema is up to date:
            </p>
            <code className="block bg-glass border border-stroke rounded p-2 text-sm">
              pnpm db:reset
            </code>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold text-ink">2. Verify Environment Variables</h4>
            <p className="text-sm text-charcoal">
              Ensure your Supabase credentials in .env.local are correct:
            </p>
            <ul className="list-disc list-inside text-sm text-charcoal space-y-1">
              <li>NEXT_PUBLIC_SUPABASE_URL</li>
              <li>NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
              <li>SUPABASE_SERVICE_ROLE_KEY</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold text-ink">3. Check Database Connection</h4>
            <p className="text-sm text-charcoal">
              Visit the health check endpoint to verify database connectivity:
            </p>
            <code className="block bg-glass border border-stroke rounded p-2 text-sm">
              /api/healthz
            </code>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}