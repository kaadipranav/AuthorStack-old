"use server";

import { revalidatePath } from "next/cache";

import { profileUpdateSchema } from "@/lib/auth/validators";
import { requireAuth } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type ActionResponse = {
  success: boolean;
  message: string;
};

export async function updateProfileAction(
  formData: FormData
): Promise<ActionResponse> {
  const user = await requireAuth();
  const supabase = await createSupabaseServerClient();

  const parsed = profileUpdateSchema.safeParse({
    full_name: formData.get("full_name"),
    avatar_url: formData.get("avatar_url"),
    subscription_tier: formData.get("subscription_tier"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Invalid form submission.",
    };
  }

  const payload = {
    full_name: parsed.data.full_name,
    avatar_url: parsed.data.avatar_url || null,
    subscription_tier: parsed.data.subscription_tier,
  };

  const { error } = await supabase
    .from("profiles")
    .update(payload)
    .eq("id", user.id);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/dashboard/profile");
  revalidatePath("/dashboard");

  return { success: true, message: "Profile updated successfully." };
}

