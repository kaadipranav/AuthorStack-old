import Link from "next/link";
import type { Route } from "next";

export const dynamic = "force-dynamic";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireAuth } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { 
  ShoppingCart, 
  ShoppingBag, 
  CreditCard, 
  Book, 
  BookOpen, 
  Apple, 
  Globe, 
  Store,
  Users,
  ChevronRight
} from "lucide-react";

const connectors: Array<{ 
  title: string; 
  description: string; 
  href: string;
  icon: React.ElementType;
  color: string;
}> = [
  {
    title: "Amazon KDP",
    description: "Upload CSVs or connect OAuth to sync Kindle Direct Publishing data.",
    href: "/dashboard/connections/amazon-kdp",
    icon: ShoppingCart,
    color: "text-orange-600",
  },
  {
    title: "Gumroad",
    description: "OAuth with Gumroad to ingest SKU-level sales and refunds.",
    href: "/dashboard/connections/gumroad",
    icon: ShoppingBag,
    color: "text-pink-600",
  },
  {
    title: "Payhip",
    description: "Connect your Payhip account to sync sales from digital and physical products.",
    href: "/dashboard/connections/payhip",
    icon: CreditCard,
    color: "text-blue-600",
  },
  {
    title: "Lulu",
    description: "Track print-on-demand orders and calculate profit margins from Lulu.",
    href: "/dashboard/connections/lulu",
    icon: Book,
    color: "text-red-600",
  },
  {
    title: "Kobo Writing Life",
    description: "Upload CSV reports from Kobo to sync ebook sales data.",
    href: "/dashboard/connections/kobo",
    icon: BookOpen,
    color: "text-teal-600",
  },
  {
    title: "Apple Books",
    description: "Upload iTunes Connect sales reports to track Apple Books sales.",
    href: "/dashboard/connections/apple-books",
    icon: Apple,
    color: "text-gray-700",
  },
  {
    title: "Google Play Books",
    description: "Upload Partner Center CSV reports to sync Google Play sales.",
    href: "/dashboard/connections/google-play",
    icon: Globe,
    color: "text-green-600",
  },
  {
    title: "Barnes & Noble Press",
    description: "Upload B&N Press sales reports to track Nook sales.",
    href: "/dashboard/connections/bn-press",
    icon: Store,
    color: "text-emerald-700",
  },
  {
    title: "Whop",
    description: "Manage memberships and upgrade/downgrade events.",
    href: "/dashboard/connections/whop",
    icon: Users,
    color: "text-purple-600",
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

      {/* Connection options as list */}
      <Card className="border-stroke bg-surface">
        <CardHeader>
          <CardTitle className="text-heading-2 text-ink">Available Platforms</CardTitle>
          <CardDescription className="text-body text-charcoal">
            Choose a platform to configure and start syncing your sales data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {connectors.map((connector) => {
              const Icon = connector.icon;
              return (
                <Link
                  key={connector.title}
                  href={connector.href as Route}
                  className="flex items-center gap-4 p-4 rounded-lg border border-stroke bg-surface hover:bg-glass transition-all duration-200 hover:shadow-sm group"
                >
                  {/* Icon */}
                  <div className={`flex-shrink-0 w-12 h-12 rounded-lg bg-surface border border-stroke flex items-center justify-center ${connector.color} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-body font-semibold text-ink group-hover:text-burgundy transition-colors">
                      {connector.title}
                    </h3>
                    <p className="text-small text-charcoal line-clamp-1">
                      {connector.description}
                    </p>
                  </div>

                  {/* Arrow */}
                  <ChevronRight className="w-5 h-5 text-charcoal group-hover:text-burgundy group-hover:translate-x-1 transition-all flex-shrink-0" />
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>

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

