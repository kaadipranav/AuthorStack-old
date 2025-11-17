import fs from "node:fs/promises";
import path from "node:path";

import { notFound } from "next/navigation";

type Params = {
  slug?: string[];
};

const DOCS_ROOT = path.join(process.cwd(), "docs");

async function loadDoc(slug: string[]) {
  if (slug.length === 0) {
    return null;
  }

  const relativePath = slug.join("/") + ".md";
  const resolvedPath = path.resolve(DOCS_ROOT, relativePath);

  if (!resolvedPath.startsWith(DOCS_ROOT)) {
    throw new Error("Invalid documentation path.");
  }

  try {
    const content = await fs.readFile(resolvedPath, "utf-8");
    return { relativePath, content };
  } catch {
    return null;
  }
}

export default async function DocArticle({ params }: { params: Params }) {
  const slug = params.slug ?? [];
  const doc = await loadDoc(slug);

  if (!doc) {
    notFound();
  }

  return (
    <div className="container space-y-4 py-8">
      <div>
        <p className="text-xs font-semibold uppercase text-primary">Repository Docs</p>
        <h1 className="text-3xl font-semibold">{doc.relativePath}</h1>
      </div>
      <pre className="overflow-auto rounded-xl border bg-card/60 p-6 text-sm leading-relaxed text-foreground">
        {doc.content}
      </pre>
    </div>
  );
}

