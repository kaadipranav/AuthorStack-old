"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAuth } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const checklistSchema = z.object({
  name: z.string().min(2),
  launchDate: z
    .string()
    .optional()
    .transform((value) => (value ? value : null)),
  notes: z.string().optional(),
});

type ActionResponse = {
  success: boolean;
  message: string;
};

export async function createChecklistAction(formData: FormData): Promise<ActionResponse> {
  const user = await requireAuth();
  const supabase = await createSupabaseServerClient();

  const payload = checklistSchema.safeParse({
    name: formData.get("name"),
    launchDate: formData.get("launchDate"),
    notes: formData.get("notes"),
  });

  if (!payload.success) {
    return {
      success: false,
      message: payload.error.issues[0]?.message ?? "Invalid form submission.",
    };
  }

  const { error } = await supabase.from("launch_checklists").insert({
    profile_id: user.id,
    name: payload.data.name,
    launch_date: payload.data.launchDate,
    notes: payload.data.notes,
  });

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/dashboard/checklists");
  return { success: true, message: "Checklist created." };
}

export async function updateChecklistTaskAction(formData: FormData): Promise<ActionResponse> {
  const user = await requireAuth();
  const supabase = await createSupabaseServerClient();
  const checklistId = formData.get("checklistId")?.toString();

  if (!checklistId) {
    return { success: false, message: "Missing checklist ID." };
  }

  const payload = checklistSchema.safeParse({
    name: formData.get("name"),
    launchDate: formData.get("launchDate"),
    notes: formData.get("notes"),
  });

  if (!payload.success) {
    return {
      success: false,
      message: payload.error.issues[0]?.message ?? "Invalid form submission.",
    };
  }

  const { error } = await supabase
    .from("launch_checklists")
    .update({
      name: payload.data.name,
      launch_date: payload.data.launchDate,
      notes: payload.data.notes,
    })
    .eq("id", checklistId)
    .eq("profile_id", user.id);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath(`/dashboard/checklists/${checklistId}`);
  revalidatePath("/dashboard/checklists");

  return { success: true, message: "Checklist updated." };
}
"use server";

type ActionResponse = {
  success: boolean;
  message: string;
};

export async function createChecklistAction(formData: FormData): Promise<ActionResponse> {
  void formData;
  return { success: false, message: "Checklist creation not implemented yet." };
}

export async function updateChecklistTaskAction(formData: FormData): Promise<ActionResponse> {
  void formData;
  return { success: false, message: "Checklist task update not implemented yet." };
}

