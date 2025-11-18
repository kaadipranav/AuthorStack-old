import { notFound } from "next/navigation";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChecklistForm } from "@/features/checklists/components/checklist-form";
import { requireAuth } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type ChecklistDetailsProps = {
  params: { checklistId: string };
};

export default async function ChecklistDetailsPage({ params }: ChecklistDetailsProps) {
  const user = await requireAuth();
  const supabase = await createSupabaseServerClient();
  const { data: checklist } = await supabase
    .from("launch_checklists")
    .select("*")
    .eq("id", params.checklistId)
    .eq("profile_id", user.id)
    .maybeSingle();

  if (!checklist) {
    notFound();
  }

  const { data: tasks } = await supabase
    .from("launch_tasks")
    .select("*")
    .eq("checklist_id", checklist.id)
    .order("due_date", { ascending: true });

  return (
    <DashboardShell
      title={checklist.name}
      description="Task statuses sync with Supabase in the production build."
    >
      <Card>
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
          <CardDescription>Mark complete to keep launches on track.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {(tasks ?? []).map((task) => (
            <div key={task.id} className="rounded-lg border p-3 text-sm">
              <p className="font-medium">{task.title}</p>
              <p className="text-xs text-charcoal">
                Status: {task.status} • Due {task.due_date ?? "TBD"}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Update checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <ChecklistForm
            mode="update"
            checklistId={checklist.id}
            defaultValues={{
              name: checklist.name,
              launch_date: checklist.launch_date,
              notes: checklist.notes,
            }}
          />
        </CardContent>
      </Card>
    </DashboardShell>
  );
}

