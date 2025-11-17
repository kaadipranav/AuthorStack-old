"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase text-primary">Something went wrong</p>
        <h1 className="text-3xl font-semibold">We couldn&apos;t load this view.</h1>
        <p className="text-sm text-muted-foreground">
          Please try again or send the diagnostics code ({error.digest ?? "n/a"}) to the AuthorStack team.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button onClick={() => reset()}>Retry</Button>
        <Button variant="outline" asChild>
          <a href="mailto:support@authorstack.app">Report issue</a>
        </Button>
      </div>
    </div>
  );
}

