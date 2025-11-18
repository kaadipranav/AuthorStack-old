"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

import { dashboardNav } from "@/lib/config/dashboard";

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {dashboardNav.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href as any}
            className={clsx(
              "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-burgundy/10 text-burgundy"
                : "text-charcoal hover:bg-glass hover:text-ink"
            )}
          >
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}

