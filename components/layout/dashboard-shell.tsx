import type { ReactNode } from "react";
import Link from "next/link";
import { CalendarDays, LogOut, Menu, Settings } from "lucide-react";

import { DashboardNav } from "@/components/navigation/dashboard-nav";
import { ThemeToggle } from "@/components/navigation/theme-toggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { signOutAction } from "@/lib/auth/actions";
import { siteConfig } from "@/lib/config/site";

type DashboardShellProps = {
  title: string;
  description?: string;
  children: ReactNode;
  toolbar?: ReactNode;
};

function DesktopSidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col justify-between rounded-3xl border border-burgundy/10 bg-surface/80 p-6 shadow-lg shadow-burgundy/5 lg:flex">
      <div className="space-y-8">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-burgundy">Launch studio</p>
          <p className="text-sm text-charcoal">
            Navigate ingestion jobs, platform connections, and launch automation.
          </p>
        </div>
        <DashboardNav />
      </div>
      <div className="space-y-3 rounded-2xl border border-burgundy/10 bg-surface/90 p-4 text-xs text-charcoal">
        <p className="font-semibold text-burgundy">Need faster support?</p>
        <p>
          Review the <Link href="/docs" className="underline">deployment guide</Link> or check
          <a
            href={siteConfig.links.status}
            target="_blank"
            rel="noreferrer"
            className="pl-1 underline"
          >
            status
          </a>
        </p>
      </div>
    </aside>
  );
}

function MobileSidebar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="lg:hidden">
          <Menu className="size-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full max-w-xs border-r border-burgundy/10 bg-surface/90">
        <div className="space-y-6">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-burgundy">Launch studio</p>
            <p className="text-sm text-charcoal">
              Access ingestion, platform connections, and launch automation.
            </p>
          </div>
          <DashboardNav />
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function DashboardShell({ title, description, children, toolbar }: DashboardShellProps) {
  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6 px-6 py-10 lg:flex-row">
      <DesktopSidebar />
      <section className="flex-1 space-y-6">
        <div className="flex flex-col justify-between gap-4 rounded-3xl border border-burgundy/10 bg-surface/80 p-6 shadow-lg shadow-burgundy/5 backdrop-blur sm:flex-row sm:items-center">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-xs uppercase tracking-wide text-charcoal">
              <span className="inline-flex items-center gap-2 rounded-full border border-burgundy/20 bg-burgundy/10 px-3 py-1 text-burgundy">
                <CalendarDays className="size-3" /> AuthorStack Command Center
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-semibold leading-tight text-ink sm:text-4xl">{title}</h1>
              {description ? (
                <p className="mt-2 max-w-2xl text-sm text-charcoal">{description}</p>
              ) : null}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <ThemeToggle />
            {toolbar}
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard/profile">
                <Settings className="size-4" />
              </Link>
            </Button>
            <form action={signOutAction}>
              <Button variant="outline" size="icon">
                <LogOut className="size-4" />
              </Button>
            </form>
            <MobileSidebar />
          </div>
        </div>
        <div className="space-y-6 rounded-3xl border border-burgundy/10 bg-surface/95 p-6 shadow-lg shadow-burgundy/5">
          {children}
        </div>
      </section>
    </div>
  );
}

