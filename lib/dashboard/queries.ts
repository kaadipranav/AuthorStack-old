import { requireAuth } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getDashboardMetrics() {
  const user = await requireAuth();
  const supabase = await createSupabaseServerClient();

  const [{ data: summaries }, { data: checklistCount }, { data: latestBooks }] = await Promise.all([
    supabase
      .from("sales_summary_view")
      .select("total_amount, total_units")
      .eq("profile_id", user.id),
    supabase
      .from("launch_checklists")
      .select("id", { count: "exact", head: true })
      .eq("profile_id", user.id),
    supabase
      .from("books")
      .select("id, title, status, format, launch_date")
      .eq("profile_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const totalAmount =
    summaries?.reduce((sum, item) => sum + Number(item.total_amount ?? 0), 0) ?? 0;
  const totalUnits =
    summaries?.reduce((sum, item) => sum + Number(item.total_units ?? 0), 0) ?? 0;

  return {
    totalAmount,
    totalUnits,
    checklistCount: checklistCount?.length ?? 0,
    latestBooks: latestBooks ?? [],
  };
}

export async function getChecklistTasks() {
  const user = await requireAuth();
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("launch_tasks")
    .select("id, title, status, due_date, launch_checklists!inner(name)")
    .eq("launch_checklists.profile_id", user.id)
    .order("due_date", { ascending: true })
    .limit(6);
  return data ?? [];
}

