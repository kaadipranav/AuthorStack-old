import Link from "next/link";

import { PublicShell } from "@/components/layout/public-shell";
import { Button } from "@/components/ui/button";

const docsLinks = [
  {
    title: "Architecture Overview",
    description: "Stack diagram, directory structure, and integration notes.",
    path: "/docs/ARCHITECTURE",
  },
  {
    title: "Production Context",
    description: "Full AuthorStack production checklist and scope.",
    path: "/docs/CONTEXT",
  },
  {
    title: "Local Development Runbook",
    description: "One-command scripts to start Supabase + web app locally.",
    path: "/docs/runbooks/local-development",
  },
];

export default function DocsPage() {
  return (
    <PublicShell mainClassName="space-y-10">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase text-burgundy">Docs</p>
        <h1 className="text-3xl font-semibold">Build & run AuthorStack with confidence.</h1>
        <p className="max-w-2xl text-sm text-charcoal">
          Documentation lives inside the repository for zero-touch deployments. Link your preferred knowledge base later—today you already have the essentials.
        </p>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        {docsLinks.map((doc) => (
          <div key={doc.path} className="rounded-xl border bg-surface/70 p-5 shadow-sm">
            <h2 className="text-lg font-semibold">{doc.title}</h2>
            <p className="mt-2 text-sm text-charcoal">{doc.description}</p>
            <Button asChild variant="ghost" className="mt-4 px-0">
              <Link href={doc.path as any}>
                Open file
              </Link>
            </Button>
          </div>
        ))}
      </div>
    </PublicShell>
  );
}

