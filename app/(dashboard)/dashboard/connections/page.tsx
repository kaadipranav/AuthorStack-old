import Link from "next/link";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireAuth } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const connectors = [
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
    <DashboardShell
      title="Platform connections"
      description="Authenticate sales channels so ingestion jobs can run automatically."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {connectors.map((connector) => (
          <Card key={connector.title}>
            <CardHeader>
              <CardTitle>{connector.title}</CardTitle>
              <CardDescription>{connector.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href={connector.href}>Configure</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Existing connections</CardTitle>
          <CardDescription>Status of each provider.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {(existingConnections ?? []).length === 0 ? (
            <p className="text-muted-foreground">No connections yet.</p>
          ) : (
            existingConnections?.map((connection) => (
              <div key={connection.id} className="flex items-center justify-between rounded border px-3 py-2">
                <span className="font-medium capitalize">{connection.provider}</span>
                <span className="text-muted-foreground">{connection.status}</span>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </DashboardShell>
  );
}

