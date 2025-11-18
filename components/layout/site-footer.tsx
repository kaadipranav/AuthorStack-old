import Link from "next/link";

import { siteConfig } from "@/lib/config/site";

export function SiteFooter() {
  return (
    <footer className="border-t bg-surface">
      <div className="container flex flex-col gap-4 py-8 text-sm text-charcoal md:flex-row md:items-center md:justify-between">
        <p>
          © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <Link href={siteConfig.links.docs as any}>Docs</Link>
          <Link href={siteConfig.links.status as any}>Status</Link>
          <a href={siteConfig.links.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}

