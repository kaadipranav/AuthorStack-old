import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase text-burgundy">404</p>
        <h1 className="text-3xl font-semibold tracking-tight">That page isn&apos;t part of AuthorStack yet.</h1>
        <p className="text-sm text-charcoal">
          Double-check the URL or jump back to the dashboard to continue building.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button asChild>
          <Link href="/">Return home</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="mailto:support@authorstack.app">Contact support</Link>
        </Button>
      </div>
    </div>
  );
}

