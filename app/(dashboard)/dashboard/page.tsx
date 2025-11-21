import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { services } from "@/lib/services";
import { requireAuth } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Dashboard - AuthorStack",
  description: "Your AuthorStack command center. Monitor revenue, track book launches, and manage your publishing operations.",
};

export default async function DashboardHomePage() {
  const user = await requireAuth();

  // Fetch data using new services
  const [salesStats, myBooks, upcomingTasks, checklists] = await Promise.all([
    services.sales.getSalesStats(user.id),
    services.book.getMyBooks(user.id),
    services.launch.getUpcomingTasks(user.id),
    services.launch.getMyChecklists(user.id),
  ]);

  const totalAmount = salesStats.totalRevenue;
  const totalUnits = salesStats.totalUnits;
  const checklistCount = checklists.length;

  // KPI metrics for the dashboard
  const kpiMetrics = [
    {
      title: "Gross Revenue",
      value: `$${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      change: "+0%", // Placeholder for now as we don't have historical comparison yet
      trend: "up",
      description: "vs last 30 days",
    },
    {
      title: "Units Sold",
      value: totalUnits.toLocaleString(),
      change: "+0%",
      trend: "up",
      description: "Print + digital sales",
    },
    {
      title: "Active Launches",
      value: checklistCount.toString(),
      change: "0 new",
      trend: "up",
      description: "Total checklists",
    },
    {
      title: "Page Reads",
      value: "0", // Placeholder
      change: "+0%",
      trend: "up",
      description: "Across platforms",
    },
  ];

  // Map books to display format
  const recentBooks = myBooks.slice(0, 5).map(book => ({
    id: book.id,
    title: book.title,
    author: "Me", // We might want to fetch profile name
    revenue: 0, // We need to aggregate revenue per book, currently not in BookService.getMyBooks
    units: 0,
    platforms: [book.format], // Placeholder
    cover: book.coverPath || "/placeholder-cover.jpg",
  }));

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-display text-ink">Command Center</h1>
        <p className="text-body text-charcoal">
          Monitor revenue, ingestion health, launch readiness, and subscriber activity from one control surface.
        </p>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiMetrics.map((metric) => (
          <Card key={metric.title} className="border-stroke bg-surface">
            <CardHeader className="pb-2">
              <CardDescription className="text-small text-charcoal">
                {metric.title}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <p className="text-heading-2 font-bold text-ink">{metric.value}</p>
                <Badge
                  variant={metric.trend === "up" ? "default" : "secondary"}
                  className="text-mini"
                >
                  {metric.trend === "up" ? "▲" : "▼"} {metric.change}
                </Badge>
              </div>
              <p className="text-mini text-charcoal mt-1">{metric.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main content area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Revenue Card */}
          <Card className="border-stroke bg-surface">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-heading-2 text-ink">Revenue Overview</CardTitle>
                  <CardDescription className="text-body text-charcoal">
                    Last 30 days performance
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">7d</Button>
                  <Button size="sm">30d</Button>
                  <Button variant="outline" size="sm">90d</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Placeholder for revenue chart */}
              <div className="h-64 rounded-lg bg-glass border border-stroke flex items-center justify-center">
                <p className="text-charcoal">Revenue chart visualization</p>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4">
                <div className="p-3 rounded-lg bg-glass border border-stroke">
                  <p className="text-small text-charcoal">KDP</p>
                  <p className="text-heading-3 font-semibold text-ink">$0</p>
                  <p className="text-mini text-success">--</p>
                </div>
                <div className="p-3 rounded-lg bg-glass border border-stroke">
                  <p className="text-small text-charcoal">Gumroad</p>
                  <p className="text-heading-3 font-semibold text-ink">$0</p>
                  <p className="text-mini text-success">--</p>
                </div>
                <div className="p-3 rounded-lg bg-glass border border-stroke">
                  <p className="text-small text-charcoal">Whop</p>
                  <p className="text-heading-3 font-semibold text-ink">$0</p>
                  <p className="text-mini text-amber">--</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Books Table */}
          <Card className="border-stroke bg-surface">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-heading-2 text-ink">Top Performing Books</CardTitle>
                  <CardDescription className="text-body text-charcoal">
                    Last 30 days revenue
                  </CardDescription>
                </div>
                <Button asChild>
                  <Link href="/dashboard/books">View all books</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentBooks.length === 0 ? (
                  <p className="text-charcoal text-center py-8">No books found. Create your first book!</p>
                ) : (
                  recentBooks.map((book) => (
                    <div key={book.id} className="flex items-center justify-between p-4 rounded-lg border border-stroke hover:bg-glass transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-16 rounded bg-glass border border-stroke flex items-center justify-center overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          {book.cover ? <img src={book.cover} alt={book.title} className="w-full h-full object-cover" /> : <span className="text-mini text-charcoal">Cover</span>}
                        </div>
                        <div>
                          <p className="text-body font-medium text-ink">{book.title}</p>
                          <p className="text-small text-charcoal">{book.author}</p>
                          <div className="flex gap-2 mt-1">
                            {book.platforms.map((platform) => (
                              <Badge key={platform} variant="secondary" className="text-mini">
                                {platform}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-heading-3 font-semibold text-ink">${book.revenue}</p>
                        <p className="text-small text-charcoal">{book.units} units</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right insights rail */}
        <div className="space-y-6">
          {/* Upcoming Tasks */}
          <Card className="border-stroke bg-surface">
            <CardHeader>
              <CardTitle className="text-heading-2 text-ink">Upcoming Tasks</CardTitle>
              <CardDescription className="text-body text-charcoal">
                Launch checklist items due soon
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingTasks.length === 0 ? (
                <p className="text-charcoal text-center py-4">No upcoming tasks.</p>
              ) : (
                upcomingTasks.map((task) => (
                  <div key={task.id} className="p-4 rounded-lg border border-stroke hover:bg-glass transition-colors">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-body font-medium text-ink">{task.title}</p>
                        <p className="text-small text-charcoal">Checklist Item</p>
                      </div>
                      <Badge
                        variant={task.priority === "high" ? "default" : task.priority === "medium" ? "secondary" : "outline"}
                        className="text-mini"
                      >
                        {task.priority}
                      </Badge>
                    </div>
                    <p className="text-small text-charcoal mt-2">Due: {task.dueDate ? task.dueDate.toLocaleDateString() : 'No date'}</p>
                  </div>
                ))
              )}
              <Button asChild variant="outline" className="w-full">
                <Link href="/dashboard/checklists">View all tasks</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Leaderboard Snippet */}
          <Card className="border-stroke bg-surface">
            <CardHeader>
              <CardTitle className="text-heading-2 text-ink">Author Leaderboard</CardTitle>
              <CardDescription className="text-body text-charcoal">
                Top performers this month
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Placeholder for Leaderboard */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-glass border border-stroke">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-burgundy flex items-center justify-center text-surface text-mini font-bold">1</div>
                  <div>
                    <p className="text-body font-medium text-ink">Sarah Johnson</p>
                    <p className="text-mini text-charcoal">Romance Author</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-body font-semibold text-ink">12.4K</p>
                  <p className="text-mini text-charcoal">units</p>
                </div>
              </div>
              <Button asChild variant="ghost" className="w-full px-0 text-burgundy hover:text-burgundy">
                <Link href="/dashboard/books">View full leaderboard →</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Competitor Price Moves */}
          <Card className="border-stroke bg-surface">
            <CardHeader>
              <CardTitle className="text-heading-2 text-ink">Competitor Insights</CardTitle>
              <CardDescription className="text-body text-charcoal">
                Recent price changes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Placeholder for Competitors */}
              <div className="p-3 rounded-lg border border-stroke">
                <div className="flex items-center justify-between">
                  <p className="text-body text-ink">"The Silent Garden"</p>
                  <Badge variant="secondary" className="text-mini">▼ 15%</Badge>
                </div>
                <p className="text-small text-charcoal mt-1">Dropped to $2.99</p>
              </div>
              <Button asChild variant="ghost" className="w-full px-0 text-burgundy hover:text-burgundy">
                <Link href="/dashboard/connections">Track competitors →</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

