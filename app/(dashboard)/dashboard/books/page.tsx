import Link from "next/link";

export const dynamic = "force-dynamic";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { deleteBookAction } from "@/lib/books/actions";
import { listBooks } from "@/lib/books/service";

export default async function BooksPage() {
  const books = await listBooks();

  const statusBadge = (status: string) => {
    if (status.toLowerCase() === "published" || status.toLowerCase() === "live") {
      return <Badge variant="secondary">{status}</Badge>;
    }
    if (status.toLowerCase() === "draft") {
      return <Badge variant="muted">{status}</Badge>;
    }
    return <Badge variant="outline">{status}</Badge>;
  };

  return (
    <DashboardShell
      title="Books"
      description="Each SKU surfaces ingestion status, launch timeline, and platform coverage."
      toolbar={
        <Button asChild>
          <Link href="/dashboard/books/new">Add book</Link>
        </Button>
      }
    >
      <div className="grid gap-4 text-sm text-muted-foreground sm:grid-cols-3">
        <Card className="border-primary/10">
          <CardHeader>
            <CardDescription>Total catalog</CardDescription>
            <CardTitle className="text-2xl text-foreground">{books.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-primary/10">
          <CardHeader>
            <CardDescription>Manuscripts in launch</CardDescription>
            <CardTitle className="text-2xl text-foreground">
              {books.filter((book) => book.status?.toLowerCase() === "launch").length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-primary/10">
          <CardHeader>
            <CardDescription>Digital formats</CardDescription>
            <CardTitle className="text-2xl text-foreground">
              {books.filter((book) => book.format?.toLowerCase() === "ebook").length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {books.length === 0 ? (
        <Card className="mt-6 border-primary/10 bg-card/80">
          <CardHeader>
            <CardTitle>No books tracked yet</CardTitle>
            <CardDescription>Add a manuscript to trigger ingestion pipelines and launch automations.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/dashboard/books/new">Create your first book</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {books.map((book) => (
            <Card key={book.id} className="border-primary/10 bg-card/80 shadow-sm shadow-primary/5">
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <CardTitle className="text-lg">{book.title}</CardTitle>
                  {statusBadge(book.status)}
                </div>
                <CardDescription>
                  Format: {book.format} • Launch {book.launch_date ?? "TBD"}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                <Button asChild size="sm">
                  <Link href={`/dashboard/books/${book.id}`}>Insights</Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link href={`/dashboard/books/${book.id}/edit`}>Edit metadata</Link>
                </Button>
                <form
                  action={async () => {
                    "use server";
                    await deleteBookAction(book.id);
                  }}
                >
                  <Button size="sm" variant="destructive">
                    Delete
                  </Button>
                </form>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
