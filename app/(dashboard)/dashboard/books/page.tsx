import Link from "next/link";

export const dynamic = "force-dynamic";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { deleteBookAction } from "@/lib/books/actions";
import { listBooks } from "@/lib/books/service";

export default async function BooksPage() {
  const books = await listBooks();

  const statusBadge = (status: string) => {
    if (status.toLowerCase() === "published" || status.toLowerCase() === "live") {
      return <Badge variant="default">{status}</Badge>;
    }
    if (status.toLowerCase() === "draft") {
      return <Badge variant="secondary">{status}</Badge>;
    }
    return <Badge variant="outline">{status}</Badge>;
  };

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-display text-ink">Books</h1>
            <p className="text-body text-charcoal">
              Manage your book catalog and track sales performance.
            </p>
          </div>
          <Button asChild className="bg-burgundy hover:bg-burgundy/90 text-surface">
            <Link href="/dashboard/books/new">Add book</Link>
          </Button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 text-sm sm:grid-cols-3">
        <Card className="border-stroke bg-surface">
          <CardHeader>
            <CardDescription className="text-charcoal">Total catalog</CardDescription>
            <CardTitle className="text-heading-1 text-ink">{books.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-stroke bg-surface">
          <CardHeader>
            <CardDescription className="text-charcoal">Manuscripts in launch</CardDescription>
            <CardTitle className="text-heading-1 text-ink">
              {books.filter((book) => book.status?.toLowerCase() === "launch").length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-stroke bg-surface">
          <CardHeader>
            <CardDescription className="text-charcoal">Digital formats</CardDescription>
            <CardTitle className="text-heading-1 text-ink">
              {books.filter((book) => book.format?.toLowerCase() === "ebook").length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Books list */}
      {books.length === 0 ? (
        <Card className="border-stroke bg-surface">
          <CardHeader>
            <CardTitle className="text-heading-2 text-ink">No books tracked yet</CardTitle>
            <CardDescription className="text-body text-charcoal">
              Add a manuscript to trigger ingestion pipelines and launch automations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="bg-burgundy hover:bg-burgundy/90 text-surface">
              <Link href="/dashboard/books/new">Create your first book</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-heading-2 text-ink">Your Books</h2>
            <p className="text-small text-charcoal">{books.length} books</p>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {books.map((book) => (
              <Card key={book.id} className="border-stroke bg-surface hover:bg-glass transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle className="text-heading-3 text-ink">{book.title}</CardTitle>
                      <CardDescription className="text-small text-charcoal mt-1">
                        Format: {book.format} • Launch {book.launch_date ?? "TBD"}
                      </CardDescription>
                    </div>
                    {statusBadge(book.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    <Button asChild size="sm" variant="outline" className="border-stroke text-ink hover:bg-glass">
                      <Link href={`/dashboard/books/${book.id}`}>View details</Link>
                    </Button>
                    <Button asChild size="sm" variant="outline" className="border-stroke text-ink hover:bg-glass">
                      <Link href={`/dashboard/books/${book.id}/edit`}>Edit</Link>
                    </Button>
                    <form
                      action={async () => {
                        "use server";
                        await deleteBookAction(book.id);
                      }}
                    >
                      <Button size="sm" variant="outline" className="border-stroke text-ink hover:bg-glass">
                        Delete
                      </Button>
                    </form>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
