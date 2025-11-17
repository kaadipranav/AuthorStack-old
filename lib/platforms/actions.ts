"use server";

import { revalidatePath } from "next/cache";

import { requireAuth } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type ActionResponse = {
  success: boolean;
  message: string;
};

export async function connectPlatformAction(formData: FormData): Promise<ActionResponse> {
  const user = await requireAuth();
  const supabase = await createSupabaseServerClient();

  const provider = formData.get("provider")?.toString();
  if (!provider) {
    return { success: false, message: "Missing provider." };
  }

  const apiKey = formData.get("apiKey")?.toString();
  const accountId = formData.get("accountId")?.toString();

  const { error } = await supabase.from("platform_connections").upsert(
    {
      profile_id: user.id,
      provider,
      status: "connected",
      metadata: { apiKey, accountId },
    },
    { onConflict: "profile_id,provider" }
  );

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/dashboard/connections");
  return { success: true, message: "Connection saved (placeholder)." };
}

export async function uploadKdpReportAction(formData: FormData): Promise<ActionResponse> {
  const user = await requireAuth();
  const supabase = await createSupabaseServerClient();

  const file = formData.get("file") as File | null;
  if (!file) {
    return { success: false, message: "Please attach a CSV." };
  }

  const { error: uploadError, data } = await supabase.storage
    .from("kdp-uploads")
    .upload(`${user.id}/${crypto.randomUUID()}-${file.name}`, file, {
      contentType: file.type || "text/csv",
      upsert: false,
    });

  if (uploadError) {
    return { success: false, message: uploadError.message };
  }

  await supabase.from("ingestion_jobs").insert({
    profile_id: user.id,
    platform: "amazon_kdp",
    status: "pending",
    payload: { storagePath: data?.path },
  });

  return { success: true, message: "Report uploaded. Ingestion job queued." };
}

