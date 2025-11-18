import Link from "next/link";

export const dynamic = "force-dynamic";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth/session";

export default async function ChecklistsPage() {
  const user = await requireAuth();
  const supabase = await createSupabaseServerClient();
  const { data: checklists } = await supabase
    .from("launch_checklists")
    .select("id, name, launch_date, launch_tasks(count)")
    .eq("profile_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-display text-ink">Launch Checklists</h1>
            <p className="text-body text-charcoal">
              Track launch readiness tasks with due dates and reminders.
            </p>
          </div>
          <Button asChild className="bg-burgundy hover:bg-burgundy/90 text-surface">
            <Link href="/dashboard/checklists/new">New checklist</Link>
          </Button>
        </div>
      </div>

      {/* Checklists list */}
      <div className="grid gap-6">
        {(checklists ?? []).length === 0 ? (
          <Card className="border-stroke bg-surface">
            <CardHeader>
              <CardTitle className="text-heading-2 text-ink">No checklists yet</CardTitle>
              <CardDescription className="text-body text-charcoal">
                Create your first checklist to plan your book launch.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="bg-burgundy hover:bg-burgundy/90 text-surface">
                <Link href="/dashboard/checklists/new">Create your first checklist</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-heading-2 text-ink">Your Checklists</h2>
              <p className="text-small text-charcoal">{checklists?.length ?? 0} checklists</p>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {(checklists ?? []).map((checklist) => (
                <Card key={checklist.id} className="border-stroke bg-surface hover:bg-glass transition-colors">
                  <CardHeader>
                    <CardTitle className="text-heading-3 text-ink">{checklist.name}</CardTitle>
                    <CardDescription className="text-small text-charcoal">
                      Launch date: {checklist.launch_date ?? "TBD"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-small text-charcoal">
                        Tasks: {checklist.launch_tasks?.[0]?.count ?? 0}
                      </div>
                      <Button asChild variant="outline" className="border-stroke text-ink hover:bg-glass">
                        <Link href={`/dashboard/checklists/${checklist.id}`}>Open</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
