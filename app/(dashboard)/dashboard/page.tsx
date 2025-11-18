import Link from "next/link";

export const dynamic = "force-dynamic";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getChecklistTasks, getDashboardMetrics } from "@/lib/dashboard/queries";

const ingestionStatuses = [
  {
    label: "QStash queue",
    status: "Healthy",
    detail: "Cron heartbeat fired 5 minutes ago",
  },
  {
    label: "Webhook processing",
    status: "2 retries scheduled",
    detail: "Next attempt in 3 minutes",
  },
  {
    label: "Redis cache",
    status: "Connected",
    detail: "Latency &lt; 40ms from Vercel region",
  },
];

export default async function DashboardHomePage() {
  const { totalAmount, totalUnits, checklistCount, latestBooks } = await getDashboardMetrics();
  const tasks = await getChecklistTasks();

  const metrics = [
    {
      title: "Gross royalties",
      value: `$${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      description: "Aggregated net of platform fees",
    },
    {
      title: "Units shipped",
      value: totalUnits.toLocaleString(),
      description: "Print + digital across Amazon, Gumroad, Whop",
    },
    {
      title: "Active launch checklists",
      value: checklistCount.toString(),
      description: "Runbooks orchestrated this quarter",
    },
  ];

  return (
    <DashboardShell
      title="Command Center"
      description="Monitor revenue, ingestion health, launch readiness, and subscriber activity from one control surface."
      toolbar={
        <Button asChild>
          <Link href="/dashboard/ingestion">Ingestion console</Link>
        </Button>
      }
    >
      <div className="grid gap-4 md:grid-cols-3">
        {metrics.map((metric) => (
          <Card key={metric.title} className="border-primary/10 bg-gradient-to-br from-card/80 via-background to-card/90">
            <CardHeader>
              <CardDescription className="text-xs uppercase tracking-wide text-primary/80">
                {metric.description}
              </CardDescription>
              <CardTitle className="text-lg">{metric.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{metric.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.25fr,0.75fr]">
        <Card className="border-primary/10">
          <CardHeader>
            <CardTitle>Launch runway</CardTitle>
            <CardDescription>Upcoming tasks across all checklists.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {tasks.length === 0 ? (
              <div className="rounded-xl border border-primary/10 bg-card/80 p-6 text-sm text-muted-foreground">
                You&apos;re all caught up. Add tasks from any checklist to see them here.
              </div>
            ) : (
              tasks.map((task) => {
                const checklistSource = task.launch_checklists as
                  | { name?: string }
                  | { name?: string }[]
                  | undefined;
                const checklistName = Array.isArray(checklistSource)
                  ? checklistSource[0]?.name
                  : checklistSource?.name;

                return (
                  <div
                    key={task.id}
                    className="flex flex-col gap-2 rounded-xl border border-primary/10 bg-card/90 p-4 text-sm shadow-sm shadow-primary/5"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-medium text-foreground">{task.title}</p>
                      <Badge variant={task.status === "completed" ? "secondary" : "outline"}>
                        {task.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Checklist: {checklistName ?? "Unknown"} • Due {task.due_date ?? "TBD"}
                    </p>
                  </div>
                );
              })
            )}
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/dashboard/checklists/new">Create checklist</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/dashboard/checklists">Open planner</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/10">
          <CardHeader>
            <CardTitle>Recent books</CardTitle>
            <CardDescription>Latest manuscripts added to the pipeline.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {latestBooks.length === 0 ? (
              <div className="rounded-xl border border-primary/10 bg-card/80 p-6 text-sm text-muted-foreground">
                No books yet. Add a title to kick off ingestion and launch tracking.
              </div>
            ) : (
              latestBooks.map((book) => (
                <div
                  key={book.id}
                  className="flex flex-col gap-2 rounded-xl border border-primary/10 bg-card/90 p-4 text-sm shadow-sm shadow-primary/5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-foreground">{book.title}</p>
                    <Badge>{book.status}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Format: {book.format} • Launch {book.launch_date ?? "TBD"}
                  </p>
                </div>
              ))
            )}
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/dashboard/books/new">Add book</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/dashboard/books">View library</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.9fr,1.1fr]">
        <Card className="border-primary/10">
          <CardHeader>
            <CardTitle>Ingestion health</CardTitle>
            <CardDescription>Signals from cron jobs, queue depths, and connected services.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            {ingestionStatuses.map((item) => (
              <div
                key={item.label}
                className="flex flex-col gap-1 rounded-xl border border-primary/10 bg-card/90 p-4 shadow-sm shadow-primary/5"
              >
                <div className="flex items-center justify-between gap-3 text-foreground">
                  <p className="font-medium">{item.label}</p>
                  <Badge variant="secondary">{item.status}</Badge>
                </div>
                <p className="text-xs">{item.detail}</p>
              </div>
            ))}
            <Button asChild variant="ghost" className="px-0 text-primary">
              <Link href="/dashboard/ingestion">View ingestion timeline →</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-primary/10">
          <CardHeader>
            <CardTitle>Deployment checklist</CardTitle>
            <CardDescription>Ensure your studio is production ready.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm text-muted-foreground">
            <div className="rounded-xl border border-primary/10 bg-card/90 p-4">
              <p className="font-semibold text-foreground">Environment variables</p>
              <p className="text-xs">NEXT_PUBLIC_SUPABASE_URL, WHOP_API_KEY, RESEND_API_KEY, UPSTASH tokens</p>
            </div>
            <div className="rounded-xl border border-primary/10 bg-card/90 p-4">
              <p className="font-semibold text-foreground">CI/CD runbook</p>
              <p className="text-xs">GitHub Actions lint, typecheck, build, deploy → Vercel staging/production.</p>
            </div>
            <div className="rounded-xl border border-primary/10 bg-card/90 p-4">
              <p className="font-semibold text-foreground">Health check</p>
              <p className="text-xs">Monitor `/api/healthz` from your status provider to catch integration drift.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}

