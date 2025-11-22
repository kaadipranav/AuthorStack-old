import Link from "next/link";
import type { Route } from "next";

export const dynamic = "force-dynamic";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireAuth } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const connectors: Array<{ title: string; description: string; href: string }> = [
  {
    title: "Amazon KDP",
    description: "Upload CSVs or connect OAuth to sync Kindle Direct Publishing data.",
    href: "/dashboard/connections/amazon-kdp",
  },
  {
    title: "Gumroad",
    description: "OAuth with Gumroad to ingest SKU-level sales and refunds.",
    href: "/dashboard/connections/gumroad",
  },
  {
    title: "Payhip",
    description: "Connect your Payhip account to sync sales from digital and physical products.",
    href: "/dashboard/connections/payhip",
  },
  {
    title: "Lulu",
    description: "Track print-on-demand orders and calculate profit margins from Lulu.",
    href: "/dashboard/connections/lulu",
  },
  {
    title: "Kobo Writing Life",
    description: "Upload CSV reports from Kobo to sync ebook sales data.",
    href: "/dashboard/connections/kobo",
  },
  {
    title: "Apple Books",
    description: "Upload iTunes Connect sales reports to track Apple Books sales.",
    href: "/dashboard/connections/apple-books",
  },
  {
    title: "Google Play Books",
    description: "Upload Partner Center CSV reports to sync Google Play sales.",
    href: "/dashboard/connections/google-play",
  },
  {
    title: "Barnes & Noble Press",
    description: "Upload B&N Press sales reports to track Nook sales.",
    href: "/dashboard/connections/bn-press",
  },
  {
    title: "Whop",
    description: "Manage memberships and upgrade/downgrade events.",
    href: "/dashboard/connections/whop",
  },
];

export default async function ConnectionsPage() {
  const user = await requireAuth();
  const supabase = await createSupabaseServerClient();
  const { data: existingConnections } = await supabase
    .from("platform_connections")
    .select("*")
    .eq("profile_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-display text-ink">Platform Connections</h1>
        <p className="text-body text-charcoal">
          Connect your sales channels to automatically sync data with AuthorStack.
        </p>
      </div>

      {/* Connection options */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {connectors.map((connector) => (
          <Card key={connector.title} className="border-stroke bg-surface hover:bg-glass transition-colors">
            <CardHeader>
              <CardTitle className="text-heading-2 text-ink">{connector.title}</CardTitle>
              <CardDescription className="text-body text-charcoal">
                {connector.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full bg-burgundy hover:bg-burgundy/90 text-surface">
                <Link href={connector.href as Route}>Configure</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Existing connections */}
      <Card className="border-stroke bg-surface">
        <CardHeader>
          <CardTitle className="text-heading-2 text-ink">Existing Connections</CardTitle>
          <CardDescription className="text-body text-charcoal">
            Status of each connected platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {(existingConnections ?? []).length === 0 ? (
            <div className="text-center py-8">
              <p className="text-body text-charcoal">No connections yet.</p>
              <p className="text-small text-charcoal mt-2">
                Connect a platform above to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {existingConnections?.map((connection) => (
                <div
                  key={connection.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-stroke bg-glass"
                >
                  <div>
                    <p className="text-body font-medium text-ink capitalize">{connection.provider}</p>
                    <p className="text-small text-charcoal">
                      Connected on {new Date(connection.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge
                    variant={connection.status === "connected" ? "default" : "secondary"}
                    className="text-small"
                  >
                    {connection.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

