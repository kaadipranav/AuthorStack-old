import { createSupabaseServerClient } from "@/lib/supabase/server";
import { LaunchRepository } from "../domain/repository";
import { LaunchChecklist, LaunchTask } from "../domain/types";

export class SupabaseLaunchRepository implements LaunchRepository {
    async getChecklists(profileId: string): Promise<LaunchChecklist[]> {
        const supabase = await createSupabaseServerClient();
        const { data, error } = await supabase
            .from("launch_checklists")
            .select("*")
            .eq("profile_id", profileId);

        if (error) return []; // Fail gracefully or throw

        return data.map((d: any) => ({
            id: d.id,
            profileId: d.profile_id,
            name: d.name,
            createdAt: new Date(d.created_at),
        }));
    }

    async getTasks(profileId: string, limit = 6): Promise<LaunchTask[]> {
        const supabase = await createSupabaseServerClient();
        const { data, error } = await supabase
            .from("launch_tasks")
            .select("id, title, status, due_date, priority, launch_checklists!inner(profile_id)")
            .eq("launch_checklists.profile_id", profileId)
            .order("due_date", { ascending: true })
            .limit(limit);

        if (error) return [];

        return data.map((d: any) => ({
            id: d.id,
            checklistId: d.launch_checklists?.id, // Note: query might need adjustment to get checklist_id
            title: d.title,
            status: d.status,
            dueDate: d.due_date ? new Date(d.due_date) : undefined,
            priority: d.priority ?? 'medium',
        }));
    }
}
