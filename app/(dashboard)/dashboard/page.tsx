import Link from "next/link";
import type { Metadata } from "next";
import type { Route } from "next";

export const dynamic = "force-dynamic";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getChecklistTasks, getDashboardMetrics } from "@/lib/dashboard/queries";

export const metadata: Metadata = {
  title: "Dashboard - AuthorStack",
  description: "Your AuthorStack command center. Monitor revenue, track book launches, and manage your publishing operations.",
};

export default async function DashboardHomePage() {
  const { totalAmount, totalUnits, checklistCount, latestBooks } = await getDashboardMetrics();
  const tasks = await getChecklistTasks();

  // KPI metrics for the dashboard
  const kpiMetrics = [
    {
      title: "Gross Revenue",
      value: `$${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      change: "+12%",
      trend: "up",
      description: "vs last 30 days",
    },
    {
      title: "Units Sold",
      value: totalUnits.toLocaleString(),
      change: "+8%",
      trend: "up",
      description: "Print + digital sales",
    },
    {
      title: "Active Launches",
      value: checklistCount.toString(),
      change: "2 new",
      trend: "up",
      description: "This quarter",
    },
    {
      title: "Page Reads",
      value: "1.2K",
      change: "+5%",
      trend: "up",
      description: "Across platforms",
    },
  ];

  // Recent books data
  const recentBooks = [
    {
      id: "1",
      title: "The Midnight Garden",
      author: "Elena Richardson",
      revenue: 1240,
      units: 89,
      platforms: ["KDP", "Gumroad"],
      cover: "/mock/cover1.jpg",
    },
    {
      id: "2",
      title: "Shadows of the Past",
      author: "Marcus Chen",
      revenue: 890,
      units: 64,
      platforms: ["KDP"],
      cover: "/mock/cover2.jpg",
    },
    {
      id: "3",
      title: "Whispers in the Wind",
      author: "Sophia Williams",
      revenue: 650,
      units: 42,
      platforms: ["Gumroad", "Apple Books"],
      cover: "/mock/cover3.jpg",
    },
  ];

  // Upcoming tasks
  const upcomingTasks = [
    {
      id: "1",
      title: "Finalize cover design",
      checklist: "Summer Romance Launch",
      dueDate: "Tomorrow",
      priority: "high",
    },
    {
      id: "2",
      title: "Send ARCs to reviewers",
      checklist: "Thriller Pre-Launch",
      dueDate: "In 3 days",
      priority: "medium",
    },
    {
      id: "3",
      title: "Schedule social media posts",
      checklist: "Fantasy Series Launch",
      dueDate: "Next week",
      priority: "low",
    },
  ];

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
                  <p className="text-heading-3 font-semibold text-ink">$1,240</p>
                  <p className="text-mini text-success">▲ 12%</p>
                </div>
                <div className="p-3 rounded-lg bg-glass border border-stroke">
                  <p className="text-small text-charcoal">Gumroad</p>
                  <p className="text-heading-3 font-semibold text-ink">$890</p>
                  <p className="text-mini text-success">▲ 8%</p>
                </div>
                <div className="p-3 rounded-lg bg-glass border border-stroke">
                  <p className="text-small text-charcoal">Whop</p>
                  <p className="text-heading-3 font-semibold text-ink">$420</p>
                  <p className="text-mini text-amber">▼ 3%</p>
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
                {recentBooks.map((book) => (
                  <div key={book.id} className="flex items-center justify-between p-4 rounded-lg border border-stroke hover:bg-glass transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-16 rounded bg-glass border border-stroke flex items-center justify-center">
                        <span className="text-mini text-charcoal">Cover</span>
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
                ))}
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
              {upcomingTasks.map((task) => (
                <div key={task.id} className="p-4 rounded-lg border border-stroke hover:bg-glass transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-body font-medium text-ink">{task.title}</p>
                      <p className="text-small text-charcoal">{task.checklist}</p>
                    </div>
                    <Badge 
                      variant={task.priority === "high" ? "default" : task.priority === "medium" ? "secondary" : "outline"}
                      className="text-mini"
                    >
                      {task.priority}
                    </Badge>
                  </div>
                  <p className="text-small text-charcoal mt-2">Due: {task.dueDate}</p>
                </div>
              ))}
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
              <div className="flex items-center justify-between p-3 rounded-lg bg-glass border border-stroke">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-charcoal flex items-center justify-center text-surface text-mini font-bold">2</div>
                  <div>
                    <p className="text-body font-medium text-ink">Marcus Chen</p>
                    <p className="text-mini text-charcoal">Thriller Writer</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-body font-semibold text-ink">9.8K</p>
                  <p className="text-mini text-charcoal">units</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-glass border border-stroke">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-charcoal flex items-center justify-center text-surface text-mini font-bold">3</div>
                  <div>
                    <p className="text-body font-medium text-ink">Elena Richardson</p>
                    <p className="text-mini text-charcoal">Fantasy Author</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-body font-semibold text-ink">7.3K</p>
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
              <div className="p-3 rounded-lg border border-stroke">
                <div className="flex items-center justify-between">
                  <p className="text-body text-ink">"The Silent Garden"</p>
                  <Badge variant="secondary" className="text-mini">▼ 15%</Badge>
                </div>
                <p className="text-small text-charcoal mt-1">Dropped to $2.99</p>
              </div>
              <div className="p-3 rounded-lg border border-stroke">
                <div className="flex items-center justify-between">
                  <p className="text-body text-ink">"Midnight Echoes"</p>
                  <Badge variant="default" className="text-mini">▲ 10%</Badge>
                </div>
                <p className="text-small text-charcoal mt-1">Increased to $4.99</p>
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

