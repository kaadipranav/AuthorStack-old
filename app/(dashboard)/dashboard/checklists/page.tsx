import Link from "next/link";

import { DashboardShell } from "@/components/layout/dashboard-shell";
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
    <DashboardShell
      title="Launch checklists"
      description="Track launch readiness tasks with due dates and reminders."
    >
      <div className="flex justify-end">
        <Button asChild>
          <Link href="/dashboard/checklists/new">New checklist</Link>
        </Button>
      </div>
      <div className="grid gap-4">
        {(checklists ?? []).map((checklist) => (
          <Card key={checklist.id}>
            <CardHeader>
              <CardTitle>{checklist.name}</CardTitle>
              <CardDescription>Launch date: {checklist.launch_date ?? "TBD"}</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Tasks: {checklist.launch_tasks?.[0]?.count ?? 0}
              </div>
              <Button variant="outline" asChild>
                <Link href={`/dashboard/checklists/${checklist.id}`}>Open</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
        {(checklists?.length ?? 0) === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No checklists yet</CardTitle>
              <CardDescription>Create your first checklist to plan the launch.</CardDescription>
            </CardHeader>
          </Card>
        ) : null}
      </div>
    </DashboardShell>
  );
}
