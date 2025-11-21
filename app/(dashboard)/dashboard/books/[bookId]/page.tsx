import Image from "next/image";
import { notFound } from "next/navigation";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { services } from "@/lib/services";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type BookDetailsPageProps = {
  params: { bookId: string };
};

export default async function BookDetailsPage({ params }: BookDetailsPageProps) {
  const book = await services.book.getBookById(params.bookId);

  if (!book) {
    notFound();
  }

  const supabase = await createSupabaseServerClient();
  const coverUrl = book.coverPath
    ? supabase.storage.from("book-covers").getPublicUrl(book.coverPath).data.publicUrl
    : null;

  return (
    <DashboardShell
      title={book.title}
      description="Sales metrics, ingestion events, and launch health will appear here."
    >
      <div className="grid gap-6 md:grid-cols-[1.2fr,0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Metadata</CardTitle>
            <CardDescription>Key attributes pulled from Supabase.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>Status: {book.status}</p>
            <p>Format: {book.format}</p>
            <p>Launch date: {book.launchDate ? book.launchDate.toLocaleDateString() : "TBD"}</p>
            <p>{book.subtitle}</p>
            <p>{book.description}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Cover</CardTitle>
          </CardHeader>
          <CardContent>
            {coverUrl ? (
              <Image
                src={coverUrl}
                alt={`${book.title} cover`}
                width={400}
                height={600}
                className="rounded-lg border object-cover"
              />
            ) : (
              <p className="text-sm text-charcoal">No cover uploaded.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}

