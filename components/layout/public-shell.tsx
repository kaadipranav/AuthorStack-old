import Link from "next/link";
import type { ReactNode } from "react";

import { ThemeToggle } from "@/components/navigation/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";

export type PublicShellProps = {
  children: ReactNode;
  mainClassName?: string;
  hideAuthLinks?: boolean;
};

export function PublicShell({ children, mainClassName, hideAuthLinks = false }: PublicShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-primary/10 bg-background/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-6 py-4">
          <Link href="/" className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            AuthorStack
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {hideAuthLinks ? null : (
              <>
                <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                  <Link href="/auth/sign-in">Sign in</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/auth/sign-up">Start free trial</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>
      <main
        className={cn(
          "mx-auto w-full max-w-[1400px] px-6 pb-24 pt-16",
          mainClassName,
        )}
      >
        {children}
      </main>
    </div>
  );
}
