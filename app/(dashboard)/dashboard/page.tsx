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
      change: "+0%",
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
      value: "0",
      change: "+0%",
      trend: "up",
      description: "Across platforms",
    },
  ];

  // Map books to display format
  const recentBooks = myBooks.slice(0, 5).map(book => ({
    id: book.id,
    title: book.title,
    author: "Me",
    revenue: 0,
    units: 0,
    platforms: [book.format],
    cover: book.coverPath || "/placeholder-cover.jpg",
  }));

  return (
    <div className="space-y-10">
      {/* Page header with refined spacing */}
      <div className="flex flex-col gap-3">
        <h1 className="text-display text-ink">Command Center</h1>
        <p className="text-body-lg text-charcoal max-w-3xl">
          Monitor revenue, ingestion health, launch readiness, and subscriber activity from one control surface.
        </p>
      </div>

      {/* KPI Strip - Premium polish */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {kpiMetrics.map((metric) => (
          <Card
            key={metric.title}
            className="group border border-stroke bg-surface shadow-soft rounded-lg overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg cursor-pointer"
          >
            <CardHeader className="pb-3 pt-6 px-6">
              <CardDescription className="text-mini text-charcoal uppercase tracking-wider font-medium">
                {metric.title}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 px-6 pb-6">
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-heading-1 text-ink">{metric.value}</p>
                <Badge
                  variant={metric.trend === "up" ? "default" : "secondary"}
                  className="text-xs px-2.5 py-0.5 font-medium"
                >
                  {metric.change}
                </Badge>
              </div>
              <p className="text-small text-charcoal/70">{metric.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main content area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Revenue Card - Enhanced */}
          <Card className="border border-stroke bg-surface shadow-soft rounded-lg overflow-hidden">
            <CardHeader className="pb-6 pt-6 px-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-heading-2 text-ink">Revenue Overview</CardTitle>
                  <CardDescription className="text-small text-charcoal mt-1">
                    Last 30 days performance
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="text-xs px-3 h-8">7d</Button>
                  <Button size="sm" className="text-xs px-3 h-8 bg-burgundy hover:bg-burgundy/90">30d</Button>
                  <Button variant="outline" size="sm" className="text-xs px-3 h-8">90d</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              {/* Placeholder for revenue chart */}
              <div className="h-64 rounded-lg bg-glass/50 border border-stroke/50 flex items-center justify-center backdrop-blur-sm">
                <p className="text-charcoal text-sm font-medium">Revenue chart visualization</p>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="group p-4 rounded-lg bg-glass/50 border border-stroke/50 transition-all duration-200 hover:shadow-soft hover:border-stroke cursor-pointer">
                  <p className="text-mini text-charcoal uppercase tracking-wide font-medium mb-1">KDP</p>
                  <p className="text-heading-3 text-ink mb-0.5">$0</p>
                  <p className="text-mini text-success">--</p>
                </div>
                <div className="group p-4 rounded-lg bg-glass/50 border border-stroke/50 transition-all duration-200 hover:shadow-soft hover:border-stroke cursor-pointer">
                  <p className="text-mini text-charcoal uppercase tracking-wide font-medium mb-1">Gumroad</p>
                  <p className="text-heading-3 text-ink mb-0.5">$0</p>
                  <p className="text-mini text-success">--</p>
                </div>
                <div className="group p-4 rounded-lg bg-glass/50 border border-stroke/50 transition-all duration-200 hover:shadow-soft hover:border-stroke cursor-pointer">
                  <p className="text-mini text-charcoal uppercase tracking-wide font-medium mb-1">Whop</p>
                  <p className="text-heading-3 text-ink mb-0.5">$0</p>
                  <p className="text-mini text-amber">--</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Books Table - Enhanced */}
          <Card className="border border-stroke bg-surface shadow-soft rounded-lg overflow-hidden">
            <CardHeader className="pb-6 pt-6 px-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-heading-2 text-ink">Top Performing Books</CardTitle>
                  <CardDescription className="text-small text-charcoal mt-1">
                    Last 30 days revenue
                  </CardDescription>
                </div>
                <Button asChild size="sm" className="bg-burgundy hover:bg-burgundy/90 text-xs h-9 px-4">
                  <Link href="/dashboard/books">View all books</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="space-y-3">
                {recentBooks.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-charcoal mb-4">No books found. Create your first book!</p>
                    <Button asChild size="sm" className="bg-burgundy hover:bg-burgundy/90">
                      <Link href="/dashboard/books/new">Create Book</Link>
                    </Button>
                  </div>
                ) : (
                  recentBooks.map((book) => (
                    <div
                      key={book.id}
                      className="group flex items-center justify-between p-4 rounded-lg border border-stroke/50 hover:border-stroke hover:bg-glass/30 transition-all duration-200 cursor-pointer hover:shadow-soft"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-16 rounded bg-glass border border-stroke flex items-center justify-center overflow-hidden shadow-sm">
                          {book.cover ? (
                            <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-mini text-charcoal">Cover</span>
                          )}
                        </div>
                        <div>
                          <p className="text-body font-medium text-ink group-hover:text-burgundy transition-colors">{book.title}</p>
                          <p className="text-small text-charcoal">{book.author}</p>
                          <div className="flex gap-2 mt-1.5">
                            {book.platforms.map((platform) => (
                              <Badge key={platform} variant="secondary" className="text-xs px-2 py-0.5 font-medium">
                                {platform}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-heading-3 text-ink">${book.revenue}</p>
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
        <div className="space-y-8">
          {/* Upcoming Tasks - Enhanced */}
          <Card className="border border-stroke bg-surface shadow-soft rounded-lg overflow-hidden">
            <CardHeader className="pb-6 pt-6 px-6">
              <CardTitle className="text-heading-3 text-ink">Upcoming Tasks</CardTitle>
              <CardDescription className="text-small text-charcoal mt-1">
                Launch checklist items due soon
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 px-6 pb-6">
              {upcomingTasks.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-small text-charcoal mb-3">No upcoming tasks.</p>
                  <Button asChild variant="outline" size="sm" className="text-xs h-8">
                    <Link href="/dashboard/checklists">Create Checklist</Link>
                  </Button>
                </div>
              ) : (
                upcomingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="group p-4 rounded-lg border border-stroke/50 hover:border-stroke hover:bg-glass/30 transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="text-body font-medium text-ink group-hover:text-burgundy transition-colors">{task.title}</p>
                        <p className="text-small text-charcoal mt-0.5">Checklist Item</p>
                      </div>
                      <Badge
                        variant={task.priority === "high" ? "default" : task.priority === "medium" ? "secondary" : "outline"}
                        className="text-xs px-2 py-0.5 font-medium ml-2"
                      >
                        {task.priority}
                      </Badge>
                    </div>
                    <p className="text-small text-charcoal">Due: {task.dueDate ? task.dueDate.toLocaleDateString() : 'No date'}</p>
                  </div>
                ))
              )}
              <Button asChild variant="outline" className="w-full text-xs h-9">
                <Link href="/dashboard/checklists">View all tasks</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Leaderboard Snippet - Enhanced */}
          <Card className="border border-stroke bg-surface shadow-soft rounded-lg overflow-hidden">
            <CardHeader className="pb-6 pt-6 px-6">
              <CardTitle className="text-heading-3 text-ink">Author Leaderboard</CardTitle>
              <CardDescription className="text-small text-charcoal mt-1">
                Top performers this month
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 px-6 pb-6">
              <div className="group flex items-center justify-between p-3 rounded-lg bg-glass/50 border border-stroke/50 hover:border-stroke transition-all duration-200 cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-burgundy flex items-center justify-center text-surface text-xs font-bold shadow-soft">1</div>
                  <div>
                    <p className="text-body font-medium text-ink group-hover:text-burgundy transition-colors">Sarah Johnson</p>
                    <p className="text-mini text-charcoal">Romance Author</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-body font-semibold text-ink">12.4K</p>
                  <p className="text-mini text-charcoal">units</p>
                </div>
              </div>
              <Button asChild variant="ghost" className="w-full px-0 text-burgundy hover:text-burgundy/80 hover:bg-transparent text-xs h-8">
                <Link href="/dashboard/books">View full leaderboard →</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Competitor Price Moves - Enhanced */}
          <Card className="border border-stroke bg-surface shadow-soft rounded-lg overflow-hidden">
            <CardHeader className="pb-6 pt-6 px-6">
              <CardTitle className="text-heading-3 text-ink">Competitor Insights</CardTitle>
              <CardDescription className="text-small text-charcoal mt-1">
                Recent price changes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 px-6 pb-6">
              <div className="group p-3 rounded-lg border border-stroke/50 hover:border-stroke hover:bg-glass/30 transition-all duration-200 cursor-pointer">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-body text-ink group-hover:text-burgundy transition-colors">"The Silent Garden"</p>
                  <Badge variant="secondary" className="text-xs px-2 py-0.5 font-medium">▼ 15%</Badge>
                </div>
                <p className="text-small text-charcoal">Dropped to $2.99</p>
              </div>
              <Button asChild variant="ghost" className="w-full px-0 text-burgundy hover:text-burgundy/80 hover:bg-transparent text-xs h-8">
                <Link href="/dashboard/connections">Track competitors →</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
