import Link from "next/link";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import { getChecklistTasks, getDashboardMetrics } from "@/lib/dashboard/queries";

export default async function DashboardHomePage() {
  const { totalAmount, totalUnits, checklistCount, latestBooks } = await getDashboardMetrics();
  const tasks = await getChecklistTasks();

  const metrics = [
    { title: "Total revenue", value: `$${totalAmount.toFixed(2)}`, description: "Sum of sales events" },
    { title: "Units sold", value: totalUnits.toString(), description: "Across all platforms" },
    { title: "Launch checklists", value: checklistCount.toString(), description: "Active launch plans" },
  ];

  return (
    <DashboardShell
      title="Command Center"
      description="High-level sales trends, launch readiness, and integration health."
    >
      <div className="grid gap-4 md:grid-cols-3">
        {metrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader>
              <CardTitle>{metric.title}</CardTitle>
              <CardDescription>{metric.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{metric.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent books</CardTitle>
            <CardDescription>Latest manuscripts added to the pipeline.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {latestBooks.length === 0 ? (
              <p className="text-sm text-muted-foreground">No books yet.</p>
            ) : (
              latestBooks.map((book) => (
                <div key={book.id} className="rounded-lg border p-4 text-sm">
                  <p className="font-medium">{book.title}</p>
                  <p className="text-muted-foreground">
                    Status: {book.status} • Format: {book.format}
                  </p>
                </div>
              ))
            )}
            <Button asChild variant="outline">
              <Link href="/dashboard/books">View all books</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Upcoming tasks</CardTitle>
            <CardDescription>Stay ahead of your launch checklist.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {tasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">No tasks yet.</p>
            ) : (
              tasks.map((task) => (
                <div key={task.id} className="rounded-lg border p-4 text-sm">
                  <p className="font-medium">{task.title}</p>
                  <p className="text-muted-foreground">
                    Status: {task.status} • Due {task.due_date ?? "TBD"}
                  </p>
                </div>
              ))
            )}
            <Button asChild variant="outline">
              <Link href="/dashboard/checklists">Manage checklists</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}

